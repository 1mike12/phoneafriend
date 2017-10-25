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
import _MinimalScreen from "./_MinimalScreen";

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
const UUID = "1";

export default class CallScreen extends _MinimalScreen {

    constructor(props){
        super(props);

        console.ignoredYellowBox = [
            'Setting a timer'
        ];

        this.state = {
            session: this.props.session,
            ready: true,
            cameraState: CAMERA_STATE_BACK,
            streamUrl: "",
            myStreamUrl: "",
            userId_streamUrl: new Map(),
            messages : []
        };

        this.userId_pc = new Map();

        let socket = io(Config.HOST, {
            query: `token=${Authentication.getToken()}`
        });
        this.socket = socket;

        let pc = new RTCPeerConnection({"iceServers": [{"url": "stun:stun.l.google.com:19302"}]});
        this.pc = pc;

        const onOpen = (event) =>{
            console.log("dataChannel.OnOpen");
        };

        const onMessage = (event) =>{
            console.log("dataChannel.OnMessage:", event.data);
        };

        const onError = (error) =>{
            console.log("dataChannel.OnError:", error);
        };

        const onClose = (event) =>{
            console.log("dataChannel.OnClose", event);
        };


        let sendChannel = pc.createDataChannel('text', {});
        sendChannel.onopen = onOpen;
        sendChannel.onmessage = onMessage;
        sendChannel.onerror = onError;
        sendChannel.onclose = onClose;
        this.sendChannel = sendChannel;


        pc.ondatachannel = (event) =>{
            let receiveChannel = event.channel;
            this.receiveChannel = receiveChannel;
            receiveChannel.onopen = onOpen;
            receiveChannel.onmessage = onMessage;
            receiveChannel.onerror = onError;
            receiveChannel.onclose = onClose;
        };

        //when remote adds a MediaStream to PeerConnection
        pc.onicecandidate = (e) =>{
            socket.emit(SocketActions.NEW_ICE_CANDIDATE, {
                candidate: e.candidate,
                uuid: UUID
            })
        };

        pc.onaddstream = (e) =>{
            this.setState({streamUrl: e.stream.toURL()})
        };

        pc.onremovestream = function(event){
            console.log('onremovestream', event.stream);
        };

        pc.oniceconnectionstatechange = (e) =>{
            if (e.target.iceConnectionState === 'connected'){

            }
        };

        socket.on("connect", () =>{
            socket.emit(SocketActions.JOIN_ROOM, {uuid: UUID});

            socket.on(SocketActions.USER_JOINED_ROOM, (othersInRoom) =>{
                if (othersInRoom.length > 0){
                    this.addVideo()
                    .then(() =>{
                        this.createOffer()
                    });
                }
            })
        });

        socket.on(SocketActions.VIDEO_OFFER, (res) =>{
            let {userId, description} = res;
            this.createAnswer(description)

        });

        socket.on(SocketActions.VIDEO_ANSWER, (res) =>{
            this.receiveAnswer(res.description);
        });

        socket.on(SocketActions.NEW_ICE_CANDIDATE, (res) =>{
            let {candidate} = res;
            try {
                let rtcCandidate = new RTCIceCandidate(candidate);
                this.pc.addIceCandidate(rtcCandidate);
            } catch (e) {
                console.log(e)
            }
        });

        this.getCameraFab = this.getCameraFab.bind(this);
        this.toggleCameraState = this.toggleCameraState.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
    }

    componentDidMount(){
        this.props.navigator.toggleTabs({
            to: 'hidden', // required, 'hidden' = hide tab bar, 'shown' = show tab bar
            animated: false // does the toggle have transition animation or does it happen immediately (optional)
        });
    }

    createAnswer(description){
        let desc = new RTCSessionDescription(description);
        this.pc.setRemoteDescription(desc);

        return this.addVideo()
        .then(() => this.pc.createAnswer())
        .then(localDescription =>{
            this.pc.setLocalDescription(localDescription);
            this.socket.emit(SocketActions.VIDEO_ANSWER, {uuid: UUID, description: localDescription})
        })
        .catch(e =>{
            throw e;
        })
    }

    receiveAnswer(desc){
        let description = new RTCSessionDescription(desc);
        this.pc.setRemoteDescription(description)
    }

    createOffer(){
        return this.pc.createOffer()
        .then(description =>{
            this.pc.setLocalDescription(description);
            this.socket.emit(SocketActions.VIDEO_OFFER, {uuid: UUID, description})
        })
    }

    /**
     * Promise<streamURL>
     */
    addVideo(){
        let state = this.state.cameraState;
        if (state !== CAMERA_STATE_OFF){
            return StreamService.getStream(this.state.cameraState)
            .then(stream =>{
                this.pc.addStream(stream);
                let myStreamUrl = stream.toURL();
                this.setState({myStreamUrl});
                return myStreamUrl;
            });
        }
    }

    toggleCameraState(cameraState){
        this.setState({cameraState}, () =>{
            this.addVideo()
        })
    }

    componentWillUnmount(){
        if (this.socket) this.socket.close();
        if (this.pc) this.pc.close();
    }

    static getName(){
        return `${config.name}.${NAME}`
    }

    getCameraFab(){
        if (this.state.cameraState === CAMERA_STATE_BACK){
            return <Fab style={{backgroundColor: "#AAA", margin: 8}}
                        onPress={() => this.toggleCameraState(CAMERA_STATE_FRONT)}
                        inside={<Icon name="camera-front-variant"
                                      size={32}
                                      color="white"/>
                        }
            />
        } else if (this.state.cameraState === CAMERA_STATE_FRONT){
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

    sendMessage(){
        console.log("send message")
        this.sendChannel.send("lololol");
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

                        <RTCView style={{position: "absolute", top: 0, bottom: 0, width: 120, height: 120}}
                                 streamURL={this.state.streamUrl}/>

                        <RTCView style={{position: "absolute", top: 0, bottom: 0, left: 0, right: 0}}
                                 streamURL={this.state.myStreamUrl}/>
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
                                 onPress={this.sendMessage}
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