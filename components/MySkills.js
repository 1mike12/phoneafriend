import React from 'react';
import {ActivityIndicator, Button, FlatList, Text, View} from "react-native";
import http from '../services/http';
import styles from "../styles";
import timeAgo from "time-ago";
import Skill from "../models/Skill";

const ta = timeAgo();

export default class MySkills extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            ready: false,
            editing: false,
            skills: []
        };
        this.loadAll = this.loadAll.bind(this);
        this.destroy = this.destroy.bind(this);
        this.edit = this.edit.bind(this);
    }

    componentDidMount(){
        this.loadAll();
    }

    loadAll(){
        console.log("loading skills");
        this.setState({ready: false});
        return http.get("api/skill/mine")
        .then(res =>{
            let skillsJson = res.data;
            let skills = skillsJson.map(json => new Skill(json))
            .sort((a, b) => a.name.localeCompare(b.name));
            console.log(skills);

            this.setState({skills, ready: true})
        });
    }

    edit(){
        console.log("editing")
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
        return "MySkills"
    }

    render(){
        return (
            <View>
                <Button title="load" onPress={this.loadAll}/>
                {!this.state.ready ? <ActivityIndicator/> :
                    <FlatList
                        data={this.state.skills}
                        ItemSeparatorComponent={() => <View style={{height: 1, backgroundColor: "#CCC"}}/>}
                        renderItem={({item}) =>{
                            return <Text style={styles.listItem}>{item.name}</Text>
                        }}
                    />
                }
            </View>
        );
    }
}