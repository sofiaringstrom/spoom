import openSocket from 'socket.io-client';

const socket = openSocket('https://swotify-api.herokuapp.com');

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

export { subscribeToCode, closeSocket, checkServerStatus }