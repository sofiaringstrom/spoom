import openSocket from 'socket.io-client';

const socket = openSocket('http://localhost:7001');

function subscribeToCode(code, cb) {
  socket.on('access_token', access_token => cb(null, access_token));
  socket.emit('subscribeToCode', code);
}

function closeSocket() {
  socket.close();
  console.log('socket closed');
}

export { subscribeToCode, closeSocket }