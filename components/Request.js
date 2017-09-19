import React from 'react';
import {Button, FlatList, Text, View} from "react-native";
import {MKProgress, getTheme} from "react-native-material-kit";
import http from '../services/http';
import styles from "../styles";
import timeAgo from "time-ago";

export default class Request extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            loading: true,
            request: null
        };
        this.loadAll= this.loadAll.bind(this);
        this.loadAll();
    }

    loadAll(){
        let uuid = this.props.match.params.uuid;

        http.get("api/session/" + uuid)
        .then(res=> {
            this.setState({
                loading: false,
                request: res.data
            })
        });
    }

    render(){
        if (this.state.loading) return  <MKProgress.Indeterminate/>;

        return (
            <View>
                <Button title="load" onPress={this.loadAll}/>
                <View style={styles.card}>
                    <Text style={styles.h1}>{this.state.request.title}</Text>
                    <Text>{this.state.request.description}</Text>
                </View>
            </View>
        );
    }
}