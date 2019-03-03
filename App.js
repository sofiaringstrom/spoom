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
import Auth from './ios_views/Auth';

const running_on_tv = Platform.isTV;

type Props = {};
export default class App extends Component<Props> {
  render() {
    return (
      <Auth />
    );
  }
}
