'use strict'

import React, {Component} from 'react';
import {StyleSheet, Text, TouchableHighlight} from 'react-native';
import * as Animatable from 'react-native-animatable';

const styles = require('./styles').default;

const btnDefault = {
  from: {
    scale: 0.95,
  },
  to: {
    scale: 0.95,
  },
};

const btnFocus = {
  from: {
    scale: 0.95,
  },
  to: {
    scale: 1,
  },
};

const btnBlur = {
  from: {
    scale: 1,
  },
  to: {
    scale: 0.95,
  },
};

type Props = {};
export default class Button extends Component<Props> {

  constructor(props) {
    super(props);

    this.state = ({
      btnBg: 'rgba(255, 255, 255, 0.1)',
      btnShadowColor: 'rgba(14,21,47,0)',
      btnShadowOffset: {width: 0, height: 0},
      btnShadowOpacity: 0,
      btnShadowRadius: 0,
      btnColor: '#fff',
      btnAnimation: btnDefault
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
      btnColor: '#000',
      btnAnimation: btnFocus
    });
  }

  handleButtonBlur() {
    this.setState({
      btnBg: 'rgba(255, 255, 255, 0.1)',
      btnShadowColor: 'rgba(14,21,47,0)',
      btnShadowOffset: {width: 0, height: 0},
      btnShadowOpacity: 0,
      btnShadowRadius: 0,
      btnColor: '#fff',
      btnAnimation: btnBlur
    });
  }

  handleButtonPress() {
    this.props.onPress();
  }

  render() {
    return (
      <TouchableHighlight
        onPress={this.handleButtonPress.bind(this)}
        onFocus={this.handleButtonFocus.bind(this)}
        onBlur={this.handleButtonBlur.bind(this)}
      >
        <Animatable.View 
          animation={this.state.btnAnimation}
          duration={200}
          style={{
            backgroundColor: this.state.btnBg,
            color: this.state.btnColor,
            borderRadius: 5,
            shadowColor: this.state.btnShadowColor,
            shadowOffset: this.state.btnShadowOffset,
            shadowOpacity: this.state.btnShadowOpacity,
            shadowRadius: this.state.btnShadowRadius,
            flex: -1,
            paddingTop: 15,
            paddingBottom: 20,
            width: 600,
            alignItems: 'center'
          }}>
          <Text style={{
            fontSize: 40,
            color: this.state.btnColor
          }}>
            {this.props.text}
          </Text>
        </Animatable.View>
      </TouchableHighlight>
    );
  }
}
