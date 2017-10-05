import React from 'react';
import {FlatList, Text, View, StyleSheet, Button, TextInput, TouchableOpacity} from "react-native";
import config from "../configReact";
import http from "../services/http"
import Authentication from "../services/Authentication";
import CreateAccountScreen from "./CreateAccountScreen";

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

const NAME = "Login";
export default class Login extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            loading: false,
            email: "1mike12@gmail.com",
            password: "123"
        };

        this.login = this.login.bind(this)
        this.goToLogin = this.goToLogin.bind(this)
    }

    login(){
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
        return `${config.name}.${NAME}`
    }

    goToLogin(){
        this.props.navigator.push({
            screen: CreateAccountScreen.getName(), // unique ID registered with Navigation.registerScreen
            titleImage: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAzCAYAAAA6oTAqAAAAEXRFWHRTb2Z0d2FyZQBwbmdjcnVzaEB1SfMAAABQSURBVGje7dSxCQBACARB+2/ab8BEeQNhFi6WSYzYLYudDQYGBgYGBgYGBgYGBgYGBgZmcvDqYGBgmhivGQYGBgYGBgYGBgYGBgYGBgbmQw+P/eMrC5UTVAAAAABJRU5ErkJggg==', // iOS only. navigation bar title image instead of the title text of the pushed screen (optional)
            animated: true, // does the push have transition animation or does it happen immediately (optional)
            animationType: 'slide-horizontal', // 'fade' (for both) / 'slide-horizontal' (for android) does the push have different transition animation (optional)
        });
    }

    render(){
        return (
            <View>
                <TextInput
                    placeholder="Email"
                    keyboardType="email-address"
                    style={styles.textField}
                    onChangeText={(email) => this.setState({email})}
                    value={this.state.email}
                />
                <TextInput
                    placeholder="Password"
                    style={styles.textField}
                    value={this.state.password}
                    onChangeText={(password) => this.setState({password})}
                    secureTextEntry={true}
                />
                <View style={{marginTop: 24}}/>
                <Button title="Login"
                        onPress={this.login}
                />
                <TouchableOpacity onPress={this.goToLogin}>
                    <Text style={{padding: 16}}>Create account</Text>
                </TouchableOpacity>
                {this.valid() ? <Text>Valid</Text> : <Text>Invalid</Text>}
            </View>
        );
    }
}