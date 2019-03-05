import openSocket from 'socket.io-client';

const socket = openSocket('http://localhost:7001');

function subscribeToCode(code, cb) {
  socket.on('authData', authData => cb(null, authData));
  socket.emit('subscribeToCode', code);
}

function closeSocket() {
  socket.close();
  console.log('socket closed');
}

export { subscribeToCode, closeSocket }