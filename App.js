/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TabBarIOS, AsyncStorage} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Auth from './ios_views/Auth';
import Dashboard from './ios_views/Dashboard';
import Loader from './ios_views/Loader';
import Exit from 'react-native-tv-exit';

const TVEventHandler = require('TVEventHandler');

const styles = require('./ios_views/styles').default;

const running_on_tv = Platform.isTV;

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

  componentDidMount() {
    this._enableTVEventHandler();
  }

  constructor(props) {
    super(props);

    this.state = ({
      authorized: null
    });

    //AsyncStorage.removeItem('access_token'); // reset auth

    //setTimeout(() => this.checkUserSignedIn(), 2000);
    this.checkUserSignedIn();
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
      authorized: null
    });
    this.checkUserSignedIn();
  }

  render() {
    
    console.log(this.state.authorized)

    var notAuth = (!this.state.authorized ? <Loader /> : <Auth cb={this.handleAuth.bind(this)} />);

    return (
      <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#159957', '#155799']} style={styles.app}>
        {this.state.authorized == 'true' ? <Dashboard cb={this.handleAuth.bind(this)} /> : notAuth}
      </LinearGradient>
    );
  }
}
