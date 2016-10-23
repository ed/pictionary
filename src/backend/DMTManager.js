'use strict';
let io;

const createMessage = require('../utils/MessageUtils').createMessage;

const words = ['alligator','ant','bear','bee','bird','camel','cat','cheetah','chicken','chimpanzee','cow','crocodile','deer','dog','dolphin','duck','eagle','elephant','fishfly','fox','frog','giraffe','goat','goldfish','hamster','hippopotamus','horse','kangaroo','kitten','leopard','lion','lizard','lobster','monkey','octopus','ostrich','otter','owl','oyster','panda','parrot','pelican','pig','pigeon','porcupine','puppy','rabbit','reindeer','rhinoceros','rooster','scorpion','seal','shark','sheep','shrimp','snail','snake','sparrow','spider','squid','squirrel','swallow','swan','tiger','toad','tortoise','turtle','vulture','walrus','weasel','whale','wolf','zebraairport','bank','barber shop','book store','bowling alley','bus stop','church','fire truck','gas station','hospital','house','library','movie theater','museum','post office','restaurant','school','mall','supermarket','train station','apple','banana','cherry','grapefruit','grapes','lemon','lime','melon ','orange','peach','pineapple','plum','strawberry','watermelon','drill','hammer','knife','ice cube','refrigerator','swordfish','shark','shrimp','lobster','eel','crab','asparagus','beans','broccoli','cabbage','carrot','celery','corn','cucumber','eggplant','green pepper','lettuce','onion','peas','potato','pumpkin','radish','spinach','sweet potato','tomato','turnip','dufflebag','suitcase','jet','vault','ocean','beach','sunset','lake','pie','cake','candy','chocolate','cookie','donut',' icecream','muffin','pie','potato chips ','pudding','sweet roll','waterfall','valley','forest','saw','scissors','screwdriver','black board',' book','bookcase','bulletin board',' calendar','chair','chalk','clock','desk','thanksgiving','christmas','halloween','saint patrick\'s day','mardi gras','birthday','sun','moon','earth','space','rocket','scarf','winter','snowman','fireplace','dictionary','eraser','map','notebook','pen','white ferrari', 'whale', 'guitar', 'television', 'kanye west', 'yeezus', 'blonde', 'harambe', 'bread', 'dwight schrute', 'water bottle', 'smoothie', 'sofa', 'smoke', 'menage on my birthday', 'sailing stock', 'kpop', 'bubble pop', 'bubble gum', 'naps'];
const emptyGame = {
  gameInProgress: false,
  players: [],
  word : '',
  artist: 'doesntmatter',
  timeLeft: -1,
  turnStatus: 'none'
};

const emptyRoom = {
  game: null,
  gameInProgress: false,
  clients: [],
};

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
    let clients = usersByRoom(room);
    console.log(clients)
    if (this.rooms[room].game != null) {
      game = this.rooms[room].game.gameState;
      this.rooms[room].game.updatePlayers(clients);
    }

    return {
      clients,
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
    else if (players.length < 2) {
      console.log(`game already started in room ${room}`)
    }
  }

  endGame(room) {
    console.log(`end game in room ${room}`)
    if ( room in this.rooms && this.rooms[room].gameInProgress ){
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
    },{});
    this.playerOrder = this.shufflePlayers(players);
    this.endGame = endGame;
    this.curArtist = 0;
    this.curWord = 'NONE';
    this.secondsPerTurn = 60;
    this.numRounds = 2;
    this.curRound = 1;
    this.gameState = {...emptyGame};
  }

  updatePlayers(newPlayers) {
    for (let player in this.players) {
      if (newPlayers.indexOf(player) <= -1) this.removePlayer(player);
    }
    for (let i = 0; i < newPlayers.length; i++) {
      if ( !(newPlayers[i] in this.players) ) this.addPlayer(newPlayers[i]);
    }
  }

  removePlayer(player) {
    if (player === this.currentArtist()) {
      this.endTurn();
    }
    this.playerOrder.splice(this.playerOrder.indexOf(player),1);
    delete this.players[player];
    if (this.numPlayers() < 1) {
      this.endGame();
      clearTimeout(this.gameTimer);
      this.setState({ gameInProgress: false });
    }
  }

  addPlayer(player) {
    this.players[player] = {
      points: 0,
      pointsThisTurn: 0,
    }
    this.playerOrder.push(player);
  }

  numPlayers() {
    return this.playerOrder.length;
  }

  start() {
    this.gameTimer = setInterval(() => this.updateGame(), 1000);
    this.startTurn();
  }

  testWord(player, guess) {
    if (player !== this.currentArtist() && guess === this.curWord) {
      this.allocatePoints(player);
      let author = 'GAME';
      let text = `${player} guessed the word`
      let msg = createMessage(text, author);
      msg.color = 'red';
      io.sockets.in(this.room).emit('update chat', msg);
      this.setState({
        players: this.players,
        timeLeft: Math.min(this.gameState.timeLeft, 10)
      });
      return true;
    }
    return false;
  }

  allocatePoints(player) {
    let guesserPoints = this.correctGuessers < this.pointsForGuesser.length ?
      this.pointsForGuesser[this.correctGuessers] :
      this.pointsForGuesser[this.pointsForGuesser.length-1];
    if (this.players[player].pointsThisTurn === 0) {
      this.players[player].points += guesserPoints;
      this.players[player].pointsThisTurn += guesserPoints;
      this.correctGuessers++;
      if (this.players[this.currentArtist()].pointsThisTurn === 0) {
        this.players[this.currentArtist()].points += this.pointsForArtist;
        this.players[this.currentArtist()].pointsThisTurn += this.pointsForArtist;
      }
      if (this.correctGuessers >= this.numPlayers() - 1) {
        this.endTurn();
      }
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
      clearTimeout(this.gameTimer);
      this.setState({ gameInProgress: false });
    }
  }

  startTurn() {
    this.correctGuessers = 0;
    this.curWord = words[Math.floor(Math.random()*words.length)+0];
    for (let player in this.players) {
      this.players[player].pointsThisTurn = 0;
    }
    this.setState({
      gameInProgress: true,
      turnStatus: 'starting',
      players: this.players,
      word: this.curWord,
      artist: this.currentArtist(),
      timeLeft: 4,
      totalRounds: this.numRounds,
      round: this.curRound,
      timePerTurn: this.secondsPerTurn,
      canvasData: null
    });
  }

  endTurn() {
    this.setState({ turnStatus: 'finished', timeLeft: 10 });
  }

  updateGame() {
    if (this.gameState['timeLeft'] > 0) {
      this.setState({ timeLeft : this.gameState.timeLeft-1 })
    }
    else if (this.gameState.turnStatus === 'drawing') {
      this.endTurn();
    }
    else if (this.gameState.turnStatus === 'starting') {
      this.setState({ turnStatus: 'drawing', timeLeft: this.secondsPerTurn });
    }
    else if (this.gameState.turnStatus === 'finished') {
      this.curArtist++;
      if (this.curArtist >= this.numPlayers()) {
        this.endRound();
      }
      else {
        this.startTurn();
      }
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
    io.sockets.in(this.room).emit('update game', this.gameState);
  }
}

module.exports = (io, rooms)  => new DMTManager(io, rooms);
