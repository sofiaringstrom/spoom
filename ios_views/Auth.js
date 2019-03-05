'use strict'

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TextInput, TouchableHighlight, AsyncStorage} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { subscribeToCode, closeSocket } from './swotify_api';
import * as Animatable from 'react-native-animatable';

const styles = require('./styles').default;

var socketInterval;

type Props = {};
export default class Auth extends Component<Props> {

  constructor(props) {
    super(props);

    this.state = ({
      code: this.generateCode(),
      access_token: null,
      refresh_token: null
    })

    subscribeToCode(this.state.code, (err, authData) => this.setState({ 
      access_token: authData['access_token'],
      refresh_token: authData['refresh_token'] 
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

      // visa dashboard
      this.props.cb();

      // connect to spotify

    }
  }

  generateCode() {
    return Math.floor(1000 + Math.random() * 9000);
  }

  render() {

    var url = `http://localhost:7000?code=${this.state.code}`;

    return (
      <Animatable.View animation="fadeIn" duration={1000} style={styles.container}>
        <Text style={styles.title}>Swotify</Text>

        <Text style={styles.login}>Scan the code to sign in to Spotify</Text>
        
        <View>
          <QRCode
            value={url}
            size={300}
          />
        </View>
        
        <Text style={styles.description}>or go to http://localhost:7000 and enter {this.state.code}</Text>

        <Text style={styles.description}>access_token: {this.state.access_token}</Text>

      </Animatable.View>
    );
  }
}
