'use strict'

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TextInput, TouchableHighlight, AsyncStorage, Image} from 'react-native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import Loader from './Loader';
import Button from './Button';
import { API_URI } from 'react-native-dotenv';
import { initSpotify, playSpotify } from './swotify_api';

const styles = require('./styles').default;

type Props = {};
export default class Player extends Component<Props> {

  constructor(props) {
    super(props);

    this.state = ({
      access_token: null,
      refresh_token: null,
      createdAt: null,
    })

    AsyncStorage.multiGet(['access_token', 'refresh_token', 'createdAt'], (err, result) => this.setState({
      access_token: result[0][1],
      refresh_token: result[1][1],
      createdAt: result[2][1],
      spotifyData: null
    }));
  }

  componentDidUpdate(prevProps, prevState) {

    // if received access_token, fetch data
    if (!prevState.access_token && this.state.access_token) {
      this.getSpotifyPlayer();

      initSpotify(this.state.access_token, (err, response) => { 
        console.log(response)
      });

      playSpotify(() => {
        console.log('called play')
      });
    }

    // if received new token in state
    if (prevState.access_token != this.state.access_token && prevState.createdAt != this.state.createdAt) {
      AsyncStorage.setItem('access_token', this.state.access_token);
      AsyncStorage.setItem('createdAt', this.state.createdAt);
    }
  }

  async getSpotifyPlayer() {
    try {
      let response = await fetch(
        `${API_URI}/api/v1/getPlayer?access_token=${this.state.access_token}&refresh_token=${this.state.refresh_token}&createdAt=${this.state.createdAt}`,
      );
      let responseJson = await response.json();
      if (responseJson.newAuthData.createdAt) {
        // new tokens
        console.log('new token')

        console.log(responseJson.player)

        this.setState({
          access_token: responseJson.newAuthData.access_token,
          createdAt: responseJson.newAuthData.createdAt,
          spotifyData: responseJson.data
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

  render() {

    //console.log(this.state.spotifyData)

    if (!this.state.spotifyData) {
      return (
        <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#159957', '#155799']} style={styles.app}>
          <Loader />
        </LinearGradient>
      );
    } else {
      return (
        <Animatable.View animation="fadeIn" duration={1000} style={styles.containerPlayer}>
    
          <Text style={styles.description}>Player</Text>

          {/*<Image style={{width: 300, height: 300}} source={{uri: this.state.spotifyData['item']['album']['images'][1]['url']}} />*/}
          
          <Text style={styles.description}>låtnamn</Text>

          <Text style={styles.description}>artist</Text>

        </Animatable.View>
      );
    }
  }
}
