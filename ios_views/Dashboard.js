'use strict'

import React, {Component} from 'react';
import {Platform, 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableHighlight, 
  AsyncStorage, 
  Image, 
  AlertIOS} from 'react-native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import Loader from './Loader';
import Button from './Button';
import { API_URI } from 'react-native-dotenv';
import Player from './Player';

var TVEventHandler = require('TVEventHandler');

const styles = require('./styles').default;

type Props = {};
export default class Dashboard extends Component<Props> {

  _tvEventHandler: any;

  _enableTVEventHandler() {
    this._tvEventHandler = new TVEventHandler();
    this._tvEventHandler.enable(this, (cmp, evt) => {
      console.log(evt.eventType)
      if(evt && evt.eventType === 'up') {
        console.log('up')
        // set focus to play/paus
        //this.refs[playPause].focus();
        this.settings.setNativeProps({ hasTVPreferredFocus: true });
      }
    });
  }

  constructor(props) {
    super(props);

    this.state = ({
      access_token: null,
      refresh_token: null,
      createdAt: null,
      profileBorder: 0,
      spotifyUserData: null
    })
  }

  componentDidMount() {
    AsyncStorage.multiGet(['access_token', 'refresh_token', 'createdAt'], (err, result) => this.setState({
      access_token: result[0][1],
      refresh_token: result[1][1],
      createdAt: result[2][1]
    }));
  }

  componentDidUpdate(prevProps, prevState) {

    // if received access_token, fetch data
    if (!prevState.access_token && this.state.access_token) {
      this.getUserData();
    }

    // if received new token in state
    if (prevState.access_token != this.state.access_token && prevState.createdAt != this.state.createdAt) {
      AsyncStorage.setItem('access_token', this.state.access_token);
      AsyncStorage.setItem('createdAt', this.state.createdAt);
    }
  }

  async getUserData(createdAt) {
    try {
      let response = await fetch(
        `${API_URI}/api/v1/getUserData?access_token=${this.state.access_token}&refresh_token=${this.state.refresh_token}&createdAt=${this.state.createdAt}`,
      );
      let responseJson = await response.json();
      if (responseJson.newAuthData.createdAt) {
        // new tokens
        console.log('new token')
        this.setState({
          spotifyUserData: responseJson.data,
          access_token: responseJson.newAuthData.access_token,
          createdAt: responseJson.newAuthData.createdAt
        })
      } else {
        console.log('same token')
        this.setState({
          spotifyUserData: responseJson.data
        });
      }
    } catch (error) {
      console.error(error);
    }
  }

  handleSettingsPress() {
    AlertIOS.alert(
      'Settings',
      '',
      [
        {
          text: 'Sign out',
          onPress: this.signOut.bind(this),
        },
        {
          text: 'Info',
          onPress: () => console.log('info Pressed'),
        },
        {
          text: 'Close',
          onPress: () => console.log('close Pressed'),
          style: 'cancel',
        },
      ],
    );
  }

  handleProfileFocus() {
    this.setState({
      profileBorder: 1
    })
  }

  handleProfileBlur() {
    this.setState({
      profileBorder: 0
    })
  }

  signOut() {
    AsyncStorage.clear();
    this.props.cb();
  }

  render() {

    console.log('this.state.spotifyUserData', this.state.spotifyUserData)

    if (!this.state.spotifyUserData) {
      return (
        <View style={styles.app}>
          <Loader />
        </View>
      );
    } else {
      return (
        <Animatable.View animation="fadeIn" duration={1000} style={styles.containerSplit}>
        
          <View style={styles.containerTop}>

            <TouchableHighlight onFocus={this.handleProfileFocus.bind(this)} onBlur={this.handleProfileBlur.bind(this)} style={{borderWidth: this.state.profileBorder, borderColor: 'white', padding: 20}}>

              <View style={{flexDirection: 'row', alignItems: 'center'}}>
            
                {this.state.spotifyUserData && this.state.spotifyUserData['images'] ? <Image style={{width: 100, height: 100, borderRadius: 50, marginRight: 30}} source={{uri: this.state.spotifyUserData['images'][0]['url']}} /> : null}
                
                <Text style={styles.userText}>Hi {this.state.spotifyUserData ? this.state.spotifyUserData['display_name'] : this.state.spotifyUserData['username']}!</Text>

              </View>

            </TouchableHighlight>

            {/*<Button text="Remove access_token" onPress={this.handlePress.bind(this)} />

            <Button text="Button" onPress={console.log('button')} />*/}

            <Button text="Settings" ref={ref => {this.settings = ref; }} onPress={this.handleSettingsPress.bind(this)} />

          </View>

          <View style={styles.containerBottom}>
            <Player />
          </View>

        </Animatable.View>
      );
    }
  }
}
