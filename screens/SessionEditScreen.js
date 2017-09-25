import React from 'react';
import {
    ActivityIndicator, Button, FlatList, Image, ProgressBarAndroid, Text, TextInput, TouchableOpacity,
    View
} from "react-native";
import http from '../services/http';
import styles from "../styles";
import Chip from "../components/Chip";
import config from "../server/config";
import update from 'immutability-helper';
import Session from "../models/Session";
import {ToastAndroid} from "react-native";
import {debounce} from "lodash";
import Autocomplete from "react-native-autocomplete-input";

const NAME = "SessionEditScreen";
export default class SessionEditScreen extends React.Component {

    constructor(props){
        super(props);

        let isNew = true;
        let session;
        if (this.props.session && this.props.session.uuid){
            isNew = false;
            session = this.props.session;
        } else {
            session = new Session();
        }
        this.state = {
            query: "",
            skills: [],
            selectedSkills: [],
            isNew: isNew,
            session: session
        };
        this.destroy = this.destroy.bind(this);
        this.getFormErrors = this.getFormErrors.bind(this);
        this.saveSession = this.saveSession.bind(this);

        this.queryChanged = this.queryChanged.bind(this);

        this.loadSkillsSuggestion = debounce(() =>{
            let exclude = this.state.session.skills.map(skill => skill.name).join(",");
            return http.get(`api/skill/search`, {
                params: {
                    query: this.state.query,
                    exclude: exclude
                }
            })
            .then(res => this.setState({skills: res.data}))
            .catch(console.log)
        }, 300)
        .bind(this);
    }

    componentDidMount(){
        this.props.navigator.toggleTabs({
            to: 'hidden',
            animated: true
        });
    }

    nonSelectedSkills(skills){
        let selectedIds = this.state.session.skills.map(skill => skill.id);
        return skills.filter(skill => !selectedIds.includes(skill.id))
    }

    queryChanged(query){
        if (query === ""){
            this.setState({query, skills: []})
        } else {
            this.setState({query}, () =>{
                this.loadSkillsSuggestion()
            });
        }
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
        return `${config.name}.${NAME}`
    }


    getFormErrors(){
        let errors = [];
        let session = this.state.session;
        if (!session.title) errors.push({message: "no title", field: "title"});
        if (session.title.length > 127) errors.push({message: "title too long", field: "title"});
        if (!session.description) errors.push({message: "no description", field: "description"});
        if (session.description.length > 250) errors.push({message: "description too long", field: "description"});
        return errors;
    }

    saveSession(){
        let errors = this.getFormErrors();
        if (errors.length > 0){
            ToastAndroid.show(errors[0].message, ToastAndroid.SHORT);
        } else {
            return this.state.session.save()
        }
    }

    render(){
        const {query} = this.state;

        return (
            <View style={{backgroundColor: "#FFF"}}>
                <TextInput
                    placeholder="Title"
                    style={styles.textField}
                    onChangeText={(title) =>{
                        this.setState({
                            session: update(this.state.session, {title: {$set: title}})
                        })
                    }}
                    value={this.state.session.title}
                />

                <TextInput
                    placeholder="Description"
                    multiline={true}
                    style={{height: 100, textAlignVertical: 'top'}}
                    onChangeText={(description) =>{
                        this.setState({
                            session: update(this.state.session, {description: {$set: description}})
                        })
                    }}
                    value={this.state.session.description}
                />

                <Text style={{textAlign: "right"}}>{this.state.session.description.length}/250</Text>

                <Autocomplete
                    autoCapitalize="none"
                    autoCorrect={false}
                    containerStyle={styles.autoCompleteContainer}
                    data={this.nonSelectedSkills(this.state.skills)}
                    defaultValue={query}
                    onChangeText={this.queryChanged}
                    placeholder="Add Skill"
                    inputContainerStyle={{borderWidth: 0}}
                    listContainerStyle={{borderWidth: 0}}
                    listStyle={{
                        shadowColor: '#000',
                        shadowRadius: 5,
                        borderWidth: 0,
                        shadowOffset: {
                            height: 2,
                            width: 2,
                        },
                        elevation: 2,
                    }}
                    renderItem={(item) => (
                        <TouchableOpacity onPress={() =>{
                            this.setState({
                                session: update(this.state.session, {skills: {$push: [item]}}),
                                query: "",
                                skills: []
                            });
                        }}>
                            <Text style={styles.itemText}>
                                {item.name}
                            </Text>
                        </TouchableOpacity>
                    )}
                />

                <View style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    paddingLeft: 8,
                    paddingRight: 8,
                    marginBottom: 8,
                    marginTop: 60
                }}
                >
                    {this.state.session.skills.map(skill =>{
                        return <View key={skill.id} style={{marginRight: 8, marginBottom: 4}}>
                            <Chip text={"#" + skill.name} onDelete={() =>{
                                let index = this.state.session.skills.indexOf(skill);
                                this.setState({
                                    session: update(this.state.session, {
                                        skills: {
                                            $splice: [[index, 1]]
                                        }
                                    })
                                })
                            }}/>
                        </View>
                    })}
                </View>

                <Image style={{height: 100, width: 100, marginBottom: 8}}
                       source={{uri: 'https://i.ytimg.com/vi/oDdK-g4XOAU/maxresdefault.jpg'}}/>
                <Button title="Save" onPress={this.saveSession}/>
            </View>
        );
    }
}