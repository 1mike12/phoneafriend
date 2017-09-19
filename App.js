import React from 'react';
import {StatusBar, StyleSheet, Text, TextInput, ToolbarAndroid, View} from 'react-native';
import {NativeRouter, Route, Link} from "react-router-native";
import config from "./server/config";
import Platform from "react-native";
import color from "react-native-material-color";
import Home from "./components/Home";
import Video from "./components/Video";
import Login from "./components/Login";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'stretch',
    },
    toolbar: {
        backgroundColor: color.Indigo,
        height: 56,
        alignSelf: 'stretch',
    },
});

export default class App extends React.Component {

    constructor(){
        super();
    }

    render(){
        return (
            <NativeRouter>
                <View style={styles.container}>
                    <ToolbarAndroid
                        style={styles.toolbar}
                        textAlign="start"
                        title={config.name}
                        onActionSelected={this.onActionSelected}
                        titleColor="#FFF"
                        actions={[
                            {title: "Log out", show: "never"}
                        ]}
                    />
                    <View style={{padding: 24}}>
                        <Route exact path="/" component={Login}/>
                        <Route exact path="/Home" component={Home}/>
                    </View>
                </View>
            </NativeRouter>
        );
    }
}

