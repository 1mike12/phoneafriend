import React from 'react';
import {Vibration, ActivityIndicator, Button, FlatList, Text, TextInput, View} from "react-native";
import http from '../services/http';
import styles from "../styles";
import timeAgo from "time-ago";
import Skill from "../models/Skill";
import config from "../configReact";
import Util from "../Util";
import DeleteSkillModal from "./DeleteSkillModal";
import Session from "../models/Session";

const ta = timeAgo();
const NAME = "HelpableSessionsScreen";
export default class HelpableSessionsScreen extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            ready: false,
            editing: false,
            skills: [],
            query: ""
        };
        this.loadNextSession = this.loadNextSession.bind(this);
    }

    componentDidMount(){
        this.loadNextSession();
    }

    loadNextSession(){
        const offset = this.state.offset;
        const rowCount = this.state.rowCount;

        if (typeof offset === "number" && offset === rowCount){
            alert("reached the end")
        } else {
            this.setState({ready: false});
            return http.get("api/session/teachable-single", {
                params: {
                    after: this.state.offset ? this.state.offset +  1 : null,
                }
            })
            .then(res =>{
                let session = new Session(res.data.session);
                let offset = res.offset;
                let rowCount = res.rowCount;
                this.setState({session, offset, rowCount, ready: true})
            })
        }
    }

    static getName(){
        return `${config.name}.${NAME}`
    }

    render(){
        return (
            <View>
                {!this.state.ready ? <ActivityIndicator/> :
                    <View>
                        <Text>{this.state.session.title}</Text>
                        <Button title="Next" onPress={this.loadNextSession}/>
                    </View>
                }
            </View>
        );
    }
}