import React from 'react';
import axios from "axios";
import {FlatList, Text, View, StyleSheet, Button} from "react-native";
import {MKButton, MKColor, MKProgress, MKTextField} from "react-native-material-kit";
import config from "../configReact";
import http from "../services/http"
import Authentication from "../services/Authentication";

const styles = StyleSheet.create({
    progress: {
        marginTop: 24
    },
    textField: {
        height: 48,  // have to do it on iOS
        marginTop: 10,
    }
});

const LoginButton = MKButton.button()
.withText('Login')
.build();

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
            Authentication.setToken(res.data.token);
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

    getMySkills(){
        console.log("getting skills")
        return http.get("api/skill/mine")
        .then(res =>{
            console.log(res.data)
        })
        .catch(e =>{
            console.log(e);
        })
    }

    render(){
        return (
            <View>
                <MKTextField
                    placeholder="Email"
                    floatingLabelEnabled={true}
                    style={styles.textField}
                    onTextChange={(email) => this.setState({email})}
                    text={this.state.email}
                />
                <MKTextField
                    placeholder="Password"
                    floatingLabelEnabled={true}
                    style={styles.textField}
                    onTextChange={(password) => this.setState({password})}
                    password={true}
                />
                <View style={{marginTop: 24}}/>

                <LoginButton onPress={this.login}/>
                {this.valid() ? <Text>Valid</Text> : <Text>Invalid</Text>}
                {this.state.loading ?
                    <MKProgress.Indeterminate
                        style={styles.progress}
                    /> : null}
                <Button title="Test"
                        onPress={this.getMySkills}
                />

            </View>
        );
    }
}