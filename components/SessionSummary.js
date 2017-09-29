import React from 'react';
import {
    Button, FlatList, Text, View, StyleSheet, TouchableNativeFeedback, TouchableHighlight,
    TouchableOpacity, Image
} from "react-native";
import timeAgo from "time-ago";
import styles from "../styles";
import Chip from "./Chip";
const ta = timeAgo();

export default class SessionSummary extends React.Component {

    /**
     * @param props onDelete callback
     */
    constructor(props){
        super(props);
        this.state = {
            session: props.session
        };
    }

    render(){
        return (
            <View>
                <Text style={[styles.h2, {marginBottom: 8}]}>{this.state.session.title}</Text>
                <View style={{flexDirection: "row", alignItems: "center", marginBottom: 16}}>

                    <Image style={[styles.profilePic, {marginRight: 8}]}
                           source={{uri: this.state.session.pupil.profile_url}}/>
                    <Text>{this.state.session.pupil.getFirstAndInitial()} |
                        Created {ta.ago(this.state.session.created_at)}</Text>
                </View>

                {this.state.session.teacher ?
                    <View style={{flexDirection: "row", alignItems: "center", marginBottom: 16}}>

                        <Image style={[styles.profilePic, {marginRight: 8}]}
                               source={{uri: this.state.session.teacher.profile_url}}/>
                        <Text>{this.state.session.teacher.getFirstAndInitial()}</Text>
                    </View> : null}


                <Text style={{marginBottom: 20}}>{this.state.session.description}</Text>

                <View style={{flexDirection: "row", flexWrap: "wrap"}}>
                    {this.state.session.skills.map(skill =>{
                        return (
                            <View key={skill.id} style={{marginRight: 8, marginBottom: 8}}>
                                <Chip  text={"#" + skill.name}/>
                            </View>
                        )
                    })}
                </View>
            </View>
        );
    }
}