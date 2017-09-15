import React from 'react';
import {FlatList, Text, View} from "react-native";

export default class Home extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      items: [{key: "a"}, {key: "b"}],
    }
  }

  render() {
    return (
      <View>
        <Text>HOME</Text>
        <FlatList
          data={this.state.items}
          renderItem={({item}) => <Text>{item.key}</Text>}
        />
      </View>
    );
  }
}