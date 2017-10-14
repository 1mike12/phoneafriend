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
import http from '../services/http';
import styles from "../styles";
import timeAgo from "time-ago";
import Skill from "../models/Skill";
import config from "../configReact";
import Util from "../shared/Util";
import DeleteSkillModal from "./DeleteSkillModal";
import Session from "../models/Session";
import SessionSummary from "../components/SessionSummary";
import Fab from "../components/Fab";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {MediaStreamTrack, getUserMedia, RTCPeerConnection, RTCView} from "react-native-webrtc";
import RTC_Service from "../services/RTC_Service";
import StreamService from "../services/StreamService";
import Config from 'react-native-config'
import Authentication from "../services/Authentication";
import NonShitWebSocket from "../classes/NotShitWebsocket";
import SocketResponse from "../shared/SocketResponse";

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
            videoURL: ""
        };

        this.props.navigator.toggleTabs({
            to: 'hidden', // required, 'hidden' = hide tab bar, 'shown' = show tab bar
            animated: true // does the toggle have transition animation or does it happen immediately (optional)
        });

        this.props.navigator.toggleNavBar({
            to: 'hidden', // required, 'hidden' = hide navigation bar, 'shown' = show navigation bar
            animated: true // does the toggle have transition animation or does it happen immediately (optional). By default animated: true
        });

        let configuration = {"iceServers": [{"url": "stun:stun.l.google.com:19302"}]};
        this.peerConnection = new RTCPeerConnection(configuration);
        this.peerConnection.onicecandidate = function(e){
            console.log("onicecandidate", e);
        };
        let wsURL = `ws://${Config.HOST}`;
        let ws = new NonShitWebSocket(wsURL, Authentication.getToken());

        ws.onOpen(() =>{
            this.joinRoom()
        });

        ws.onMessage((message) =>{
            console.log(message)
        });

        console.log(SocketResponse.JOINED_ROOM)
        this.ws = ws;

        this.getCameraFab = this.getCameraFab.bind(this);
        this.toggleCameraState = this.toggleCameraState.bind(this);
        this.joinRoom = this.joinRoom.bind(this);
    }

    joinRoom(){
        return new Promise((resolve, reject)=> {
            this.ws.send({type: "joinSession", uuid: this.state.session.uuid});
            this.ws.onMessage((message)=>{
                if (message.status !== 200) reject(message);

                resolve(message)
            })
        })
    }

    componentDidMount(){

        this.peerConnection.createOffer()
        .then(this.peerConnection.setLocalDescription)
        .then(console.log);

        this.loadCamera()
    }

    loadCamera(){
        let state = this.state.cameraState;
        if (state !== CAMERA_STATE_OFF){
            return StreamService.getStream(this.state.cameraState)
            .then(stream => this.setState({videoURL: stream.toURL()}));
        }
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
                                 streamURL={this.state.videoURL}/>
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
                            <Button title="join Room" onPress={this.joinRoom}/>
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