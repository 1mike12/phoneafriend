import React from 'react';
import {ActivityIndicator, Button, FlatList, Image, ProgressBarAndroid, Text, TextInput, View} from "react-native";
import http from '../services/http';
import styles from "../styles";
import Chip from "../components/Chip";
import config from "../server/config";
import update from 'immutability-helper';

const NAME = "SessionEditScreen";
export default class SessionEditScreen extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            title: "",
            session: this.props.session
        };
        this.destroy = this.destroy.bind(this);
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

    componentWillUnmount(){
        this.state.session.save()
    }

    isValid(){

    }
    save(){

    }

    render(){
        return (
            <View style={{backgroundColor: "#FFF"}}>
                <Button title="log session" onPress={() => console.log(this.state.session)}/>
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
                <View style={{flexDirection: "row", flexWrap: "wrap", paddingLeft: 8, paddingRight: 8, marginBottom: 8}}>
                    {this.state.session.skills.map(skill =>{
                        return <View key={skill.id} style={{paddingRight: 8}}>
                            <Chip text={"#" + skill.name}/>
                        </View>
                    })}
                </View>
                <Image style={{height: 200, width: 200, marginBottom: 8}}
                       source={{uri: 'https://i.ytimg.com/vi/oDdK-g4XOAU/maxresdefault.jpg'}}/>
            </View>
        );
    }
}