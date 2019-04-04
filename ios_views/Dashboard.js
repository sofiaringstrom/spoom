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

const styles = require('./styles').default;

const icon = require('../assets/spoom-small.png');
const settingsImg = require('../assets/setting.png');
const spotifyImg = require('../assets/Spotify_Icon_RGB_Green.png');
const userTemp = require('../assets/user.jpeg');

const btnDefault = {
  from: {
    scale: 0.7,
  },
  to: {
    scale: 0.7,
  },
};

const btnFocus = {
  from: {
    scale: 0.7,
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
    scale: 0.7,
  },
};

type Props = {};
export default class Dashboard extends Component<Props> {

  constructor(props) {
    super(props);

    this.state = ({
      access_token: null,
      refresh_token: null,
      createdAt: null,
      profileBorderColor: 0,
      spotifyUserData: null,
      btnBorderColor: 'rgba(255, 255, 255, 0)',
      deviceName: '',
      settingsImg: settingsImg,
      btnAnimation: btnDefault
    })

    this.handleTVEvent = this.handleTVEvent.bind(this);
    this.setDevice = this.setDevice.bind(this);
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

  setDevice(name) {
    this.setState({
      deviceName: name
    })
  }

  async getUserData(createdAt) {
    try {
      let response = await fetch(
        `${API_URI}/api/v1/getUserData?access_token=${this.state.access_token}&refresh_token=${this.state.refresh_token}&createdAt=${this.state.createdAt}`,
      );
      let responseJson = await response.json();
      if (responseJson.newAuthData.createdAt) {
        // new tokens
        this.setState({
          spotifyUserData: responseJson.data,
          access_token: responseJson.newAuthData.access_token,
          createdAt: responseJson.newAuthData.createdAt
        })
      } else {
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
          onPress: () => AlertIOS.alert('Info', 
            'Spoom is a hobby project made for fun and for the purpos of learning, and is not affiliated with or endorsed by Spotify. Spoom does not and will never save any personal data withour your consent. The only thing we save is a connection between your Spotify account and Spoom. If you want to remove this connection all you have to do is simple log our of the app or visit your Spotify Dashboard. If you have any questions or suggestions please check out spoom.heroku-app.com for more informaiton.'
          ),
        },
        {
          text: 'Close',
          onPress: () => console.log('close Pressed'),
          style: 'cancel',
        },
      ],
    );
  }

  handleTVEvent() {
    this.settings.setNativeProps({ hasTVPreferredFocus: true });
  }

  handleButtonFocus() {
    console.log('button focus')
    this.setState({
      btnAnimation: btnFocus
    });
  }

  handleButtonBlur() {
    this.setState({
      btnAnimation: btnBlur
    });
  }

  signOut() {
    AsyncStorage.clear();
    this.props.cb();
  }

  render() {

    console.log('spotifyUserData', this.state.spotifyUserData)

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

            <View style={{flexDirection: 'row', alignItems: 'center', width: '33%'}}>
          
              {this.state.spotifyUserData && (this.state.spotifyUserData['images'].length > 0) ? 
              <Image resizeMode="stretch" style={{width: 100, height: 100, borderRadius: 50, marginRight: 30}} source={{uri: this.state.spotifyUserData['images'][0]['url']}} /> : 
              <Image resizeMode="stretch" style={{width: 100, height: 100, borderRadius: 50, marginRight: 30}} source={userTemp} />}
              
              <View style={{flexDirection: 'column'}}>
                <Text style={styles.userText}>Hi {this.state.spotifyUserData ? this.state.spotifyUserData['display_name'] : this.state.spotifyUserData['username']}!</Text>

                <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 10}}>
                  <Image resizeMode="stretch" style={{width: 25, height: 25}} source={spotifyImg} />
                  <Text style={{color: '#1DB954', fontSize: 20, textTransform: 'uppercase', marginLeft: 7}}>{this.state.deviceName}</Text>
                </View>
              </View>

            </View>

            <Image style={{width: '33%'}} source={icon} />

            <View style={{alignItems: 'flex-end', width: '33%'}}>
              <TouchableHighlight
                ref={ref => {this.settings = ref; }}
                onPress={this.handleSettingsPress.bind(this)}
                onFocus={this.handleButtonFocus.bind(this)}
                onBlur={this.handleButtonBlur.bind(this)}
              >
                <Animatable.View
                  animation={this.state.btnAnimation}
                  duration={200}
                >
                  <Image style={{width: 80, height: 80}} source={settingsImg} />
                </Animatable.View>
              </TouchableHighlight>
            </View>

          </View>

          <View style={styles.containerBottom}>
            <Player tvEventCb={this.handleTVEvent} handleDevice={this.setDevice} />
          </View>

        </Animatable.View>
      );
    }
  }
}
