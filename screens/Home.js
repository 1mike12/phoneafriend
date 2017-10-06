import React from 'react';
import {Button, FlatList, ScrollView, Text, TouchableHighlight, TouchableOpacity, View} from "react-native";
import http from '../services/http';
import styles from "../styles";
import config from "../configReact";
import timeAgo from "time-ago";
import Request from "./SessionScreen";
import MySkills from "./MySkills";
import SessionEditScreen from "./SessionEditScreen";
import HelpableSessionsScreen from "./HelpableSessionsScreen";

const ta = timeAgo();
const NAME = "Home";
export default class Home extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            loading: true,
            teachableCount: null,
            skills: [],
            requests: []
        };

        this.loadSkills = this.loadSkills.bind(this);
        this.loadRequests = this.loadRequests.bind(this);
        this.loadTeachableCount = this.loadTeachableCount.bind(this);
        this.loadAll = this.loadAll.bind(this);
        this.goToSession = this.goToSession.bind(this);
        this.goToMySkills = this.goToMySkills.bind(this);

        this.loadAll()
        .then(() => this.setState({loading: false}))
    }

    loadAll(){
        return Promise.all([
            this.loadSkills(),
            this.loadRequests(),
            this.loadTeachableCount()
        ])
    }

    loadTeachableCount(){
        return http.get("api/session/teachable/count")
        .then(res => this.setState({teachableCount: res.data}))
    }

    loadSkills(){
        return http.get("api/skill/mine")
        .then(res =>{
            let skills = res.data.map(skill =>{
                skill.key = skill.id;
                return skill;
            });
            this.setState({skills})
        })
        .catch(console.log)
    }

    loadRequests(){
        return http.get("api/session/mine")
        .then(res =>{
            let requests = res.data.map(session =>{
                session.key = session.id;
                return session;
            });
            this.setState({requests})
        })
    }

    goToSession(uuid){
        this.props.navigator.push({
            screen: Request.getName(), // unique ID registered with Navigation.registerScreen
            title: undefined, // navigation bar title of the pushed screen (optional)
            titleImage: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAzCAYAAAA6oTAqAAAAEXRFWHRTb2Z0d2FyZQBwbmdjcnVzaEB1SfMAAABQSURBVGje7dSxCQBACARB+2/ab8BEeQNhFi6WSYzYLYudDQYGBgYGBgYGBgYGBgYGBgZmcvDqYGBgmhivGQYGBgYGBgYGBgYGBgYGBgbmQw+P/eMrC5UTVAAAAABJRU5ErkJggg==', // iOS only. navigation bar title image instead of the title text of the pushed screen (optional)
            passProps: {uuid}, // Object that will be passed as props to the pushed screen (optional)
            animated: true, // does the push have transition animation or does it happen immediately (optional)
            animationType: 'slide-horizontal', // 'fade' (for both) / 'slide-horizontal' (for android) does the push have different transition animation (optional)
        });
    }

    goToMySkills(){
        this.props.navigator.push({
            screen: MySkills.getName(), // unique ID registered with Navigation.registerScreen
            titleImage: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAzCAYAAAA6oTAqAAAAEXRFWHRTb2Z0d2FyZQBwbmdjcnVzaEB1SfMAAABQSURBVGje7dSxCQBACARB+2/ab8BEeQNhFi6WSYzYLYudDQYGBgYGBgYGBgYGBgYGBgZmcvDqYGBgmhivGQYGBgYGBgYGBgYGBgYGBgbmQw+P/eMrC5UTVAAAAABJRU5ErkJggg==', // iOS only. navigation bar title image instead of the title text of the pushed screen (optional)
            animated: true, // does the push have transition animation or does it happen immediately (optional)
            animationType: 'slide-horizontal', // 'fade' (for both) / 'slide-horizontal' (for android) does the push have different transition animation (optional)
        });
    }

    static getName(){
        return `${config.name}.${NAME}`
    }

    render(){
        return (
            <ScrollView style={{padding: 8}}>
                <View style={{flexDirection: "row"}}>
                    <TouchableOpacity onPress={this.goToMySkills} style={{flex: 1, marginRight: 8}}>
                        <View style={[styles.card, {backgroundColor: styles.primary}]}>
                            <Text style={{
                                fontSize: 48,
                                fontWeight: "900",
                                color: "#FFF"
                            }}>{this.state.skills.length}</Text>
                            <Text style={[styles.h1, {color: "#FFF"}]}>skills</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() =>{
                            this.props.navigator.push({
                                screen: HelpableSessionsScreen.getName(),
                                titleImage: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAzCAYAAAA6oTAqAAAAEXRFWHRTb2Z0d2FyZQBwbmdjcnVzaEB1SfMAAABQSURBVGje7dSxCQBACARB+2/ab8BEeQNhFi6WSYzYLYudDQYGBgYGBgYGBgYGBgYGBgZmcvDqYGBgmhivGQYGBgYGBgYGBgYGBgYGBgbmQw+P/eMrC5UTVAAAAABJRU5ErkJggg==',
                                animated: true,
                                animationType: 'slide-horizontal',
                            });
                        }}
                        style={{flex: 1}}
                    >
                        <View style={styles.card}>
                            <Text style={{fontSize: 48, fontWeight: "900"}}>{this.state.teachableCount}</Text>
                            <Text style={styles.h1}>I Can Help</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <Button title="Get Help"
                        onPress={() =>{
                            this.props.navigator.push({
                                screen: SessionEditScreen.getName(), // unique ID registered with Navigation.registerScreen
                                title: "New Request", // navigation bar title of the pushed screen (optional)
                                titleImage: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAzCAYAAAA6oTAqAAAAEXRFWHRTb2Z0d2FyZQBwbmdjcnVzaEB1SfMAAABQSURBVGje7dSxCQBACARB+2/ab8BEeQNhFi6WSYzYLYudDQYGBgYGBgYGBgYGBgYGBgZmcvDqYGBgmhivGQYGBgYGBgYGBgYGBgYGBgbmQw+P/eMrC5UTVAAAAABJRU5ErkJggg==',
                            })
                        }}
                />

                <View style={styles.card}>
                    <Text style={styles.h1}>My Requests </Text>
                    {this.state.requests.length === 0 ?
                        <Text>No open requests, create one</Text> :
                        <FlatList
                            data={this.state.requests}
                            ItemSeparatorComponent={() => <View style={{height: 1, backgroundColor: '#CCC'}}/>}
                            renderItem={({item}) =>{
                                return (
                                    <Text onPress={() =>{
                                        this.goToSession(item.uuid)
                                    }}
                                          style={styles.listItem}
                                    >{item.title} | {ta.ago(item.created_at)}
                                    </Text>
                                )

                            }}
                        />
                    }

                </View>
            </ScrollView>
        );
    }
}