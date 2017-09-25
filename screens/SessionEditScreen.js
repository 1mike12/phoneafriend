import React from 'react';
import {
    ActivityIndicator,
    Button,
    FlatList,
    Image,
    ProgressBarAndroid,
    Text,
    TextInput,
    View,
    StyleSheet,
    TouchableOpacity, KeyboardAvoidingView
} from "react-native";
import http from '../services/http';
// import styles from "../styles";
import config from "../server/config";
import update from 'immutability-helper';
import Session from "../models/Session";
import {ToastAndroid} from "react-native";
import Autocomplete from 'react-native-autocomplete-input';
import Chip from "../components/Chip"
import {debounce} from "lodash";

const styles = StyleSheet.create({
    autocompleteContainer: {
        flex: 1,
        left: 0,
        position: 'absolute',
        right: 0,
        top: 0,
        zIndex: 1
    },
    itemText: {
        fontSize: 15,
        margin: 2
    },
});

const NAME = "SessionEditScreen";
export default class SessionEditScreen extends React.Component {

    static getName(){
        return `${config.name}.${NAME}`
    }

    constructor(props){
        super(props);
        this.state = {
            skills: [],
            selectedSkills: [],
            query: ''
        };
        this.queryChanged = this.queryChanged.bind(this);

        this.loadSkillsSuggestion = debounce(() =>{
            let exclude = this.state.selectedSkills.map(skill => skill.name).join(",");
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

    nonSelectedSkills(skills){
        let selectedIds = this.state.selectedSkills.map(skill => skill.id);
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

    render(){
        const {query} = this.state;

        return (
                <View >
                    <Autocomplete
                        autoCapitalize="none"
                        autoCorrect={false}
                        containerStyle={styles.autocompleteContainer}
                        data={this.nonSelectedSkills(this.state.skills)}
                        defaultValue={query}
                        onChangeText={this.queryChanged}
                        placeholder="Skill Search"
                        renderItem={(item) => (
                            <TouchableOpacity onPress={() =>{
                                this.setState({
                                    selectedSkills: update(this.state.selectedSkills, {$push: [item]}),
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
                    <View style={{marginTop: 50}}>
                        {this.state.selectedSkills.map(skill =>{
                            return <Chip key={skill.id} text={skill.name}/>
                        })}
                    </View>

                </View>
        );
    }
}