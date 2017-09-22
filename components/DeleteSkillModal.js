import React from 'react';
import {ActivityIndicator, Button, FlatList, Text, TextInput, View} from "react-native";
import http from '../services/http';
import styles from "../styles";
import timeAgo from "time-ago";

const ta = timeAgo();

export default class DeleteSkillModal extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            skill: this.props.skill
        };
    }

    destroy(){
    }

    static getName(){
        return "DeleteSkillModal"
    }

    render(){
        return (
            <View style={{backgroundColor: "#FFF"}}>
                <Text>Remove Skill?</Text>
                <Button title="Yes"
                        onPress={this.destroy}
                />
                <Button title="Cancel"
                        onPress={() =>{
                            this.props.navigator.dismissLightBox();
                        }}
                />
            </View>
        );
    }
}