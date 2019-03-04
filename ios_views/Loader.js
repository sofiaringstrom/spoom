'use strict'

import React, {Component} from 'react';
import { StyleSheet, View, Image} from 'react-native';

const styles = require('./styles').default;

type Props = {};
export default class Loader extends Component<Props> {

  render() {
    return (
      <View style={styles.container}>
        <Image
          source={require('../assets/loader.gif')}
        />
      </View>
    );
  }
}
