import React from 'react';
import {ActivityIndicator, Button, FlatList, ProgressBarAndroid, Text, TextInput, View} from "react-native";
import http from '../services/http';
import styles from "../styles";
import timeAgo from "time-ago";

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
                // ready: true
            });
            setTimeout(() => this.setState({ready: true}), 1500)
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
                                    onTextChange={(title) => this.setState({title})}
                                    value={this.state.title}
                                />

                                <TextInput
                                    placeholder="Description"
                                    multiline={true}
                                    style={{height: 150, textAlignVertical: 'top'}}
                                    onTextChange={(description) => this.setState({description})}
                                    value={this.state.description}
                                />

                                <Text style={{textAlign: "right"}}>{this.state.description.length}/250</Text>

                                <Button title="Done" onPress={() => this.setState({editing: false})}/>
                            </View>
                            :
                            <View>
                                <Button title="load" onPress={this.loadAll}/>
                                <View style={styles.card}>
                                    <Text style={styles.h1}>{this.state.title}</Text>
                                    <Text>{ta.ago(this.state.request.created_at)}</Text>
                                    <Text style={{marginBottom: 20}}> {this.state.request.description}</Text>

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