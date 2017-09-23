import React from 'react';
import {FlatList, Text, View} from "react-native";
import {RTCView} from "react-native-webrtc";

var WebRTC = require('react-native-webrtc');
var {
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  MediaStream,
  MediaStreamTrack,
  getUserMedia,
} = WebRTC;

export default class Home extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      videoURL : null
    }
  }

  render() {
    return (
      <View>
        <Text>ser</Text>
        <RTCView streamURL={this.state.videoURL}/>
      </View>
    );
  }
}