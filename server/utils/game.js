const initialState = { /*0 -> not clicked, 1/-1 -> clicked by this.playerIDs[1/-1]*/
  'b1':  0,
  'b2':  0,
  'b3':  0,
  'b4':  0,
  'b5':  0,
  'b6':  0,
  'b7':  0,
  'b8':  0,
  'b9':  0
}

class Game {
  constructor(socketID, name) {
    this.state = [];
    this.currentPlayer = 1;
    this.playerIDs = {1: {socketID, name}};
    this.colors = { /*TODO: Allow choosing a color?*/
      '-1': 'red',
      '1': 'yellow'
    };
    this.state = JSON.parse(JSON.stringify(initialState));
    this.winningCombinations= [
      [ 'b1', 'b2', 'b3' ], [ 'b4', 'b5', 'b6' ], [ 'b7', 'b8', 'b9' ],  // horizontal
      [ 'b1', 'b5', 'b9' ], [ 'b3', 'b5', 'b7' ], // diagonal
      [ 'b1', 'b4', 'b7' ],[ 'b2', 'b5', 'b8' ],[ 'b3', 'b6', 'b9' ] // vertical
    ];
    this.gameEnd = false;
    this.gameStart = false;
  }

  wasClickedBefore(buttonID) {
    return this.state[buttonID] != 0
  }

  updateState(buttonID) {
    this.state[buttonID] = this.currentPlayer;
  }

  isGameWon() {
    this.winningCombinations.forEach((combination) =>  {
      var tot = 0;
      combination.forEach((cell) => {
        tot += this.state[cell];
      });

      // TODO: return winning combination and flash the cells within the combination
      if (tot === 3 || tot === -3) {
        this.gameEnd = true;
        this.winner = this.playerIDs[tot/3].name;
      }
    });
    return this.gameEnd;
  }
  isGameDraw() {
    return false; // TODO
  }

  changePlayer() {
    this.currentPlayer *= -1;
  }
  addPlayer(socketID, name) {
    this.playerIDs[-1] = {socketID, name};
  }
  getCurrentPlayer () {
    return this.playerIDs[this.currentPlayer];
  }
  isCorrectPlayer (socketID) {
    return this.playerIDs[this.currentPlayer].socketID === socketID;
  }
  getRemainingPlayer(socketID) {
    var toReturn;
    Object.keys(this.playerIDs).forEach(key => {
      if (this.playerIDs[key].socketID != socketID) toReturn = this.playerIDs[key];
    });
    return toReturn;
  }
}

module.exports = {Game};
















// // update colors of buttons according to updated gameState
// document.getElementById(buttonID).style['background-color'] = colors[currentPlayer];
//
//
//
//
//   var html = '<h3><a href=game.html >' + state.winner +  ' has won. Click to restart</a></h3?'
//   jQuery('#turn').html(html);
// } else  {
//   jQuery('#turn').html("It's " + colors[state.currentPlayer] + "s turn");
