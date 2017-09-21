import React from 'react';
import {Button, FlatList, Text, View} from "react-native";
import http from '../services/http';
import styles from "../styles";
import timeAgo from "time-ago";

const ta = timeAgo();

export default class Request extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            loading: true,
            request: null
        };
        this.loadAll = this.loadAll.bind(this);
        this.loadAll();
    }

    loadAll(){
        let uuid = this.props.match.params.uuid;

        http.get("api/session/" + uuid)
        .then(res =>{
            this.setState({
                loading: false,
                request: res.data
            })
        });
    }

    edit(){

    }

    delete(){

    }

    static getName(){
        return "Request"
    }

    render(){
        return (
            <View>
                <Button title="load" onPress={this.loadAll}/>
                <View style={styles.card}>
                    <Text style={styles.h1}>{this.state.request.title}</Text>
                    <Text>{ta.ago(this.state.request.created_at)}</Text>
                    <Text style={{marginBottom: 20}}> {this.state.request.description}</Text>
                    <Button title="Edit" onPress={this.edit}/>
                    <View style={{height: 12}}/>
                    <Button title="Delete" onPress={this.delete}/>
                </View>
            </View>
        );
    }
}