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
    ToastAndroid
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

const ta = timeAgo();
const NAME = "AccountScreen";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default class AccountScreen extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            session: this.props.session,
            ready: false,
            icons: ["new-box", "help-circle", "account-star", "account-multiple", "bell-ring", "atom", "bowling", "cake-variant", "camera", "cash", "comment-question-outline", "flask", "google-controller", "sleep-off", "owl", "leaf", "fire"]
        };
        this.load = this.load.bind(this);
        this.load();
    }

    randomColor(){
        let letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    load(){
        return http.get("api/user/mine")
        .then(res =>{
            console.log(res.data)
            this.setState({user: res.data, ready: true})
        })
    }

    static getName(){
        return `${config.name}.${NAME}`
    }

    render(){
        return (
            <ScrollView style={{position: "absolute", top: 0, bottom: 0, left: 0, right: 0}}>
                <Button title="load" onPress={this.load}/>
                {!this.state.ready ? <ActivityIndicator/> :
                    <View>
                        <View style={styles.card}>
                            <Text style={styles.h2}>{this.state.user.first_name}</Text>
                            <Text>Email: {this.state.user.email}</Text>
                            <Text>User since : {ta.ago(this.state.user.created_at)}</Text>
                        </View>

                        <View style={styles.card}>
                            <Text style={styles.h2}>Payments</Text>
                            <Text>Tokens: 23</Text>
                            <Text style={{marginTop: 16}}>Credit Cards: </Text>
                            <Text>Discover XXXX 1234</Text>
                            <Text>Visa XXXX 4321</Text>
                        </View>

                        <View style={styles.card}>
                            <Text style={styles.h2}>Achievements</Text>
                            <Text>People Helped: 27</Text>
                            <View style={{flexDirection: "row", flexWrap: "wrap"}}>
                                {this.state.icons.map(name =>
                                    <Icon style={{marginRight: 8}}
                                          key={name}
                                          name={name}
                                          size={80}
                                          color={this.randomColor()}/>)
                                }
                            </View>
                        </View>

                    </View>
                }
            </ScrollView>
        );
    }
}