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
            passwordConfirm: "",
            termsAccepted: false,
            valid: false,
        };

        this.submit = this.submit.bind(this)
        this.valid = this.valid.bind(this);
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

    getFormErrors(){
        let errors = [];
        const emailPattern = /.+\@.+\..+/;
        if (!this.state.email.match(emailPattern)) errors.push({message: "Please enter valid email", field: "email"});
        if (this.state.password.length <= 5) errors.push({
            message: "Password must be at least 5 characters",
            field: "password"
        });
        if (this.state.password !== this.state.passwordConfirm) errors.push({
            message: "Passwords do not match",
            field: "passwordConfirm"
        });
        if (this.state.termsAccepted) errors.push({message: "Terms not accepted", field: "terms"});
        return errors;
    }

    valid(){
        const emailPattern = /.+\@.+\..+/;
        return (this.state.email.match(emailPattern)
            && this.state.password
            && (this.state.password === this.state.passwordConfirm)
            && this.state.termsAccepted
        )
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
                    onChangeText={(email) => this.setState({email})}
                    value={this.state.email}
                />
                <TextInput
                    placeholder="Password"
                    style={screenStyles.textField}
                    value={this.state.password}
                    onChangeText={(password) => this.setState({password})}
                    secureTextEntry={true}
                />
                <TextInput
                    placeholder="Password Cofirm"
                    style={screenStyles.textField}
                    value={this.state.passwordConfirm}
                    onChangeText={(passwordConfirm) => this.setState({passwordConfirm})}
                    secureTextEntry={true}
                />
                <View style={{marginTop: 24}}/>

                <View style={{flexDirection: "row", alignItems: "center"}}>
                    <CheckBox value={this.state.termsAccepted}
                              onValueChange={() => this.setState({termsAccepted: !this.state.termsAccepted})}/>
                    <Text>Accept Terms</Text>
                    <Text style={{marginLeft: 16, color: "blue"}}>View Terms</Text>
                </View>

                <View style={{marginTop: 16}}>
                    <Button title="Create Account"
                            onPress={this.submit}
                            disabled={!this.valid()}
                    />
                </View>

            </View>
        );
    }
}