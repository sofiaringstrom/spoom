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
  ImageBackground
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import Loader from './Loader';
import Button from './Button';
import { API_URI } from 'react-native-dotenv';
import { playerSocket } from './swotify_api';
import * as Progress from 'react-native-progress';

const styles = require('./styles').default;

type Props = {};
export default class Player extends Component<Props> {

  constructor(props) {
    super(props);

    this.state = ({
      access_token: null,
      refresh_token: null,
      createdAt: null,
    })
  }

  componentDidMount() {
    AsyncStorage.multiGet(['access_token', 'refresh_token', 'createdAt'], (err, result) => this.setState({
      access_token: result[0][1],
      refresh_token: result[1][1],
      createdAt: result[2][1],
      spotifyData: null
    }));
  }

  componentDidUpdate(prevProps, prevState) {

    // if received access_token, fetch data
    if (!prevState.access_token && this.state.access_token) {
      this.setupConnect();
    }

    // if received new token in state
    if (prevState.access_token != this.state.access_token && prevState.createdAt != this.state.createdAt) {
      AsyncStorage.setItem('access_token', this.state.access_token);
      AsyncStorage.setItem('createdAt', this.state.createdAt);
    }

    if (this.state.access_token) {
      // request new token if current is expiring
      var tokenTimePassed = this.checkToken(this.state.createdAt);
      console.log('time passed on token:', tokenTimePassed)
      if (tokenTimePassed >= 59) {
        this.getNewToken();
      }
    }

  }

  checkToken(createdAt) {
    var now = Date.now();
    var diff = now - createdAt;
    var timePassed = diff/60/1000;
    return timePassed;
  }

  async getNewToken() {
    console.log('getNewToken()')
    try {
      let response = await fetch(
        `${API_URI}/api/v1/refreshToken?refresh_token=${this.state.refresh_token}`,
      );
      let responseJson = await response.json();
      // new token
      console.log('new access_token token')
      this.setState({
        access_token: responseJson.newAuthData.access_token,
        createdAt: responseJson.newAuthData.createdAt
      })
  } catch (error) {
      console.error(error);
    }
  }

  setProgress = (progress, timestamp) => {
    const trackLength = this.state.activeTrack.duration_ms
    this.setState({
      progress: progress,
      progressPercent: progress / trackLength * 100,
      progressPercentTest: progress / trackLength
    })
  }
  setPlaybackState = isPlaying => {
    this.setState({
      isPlaying
    })
  }
  setDevice = device => {
    this.setState({
      device
    })
  }
  setVolume = volume => {
    this.setState({
      volume
    })
  }
  setTrack = activeTrack => {
    this.setState({
      activeTrack
    })
  }
  emit = (event, value) => {
    this.playerSocket.emit(event, value)

    // optimistic updates
    switch (event) {
      case 'play':
        this.setPlaybackState(true)
        break
      case 'pause':
        this.setPlaybackState(false)
        break
      default:
        break
    }
  }
  onError = error => {
    this.setState({ error: error.message || error })
  }

  setupConnect = () => {
    const wrappedHandler = (event, handler) => {
      playerSocket.on(event, data => {
        console.info(event, data)
        /*this.setState({
          eventLog: [...this.state.eventLog, { event, data }]
        })*/
        handler(data)
      })
    }
    playerSocket.emit('initiate', { accessToken: this.state.access_token })
    wrappedHandler('initial_state', state => {
      this.setVolume(state.device.volume_percent)
      this.setDevice(state.device)
      this.setPlaybackState(state.is_playing)
      this.setTrack(state.item)
      this.setProgress(state.progress_ms)
      this.setState({ playerReady: true })
      this.progressTimer = window.setInterval(() => {
        if (this.state.isPlaying) {
          this.setProgress(this.state.progress + 1000)
        }
      }, 1000)
    })
    wrappedHandler('track_change', this.setTrack)
    wrappedHandler('seek', this.setProgress)
    wrappedHandler('playback_started', () => this.setPlaybackState(true))
    wrappedHandler('playback_paused', () => this.setPlaybackState(false))
    wrappedHandler('device_change', this.setDevice)
    wrappedHandler('volume_change', this.setVolume)
    wrappedHandler('track_end', () => {})
    wrappedHandler('connect_error', this.onError)

    this.playerSocket = playerSocket
  }

  render() {

    if (this.state.isPlaying) {
      const {
        error,
        activeTrack,
        playerReady,
        isPlaying
      } = this.state
      return (
        <Animatable.View animation="fadeIn" duration={1000} style={styles.containerPlayer}>
          <ImageBackground resizeMode={'cover'} style={styles.backgroundImagePlayer} blurRadius={20} source={activeTrack ? {uri: activeTrack.album.images[0].url} : {uri: "https://placeimg.com/300/300/any"}} >
            <View style={{backgroundColor: 'rgba(25,20,20, 0.2)', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center'}}>
              <Image style={{width: 300, height: 300}} source={activeTrack ? {uri: activeTrack.album.images[0].url} : {uri: "https://placeimg.com/300/300/any"}} />
              
              <Text style={styles.description}>{activeTrack ? activeTrack.name : ''}</Text>

              <Text style={styles.description}>{activeTrack ? activeTrack.artists[0].name : ''}</Text>

              <Progress.Bar progress={this.state.progressPercentTest} color={'white'} unfilledColor={'rgba(25,20,20, 0.5)'} borderWidth={0} width={600} height={10} />

            </View>
          </ImageBackground>
        </Animatable.View>
      );
    } else {
      return (
        <Animatable.View animation="fadeIn" duration={1000} style={styles.containerPlayer}>

          <Text style={styles.description}>nothing is playing</Text>

        </Animatable.View>
      );
    }
  }
}
