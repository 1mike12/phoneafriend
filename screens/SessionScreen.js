import React from 'react';
import {
    ActivityIndicator, Button, FlatList, Image, ProgressBarAndroid, Text, TextInput, TouchableHighlight,
    View
} from "react-native";
import http from '../services/http';
import styles from "../styles";
import timeAgo from "time-ago";
import Chip from "../components/Chip";
import Session from "../models/Session";
import config from "../configReact";
import SessionEdit from "./SessionEditScreen";
import SessionSummary from "../components/SessionSummary";

const ta = timeAgo();

const NAME = "SessionScreen";
export default class SessionScreen extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            ready: false,
            title: "",
            session: null
        };
        this.loadAll = this.loadAll.bind(this);
        this.destroy = this.destroy.bind(this);
    }

    componentDidMount(){
        this.loadAll();
    }

    loadAll(){
        this.setState({ready: false});
        return http.get("api/session/" + this.props.uuid)
        .then(res =>{

            let session = new Session(res.data);
            this.setState({
                session: session,
                ready: true
            });

            console.log(session);
        });
    }

    edit(){
    }

    destroy(){
        return http.delete("api/session/", {uuid: this.props.uuid})
        .then(() => this.props.navigator.pop({
            animated: true,
            animationType: 'fade',
        }))
        .catch(console.log)
    }

    static getName(){
        return `${config.name}.${NAME}`
    }

    render(){
        return (
            <View>
                {!this.state.ready ? <ActivityIndicator/> :
                    <View>
                        <Button title="load" onPress={this.loadAll}/>

                        <View style={styles.card}>
                            <SessionSummary session={this.state.session}/>
                            <Button title="Edit" onPress={() =>{
                                this.props.navigator.push({
                                    screen: SessionEdit.getName(),
                                    title: "Edit",
                                    titleImage: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAzCAYAAAA6oTAqAAAAEXRFWHRTb2Z0d2FyZQBwbmdjcnVzaEB1SfMAAABQSURBVGje7dSxCQBACARB+2/ab8BEeQNhFi6WSYzYLYudDQYGBgYGBgYGBgYGBgYGBgZmcvDqYGBgmhivGQYGBgYGBgYGBgYGBgYGBgbmQw+P/eMrC5UTVAAAAABJRU5ErkJggg==',
                                    passProps: {session: this.state.session},
                                    animated: true,
                                    animationType: 'slide-horizontal'
                                })
                            }}/>
                            <View style={{height: 12}}/>
                            <Button title="Delete" onPress={this.destroy}/>
                        </View>
                    </View>
                }
            </View>
        );
    }
}