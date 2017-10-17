import React from 'react';
import {
    Vibration,
    ActivityIndicator,
    Button,
    FlatList,
    Text,
    TextInput,
    View,
    ScrollView,
    ToastAndroid, Image
} from "react-native";
import styles from "../styles";
import timeAgo from "time-ago";
import config from "../configReact";
import Fab from "../components/Fab";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {
    MediaStreamTrack, getUserMedia, RTCPeerConnection, RTCView, RTCSessionDescription,
    RTCIceCandidate
} from "react-native-webrtc";
import StreamService from "../services/StreamService";
import Config from 'react-native-config'
import Authentication from "../services/Authentication";
import SocketActions from "../shared/SocketActions";
import Promise from "bluebird";
import io from "socket.io-client";

const ta = timeAgo();
const NAME = "CallScreen";

const CAMERA_STATE_BACK = "back";
const CAMERA_STATE_FRONT = "front";
const CAMERA_STATE_OFF = "off";

const screenStyles = {
    myImage: {
        position: "absolute",
        bottom: 0,
        left: 0,
        margin: 8,
        height: 80,
        width: 80,
        borderRadius: 999,
    },
    chat: {
        position: "absolute",
        right: 0,
        bottom: 80,
        margin: 8,
    },
    chatText: {
        color: "#FFF",
        fontSize: 14,
        textShadowColor: "#000",
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 2,
        textAlign: "right"
    }
};

