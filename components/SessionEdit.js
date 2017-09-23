import React from 'react';
import {ActivityIndicator, Button, FlatList, Image, ProgressBarAndroid, Text, TextInput, View} from "react-native";
import http from '../services/http';
import styles from "../styles";
import timeAgo from "time-ago";
import Chip from "./Chip";
import Session from "../models/Session";

const ta = timeAgo();

const NAME = "SessionEdit";
export default class SessionEdit extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            ready: false,
            editing: false,
            title: "",
        };
        this.loadAll = this.loadAll.bind(this);
        this.destroy = this.destroy.bind(this);
    }

    componentDidMount(){
        this.loadAll();
    }

    loadAll(){
        this.setState({ready: false});
        return http.get("api/session/" + this.props.uuid)
        .then(res =>{
            let session = new Session(res.data);
            this.setState({
                session: session,
                ready: true
            });
        });
    }

    edit(){
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
        import config from "../server/config";
        return `${config.name}.${NAME}`
    }
    render(){
        return (
            <View>
                {!this.state.ready ? <ActivityIndicator/> :
                    <View>
                        <TextInput
                            placeholder="Title"
                            style={styles.textField}
                            onChangeText={(title) => this.setState({title})}
                            value={this.state.session.title}
                        />

                        <TextInput
                            placeholder="Description"
                            multiline={true}
                            style={{height: 150, textAlignVertical: 'top'}}
                            onChangeText={(description) =>{
                                console.log(description);
                                this.setState({description});
                            }}
                            value={this.state.session.description}
                        />

                        <Text style={{textAlign: "right"}}>{this.state.session.description.length}/250</Text>
                        <Image style={{height: 200, width: 200}}
                               source={{uri: 'https://i.ytimg.com/vi/oDdK-g4XOAU/maxresdefault.jpg'}}/>
                        <View style={{paddingBottom: 46, paddingTop: 16, flex: 1, flexDirection: 'row'}}>
                            <Chip text="Climbing"/>
                            <Chip text="Lead"/>
                            <Chip text="Belay"/>
                        </View>

                        <Button title="Done" onPress={() => this.setState({editing: false})}/>
                    </View>}
            </View>
        );
    }
}