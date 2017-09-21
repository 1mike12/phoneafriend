import React from 'react';
import {Button, FlatList, ProgressBarAndroid, Text, View} from "react-native";
import http from '../services/http';
import styles from "../styles";
import timeAgo from "time-ago";

const ta = timeAgo();

export default class Request extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            ready: false,
            request: {
                title: ""
            }
        };
        this.loadAll = this.loadAll.bind(this);
        this.destroy = this.destroy.bind(this);

        this.loadAll();
    }

    loadAll(){
        this.setState({ready: false});
        return http.get("api/session/" + this.props.uuid)
        .then(res =>{
            console.log(res.data);
            this.setState({
                request: res.data,
                ready: true
            });
        });
    }

    edit(){

    }

    destroy(){
        console.log(this.props);
        return http.delete("api/session/" + this.props.uuid)
        .then(()=> this.props.navigator.pop({
            animated: true,
            animationType: 'fade',
        }))
        .catch(console.log)
    }

    static getName(){
        return "Request"
    }

    render(){
        return (
            <View>
                {!this.state.ready ? <ProgressBarAndroid/> :
                    <View>
                        <Button title="load" onPress={this.loadAll}/>
                        <View style={styles.card}>
                            <Text style={styles.h1}>{this.state.request.title}</Text>
                            <Text>{ta.ago(this.state.request.created_at)}</Text>
                            <Text style={{marginBottom: 20}}> {this.state.request.description}</Text>
                            <Button title="Edit" onPress={this.edit}/>
                            <View style={{height: 12}}/>
                            <Button title="Delete" onPress={this.destroy}/>
                        </View>
                    </View>
                }
            </View>
        );
    }
}