'use strict'

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TextInput, TouchableHighlight} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import QRCode from 'react-native-qrcode-svg';

const styles = require('./styles').default;

type Props = {};
export default class Login extends Component<Props> {

  constructor(props) {
    super(props);

    this.state = ({
      username: '',
      password: '',
      btnBg: 'rgba(255, 255, 255, 0.1)',
      btnShadowColor: 'rgba(14,21,47,0)',
      btnShadowOffset: {width: 0, height: 0},
      btnShadowOpacity: 0,
      btnShadowRadius: 0,
      btnColor: '#fff'
    })
  }

  handleButtonFocus() {
    console.log('button focus')
    this.setState({
      btnBg: 'rgba(255, 255, 255, 1)',
      btnShadowColor: 'rgba(14,21,47,0.6)',
      btnShadowOffset: {width: 8, height: 0},
      btnShadowOpacity: 0.8,
      btnShadowRadius: 30,
      btnColor: '#000'
    });
  }

  handleButtonBlur() {
    this.setState({
      btnBg: 'rgba(255, 255, 255, 0.1)',
      btnShadowColor: 'rgba(14,21,47,0)',
      btnShadowOffset: {width: 0, height: 0},
      btnShadowOpacity: 0,
      btnShadowRadius: 0,
      btnColor: '#fff'
    });
  }

  handleButtonPress() {
    console.log('sign in')
    console.log('username', this.state.username)
    console.log('password', this.state.password)
  }

  signIn() {
    
  }

  render() {
    return (
      <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#159957', '#155799']} style={styles.container}>
        <View>
          <Text style={styles.login}>Swotify</Text>
          <Text style={styles.description}>Sign in with your Spotify credentials.</Text>
          
          <TextInput
            style={styles.loginInput}
            value={this.state.username}
            placeholder="Username"
            onChangeText={(username) => this.setState({username})}
          />
          
          <TextInput
            style={styles.loginInput}
            value={this.state.password}
            placeholder="Password"
            secureTextEntry={true}
            onChangeText={(password) => this.setState({password})}
          />

          <TouchableHighlight
            style={{
              height: 80,
              width: 200,
              backgroundColor: this.state.btnBg,
              marginTop: 40,
              alignSelf: 'center',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 5,
              shadowColor: this.state.btnShadowColor,
              shadowOffset: this.state.btnShadowOffset,
              shadowOpacity: this.state.btnShadowOpacity,
              shadowRadius: this.state.btnShadowRadius
            }}
            onPress={this.handleButtonPress.bind(this)}
            onFocus={this.handleButtonFocus.bind(this)}
            onBlur={this.handleButtonBlur.bind(this)}
          >
            <Text style={{fontSize: 40, color: this.state.btnColor}}> Sign in </Text>
          </TouchableHighlight>
        </View>
      </LinearGradient>
    );
  }
}
