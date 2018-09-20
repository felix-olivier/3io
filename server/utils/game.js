class Game {
  constructor(socketID) {
    this.state = [];
    this.currentPlayer = 1;
    this.playerIDs = {1: socketID};
    this.colors = {
      '-1': 'red',
      '1': 'yellow'
    };
    this.state = {
      'b1':  0,
      'b2':  0,
      'b3':  0,
      'b4':  0,
      'b5':  0,
      'b6':  0,
      'b7':  0,
      'b8':  0,
      'b9':  0
    };
    this.winningCombinations= [
      [ 'b1', 'b2', 'b3' ], [ 'b4', 'b5', 'b6' ], [ 'b7', 'b8', 'b9' ],  // horizontal
      [ 'b1', 'b5', 'b9' ], [ 'b3', 'b5', 'b7' ], // diagonal
      [ 'b1', 'b4', 'b7' ],[ 'b2', 'b5', 'b8' ],[ 'b3', 'b6', 'b9' ] // vertical
    ];
    this.gameEnd = false
  }

  wasClickedBefore(buttonID) {
    return this.state[buttonID] != 0
  }

  updateState(buttonID) {
    this.state[buttonID] = this.currentPlayer;
  }

  isGameWon() {
    this.winningCombinations.forEach( (combs) =>  {
      var tot = 0;
      combs.forEach((comb) => {
        tot += this.state[comb];
      });

      if (tot === 3 || tot === -3) {
        this.gameEnd = true;
        this.winner = this.colors[tot/3];
      }
    });
    return this.gameEnd;
  }

  changePlayer() {
    this.currentPlayer *= -1;
  }
  addPlayer(socketID) {
    this.playerIDs[-1] = socketID;
  }

  isCorrectPlayer (socketID) {
    return this.playerIDs[this.currentPlayer] === socketID;
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
