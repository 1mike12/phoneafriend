import React from 'react';
import {
    Button, FlatList, Text, View, StyleSheet, TouchableNativeFeedback, TouchableHighlight,
    TouchableOpacity
} from "react-native";
import http from '../services/http';
import styles from "../styles";

const RADIUS = 56;
const fabStyle = StyleSheet.create({
    container: {
        borderRadius: 80,
        paddingLeft: 12,
        paddingRight: 12,
        height: RADIUS,
        width: RADIUS,
        alignItems: "center",
        flexDirection: "row",


        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 3,
    }
});

export default class Fab extends React.Component {

    /**
     * @param props onDelete callback
     */
    constructor(props){
        super(props);
        this.state = {
            icon: this.props.icon
        };
        this.press = this.press.bind(this);
    }

    press(){
        if (this.props.onPress) {
            this.props.onPress();
        }
    }


    render(){
        return (
            <TouchableOpacity onPress={this.press}
                              background={TouchableNativeFeedback.SelectableBackground()}
                              style={[this.props.style, fabStyle.container]}
            >
                {this.props.inside}
            </TouchableOpacity>
        );
    }
}