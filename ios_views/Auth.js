'use strict'

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TextInput, TouchableHighlight, AsyncStorage, Image} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { subscribeToCode, closeSocket } from './swotify_api';
import * as Animatable from 'react-native-animatable';
import { API_URI } from 'react-native-dotenv';

const styles = require('./styles').default;

const icon = require('../assets/spoom.png');

var socketInterval;

type Props = {};
export default class Auth extends Component<Props> {

  constructor(props) {
    super(props);

    this.state = ({
      code: this.generateCode(),
      access_token: null,
      refresh_token: null,
      createdAt: null
    })

    subscribeToCode(this.state.code, (err, authData) => this.setState({ 
      access_token: authData['access_token'],
      refresh_token: authData['refresh_token'],
      createdAt: authData['createdAt']
    }));

  }

  componentWillUnmount() {
    closeSocket();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.access_token != prevState.access_token) {
      console.log('got access token')
      
      AsyncStorage.setItem('access_token', this.state.access_token);
      AsyncStorage.setItem('refresh_token', this.state.refresh_token);
      AsyncStorage.setItem('createdAt', this.state.createdAt);

      // visa dashboard
      this.props.cb();
    }
  }

  generateCode() {
    return Math.floor(1000 + Math.random() * 9000);
  }

  render() {

    var url = `${API_URI}?code=${this.state.code}`;

    return (
      <Animatable.View animation="fadeIn" duration={1000} style={styles.container}>
        <Image source={icon} />

        <Text style={styles.login}>Scan the code with your phone to sign in with Spotify</Text>
        
        <View style={{borderWidth: 5, borderColor: 'white', marginBottom: 40}}>
          <QRCode
            value={url}
            size={300}
          />
        </View>
        
        <Text style={styles.codeDescription}>or go to</Text>
        <Text style={styles.codeLink}>{API_URI}</Text>
        <Text style={styles.codeDescription}>and enter</Text>
        <Text style={styles.code}>{this.state.code}</Text>

      </Animatable.View>
    );
  }
}
