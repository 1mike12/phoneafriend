import React from 'react';
import {Button, FlatList, Text, View} from "react-native";
import http from '../services/http';
import styles from "../styles";
import {Link} from "react-router-native";

import timeAgo from "time-ago";

const ta = timeAgo();

export default class Home extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            loading: true,
            skills: [],
            requests: []
        };

        this.loadSkills = this.loadSkills.bind(this);
        this.loadRequests = this.loadRequests.bind(this);
        this.loadAll = this.loadAll.bind(this);
        this.goToRequest = this.goToRequest.bind(this);

        this.loadAll()
        .then(() => this.setState({loading: false}))
    }

    loadAll(){
        return Promise.all([
            this.loadSkills(),
            this.loadRequests()
        ])
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
            console.log(res.data);
            let requests = res.data.map(session =>{
                session.key = session.id;
                return session;
            });
            this.setState({requests})
        })
    }

    goToRequest(uuid){
        console.log(uuid);
        this.props.navigator.push({
            screen: 'phoneafriend.Request', // unique ID registered with Navigation.registerScreen
            title: undefined, // navigation bar title of the pushed screen (optional)
            titleImage: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAzCAYAAAA6oTAqAAAAEXRFWHRTb2Z0d2FyZQBwbmdjcnVzaEB1SfMAAABQSURBVGje7dSxCQBACARB+2/ab8BEeQNhFi6WSYzYLYudDQYGBgYGBgYGBgYGBgYGBgZmcvDqYGBgmhivGQYGBgYGBgYGBgYGBgYGBgbmQw+P/eMrC5UTVAAAAABJRU5ErkJggg==', // iOS only. navigation bar title image instead of the title text of the pushed screen (optional)
            passProps: {uuid}, // Object that will be passed as props to the pushed screen (optional)
            animated: true, // does the push have transition animation or does it happen immediately (optional)
            animationType: 'fade', // 'fade' (for both) / 'slide-horizontal' (for android) does the push have different transition animation (optional)
            backButtonTitle: undefined, // override the back button title (optional)
            backButtonHidden: false, // hide the back button altogether (optional)
            navigatorStyle: {}, // override the navigator style for the pushed screen (optional)
            navigatorButtons: {} // override the nav buttons for the pushed screen (optional)
        });
    }

    static getName(){
        return "Home"
    }

    render(){
        return (
            <View>
                <Button title="load" onPress={this.loadAll}/>
                <View style={styles.card}>
                    <Text style={styles.h1}>My Skills</Text>
                    <FlatList
                        data={this.state.skills}
                        renderItem={({item}) =>{
                            return <Text>{item.name}</Text>
                        }}
                    />
                </View>

                <View style={styles.card}>
                    <Text style={styles.h1}>Requests </Text>
                    <FlatList
                        data={this.state.requests}
                        itemSeparatorComponent={() => <View style={{width: 10, height: 10, backgroundColor: 'red'}}/>}
                        renderItem={({item}) =>{
                            return <Text onPress={() =>{
                                this.goToRequest(item.uuid)
                            }}>{item.title} | {ta.ago(item.created_at)}</Text>

                        }}
                    />
                </View>
            </View>
        );
    }
}