import React from 'react';
import {Button, FlatList, Text, View} from "react-native";
import http from '../services/http';
import styles from "../styles";
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
            let requests = res.data.map(session =>{
                session.key = session.id;
                return session;
            });
            this.setState({requests})
        })
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
                        renderItem={({item}) =>{
                            return <Text>{ta.ago(item.created_at)}</Text>
                        }}
                    />
                </View>
            </View>
        );
    }
}