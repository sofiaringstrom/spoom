/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TabBarIOS} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const styles = require('./styles').default;

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

const running_on_tv = Platform.isTV;

type Props = {};
export default class App extends Component<Props> {
  render() {
    return (
      <LinearGradient colors={['#159957', '#155799']} style={styles.container}>
        <View style={styles.container}>
          <Text>{running_on_tv ? 'is tvOS' : 'not tvOS'}</Text>
          <Text style={styles.welcome}>Welcome to React Native!</Text>
        </View>
      </LinearGradient>
    );
  }
}
