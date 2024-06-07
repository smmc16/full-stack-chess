const express = require('express');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 5001;

// Middleware Includes
const sessionMiddleware = require('./modules/session-middleware');
const passport = require('./strategies/user.strategy');

// Route Includes
const userRouter = require('./routes/user.router');
const gameRouter = require('./routes/game.router');
const chatRouter = require('./routes/chat.router');

// Express Middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('build'));

// Passport Session Configuration
app.use(sessionMiddleware);

// Start Passport Sessions
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/user', userRouter);
app.use('/api/game', gameRouter);
app.use('/api/chat', chatRouter);

const cors = require('cors');
app.use(cors())
const http = require('http');

const ioPORT = process.env.ioPORT || 5002;

const server = http.createServer(app);
const io = require("socket.io")(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST", "UPDATE", "DELETE"]
    }
  });  

io.on('connection', (socket) => {
  console.log('A user connected', socket.id);

  socket.on('joinRoom', (room) => {
    console.log('room joined', room)
    socket.join(room);
  });

  socket.on('makeMove', (move, id) => {
    console.log('move made', move, id)
    socket.to(id).emit('makeMove', move);
  });

  socket.on('sendMessage', (msg, id, user) => {
    socket.to(id).emit('sendMessage', msg, user);
  });

  socket.on('disconnect', () => {
      console.log('User disconnected');
  });
  });

io.listen(ioPORT, () => {
  console.log('Listening on ioPORT:', ioPORT);
});

// Listen Server & Port
app.listen(PORT, () => {
  console.log(`Listening on PORT: ${PORT}`);
});
