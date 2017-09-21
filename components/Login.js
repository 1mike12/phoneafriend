import React from 'react';
import axios from "axios";
import {FlatList, Text, View, StyleSheet, Button, TextInput} from "react-native";
import config from "../configReact";
import http from "../services/http"
import Authentication from "../services/Authentication";
import {NativeRouter, Route, Link} from "react-router-native";

const styles = StyleSheet.create({
    progress: {
        marginTop: 24
    },
    textField: {
        height: 48,  // have to do it on iOS
        marginTop: 10,
    },
    multiLine:{
        height: 100,
        marginTop:10
    },
});

export default class Home extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            loading: false,
            email: "1mike12@gmail.com",
            password: "123"
        };

        this.login = this.login.bind(this)
    }

    login(){

        const testUrl = "https://jsonplaceholder.typicode.com/posts";
        const localServer = config.domain + "/api/public/login";
        this.setState({loading: true});
        return http.post("api/public/login", {
            email: this.state.email,
            password: this.state.password
        })
        .then(res =>{
            this.setState({loading: false});
            Authentication.commitToken(res.data.token);
            http.setToken(res.data.token);
            console.log(res.data)
        })
        .catch(e =>{
            console.log(e);
            this.setState({loading: false})
        })
    }

    valid(){
        const emailPattern = /.+\@.+\..+/;
        return this.state.email.match(emailPattern) && this.state.password
    }

    static getName(){
        return "Login"
    }
    render(){
        return (
            <View>
                <TextInput
                    placeholder="Email"
                    keyboardType="email-address"
                    style={styles.textField}
                    onTextChange={(email) => this.setState({email})}
                    value={this.state.email}
                />
                <TextInput
                    placeholder="Password"
                    style={styles.textField}
                    value={this.state.password}
                    onTextChange={(password) => this.setState({password})}
                    secureTextEntry={true}
                />
                <View style={{marginTop: 24}}/>
                <Button title="Login"
                        onPress={this.login}
                />

                {this.valid() ? <Text>Valid</Text> : <Text>Invalid</Text>}
            </View>
        );
    }
}