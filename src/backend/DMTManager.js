'use strict';
let io;

const createMessage = require('../utils/MessageUtils').createMessage;

const words = ['white ferrari', 'whale', 'guitar', 'television', 'kanye west', 'yeezus', 'blonde', 'harambe', 'bread', 'dwight schrute', 'water bottle', 'smoothie', 'sofa', 'smoke', 'menage on my birthday', 'sailing stock', 'kpop', 'bubble pop', 'bubble gum', 'naps'];
const emptyGame = {
  gameInProgress: false,
  players: [],
  word : '',
  artist: 'doesntmatter',
  timeLeft: -1
};

const emptyRoom = {
  game: null,
  gameInProgress: false,
  clients: [],
}

const usersByRoom = (room) => {
  if ( io.sockets.adapter.rooms[room]!= null && io.sockets.adapter.rooms[room]!= undefined ) {
    let sockets = io.sockets.adapter.rooms[room].sockets;
    return Object.keys(sockets).map((socketId) => {
      var clientSocket = io.sockets.connected[socketId];
      return clientSocket.user;
    });
  }
  else return [];
}

class DMTManager {
  constructor(socketio, rooms) {
    rooms = rooms || {};
    this.rooms = {};
    for ( let room in rooms ) {
      this.addRoom(room)
    }
    io = socketio;
  }

  addRoom(roomName, visibility='public') {
    this.rooms[roomName] = {
      game: null,
      gameInProgress: false,
      clients: [],
      visibility
    };
  }

  getRooms() {
    return Object.keys(this.rooms).reduce((previous, curRoom) => {
        previous[curRoom] = this.getRoom(curRoom);
        return previous;
    }, {}); 
  }

  getPublicRooms() {
    return Object.keys(this.rooms).reduce((previous, curRoom) => {
        if (this.rooms[curRoom].visibility == 'public') {
          previous[curRoom] = this.getRoom(curRoom);
        }
        return previous;
    }, {}); 
  }

  getRoom(room) {
    if ( !(room in this.rooms) ) {
      return null;
    }

    let game = {...emptyGame};
    if (this.rooms[room].game != null) {
      game = this.rooms[room].game.gameState
    }
    return {
      clients: usersByRoom(room),
      game
    }
  }

  newGame(room) {
    let players = usersByRoom(room);
    if ( room in this.rooms && this.rooms[room].gameInProgress == false && players.length > 1) {
      console.log(`game started in room ${room}`);
      let dmtGame = new DMT(players, room, () => this.endGame(room));
      this.rooms[room].game = dmtGame;
      this.rooms[room].gameInProgress = true;
      dmtGame.start();
    }
    else if (players.length < 2){
      console.log(`game already started in room ${room}`)
    }
  }

  endGame(room) {
    console.log(`end game in room ${room}`)
    if ( room in this.rooms && this.rooms[room].gameInProgress ){
      io.sockets.in(room).emit('update game', emptyGame);
      clearInterval(this.rooms[room].game.turnTimer);
      this.rooms[room].gameInProgress = false;
    }
  } 

  testWinner(room, msg) {
    if ( room in this.rooms && this.rooms[room].gameInProgress ){
      return this.rooms[room].game.testWord(msg.author, msg.text.trim().toLowerCase());
    }
    else {
      return false;
    }
  }

  getGame(room) {
    console.log(`getting game in room ${room}`)
    if ( room in this.rooms && this.rooms[room].gameInProgress ) {
      return this.rooms[room].game.gameState;
    }
    return {...emptyGame};
  }

  updateGame(room, stateChange) {
    if ( room in this.rooms ) {
      this.rooms[room].game.setState(stateChange);
    } 
  }  
}

class DMT {
  constructor(players, room, endGame) {
    this.pointsForGuesser = [3,2,1];
    this.pointsForArtist = 2;
    this.correctGuessers = 0;
    this.room = room;
    this.players = players.reduce((previous, curPlayer) => {
      previous[curPlayer] = {
        points: 0,
        pointsThisTurn: 0,
      }
      return previous;
    },{})
    this.playerOrder = this.shufflePlayers(players);
    this.endGame = endGame;
    this.curArtist = 0;
    this.curWord = 'NONE';
    this.secondsPerTurn = 20;
    this.numPlayers = players.length;
    this.numRounds = 1;
    this.curRound = 1;
    this.gameState = {...emptyGame};
  }

  start() {
    this.startTurn();
  }

  testWord(player, guess) {
    if (player != this.currentArtist() && guess == this.curWord) {
      this.allocatePoints(player);
      let author = 'GAME';
      let text = `${player} guessed the word`
      let msg = createMessage(text, author);
      msg.color = 'red';
      io.sockets.in(this.room).emit('update chat', msg);
      this.gameState.players = this.players;
      io.sockets.in(this.room).emit('update game', this.gameState);
      return true;
    }
    return false;
  }

  allocatePoints(player) {
    let guesserPoints = this.correctGuessers < this.pointsForGuesser.length ? this.pointsForGuesser[this.correctGuessers++] : this.pointsForGuesser[this.pointsForGuesser.length-1];
    if (this.players[player].pointsThisTurn == 0) {
      this.players[player].points += guesserPoints;
      this.players[player].pointsThisTurn += guesserPoints;
      this.players[this.currentArtist()].points += this.pointsForArtist;
      this.players[this.currentArtist()].pointsThisTurn += this.pointsForArtist;
    }
  }

  endRound() {
    if (this.curRound < this.numRounds) {
      this.curRound++;
      this.curArtist = 0;
      this.startTurn();
    }
    else {
      this.endGame();
      this.gameState = {...emptyGame};
    }
  }

  endTurn() {
    clearTimeout(this.turnTimer);

    let guessers = this.playerOrder.filter((player) => this.players[player].pointsThisTurn > 0 && player !== this.currentArtist())
    io.sockets.in(this.room).emit('turn over', guessers);
    setTimeout(() => {
      this.curArtist++;
      if (this.curArtist >= this.numPlayers) {
        this.endRound();
      }
      else {
        this.startTurn();
      }  
    },10000)
  }

  startTurn() {
    this.correctGuessers = 0;
    this.curWord = words[Math.floor(Math.random()*words.length)+0];
    for (let player in this.players) {
      this.players[player].pointsThisTurn = 0;
    }
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
    return this.playerOrder[this.curArtist];
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

module.exports = (io, rooms)  => new DMTManager(io, rooms);