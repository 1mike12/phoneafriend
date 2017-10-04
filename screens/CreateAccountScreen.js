import React from 'react';
import {FlatList, Text, View, StyleSheet, Button, TextInput, CheckBox} from "react-native";
import config from "../configReact";
import http from "../services/http"
import Authentication from "../services/Authentication";

const screenStyles = StyleSheet.create({
    progress: {
        marginTop: 24
    },
    textField: {
        height: 48,  // have to do it on iOS
        marginTop: 10,
    },
    multiLine: {
        height: 100,
        marginTop: 10
    },
});

const NAME = "CreateAccountScreen";
export default class CreateAccountScreen extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            loading: false,
            email: "",
            password: "",
            isChecked: false,
        };

        this.submit = this.submit.bind(this)
    }

    submit(){
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
        return this.state.email.match(emailPattern) && this.state.password && this.state.isChecked
    }

    static getName(){
        return `${config.name}.${NAME}`
    }

    render(){
        return (
            <View style={{padding: 8}}>
                <TextInput
                    placeholder="Email"
                    keyboardType="email-address"
                    style={screenStyles.textField}
                    onTextChange={(email) => this.setState({email})}
                    value={this.state.email}
                />
                <TextInput
                    placeholder="Password"
                    style={screenStyles.textField}
                    value={this.state.password}
                    onTextChange={(password) => this.setState({password})}
                    secureTextEntry={true}
                />
                <TextInput
                    placeholder="Password Cofirm"
                    style={screenStyles.textField}
                    value={this.state.password}
                    onTextChange={(password) => this.setState({password})}
                    secureTextEntry={true}
                />
                <View style={{marginTop: 24}}/>

                <View style={{flexDirection: "row", alignItems: "center"}}>
                    <CheckBox value={this.state.isChecked}
                              onValueChange={() => this.setState({isChecked: !this.state.isChecked})}/>
                    <Text>Accept Terms</Text>
                </View>

                <Button title="Create Account"
                        onPress={this.submit}
                />

                {this.valid() ? <Text>Valid</Text> : <Text>Invalid</Text>}
            </View>
        );
    }
}