import * as socketIO from 'socket.io-client';
export const socket = socketIO.connect('http://pix2desktop.backend.local:3333');
