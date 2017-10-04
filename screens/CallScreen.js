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
import Util from "../Util";
import DeleteSkillModal from "./DeleteSkillModal";
import Session from "../models/Session";
import SessionSummary from "../components/SessionSummary";
import Fab from "../components/Fab";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const ta = timeAgo();
const NAME = "CallScreen";

const CAMERA_STATE_REAR = "rear";
const CAMERA_STATE_FRONT = "front";
const CAMERA_STATE_OFF = "off";

export default class CallScreen extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            session: this.props.session,
            ready: true,
            cameraState: CAMERA_STATE_FRONT
        };

        setTimeout(() => this.setState({ready: true}), 3000)

        this.getCameraFab = this.getCameraFab.bind(this);
    }

    static getName(){
        return `${config.name}.${NAME}`
    }

    getCameraFab(){
        console.log("cameraState", this.state.cameraState)
        if (this.state.cameraState === CAMERA_STATE_REAR) {
            return <Fab style={{backgroundColor: "#AAA", margin: 12}}
                        onPress={() => this.setState({cameraState: CAMERA_STATE_FRONT})}
                        inside={<Icon name="camera-front-variant"
                                      size={32}
                                      color="white"/>
                        }
            />
        } else if (this.state.cameraState === CAMERA_STATE_FRONT) {
            return <Fab style={{backgroundColor: "#AAA", margin: 12}}
                        onPress={() => this.setState({cameraState: CAMERA_STATE_REAR})}
                        inside={<Icon name="camera-rear-variant"
                                      size={32}
                                      color="white"/>
                        }
            />
        } else {
            return <Fab style={{backgroundColor: "#AAA", margin: 12}}
                        inside={<Icon name="test-tube"
                                      size={32}
                                      color="white"/>}
            />
        }
    }

    render(){
        return (
            <View style={{position: "absolute", top: 0, bottom: 0, left: 0, right: 0, backgroundColor: "#EEE"}}>
                {!this.state.ready ?
                    <View style={{position: "absolute", top: 0, bottom: 0, left: 0, right: 0, backgroundColor: "#EEE"}}>
                        <Image style={[styles.profilePicLarge, {marginRight: 8}]}
                               source={{uri: this.state.session.pupil.profile_url}}/>
                        <Text style={[styles.h1]}>Connecting
                            with {this.state.session.pupil.getFirstAndInitial()}...</Text>
                        <ActivityIndicator size="large"/>
                    </View> :
                    <View style={{position: "absolute", top: 0, bottom: 0, left: 0, right: 0, backgroundColor: "#EEE"}}>
                        <Text>Loaded</Text>

                        <View style={{
                            position: "absolute",
                            bottom: 0,
                            flexDirection: 'row',
                            justifyContent: "space-between"
                        }}>
                            <Fab style={{backgroundColor: "#AAA", margin: 12}}
                                 inside={<Icon name="camera"
                                               size={32}
                                               color="white"/>
                                 }
                            />
                            {this.getCameraFab()}
                            <Fab style={{backgroundColor: "green", margin: 12}}
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