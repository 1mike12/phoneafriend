import React from 'react';
import {Vibration, ActivityIndicator, Button, FlatList, Text, TextInput, View, ScrollView, ToastAndroid} from "react-native";
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
const NAME = "ActiveSessionScreen";
export default class ActiveSessionScreen extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            session: this.props.session,
            ready: true,
        };
    }

    helpSession(){

    }

    call(){

    }

    static getName(){
        return `${config.name}.${NAME}`
    }

    render(){
        return (
            <View style={{position: "absolute", top: 0, bottom: 0, left: 0, right: 0}}>
                {!this.state.ready ? <ActivityIndicator/> :
                    <View style={styles.card}>
                        <SessionSummary session={this.state.session}/>
                        <Button title="Call" onPress={this.call}/>
                    </View>}
            </View>
        );
    }
}