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

socket.on('updateGrid', function(data) {
  document.getElementById(data.buttonID).style['background-color'] = data.color;
    jQuery('#turn').html("It's " + data.newPlayer + "s turn");
});

socket.on('gameWon', function(data) {
  var html = '<h3><a href=game.html >' + data.winner +  ' has won. Click to restart</a></h3?'
  // TODO: href does not provide player name and room. Instead refresh state
  jQuery('#turn').html(html);
});

//// **** Event listeners **** ////
var buttons = ['b1',    'b2',    'b3',    'b4',    'b5',    'b6',    'b7',    'b8',    'b9'];
buttons.forEach(function(buttonID) {
  document.getElementById(buttonID).addEventListener('click', function () {
    socket.emit('buttonClicked', {button: buttonID});
  });
});
