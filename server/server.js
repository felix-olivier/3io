const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {Users} = require('./utils/users');
const {Game} = require('./utils/game');
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app)
var io = socketIO(server);
var users = new Users();
var games = {}; // Stores game state per rooms

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('New user connected');


  socket.on('join', (params, callback) => {
    if (!(params.name) || !(params.room)) {
      return callback('Name and room name are required');
    }

    params.room = params.room.toLowerCase();

    if (users.getUserList(params.room).length < 2) {
      socket.join(params.room);
      // TODO: broadcast to room that game is now ready to be started

      users.removeUser(socket.id); /*User can only join a single room*/
      users.addUser(socket.id, params.name, params.room);

      if (!games[params.room]) games[params.room] = new Game(socket.id);
      else games[params.room].addPlayer(socket.id);
      // TODO: render game based on state

      callback();
    } else {
      // TODO: On refresh room stays occupied
      callback('Sorry, this room is full');
    }
  });

  socket.on('buttonClicked', (button) => {
    var buttonID = button.button;
    var user = users.getUser(socket.id);
    if (user) {

      if (!games[user.room].wasClickedBefore(buttonID) && games[user.room].isCorrectPlayer(socket.id)) {
        games[user.room].updateState(buttonID);

        if (games[user.room].isGameWon()) {
          io.to(user.room).emit('gameWon', {winner: games[user.room].winner});
        } else {
          io.to(user.room).emit('updateGrid', {
            buttonID,
            color: games[user.room].colors[games[user.room].currentPlayer],
            newPlayer: games[user.room].colors[-games[user.room].currentPlayer]
          });
        }
        games[user.room].changePlayer();
      }
    }
  });
});

// TODO: on disconnect, clear from user list and emit to room, so it can be displayed 

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
