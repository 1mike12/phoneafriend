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
import ActiveSessionScreen from "./ActiveSessionScreen";

const ta = timeAgo();
const NAME = "HelpableSessionsScreen";
export default class HelpableSessionsScreen extends React.Component {

    constructor(props){
        super(props);

        this.offset = 0;
        this.rowCount = 9999999999999;
        this.state = {
            ready: false,
        };
        this.loadNextSession = this.loadNextSession.bind(this);
        this.loadPreviousSession = this.loadPreviousSession.bind(this);
        this.loadSession = this.loadSession.bind(this);
        this.helpSession = this.helpSession.bind(this);
    }

    componentDidMount(){
        this.loadSession();
    }

    loadNextSession(){
        if (this.rowCount - this.offset === 1) return ToastAndroid.show("Reached the end!", ToastAndroid.SHORT);
        this.offset += 1;
        return this.loadSession();
    }

    loadPreviousSession(){
        if (this.offset === 0) return ToastAndroid.show("At First", ToastAndroid.SHORT);
        this.offset -= 1;
        return this.loadSession();
    }

    loadSession(){
        console.log("loadSession")
        this.setState({ready: false});
        return http.get("api/session/teachable-single", {
            params: {
                after: this.offset
            }
        })
        .then(res =>{
            console.log(res.data)
            let session = new Session(res.data.session);
            let rowCount = res.data.rowCount;

            this.offset = res.data.offset;
            this.rowCount = rowCount;
            this.setState({session, rowCount, ready: true}, ()=> console.log(this.state))
        })
    }

    helpSession(){
        this.props.navigator.push({
            screen: ActiveSessionScreen.getName(),
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
                    </View>}


                <View style={{flexDirection: "row", position: "absolute", bottom: 0}}>
                    <View style={{flex: 1, padding: 8}}>
                        <Button title="Prev" onPress={this.loadPreviousSession}/>
                    </View>
                    <View style={{flex: 2, padding: 8}}>
                        <Button title="Help" onPress={this.helpSession}/>
                    </View>
                    <View style={{flex: 1, padding: 8}}>
                        <Button title="Next" onPress={this.loadNextSession}/>
                    </View>
                </View>

            </View>
        );
    }
}