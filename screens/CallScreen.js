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

const ta = timeAgo();
const NAME = "CallScreen";
export default class CallScreen extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            session: this.props.session,
            ready: false,
        };

        setTimeout(() => this.setState({ready: true}), 3000)
    }

    static getName(){
        return `${config.name}.${NAME}`
    }

    render(){
        return (
            <View style={{position: "absolute", top: 0, bottom: 0, left: 0, right: 0, backgroundColor: "#EEE"}}>
                {!this.state.ready ?
                    <View>
                        <Image style={[styles.profilePicLarge, {marginRight: 8}]}
                               source={{uri: this.state.session.pupil.profile_url}}/>
                        <Text style={[styles.h1]}>Connecting
                            with {this.state.session.pupil.getFirstAndInitial()}...</Text>
                        <ActivityIndicator size="large"/>
                    </View> :
                    <View>
                        <Text>Loaded</Text>
                    </View>
                }
            </View>
        );
    }
}