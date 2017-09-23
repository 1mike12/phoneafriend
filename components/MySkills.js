import React from 'react';
import {Vibration, ActivityIndicator, Button, FlatList, Text, TextInput, View} from "react-native";
import http from '../services/http';
import styles from "../styles";
import timeAgo from "time-ago";
import Skill from "../models/Skill";
import config from "../configReact";
import Util from "../Util";
import DeleteSkillModal from "./DeleteSkillModal";

const ta = timeAgo();
const NAME = "MySkills";
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
        Vibration.vibrate([0, 25]);
        this.props.navigator.showLightBox({
            screen: DeleteSkillModal.getName(),
            passProps: {
                skill, onDelete: () =>{
                    this.setState({
                        skills: Util.removeFromArray(this.state.skills, skill)
                    });
                }
            },
            style: {
                backgroundBlur: "dark", // 'dark' / 'light' / 'xlight' / 'none' - the type of blur on the background
                backgroundColor: "rgba(0, 0, 0, 0.5)" // tint color for the background, you can specify alpha here (optional)
            },
            adjustSoftInput: "resize", // android only, adjust soft input, modes: 'nothing', 'pan', 'resize', 'unspecified' (optional, default 'unspecified')
            tapBackgroundToDismiss: true
        });
    }

    static getName(){
        return `${config.name}.${NAME}`
    }
    render(){
        return (
            <View>
                <Button title="test" onPress={()=> {
                    return http.delete("api/skill", {id: 2})
                }}/>

                <Button title="load" onPress={this.loadAll}/>
                {!this.state.ready ? <ActivityIndicator/> :
                    <View>
                        <TextInput placeholder="Add"
                                   style={styles.textField}
                                   onTextChange={(query) => this.setState({query})}
                                   value={this.state.query}
                        />
                        <FlatList
                            style={{marginBottom: 170}}
                            data={this.state.skills}
                            ItemSeparatorComponent={() => <View style={{height: 1, backgroundColor: "#DDD"}}/>}
                            renderItem={({item}) =>{
                                return <Text onLongPress={() => this.showDeleteSkillModal(item)}
                                             delayLongPress={1500}
                                             style={[styles.listItem, {marginLeft: 8}]}>#{item.name}
                                </Text>
                            }}
                        />
                    </View>

                }
            </View>
        );
    }
}