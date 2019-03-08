import openSocket from 'socket.io-client';
import { API_URI } from 'react-native-dotenv';

const socket = openSocket('http://localhost:7000/token');
const io = openSocket('http://localhost:7000/connect');

function subscribeToCode(code, cb) {
  socket.on('authData', authData => cb(null, authData));
  socket.emit('subscribeToCode', code);
}

function closeSocket() {
  socket.close();
  console.log('socket closed');
}

function checkServerStatus(cb) {
  socket.on('connect', () => cb('up'));
  socket.on('connect_error', () => cb('down'));
}

function initSpotify(access_token, cb) {
  console.log('initSpotify', access_token)
  io.on('response', response => cb(null, response));
  io.emit('initiate', { accessToken: access_token });
  io.on('connect_error', (err) => {
    console.log(err)
  });
}

function playSpotify(cb) {
  console.log('playSpotify')
  io.on('res', () => cb())
  io.emit('resume')
  io.on('connect_error', (err) => {
    console.log(err)
  });
}

io.on('playback_paused', track => {
    console.log('paused')
    // update state/store with new track
  })

export { subscribeToCode, closeSocket, checkServerStatus, initSpotify, playSpotify }