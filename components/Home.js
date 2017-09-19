import React from 'react';
import {Button, FlatList, Text, View} from "react-native";
import {MKProgress} from "react-native-material-kit";
import http from '../services/http';
import styles from "../styles";

export default class Home extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            loading: true,
            skills: []
        };

        this.loadSkills = this.loadSkills.bind(this);

        this.loadSkills()
        .then(() => this.setState({loading: false}))
    }

    loadSkills(){
        return http.get("api/skill/mine")
        .then(res =>{
            let skills = res.data.map(skill =>{
                skill.key = skill.id;
                return skill;
            });
            console.log(skills);
            this.setState({skills})
        })
        .catch(console.log)
    }


    render(){
        return (
            <View>
                <Text style={styles.h1}>Skills:</Text>
                {this.state.loading ?
                    <MKProgress.Indeterminate
                    /> : null}
                <FlatList
                    data={this.state.skills}
                    renderItem={({item}) =>{
                        return <Text>{item.name}</Text>
                    }}
                />
            </View>
        );
    }
}