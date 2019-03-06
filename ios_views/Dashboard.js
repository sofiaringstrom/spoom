'use strict'

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TextInput, TouchableHighlight, AsyncStorage, Image} from 'react-native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import Loader from './Loader';
import Button from './Button';

const styles = require('./styles').default;

const imgPlaceholder = require('../assets/ghost.png');

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

    AsyncStorage.multiGet(['access_token', 'refresh_token', 'createdAt'], (err, result) => this.setState({
      access_token: result[0][1],
      refresh_token: result[1][1],
      createdAt: result[2][1]
    }));
  }

  componentDidUpdate(prevProps, prevState) {

    // if received access_token, fetch data
    if (!prevState.access_token) {
      this.getUserData();
    }

    // if received new token in state
    if (prevState.access_token != this.state.access_token && prevState.createdAt != this.state.createdAt) {
      AsyncStorage.setItem('access_token', this.state.access_token);
      AsyncStorage.setItem('createdAt', this.state.createdAt);
    }
  }

  async getUserData(createdAt) {
    try {
      let response = await fetch(
        'https://swotify-api.herokuapp.com/api/v1/getUserData?access_token=' + this.state.access_token + '&refresh_token=' + this.state.refresh_token + '&createdAt=' + this.state.createdAt,
      );
      let responseJson = await response.json();
      if (responseJson.newAuthData.createdAt) {
        // new tokens
        console.log('new token')
        this.setState({
          spotifyData: responseJson.data,
          access_token: responseJson.newAuthData.access_token,
          createdAt: responseJson.newAuthData.createdAt
        })
      } else {
        console.log('same token')
        this.setState({
          spotifyData: responseJson.data
        });
      }
    } catch (error) {
      console.error(error);
    }
  }

  handlePress() {
    AsyncStorage.clear();
    this.props.cb();
  }

  render() {

    console.log(this.state.spotifyData)

    if (!this.state.spotifyData) {
      return (
        <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#159957', '#155799']} style={styles.app}>
          <Loader />
        </LinearGradient>
      );
    } else {
      return (
        <Animatable.View animation="fadeIn" duration={1000} style={styles.container}>
    
          <Text style={styles.title}>Swotify Dashboard</Text>
          {/*<Text style={styles.description}>access_token: {this.state.access_token}</Text>
          <Text style={styles.description}>refresh_token: {this.state.refresh_token}</Text>
          <Text style={styles.description}>createdAt: {this.state.createdAt}</Text>*/}
          
          {this.state.spotifyData ? <Image style={{width: 100, height: 100, borderRadius: 50}} source={{uri: this.state.spotifyData['images'][0]['url']}} /> : null}
          
          <Text style={styles.description}>Hi {this.state.spotifyData ? this.state.spotifyData['display_name'] : ''}!</Text>

          <Button text="Remove access_token" onPress={this.handlePress.bind(this)} />

          <Button text="Button" onPress={console.log('button')} />

        </Animatable.View>
      );
    }
  }
}
