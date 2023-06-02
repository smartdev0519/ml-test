import { Server } from 'socket.io'
import { autoCreateBlogs } from '../services/blogs/auto';
import { verifySocketToken } from '../middleware';
import { createJson } from '../services/openai/createJson';
import { embeddingJsonData } from '../services/openai/embdding/json';

export const createSocketServer = (server) => {
  const io = new Server(server);

  io.use((socket, next) => {
    if (verifySocketToken(socket.handshake)) {
      next();
    } else {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log('user connected');
    socket.on('disconnect', function () {
      console.log('user disconnected');
    });
    socket.on('request-auto-create-blogs', data => {
      autoCreateBlogs(data, socket)
    });
    socket.on('request-embedding-json-data', data => {
      embeddingJsonData(data, socket)
    })
    socket.on('request-create-json-data', data => {
      createJson(data, socket)
    })
  })
}

