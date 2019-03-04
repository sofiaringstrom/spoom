'use strict'

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TextInput, TouchableHighlight} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import QRCode from 'react-native-qrcode-svg';
import { subscribeToTimer } from './swotify_api';

const styles = require('./styles').default;

type Props = {};
export default class Auth extends Component<Props> {

  constructor(props) {
    super(props);

    this.state = ({
      code: this.generateCode(),
      timestamp: 'no timestamp yet'
    })

    subscribeToTimer(1000, (err, timestamp) => this.setState({ 
      timestamp 
    }));
  }

  generateCode() {
    return Math.floor(1000 + Math.random() * 9000);
  }

  render() {

    var url = `http://localhost:7000?code=${this.state.code}`;

    return (
      <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#159957', '#155799']} style={styles.container}>
        <Text style={styles.title}>Swotify</Text>

        <Text style={styles.login}>Scan the code to sign in to Spotify</Text>
        
        <View>
          <QRCode
            value={url}
            size={300}
          />
        </View>
        
        <Text style={styles.description}>or go to http://localhost:7000 and enter {this.state.code}</Text>

        <Text style={styles.description}>This is the timer value: {this.state.timestamp}</Text>
      </LinearGradient>
    );
  }
}
