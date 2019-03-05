'use strict'

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TextInput, TouchableHighlight, AsyncStorage} from 'react-native';
import * as Animatable from 'react-native-animatable';
import Button from './Button';

const styles = require('./styles').default;

type Props = {};
export default class Dashboard extends Component<Props> {

  constructor(props) {
    super(props);

    this.state = ({
      access_token: null,
      refresh_token: null
    })

    AsyncStorage.getItem('access_token', (err, result) => this.setState({ 
      access_token: result
    }));

    AsyncStorage.getItem('refresh_token', (err, result) => this.setState({ 
      refresh_token: result
    }));
  }

  componentDidMount() {

    // call api and send tokens for spotify data

  }

  handlePress() {
    AsyncStorage.removeItem('access_token'); // reset auth
    AsyncStorage.removeItem('refresh_token'); // reset auth
    this.props.cb();
  }

  render() {
    return (
      <Animatable.View animation="fadeIn" duration={1000} style={styles.container}>
  
        <Text style={styles.title}>Swotify Dashboard</Text>
        <Text style={styles.description}>access_token: {this.state.access_token}</Text>
        <Text style={styles.description}>refresh_token: {this.state.refresh_token}</Text>

        <Button text="Remove access_token" onPress={this.handlePress.bind(this)} />

        <Button text="Button" onPress={console.log('button')} />

      </Animatable.View>
    );
  }
}
