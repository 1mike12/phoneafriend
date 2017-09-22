import React from 'react';
import {Button, FlatList, Text, View} from "react-native";
import http from '../services/http';
import styles from "../styles";

const style = {
    borderRadius: 80,
    paddingLeft: 12,
    paddingRight: 12,
    height: 32,
    backgroundColor: "#DDD",
    marginRight: 8,
    textAlignVertical: "center", textAlign: "center", fontSize: 16
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
            <Text style={style}>{this.state.text}</Text>
        );
    }
}