export default class CallScreen extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            session: this.props.session,
            ready: true,
            cameraState: CAMERA_STATE_BACK,
            streamUrl: "",
            userId_streamUrl: new Map()
        };

        this.props.navigator.toggleTabs({
            to: 'hidden', // required, 'hidden' = hide tab bar, 'shown' = show tab bar
            animated: true // does the toggle have transition animation or does it happen immediately (optional)
        });

        this.props.navigator.toggleNavBar({
            to: 'hidden', // required, 'hidden' = hide navigation bar, 'shown' = show navigation bar
            animated: true // does the toggle have transition animation or does it happen immediately (optional). By default animated: true
        });

        this.userId_pc = new Map();

        this.getCameraFab = this.getCameraFab.bind(this);
        this.toggleCameraState = this.toggleCameraState.bind(this);
        this.connect = this.connect.bind(this);
        this.setupSocket = this.setupSocket.bind(this);
        this.joinRoom = this.joinRoom.bind(this);
        this.setupWebRTC = this.setupWebRTC.bind(this);
    }

    connect(){
        return this.loadCamera()
        .then(() => this.setupSocket())
        .then(() => this.setupWebRTC())
        .then(() =>{
            console.log("successfully connected all")
        })
        .catch(console.log)
    }

    /**
     * Promise<streamURL>
     */
    loadCamera(){
        let state = this.state.cameraState;
        if(state !== CAMERA_STATE_OFF) {
            return StreamService.getStream(this.state.cameraState)
            .then(stream =>{
                let streamUrl = stream.toURL();
                this.setState({streamUrl});
                return streamUrl;
            });
        }
    }

    setupSocket(){
        return new Promise((resolve, reject) =>{
            let wsURL = `ws://${Config.HOST}`;
            let socket = io(wsURL, {
                transportOptions: {
                    polling: {
                        extraHeaders: {
                            'Token': Authentication.getToken()
                        }
                    }
                }
            });
            socket.on("connect", resolve);
            socket.on("error", reject);

            socket.on(SocketActions.USER_LEFT_ROOM, (userId) =>{
                //find peerConnection and pc.close();
            });

            //first 1
            socket.on(SocketActions.USER_JOINED_ROOM, (userId) => this.createPeerConnection(userId));

            socket.on(SocketActions.RECEIVE_DESCRIPTION, (response) =>{
                this.assignRemoteDescription(response.userId, response.description)
            });

            socket.on(SocketActions.RECEIVE_CANDIDATE, (response) =>{
                let {userId, candidate} = response;
                this.assignCandidate(userId, candidate)
            });

            this.socket = socket;
        })
        .then(() =>{
            return new Promise((resolve, reject) =>{
                this.socket.emit(SocketActions.JOIN_ROOM, {uuid: this.state.session.uuid}, resolve)
            })
        })
        .then(userIds =>{
            //second 1
            return Promise.all(userIds.map(userId => this.createPeerConnection(userId)))
        })
    }

    //first second 2
    createPeerConnection(userId){
        return Promise.resolve((resolve, reject) =>{
            if(!userId) throw new Error("userId malformed");

            const configuration = {"iceServers": [{"url": "stun:stun.l.google.com:19302"}]};
            const pc = new RTCPeerConnection(configuration);
            pc.addStream(this.state.streamURL);
            this.userId_pc.set(userId, pc);

            //1 called immediately
            pc.onnegotiationneeded = function (){
                pc.createOffer()
                .then(description => pc.setLocalDescription(description))
                .then(() =>{
                    this.socket.emit(SocketActions.SEND_DESCRIPTION, {
                            uuid: this.state.session.uuid,
                            description: pc.localDescription
                        },
                        (status) =>{
                            if(status !== 200) reject("couldn't exchange description");
                        })
                })
                .catch(reject)
            };

            // //2, 5
            // //called after setLocalDescription or setRemoteDescription
            // pc.onsignalingstatechange = function(event){
            //     console.log('onsignalingstatechange', event.target.signalingState);
            // };


            //3 x4
            //local ice agent needs to send message to other peers through signaling server
            pc.onicecandidate = function (event){
                this.socket.emit(SocketActions.SEND_CANDIDATE, {
                        uuid: this.state.session.uuid,
                        candidate: event.candidate
                    },
                    (status) =>{
                        if(status !== 200) reject("couldn't exchange candidate");
                    })
            };

            //6,9
            pc.oniceconnectionstatechange = function (event){
                if(event.target.iceConnectionState === 'connected') {
                    createDataChannel();
                }
            };

            //7
            //when remote peer adds a MediaStream to the connection
            //called after setRemoteDescription()
            //update our Map with new stream, trigger rendering of view
            pc.onaddstream = (event) =>{
                let map = this.state.userId_streamUrl;
                map.set(userId, event.stream.toURL());
                this.setState({userId_streamUrl: map});
            };

            pc.onremovestream = function (event){
                console.log('onremovestream', event.stream);
            };

            function createDataChannel(){
                if(pc.textDataChannel) {
                    return;
                }
                const dataChannel = pc.createDataChannel("text");
                pc.textDataChannel = dataChannel;

                dataChannel.onerror = function (error){
                    console.log("dataChannel.onerror", error);
                };

                dataChannel.onmessage = function (event){
                    console.log("dataChannel.onmessage:", event.data);
                };

                dataChannel.onopen = function (){
                    console.log('dataChannel.onopen');
                };

                dataChannel.onclose = function (){
                    console.log("dataChannel.onclose");
                };

                dataChannel.send("hello")
            }
        })

    }


    assignRemoteDescription(userId, description){
        return new Promise((resolve, reject) =>{
            let pc = this.userId_pc.get(userId);
            if(!pc) throw new Error("no peer connection found");
            return pc.setRemoteDescription(new RTCSessionDescription(description))
            .then(() =>{
                if(pc.remoteDescription.type.toLowerCase() === "offer") {
                    return pc.createAnswer()
                    .then(description => pc.setLocalDescription(description))
                    .then(() =>{
                        this.socket.emit(SocketActions.SEND_DESCRIPTION, description, resolve)
                    })
                } else {
                    resolve()
                }
            })
            .catch(reject)
        })
    }

    assignCandidate(userId, candidate){
        let pc = this.userId_pc.get(userId);
        if(!pc) throw new Error("no peer connection found");
        pc.addIceCandidate(new RTCIceCandidate(candidate))
    }

    setupWebRTC(userIdsInRoom){
        userIdsInRoom.forEach(userId =>{

        });

        if(this.peerConnection) this.peerConnection.close();
        let configuration = {"iceServers": [{"url": "stun:stun.l.google.com:19302"}]};
        this.peerConnection = new RTCPeerConnection(configuration);


        this.peerConnection.onicecandidate = function (e){

        };
        this.peerConnection.onicecandidateerror = function (e){
            reject(e)
        };

        return this.peerConnection.createOffer()
        .then(this.peerConnection.setLocalDescription)

    }

    toggleCameraState(cameraState){
        this.setState({cameraState}, () =>{
            this.loadCamera()
        })
    }

    static getName(){
        return `${config.name}.${NAME}`
    }

    getCameraFab(){
        if(this.state.cameraState === CAMERA_STATE_BACK) {
            return <Fab style={{backgroundColor: "#AAA", margin: 8}}
                        onPress={() => this.toggleCameraState(CAMERA_STATE_FRONT)}
                        inside={<Icon name="camera-front-variant"
                                      size={32}
                                      color="white"/>
                        }
            />
        } else if(this.state.cameraState === CAMERA_STATE_FRONT) {
            return <Fab style={{backgroundColor: "#AAA", margin: 8}}
                        onPress={() => this.toggleCameraState(CAMERA_STATE_BACK)}
                        inside={<Icon name="camera-rear-variant"
                                      size={32}
                                      color="white"/>
                        }
            />
        } else {
            return <Fab style={{backgroundColor: "#AAA", margin: 8}}
                        inside={<Icon name="test-tube"
                                      size={32}
                                      color="white"/>}
            />
        }
    }

    render(){
        return (
            <View style={{position: "absolute", top: 0, bottom: 0, left: 0, right: 0, backgroundColor: "#000"}}>
                {!this.state.ready ?
                    <View style={{position: "absolute", top: 0, bottom: 0, left: 0, right: 0}}>
                        <Image style={[styles.profilePicLarge, {marginRight: 8}]}
                               source={{uri: this.state.session.pupil.profile_url}}/>
                        <Text style={[styles.h1]}>Connecting
                            with {this.state.session.pupil.getFirstAndInitial()}...</Text>
                        <ActivityIndicator size="large"/>
                    </View> :
                    <View style={{position: "absolute", top: 0, bottom: 0, left: 0, right: 0}}>
                        <RTCView style={{position: "absolute", top: 0, bottom: 0, left: 0, right: 0}}
                                 streamURL={this.state.streamUrl}/>
                        <Image style={[styles.profilePicLarge, screenStyles.myImage]}
                               source={{uri: this.state.session.pupil.profile_url}}/>

                        <View style={screenStyles.chat}>
                            <Text style={screenStyles.chatText}>Lorem ipsum doloret</Text>
                            <Text style={screenStyles.chatText}>LOL ok</Text>
                            <Text style={screenStyles.chatText}>Yup that's it</Text>
                        </View>

                        <View style={{
                            position: "absolute",
                            bottom: 0,
                            right: 0,
                            flexDirection: 'row',
                            justifyContent: "space-between"
                        }}>
                            <Button title="Open socket" onPress={this.connect}/>
                            <Fab style={{backgroundColor: "#AAA", margin: 8}}
                                 inside={<Icon name="camera"
                                               size={32}
                                               color="white"/>
                                 }
                            />
                            <Fab style={{backgroundColor: "#AAA", margin: 8}}
                                 inside={<Icon name="lead-pencil"
                                               size={32}
                                               color="white"/>
                                 }
                            />
                            {this.getCameraFab()}
                            <Fab style={{backgroundColor: "green", margin: 8}}
                                 inside={<Icon name="message-text"
                                               size={32}
                                               color="white"/>
                                 }
                            />
                        </View>
                    </View>
                }
            </View>
        );
    }
}