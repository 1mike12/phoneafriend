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
const NAME = "AccountScreen";
export default class AccountScreen extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            session: this.props.session,
            ready: false,
        };
        this.load();
    }

    load(){
        return http.get("api/user/mine")
        .then(res=> {
            console.log(res.data)
            this.setState({user: res.data, ready: true})
        })
    }

    static getName(){
        return `${config.name}.${NAME}`
    }

    render(){
        return (
            <View style={{position: "absolute", top: 0, bottom: 0, left: 0, right: 0}}>
                <Button title="load" onPress={this.load} />
                {!this.state.ready ? <ActivityIndicator/> :
                    <View>
                        <View style={styles.card}>
                            <Text>{this.state.user.first_name}</Text>
                            <Text>Email: {this.state.user.email}</Text>
                            <Text>User since : {ta.ago(this.state.user.created_at)}</Text>
                        </View>

                        <View style={styles.card}>
                            <Text style={styles.h2}>Payments</Text>
                            <Text>Tokens: 23</Text>
                            <Text>Credit Cards: </Text>
                            <Text>Discover 1234</Text>
                            <Text>Visa 4321</Text>
                        </View>

                        <View style={styles.card}>
                            <Text style={styles.h2}>Achievements</Text>
                            <Text>People Helped: 27</Text>
                        </View>

                    </View>
                }
            </View>
        );
    }
}