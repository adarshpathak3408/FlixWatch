import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';

const PORT = process.env.PORT || 5000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5174';
const app = express();

// allow your React app origin
app.use(cors({ origin: CLIENT_ORIGIN }));

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: CLIENT_ORIGIN, methods: ['GET','POST'] }
});

// in-memory map of rooms → host socket
const rooms = {};

io.on('connection', socket => {
  console.log('⏩ client connected:', socket.id);

  socket.on('join-room', ({ roomId, username, isHost }) => {
    socket.join(roomId);

    if (isHost) {
      rooms[roomId] = { hostId: socket.id };
    }

    // let everyone know how many are in the room
    const count = io.sockets.adapter.rooms.get(roomId)?.size || 0;
    io.to(roomId).emit('participants', count);

    // acknowledge join
    socket.emit('room-joined', { roomId, isHost });

    // 1) tell the new client who's already in the room:
    const existing = Array.from(io.sockets.adapter.rooms.get(roomId) || [])
                         .filter(id => id !== socket.id);
    socket.emit('all-users', { users: existing });

    // 2) tell the existing clients that somebody new just joined:
    socket.to(roomId).emit('user-joined', { userId: socket.id });
  });

  socket.on('play', ({ roomId, currentTime }) => {
    socket.to(roomId).emit('play', { currentTime });
  });

  socket.on('pause', ({ roomId, currentTime }) => {
    socket.to(roomId).emit('pause', { currentTime });
  });

  socket.on('seek', ({ roomId, currentTime }) => {
    socket.to(roomId).emit('seek', { currentTime });
  });

  socket.on('chat-message', ({ roomId, message, author }) => {
    const timestamp = new Date().toISOString();
    io.to(roomId).emit('chat-message', { author, message, timestamp });
  });

  // WebRTC signalling relay
  socket.on('signal', ({ to, signal }) => {
    io.to(to).emit('signal', { from: socket.id, signal });
  });

  socket.on('disconnect', () => {
    console.log('⏪ client disconnected:', socket.id);
    // optional cleanup for rooms...
  });
});

server.listen(PORT, () => {
  console.log(`🚀 GroupWatch server listening on ${PORT}`);
}); 