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
import CallScreen from "./CallScreen";

const ta = timeAgo();
const NAME = "ActiveSessionScreen";
export default class ActiveSessionScreen extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            session: this.props.session,
            ready: true,
        };

        this.call = this.call.bind(this);
    }

    call(){
        this.props.navigator.push({
            screen: CallScreen.getName(),
            titleImage: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAzCAYAAAA6oTAqAAAAEXRFWHRTb2Z0d2FyZQBwbmdjcnVzaEB1SfMAAABQSURBVGje7dSxCQBACARB+2/ab8BEeQNhFi6WSYzYLYudDQYGBgYGBgYGBgYGBgYGBgZmcvDqYGBgmhivGQYGBgYGBgYGBgYGBgYGBgbmQw+P/eMrC5UTVAAAAABJRU5ErkJggg==',
            animated: true,
            animationType: 'slide-horizontal',
            passProps: {session: this.state.session},
        });
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
                        <Button title="Connect" onPress={this.call}/>
                    </View>}
            </View>
        );
    }
}