const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});
const cors = require('cors');

app.use(cors());
app.use(express.static('public'));

const users = {};

io.on('connection', socket => {
  socket.on('new-user-joined', name => {
    users[socket.id] = name;
    socket.broadcast.emit('user-joined', name);
  });

  socket.on('send', message => {
    socket.broadcast.emit('receive', {
      message: message,
      name: users[socket.id]
    });
  });

  socket.on('disconnect', () => {
    const userName = users[socket.id];
    delete users[socket.id];
    socket.broadcast.emit('user-left', userName);
  });
});

http.listen(8000, () => {
  console.log('Server is running on port 8000');
});