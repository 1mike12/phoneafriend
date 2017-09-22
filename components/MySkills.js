import React from 'react';
import {ActivityIndicator, Button, FlatList, Text, TextInput, View} from "react-native";
import http from '../services/http';
import styles from "../styles";
import timeAgo from "time-ago";
import Skill from "../models/Skill";
import config from "../configReact";

const ta = timeAgo();

export default class MySkills extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            ready: false,
            editing: false,
            skills: [],
            query: ""
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

    showDeleteSkillModal(skill){
        this.props.navigator.showLightBox({
            screen: config.name + ".DeleteSkillModal", // unique ID registered with Navigation.registerScreen
            passProps: {skill}, // simple serializable object that will pass as props to the lightbox (optional)
            style: {
                backgroundBlur: "dark", // 'dark' / 'light' / 'xlight' / 'none' - the type of blur on the background
                backgroundColor: "#DDD" // tint color for the background, you can specify alpha here (optional)
            },
            adjustSoftInput: "resize", // android only, adjust soft input, modes: 'nothing', 'pan', 'resize', 'unspecified' (optional, default 'unspecified')
            tapBackgroundToDismiss: true
        });
    }

    static getName(){
        return "MySkills"
    }

    render(){
        return (
            <View>
                <Button title="load" onPress={this.loadAll}/>
                {!this.state.ready ? <ActivityIndicator/> :
                    <View>
                        <TextInput placeholder="Add"
                                   style={styles.textField}
                                   onTextChange={(query) => this.setState({query})}
                                   value={this.state.query}
                        />
                        <FlatList
                            data={this.state.skills}
                            ItemSeparatorComponent={() => <View style={{height: 1, backgroundColor: "#CCC"}}/>}
                            renderItem={({item}) =>{
                                return <Text onLongPress={()=> this.showDeleteSkillModal(item)}
                                             delayLongPress={1500}
                                             style={styles.listItem}>{item.name}
                                </Text>
                            }}
                        />
                    </View>

                }
            </View>
        );
    }
}