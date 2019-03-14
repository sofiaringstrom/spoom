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

var TVEventHandler = require('TVEventHandler');

const styles = require('./styles').default;

const pauseImg = require('../assets/icons8-pause-button-filled-50.png');
const pauseImgBlur = require('../assets/icons8-pause-button-50.png');
const prevImg = require('../assets/icons8-skip-to-start-filled-50.png');
const prevImgBlur = require('../assets/icons8-skip-to-start-50.png');
const nextImg = require('../assets/icons8-end-filled-50.png');
const nextImgBlur = require('../assets/icons8-end-50.png');
const playImg = require('../assets/icons8-circled-play-filled-50.png');
const playImgBlur = require('../assets/icons8-circled-play-50.png');

const btnDefault = {
  from: {
    scale: 0.8,
  },
  to: {
    scale: 0.8,
  },
};

const btnFocus = {
  from: {
    scale: 0.8,
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
    scale: 0.8,
  },
};

type Props = {};
export default class Player extends Component<Props> {

  _tvEventHandler: any;

  _enableTVEventHandler() {
    this._tvEventHandler = new TVEventHandler();
    this._tvEventHandler.enable(this, (cmp, evt) => {
      if(evt && evt.eventType === 'down') {
        console.log('down')
        console.log(this.playPause)
        // set focus to play/paus
        //this.refs[playPause].focus();
        this.playPause.setNativeProps({ hasTVPreferredFocus: true });
      }
    });
  }

  constructor(props) {
    super(props);

    this.state = ({
      access_token: null,
      refresh_token: null,
      createdAt: null,
      btnPrevAnimation: btnDefault,
      btnPrevImage: prevImgBlur,
      btnPlayPauseAnimation: btnDefault,
      btnPlayPauseImage: pauseImgBlur,
      btnNextAnimation: btnDefault,
      btnNextImage: nextImgBlur
    })
  }

  componentDidMount() {
    this._enableTVEventHandler();

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
      //console.log('time passed on token:', tokenTimePassed)
      if (tokenTimePassed >= 59) {
        this.getNewToken();
      }
    }

  }

  handleButtonFocus(name) {
    console.log('focus', name)
    if (name === 'playPause') {
      this.setState({
        btnPlayPauseAnimation: btnFocus,
        btnPlayPauseImage: pauseImg
      });
    } else if (name === 'prev') {
      this.setState({
        btnPrevAnimation: btnFocus,
        btnPrevImage: prevImg
      });
    } else if (name === 'next') {
      this.setState({
        btnNextAnimation: btnFocus,
        btnNextImage: nextImg
      });
    }
  }

  handleButtonBlur(name) {
    if (name === 'playPause') {
      this.setState({
        btnPlayPauseAnimation: btnBlur,
        btnPlayPauseImage: pauseImgBlur
      });
    } else if (name === 'prev') {
      this.setState({
        btnPrevAnimation: btnBlur,
        btnPrevImage: prevImgBlur
      });
    } else if (name === 'next') {
      this.setState({
        btnNextAnimation: btnBlur,
        btnNextImage: nextImgBlur
      });
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

    const {
      error,
      activeTrack,
      playerReady,
      isPlaying
    } = this.state

    console.log('activeTrack', activeTrack)

    if (activeTrack) {
      
      return (
        <Animatable.View animation="fadeIn" duration={1000} style={styles.containerPlayer}>
          <ImageBackground resizeMode={'cover'} style={styles.backgroundImagePlayer} blurRadius={20} source={activeTrack ? {uri: activeTrack.album.images[0].url} : {uri: "https://placeimg.com/300/300/any"}} >
            <View style={{backgroundColor: 'rgba(25,20,20, 0.5)', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center'}}>
              <Image style={{width: 300, height: 300}} source={activeTrack ? {uri: activeTrack.album.images[0].url} : {uri: "https://placeimg.com/300/300/any"}} />
              
              <Text style={styles.trackName}>{activeTrack ? activeTrack.name : ''}</Text>

              <Text style={styles.artist}>{activeTrack ? activeTrack.artists[0].name : ''}</Text>

              <View style={{flexDirection: 'row', marginTop: 20, width: 300, justifyContent: 'space-between'}}>

                <TouchableHighlight onFocus={this.handleButtonFocus.bind(this, 'prev')} onBlur={this.handleButtonBlur.bind(this, 'prev')} onPress={() => this.emit('previous_track')}>
                  <Animatable.View 
                    animation={this.state.btnPrevAnimation}
                    duration={200}
                    style={{
                      flex: -1,
                      alignItems: 'center',
                    }}>
                    <Image style={{}} source={this.state.btnPrevImage} width={60} height={60} />
                  </Animatable.View>
                </TouchableHighlight>

                <TouchableHighlight ref={ref => {this.playPause = ref; }} onFocus={this.handleButtonFocus.bind(this, 'playPause')} onBlur={this.handleButtonBlur.bind(this, 'playPause')} onPress={() => this.emit(isPlaying ? 'pause' : 'play')}>
                  <Animatable.View 
                    animation={this.state.btnPlayPauseAnimation}
                    duration={200}
                    style={{
                      flex: -1,
                      alignItems: 'center'
                    }}>
                    <Image style={{}} source={this.state.btnPlayPauseImage} width={60} height={60} />
                  </Animatable.View>
                </TouchableHighlight>

                <TouchableHighlight onFocus={this.handleButtonFocus.bind(this, 'next')} onBlur={this.handleButtonBlur.bind(this, 'next')} onPress={() => this.emit('next_track')}>
                  <Animatable.View 
                    animation={this.state.btnNextAnimation}
                    duration={200}
                    style={{
                      flex: -1,
                      alignItems: 'center'
                    }}>
                    <Image style={{}} source={this.state.btnNextImage} width={60} height={60} />
                  </Animatable.View>
                </TouchableHighlight>

              </View>

              <Progress.Bar style={{marginTop: 20}} progress={this.state.progressPercentTest} color={'white'} unfilledColor={'rgba(25,20,20, 0.5)'} borderWidth={0} width={500} height={10} />

            </View>
          </ImageBackground>
        </Animatable.View>
      );
    } else {
      return (
        <Animatable.View animation="fadeIn" duration={1000} style={styles.containerPlayer}>

          <Text style={styles.description}>pls start spotify on a device</Text>

        </Animatable.View>
      );
    }
  }
}
