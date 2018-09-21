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
       // TODO: username should be unique

      users.removeUser(socket.id); /*User can only join a single room*/
      users.addUser(socket.id, params.name, params.room);

      if (!games[params.room]) games[params.room] = new Game(socket.id, params.name);
      else {
        games[params.room].addPlayer(socket.id, params.name);
        games[params.room].gameStart = true;
        var currentPlayer = games[params.room].getCurrentPlayer().name;
        io.to(params.room).emit('2ndJoin', {currentPlayer});
      }

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
      var curGame = games[user.room]
      if (!curGame.wasClickedBefore(buttonID) && curGame.isCorrectPlayer(socket.id) && curGame.gameStart === true) {
        curGame.updateState(buttonID);
        curGame.changePlayer();

        if (curGame.isGameWon()) {
          io.to(user.room).emit('gameWon', {
            buttonID,
            winner: games[user.room].winner,
            color: curGame.colors[-curGame.currentPlayer]
          }); // TODO, fill cell with color (opt flash winningCombination)
        } else if (false && curGame.isGameDraw()) {
          // TODO
        } else {
          io.to(user.room).emit('updateGrid', {
            buttonID,
            color: curGame.colors[-curGame.currentPlayer],
            currentPlayer: curGame.getCurrentPlayer().name
          });
        }
      }
    }
  });



  socket.on('disconnect', () => {
    var user = users.getUser(socket.id);
    users.removeUser(socket.id); /*User can only join a single room*/
    if (user) {
      io.to(user.room).emit('rageQuit', {test: 'test'});
      var remainingPlayer = games[user.room].getRemainingPlayer(socket.id);
      if (remainingPlayer) games[user.room] = new Game(remainingPlayer.socketID, remainingPlayer.name); // TODO else
    }
  });



});


server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
