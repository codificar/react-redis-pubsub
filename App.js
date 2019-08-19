/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, NativeEventEmitter } from 'react-native';
import ServiceBridge from "./ServiceBridge";

const NativeEvents = new NativeEventEmitter(ServiceBridge)

var subscribed = false;
var instance;

NativeEvents.addListener('handleMessage', data => {
  console.log(data);
  instance.setState({ subMessage: data.message })
  instance.forceUpdate();
})

type Props = {};
export default class App extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      pubMessage: '',
      subMessage: '',
      subChannel: 's',
      pubChannel: 'p',
      // redis://[password]@host:port
      redisURI: 'redis://password@127.0.0.1:6379',
    };

    subscribed = false;

    instance = this;
  }
  componentDidMount() {
    ServiceBridge.connectPubSub(instance.state.redisURI)
      .then(res => console.log(res))
      .catch(e => console.log(e.message, e.code));
  }
  subscribe() {
    ServiceBridge.subscribePubSub(instance.state.subChannel)
      .then(function (res) { console.log(res); subscribed = true; instance.forceUpdate() })
      .catch(e => console.log(e.message, e.code));
  }
  unsubscribe() {
    ServiceBridge.unsubscribePubSub(instance.state.subChannel)
      .then(function (res) {
        console.log(res); subscribed = false;
        instance.setState({ subMessage: "" })
        instance.forceUpdate()
      }).catch(e => console.log(e.message, e.code));
  }
  publish(msg) {
    ServiceBridge.publishMessage(instance.state.pubChannel, msg)
      .then(res => console.log(res))
      .catch(e => console.log(e.message, e.code));
  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Redis Pub/Sub example</Text>
        <Text>Channel to subscribe: </Text>
        <TextInput
          style={styles.textInputTiny}
          onChangeText={(subChannel) => this.setState({ subChannel })}
          value={this.state.subChannel}
        />
        <Text>Channel to publish: </Text>
        <TextInput
          style={styles.textInputTiny}
          onChangeText={(pubChannel) => this.setState({ pubChannel })}
          value={this.state.pubChannel}
        />
        {!subscribed ? (
          <TouchableOpacity
            style={styles.button}
            onPress={this.subscribe}
          >
            <Text style={styles.label}> Subscribe channel </Text>
          </TouchableOpacity>
        ) : (
            <TouchableOpacity
              style={styles.button}
              onPress={this.unsubscribe}
            >
              <Text style={styles.label}> Unsubscribe channel </Text>
            </TouchableOpacity>
          )
        }
        {subscribed ? (
          <View>
            <Text style={styles.instructions}> Subscribed to channel <Text style={{ color: 'red' }}>{this.state.subChannel}</Text></Text>
            <Text style={styles.instructions}> Message received:</Text>
          </View >
        ) : (<Text>Click on the button above to subscribe.</Text>)}
        <Text>{this.state.subMessage}{"\n"}</Text>
        <TextInput
          style={styles.textInputFull}
          onChangeText={(pubMessage) => this.setState({ pubMessage })}
          value={this.state.pubMessage}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() => this.publish(this.state.pubMessage)}
        >
          <Text style={styles.label}> Publish message </Text>
        </TouchableOpacity>
      </View >
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    paddingTop: 20,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
    fontWeight: 'bold',
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#cf3232',
    padding: 10,
    margin: 10,
  },
  label: {
    color: 'white'
  },
  textInputFull: {
    paddingLeft: 5,
    width: '90%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1
  },
  textInputTiny: {
    textAlign: 'center',
    paddingLeft: 5,
    width: '40%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1
  }
});
