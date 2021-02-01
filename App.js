/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */
console.disableYellowBox = true;

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TabBarIOS, AsyncStorage, Dimensions, Image} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Auth from './ios_views/Auth';
import Dashboard from './ios_views/Dashboard';
import Loader from './ios_views/Loader';
import Exit from 'react-native-tv-exit';
import { checkServerStatus } from './ios_views/spoom_api';

const TVEventHandler = require('TVEventHandler');

const styles = require('./ios_views/styles').default;
const width = Dimensions.get('window').width; //full width

const running_on_tv = Platform.isTV;

const imgSadMac = require('./assets/sad_mac.png');

type Props = {};
export default class App extends Component<Props> {

  _tvEventHandler: any;

  _enableTVEventHandler() {
    this._tvEventHandler = new TVEventHandler();
    this._tvEventHandler.enable(this, function(cmp, evt) {

      if (evt && evt.eventType === 'menu') {
        Exit.exitApp();
      }
    });
  }

  constructor(props) {
    super(props);

    this.state = ({
      authorized: null,
      serverStatus: null
    });

    //AsyncStorage.clear(); // reset auth
  }

  componentDidMount() {
    this._enableTVEventHandler();

    console.log('componentDidMount')
    this.checkServer();
  }

  checkServer() {
    console.log('checkServer')
    checkServerStatus((status) => {
      console.log('checkServerStatus cb')
      if (status === 'down') {
        console.log('server is down')
        this.setState({
          serverStatus: "Could not connect to server, trying to reconnect...\n\nIf this screen doesn't change soon there's a chance the server is down.\nPlease come back and check later."
        })
      } else if (status === 'up') {
        console.log('server is up')
        this.handleAuth();
      }
    });
  }

  async checkUserSignedIn() {
    let self = this;
     
    try {
      let access_token = await AsyncStorage.getItem('access_token');

      setTimeout(() => {
        if (access_token != null){
          // do something

          this.setState({
            authorized: 'true'
          });
        }
        else {
          // do something else
          this.setState({
            authorized: 'empty'
          });
        }
      }, 2000);
      
    } catch (error) {
      // Error retrieving data
      console.log('item no existing')
      this.setState({
        authorized: 'missing'
      });
    }
    
  }

  handleAuth() {
    this.setState({
      authorized: null,
      serverStatus: null
    });
    this.checkUserSignedIn();
  }

  render() {

    var notAuth = (!this.state.authorized ? <Loader /> : <Auth cb={this.handleAuth.bind(this)} />);

    if (this.state.serverStatus) {
      return (
        <View style={styles.app}>
          <View style={{ width: width, flex: 1, justifyContent: 'center', alignItems: 'center',}}>
            <Text style={styles.title}>Swotify</Text>
            <Image style={{width: 120, height: 150}} resizeMode="contain" source={imgSadMac} />
            <Text style={styles.description}>{this.state.serverStatus}</Text>
          </View>
        </View>
      );
    } else {
      return (
        <View style={styles.app}>
          {this.state.authorized == 'true' ? <Dashboard cb={this.handleAuth.bind(this)} /> : notAuth}
        </View>
      );
    }
  }
}
