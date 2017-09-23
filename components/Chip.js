import React from 'react';
import {Button, FlatList, Text, View} from "react-native";
import http from '../services/http';
import styles from "../styles";

const chipContainer = {
    borderRadius: 80,
    paddingLeft: 12,
    paddingRight: 12,
    height: 32,
    backgroundColor: "#DDD",
};

const chipText = {
    fontSize: 16,
};

const closeButton = {
    marginLeft: 4,
    height: 16,
    width: 16,
    borderRadius: 80,
    backgroundColor: "#333",
    color: "#FFF",
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 8
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
            <View style={chipContainer}>
                <Text style={chipText}>{this.state.text}</Text>
                <Text style={closeButton}>X</Text>
            </View>
        );
    }
}