'use strict'

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TextInput, TouchableHighlight, AsyncStorage, Image} from 'react-native';
import * as Animatable from 'react-native-animatable';
import Button from './Button';

const styles = require('./styles').default;

type Props = {};
export default class Dashboard extends Component<Props> {

  constructor(props) {
    super(props);

    this.state = ({
      access_token: null,
      refresh_token: null,
      createdAt: null,
      spotifyData: null
    })

    AsyncStorage.getItem('access_token', (err, result) => this.setState({ 
      access_token: result
    }));

    AsyncStorage.getItem('refresh_token', (err, result) => this.setState({ 
      refresh_token: result
    }));

    AsyncStorage.getItem('createdAt', (err, result) => this.setState({ 
      createdAt: result
    }));
  }

  componentDidMount() {

  }

  componentWillUpdate(nextProps, nextState) {
    if (nextState.createdAt != this.state.createdAt) { // wait for last parameter
      // call api and send tokens for spotify data
      this.getUserData();
    }
  }

  async getUserData() {
    try {
      let response = await fetch(
        'http://localhost:7000/api/v1/getUserData?access_token=' + this.state.access_token + '&refresh_token=' + this.state.refresh_token + '&createdAt=' + this.state.createdAt,
      );
      let responseJson = await response.json();
      console.log(responseJson.newAuthData.createdAt)
      if (responseJson.newAuthData.createdAt) {
        // new tokens
      } else {
        this.setState({
          spotifyData: responseJson.data
        });
      }
    } catch (error) {
      console.error(error);
    }
  }

  handlePress() {
    AsyncStorage.removeItem('access_token'); // reset auth
    AsyncStorage.removeItem('refresh_token'); // reset auth
    AsyncStorage.removeItem('createdAt');
    this.props.cb();
  }

  render() {

    console.log(this.state.spotifyData)

    var userImage = this.state.spotifyData ? this.state.spotifyData['images'][0]['url'] : '';

    return (
      <Animatable.View animation="fadeIn" duration={1000} style={styles.container}>
  
        <Text style={styles.title}>Swotify Dashboard</Text>
        {/*<Text style={styles.description}>access_token: {this.state.access_token}</Text>
        <Text style={styles.description}>refresh_token: {this.state.refresh_token}</Text>
        <Text style={styles.description}>createdAt: {this.state.createdAt}</Text>*/}
        <Image
          style={{width: 200, height: 200, borderRadius: 100}}
          source={{uri: userImage}}
        />
        <Text style={styles.description}>Hi {this.state.spotifyData ? this.state.spotifyData['display_name'] : ''}!</Text>

        <Button text="Remove access_token" onPress={this.handlePress.bind(this)} />

        <Button text="Button" onPress={console.log('button')} />

      </Animatable.View>
    );
  }
}
