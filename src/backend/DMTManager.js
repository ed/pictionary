'use strict';
var io = require('./socket');

const words = ['white ferrari', 'whale', 'guitar', 'television', 'kanye west', 'yeezus', 'blonde', 'harambe', 'bread', 'dwight schrute', 'water bottle', 'smoothie', 'sofa', 'smoke', 'menage on my birthday', 'sailing stock', 'kpop', 'bubble pop', 'bubble gum', 'naps'];
const emptyGame = {
  gameInProgress: false,
  players: [],
  word : '',
  artist: 'doesntmatter',
  timeLeft: -1
};

class DMTManager {
  constructor() {
    this.activeGames = {};
  }

  newGame(room, users) {
    if ( !(room in this.activeGames) ) {
      let dmtGame = new DMT(users, room, () => this.endGame(room));
      this.activeGames[room] = dmtGame;
      dmtGame.start();
    }
    else {
      console.log(`game already started in room ${room}`)
    }
  }

  endGame(room) {
    console.log(`end game in room ${room}`)
    if (room in this.activeGames){
      io.sockets.in(room).emit('update game', emptyGame);
      clearInterval(this.activeGames[room].turnTimer);
      delete this.activeGames[room];
    }
  } 

  testWinner(room, msg) {
    if (room in this.activeGames){
      let game = this.activeGames[room];
      if (msg.author != game.currentArtist() && msg.text.trim().toLowerCase() == game.curWord) {
        console.log(`${msg.author} wins!`);
        game.endTurn(msg.author);
      }
    }
  }

  getGame(room) {
    if (room in this.activeGames) {
      return this.activeGames[room].gameState;
    }
    else {
      return emptyGame;
    }
  }

  updateGame(room,stateChange) {
    if (room in this.activeGames) {
      this.activeGames[room].setState(stateChange);
    } 
  }  
}

class DMT {
  constructor(players, room, endGame) {
    this.room = room;
    this.players = this.shufflePlayers(players);
    this.endGame = endGame;
    this.curArtist = 0;
    this.curWord = 'NONE';
    this.secondsPerTurn = 30;
  }

  start() {
    this.startTurn();
  }

  endTurn(winner) {
    clearTimeout(this.turnTimer);
    io.sockets.in(this.room).emit('round over', winner);

    this.curArtist++;
    if (this.curArtist >= this.players.length) {
      this.endGame();
    }
    else {
      this.startTurn();
    }  
  }

  startTurn() {
    this.curWord = words[Math.floor(Math.random()*words.length)+0];
    this.gameState = {
      gameInProgress: true,
      players: this.players,
      word: this.curWord,
      artist: this.currentArtist(),
      timeLeft: this.secondsPerTurn
    };
    io.sockets.in(this.room).emit('update game', this.gameState);
    this.turnTimer = setInterval(() => this.tickTurn(), 1000);
  }

  tickTurn() {
    if (this.gameState['timeLeft'] > 0) {
      this.gameState['timeLeft']--;
      io.sockets.in(this.room).emit('update game', this.gameState);
    }
    else {
      this.endTurn();
    }
  }

  currentArtist() {
    return this.players[this.curArtist];
  }

  shufflePlayers(players) {
    for (var i = players.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = players[i];
        players[i] = players[j];
        players[j] = temp;
    }
    return players;
  }

  setState(newStates) {
    for (let key in newStates) { 
      this.gameState[key] = newStates[key]; 
    }
  }
}

module.exports = ()  => new DMTManager();