import React from 'react';
import {Button, FlatList, Text, View} from "react-native";
import http from '../services/http';
import styles from "../styles";

const style = {
    borderRadius:30,
    padding: 8,
    width: 100,
    height: 30,
    backgroundColor: "#DDD",
    marginRight: 8
};

export default class Chip extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            text: props.text
        };
    }

    render(){
        return (
            <View style={style}>
                <Text style={{textAlignVertical: "center", textAlign: "center", fontSize: 16}}>{this.state.text}</Text>
            </View>
        );
    }
}