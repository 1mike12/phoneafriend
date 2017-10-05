import React from 'react';
import {
    Vibration,
    ActivityIndicator,
    Button,
    FlatList,
    Text,
    TextInput,
    View,
    ScrollView,
    ToastAndroid
} from "react-native";
import http from '../services/http';
import styles from "../styles";
import timeAgo from "time-ago";
import Skill from "../models/Skill";
import config from "../configReact";
import Util from "../Util";
import DeleteSkillModal from "./DeleteSkillModal";
import Session from "../models/Session";
import SessionSummary from "../components/SessionSummary";
import ActiveSessionScreen from "./ActiveSessionScreen";
import SwipeCards from "react-native-swipe-cards";
import Promise from "bluebird";

const ta = timeAgo();
const NAME = "HelpableSessionsScreen";

export default class HelpableSessionsScreen extends React.Component {

    constructor(props){
        super(props);

        this.offset = 0;
        this.rowCount = 9999999999999;
        this.state = {
            ready: false,
            cards: ["one"],
            session: null,
            rowCount: 0
        };
        this.loadNextSession = this.loadNextSession.bind(this);
        this.loadPreviousSession = this.loadPreviousSession.bind(this);
        this.loadSession = this.loadSession.bind(this);
        this.helpSession = this.helpSession.bind(this);
        this.declineSession = this.declineSession.bind(this);
    }

    componentDidMount(){
        this.loadSession();
    }

    loadNextSession(){
        if (this.rowCount - this.offset === 1) return ToastAndroid.show("Reached the end!", ToastAndroid.SHORT);
        this.offset += 1;
        return this.loadSession();
    }

    loadPreviousSession(){
        if (this.offset === 0) return ToastAndroid.show("At First", ToastAndroid.SHORT);
        this.offset -= 1;
        return this.loadSession();
    }

    declineSession(){
        return Promise.all([
            http.post("api/session/decline", {
                uuid: this.state.session.uuid
            }),
            this.loadSession()
        ])
    }

    loadSession(){
        this.setState({ready: false});
        return http.get("api/session/teachable-single", {
            params: {
                after: this.offset
            }
        })
        .then(res =>{
            let session = new Session(res.data.session);
            let rowCount = res.data.rowCount;

            this.offset = res.data.offset;
            this.rowCount = rowCount;
            this.setState({session, rowCount, ready: true}, () => console.log(this.state))
        })
    }

    helpSession(){
        this.props.navigator.push({
            screen: ActiveSessionScreen.getName(),
            titleImage: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAzCAYAAAA6oTAqAAAAEXRFWHRTb2Z0d2FyZQBwbmdjcnVzaEB1SfMAAABQSURBVGje7dSxCQBACARB+2/ab8BEeQNhFi6WSYzYLYudDQYGBgYGBgYGBgYGBgYGBgZmcvDqYGBgmhivGQYGBgYGBgYGBgYGBgYGBgbmQw+P/eMrC5UTVAAAAABJRU5ErkJggg==',
            animated: true,
            animationType: 'slide-horizontal',
            passProps: {session: this.state.session},
        });
    }

    static getName(){
        return `${config.name}.${NAME}`
    }

    render(){
        return (
            <View style={{position: "absolute", top: 0, bottom: 0, left: 0, right: 0}}>
                {!this.state.ready ? <ActivityIndicator/> :
                    <SwipeCards
                        cards={this.state.cards}
                        loop={false}

                        renderCard={(cardData) => {
                            return (<View style={[styles.card, {margin:8}]}>
                                <SessionSummary session={this.state.session}/>
                            </View>)
                        }}
                        onClickHandler={this.helpSession}
                        showYup={true}
                        yupText="Save for later"
                        showNope={true}
                        noText="Nayeth"
                        hasMaybeAction
                        showMaybe={true}
                        maybeText="Accept"
                        handleYup={this.loadNextSession}
                        handleNope={this.declineSession}
                        cardRemoved={this.loadNextSession}
                    />
                }
            </View>
        );
    }
}