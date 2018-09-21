//// **** Socket IO handeling **** ////
var socket = io();

socket.on('connect', function () {
  var params = jQuery.deparam(window.location.search);
  if (!params.room && params.roomList) params.room = params.roomList;
  delete params.roomList;

  socket.emit('join', params, function (err) {
    if (err) {
      alert(err);
      window.location.href = '/'; /*Redirect to homepage */
    }
  });
});

socket.on('2ndJoin', function(data) {
  // document.getElementById(data.buttonID).style['background-color'] = data.color;
    jQuery('#turn').html("Game is ready to start! <br>It's " + data.currentPlayer +"'s turn");
});

socket.on('updateGrid', function(data) {
  document.getElementById(data.buttonID).style['background-color'] = data.color;
    jQuery('#turn').html("It's " + data.currentPlayer + "s turn");
});

socket.on('gameWon', function(data) {
  document.getElementById(data.buttonID).style['background-color'] = data.color;
  // document.getElementById(data.buttonID).classList.add('flash-button-red'); // Experimental

  var html = '<h3><a href=game.html >' + data.winner +  ' has won. Click to restart</a></h3?'
  // TODO: href does not provide player name and room. Instead refresh state
  jQuery('#turn').html(html);
});

socket.on('rageQuit', function(data) {
  jQuery('#turn').html("Your opponent has left..<br> Waiting for a new player");

});

//// **** Event listeners **** ////
var buttons = ['b1',    'b2',    'b3',    'b4',    'b5',    'b6',    'b7',    'b8',    'b9'];
buttons.forEach(function(buttonID) {
  document.getElementById(buttonID).addEventListener('click', function () {
    socket.emit('buttonClicked', {button: buttonID});
  });
});
