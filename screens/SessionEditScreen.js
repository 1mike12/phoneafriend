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

    componentDidMount(){
    }

    nonSelectedSkills(skills){
        let selectedIds = this.state.selectedSkills.map(skill => skill.id);
        return skills.filter(skill => !selectedIds.includes(skill.id))
    }

    findFilm(query){
        if (query === ''){
            return [];
        }

        const {skills} = this.state;
        const regex = new RegExp(`${query.trim()}`, 'i');
        return skills.filter(skill => skill.name.search(regex) >= 0);
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
                <View style={styles.container}>
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

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F5FCFF',
        flex: 1,
        paddingTop: 25
    },
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
    descriptionContainer: {
        // `backgroundColor` needs to be set otherwise the
        // autocomplete input will disappear on text input.
        backgroundColor: '#F5FCFF',
        marginTop: 25
    },
    infoText: {
        textAlign: 'center'
    },
    titleText: {
        fontSize: 18,
        fontWeight: '500',
        marginBottom: 10,
        marginTop: 10,
        textAlign: 'center'
    },
    directorText: {
        color: 'grey',
        fontSize: 12,
        marginBottom: 10,
        textAlign: 'center'
    },
    openingText: {
        textAlign: 'center'
    }
});