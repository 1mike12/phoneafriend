import React from 'react';
import {
    Button, FlatList, Text, View, StyleSheet, TouchableNativeFeedback, TouchableHighlight,
    TouchableOpacity
} from "react-native";
import http from '../services/http';
import styles from "../styles";

const chipStyles = StyleSheet.create({
    chipContainer: {
        borderRadius: 80,
        paddingLeft: 12,
        paddingRight: 12,
        height: 32,
        backgroundColor: "#DDD",
        flexDirection: "row",
        alignItems: "center"

    },
    chipText: {
        fontSize: 16,
    },
    closeButton: {
        marginLeft: 4,
        height: 24,
        width: 24,
        borderRadius: 80,
        backgroundColor: "#777",
        color: "#FFF",
        textAlign: "center",
        textAlignVertical: "center",
        fontSize: 12
    }
});

export default class Chip extends React.Component {

    /**
     * @param props onDelete callback
     */
    constructor(props){
        super(props);
        this.state = {
            text: props.text
        };
        this.deletePress = this.deletePress.bind(this);
    }

    deletePress(){
        if (this.props.onDelete){
            this.props.onDelete();
        }
    }

    render(){
        return (
            <View style={chipStyles.chipContainer}>
                <Text style={chipStyles.chipText}>{this.state.text}</Text>
                <TouchableOpacity onPress={this.deletePress}
                                  background={TouchableNativeFeedback.SelectableBackground()}>

                    {this.props.onDelete ? <Text style={chipStyles.closeButton}>X</Text> : null}
                </TouchableOpacity>
            </View>
        );
    }
}