import React from 'react';
import {ToastAndroid, ActivityIndicator, Button, FlatList, Text, TextInput, View} from "react-native";
import styles from "../styles";
import timeAgo from "time-ago";

const ta = timeAgo();

export default class DeleteSkillModal extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            skill: this.props.skill
        };

        this.destroy = this.destroy.bind(this);
    }

    destroy(){
        return this.state.skill.delete()
        .then(()=> {
            this.props.onDelete();
            ToastAndroid.show(`Removed ${this.state.skill.name}`, ToastAndroid.SHORT);
            this.props.navigator.dismissLightBox();
        });
    }

    static getName(){
        return "DeleteSkillModal"
    }

    render(){
        return (
            <View style={[styles.card, {marginLeft: 32, marginRight: 32}]}>
                <Text style={[styles.h2, {textAlign: "center", marginBottom: 16}]}>Remove {this.state.skill.name}?</Text>
                <View style={{flexDirection: "row", justifyContent: 'space-between'}}>
                    <Button title="Yes"
                            onPress={this.destroy}
                            style={{flex: 1}}
                    />
                    <Button title="Cancel"
                            onPress={() =>{
                                this.props.navigator.dismissLightBox();
                            }}
                            style={{flex: 1}}
                    />
                </View>
            </View>
        );
    }
}