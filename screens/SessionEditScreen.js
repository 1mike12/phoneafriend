import React from 'react';
import {ActivityIndicator, Button, FlatList, Image, ProgressBarAndroid, Text, TextInput, View} from "react-native";
import http from '../services/http';
import styles from "../styles";
import Chip from "../components/Chip";
import config from "../server/config";
import update from 'immutability-helper';
import Session from "../models/Session";
import {ToastAndroid} from "react-native";

const NAME = "SessionEditScreen";
export default class SessionEditScreen extends React.Component {

    constructor(props){
        super(props);

        let isNew = true;
        let session;
        if (this.props.session && this.props.session.uuid){
            isNew = false;
            session = this.props.session;
        } else {
            session = new Session();
        }
        this.state = {
            title: "",
            skillQuery: "",
            isNew: isNew,
            session: session
        };
        this.destroy = this.destroy.bind(this);
        this.getFormErrors = this.getFormErrors.bind(this);
        this.saveSession = this.saveSession.bind(this);
    }

    componentDidMount(){
        this.props.navigator.toggleTabs({
            to: 'hidden',
            animated: true
        });
    }

    destroy(){
        return http.delete("api/session/", {uuid: this.props.uuid})
        .then(() => this.props.navigator.pop({
            animated: true,
            animationType: 'fade',
        }))
        .catch(console.log)
    }

    static getName(){
        return `${config.name}.${NAME}`
    }


    getFormErrors(){
        let errors = [];
        let session = this.state.session;
        if (!session.title) errors.push({message: "no title", field: "title"});
        if (session.title.length > 127) errors.push({message: "title too long", field: "title"});
        if (!session.description) errors.push({message: "no description", field: "description"});
        if (session.description.length > 250) errors.push({message: "description too long", field: "description"});
        return errors;
    }

    saveSession(){
        let errors = this.getFormErrors();
        if (errors.length > 0){
            ToastAndroid.show(errors[0].message, ToastAndroid.SHORT);
        } else {
            return this.state.session.save()
        }
    }

    render(){
        return (
            <View style={{backgroundColor: "#FFF"}}>
                <TextInput
                    placeholder="Title"
                    style={styles.textField}
                    onChangeText={(title) =>{
                        this.setState({
                            session: update(this.state.session, {title: {$set: title}})
                        })
                    }}
                    value={this.state.session.title}
                />

                <TextInput
                    placeholder="Description"
                    multiline={true}
                    style={{height: 150, textAlignVertical: 'top'}}
                    onChangeText={(description) =>{
                        this.setState({
                            session: update(this.state.session, {description: {$set: description}})
                        })
                    }}
                    value={this.state.session.description}
                />

                <Text style={{textAlign: "right"}}>{this.state.session.description.length}/250</Text>

                <TextInput
                    placeholder="Search Skill"
                    onChangeText={(skillQuery) =>{
                        this.setState({skillQuery})
                    }}
                    value={this.state.skillQuery}
                />


                <View
                    style={{flexDirection: "row", flexWrap: "wrap", paddingLeft: 8, paddingRight: 8, marginBottom: 8}}>
                    {this.state.session.skills.map(skill =>{
                        return <View key={skill.id} style={{paddingRight: 8}}>
                            <Chip text={"#" + skill.name}/>
                        </View>
                    })}
                </View>
                <Image style={{height: 200, width: 200, marginBottom: 8}}
                       source={{uri: 'https://i.ytimg.com/vi/oDdK-g4XOAU/maxresdefault.jpg'}}/>
                <Button title="Save" onPress={this.saveSession}/>
            </View>
        );
    }
}