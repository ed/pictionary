'use strict';
let io;

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
  constructor(socketio, rooms={}) {
    this.rooms = {};
    for ( let room in rooms ) {
      this.addRoom(room)
    }
    io = socketio;
  }

  addRoom(roomName) {
    this.rooms[roomName] = {
      game: null,
      gameInProgress: false,
      clients: [],
    };
  }

  getRooms() {
    let rooms = this.rooms;
    return Object.keys(rooms).reduce((previous, curRoom) => {
        previous[curRoom] = this.getGame(curRoom);
        return previous;
    }, {}); 
  }

  getRoom(room) {
    let game = {
      gameInProgress: false,
      players: [],
      word : '',
      artist: 'doesntmatter',
      timeLeft: -1
    };
    if (this.rooms[room]['game'] != null) {
      game = this.rooms[room]['game'].gameState
    }
    return {
      clients: usersByRoom(room),
      game
    }
  }

  newGame(room, users) {
    if ( room in this.rooms && this.rooms[room]['gameInProgress'] == false ) {
      console.log(`game started in room ${room}`);
      let dmtGame = new DMT(users, room, () => this.endGame(room));
      this.rooms[room]['game'] = dmtGame;
      this.rooms[room]['gameInProgress'] = true;
      dmtGame.start();
    }
    else {
      console.log(`game already started in room ${room}`)
    }
  }

  endGame(room) {
    console.log(`end game in room ${room}`)
    if ( room in this.rooms && this.rooms[room]['gameInProgress'] ){
      io.sockets.in(room).emit('update game', emptyGame);
      clearInterval(this.rooms[room]['game'].turnTimer);
      this.rooms[room]['gameInProgress'] = false;
    }
  } 

  testWinner(room, msg) {
    if ( room in this.rooms && this.rooms[room]['gameInProgress'] ){
      let game = this.rooms[room]['game'];
      if (msg.author != game.currentArtist() && msg.text.trim().toLowerCase() == game.curWord) {
        console.log(`${msg.author} wins!`);
        game.endTurn(msg.author);
      }
    }
  }

  getGame(room) {
    console.log(`getting game in room ${room}`)
    if ( room in this.rooms && this.rooms[room]['gameInProgress'] ) {
      return this.rooms[room]['game'].gameState;
    }
    return emptyGame;
  }

  updateGame(room, stateChange) {
    if ( room in this.rooms ) {
      this.rooms[room]['game'].setState(stateChange);
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
    this.gameState = {
      gameInProgress: false,
      players: [],
      word : '',
      artist: 'doesntmatter',
      timeLeft: -1
    };
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

module.exports = (io, rooms)  => new DMTManager(io, rooms);