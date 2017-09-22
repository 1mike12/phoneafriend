import React from 'react';
import {ActivityIndicator, Button, FlatList, Image, ProgressBarAndroid, Text, TextInput, View} from "react-native";
import http from '../services/http';
import styles from "../styles";
import timeAgo from "time-ago";
import Chip from "./Chip";

const ta = timeAgo();

export default class Request extends React.Component {

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
            let request = res.data;
            console.log(request);
            this.setState({
                title: request.title,
                description: request.description,
                request: res.data,
                ready: true
            });
        });
    }

    edit(){
    }

    destroy(){
        console.log(this.props);
        return http.delete("api/session/", {data: {uuid: this.props.uuid}})
        .then(() => this.props.navigator.pop({
            animated: true,
            animationType: 'fade',
        }))
        .catch(console.log)
    }

    static getName(){
        return "Request"
    }

    render(){
        return (
            <View>
                {!this.state.ready ? <ActivityIndicator/> :
                    <View>
                        {this.state.editing ?
                            <View>
                                <TextInput
                                    placeholder="Title"
                                    style={styles.textField}
                                    onChangeText={(title) => this.setState({title})}
                                    value={this.state.title}
                                />

                                <TextInput
                                    placeholder="Description"
                                    multiline={true}
                                    style={{height: 150, textAlignVertical: 'top'}}
                                    onChangeText={(description) =>{
                                        console.log(description);
                                        this.setState({description});
                                    }}
                                    value={this.state.description}
                                />

                                <Text style={{textAlign: "right"}}>{this.state.description.length}/250</Text>
                                <Image style={{height: 200, width: 200}}
                                       source={{uri: 'https://i.ytimg.com/vi/oDdK-g4XOAU/maxresdefault.jpg'}}/>
                                <View style={{paddingBottom: 46, paddingTop: 16, flex: 1, flexDirection: 'row'}}>
                                    <Chip text="Climbing" />
                                    <Chip text="Lead" />
                                    <Chip text="Belay" />
                                </View>

                                <Button title="Done" onPress={() => this.setState({editing: false})}/>
                            </View>
                            :
                            <View>
                                <Button title="load" onPress={this.loadAll}/>
                                <View style={styles.card}>
                                    <Text style={styles.h1}>{this.state.title}</Text>
                                    <Text>{ta.ago(this.state.request.created_at)}</Text>
                                    <Text style={{marginBottom: 20}}> {this.state.description}</Text>

                                    <Button title="Edit" onPress={() =>{
                                        this.setState({editing: true})
                                    }}/>
                                    <View style={{height: 12}}/>
                                    <Button title="Delete" onPress={this.destroy}/>
                                </View>
                            </View>}
                    </View>
                }
            </View>
        );
    }
}