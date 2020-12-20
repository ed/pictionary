'use strict'
let io

const createMessage = require('../utils/MessageUtils').createMessage

const words = [
  'alligator',
  'ant',
  'bear',
  'bee',
  'bird',
  'camel',
  'cat',
  'cheetah',
  'chicken',
  'chimpanzee',
  'cow',
  'crocodile',
  'deer',
  'dog',
  'dolphin',
  'duck',
  'eagle',
  'elephant',
  'fishfly',
  'fox',
  'frog',
  'giraffe',
  'goat',
  'goldfish',
  'hamster',
  'hippopotamus',
  'horse',
  'kangaroo',
  'kitten',
  'leopard',
  'lion',
  'lizard',
  'lobster',
  'monkey',
  'octopus',
  'ostrich',
  'otter',
  'owl',
  'oyster',
  'panda',
  'parrot',
  'pelican',
  'pig',
  'pigeon',
  'porcupine',
  'puppy',
  'rabbit',
  'reindeer',
  'rhinoceros',
  'rooster',
  'scorpion',
  'seal',
  'shark',
  'sheep',
  'shrimp',
  'snail',
  'snake',
  'sparrow',
  'spider',
  'squid',
  'squirrel',
  'swallow',
  'swan',
  'tiger',
  'toad',
  'tortoise',
  'turtle',
  'vulture',
  'walrus',
  'weasel',
  'whale',
  'wolf',
  'zebraairport',
  'bank',
  'barber shop',
  'book store',
  'bowling alley',
  'bus stop',
  'church',
  'fire truck',
  'gas station',
  'hospital',
  'house',
  'library',
  'movie theater',
  'museum',
  'post office',
  'restaurant',
  'school',
  'mall',
  'supermarket',
  'train station',
  'apple',
  'banana',
  'cherry',
  'grapefruit',
  'grapes',
  'lemon',
  'lime',
  'melon',
  'orange',
  'peach',
  'pineapple',
  'plum',
  'strawberry',
  'watermelon',
  'drill',
  'hammer',
  'knife',
  'ice cube',
  'refrigerator',
  'swordfish',
  'shark',
  'shrimp',
  'lobster',
  'eel',
  'crab',
  'asparagus',
  'beans',
  'broccoli',
  'cabbage',
  'carrot',
  'celery',
  'corn',
  'cucumber',
  'eggplant',
  'green pepper',
  'lettuce',
  'onion',
  'peas',
  'potato',
  'pumpkin',
  'radish',
  'spinach',
  'sweet potato',
  'tomato',
  'turnip',
  'dufflebag',
  'suitcase',
  'jet',
  'vault',
  'ocean',
  'beach',
  'sunset',
  'lake',
  'pie',
  'cake',
  'candy',
  'chocolate',
  'cookie',
  'donut',
  'icecream',
  'muffin',
  'pie',
  'potato chips',
  'pudding',
  'sweet roll',
  'waterfall',
  'valley',
  'forest',
  'saw',
  'scissors',
  'screwdriver',
  'black board',
  'book',
  'bookcase',
  'bulletin board',
  'calendar',
  'chair',
  'chalk',
  'clock',
  'desk',
  'thanksgiving',
  'christmas',
  'halloween',
  "saint patrick's day",
  'mardi gras',
  'birthday',
  'sun',
  'moon',
  'earth',
  'space',
  'rocket',
  'scarf',
  'winter',
  'snowman',
  'fireplace',
  'dictionary',
  'eraser',
  'map',
  'notebook',
  'pen',
  'white ferrari',
  'whale',
  'guitar',
  'television',
  'kanye west',
  'yeezus',
  'blonde',
  'harambe',
  'bread',
  'dwight schrute',
  'water bottle',
  'smoothie',
  'sofa',
  'smoke',
  'sailing stock',
  'bubble gum',
  'naps'
]
const emptyGame = {
  gameInProgress: false,
  players: [],
  word: '',
  artist: 'doesntmatter',
  timeLeft: -1,
  turnStatus: 'none'
}

const emptyRoom = {
  game: null,
  gameInProgress: false,
  clients: []
}

const usersByRoom = (room) => {
  const root = io.of('/')
  const rooms = Array.from(root.adapter.rooms.get(room) ?? [])
  const sockets = root.sockets
  return rooms.map((socketId) => {
      return sockets.get(socketId).user
  })
}

class DMTManager {
  constructor(socketio, rooms) {
    rooms = rooms || {}
    this.rooms = {}
    for (let room in rooms) {
      this.addRoom(room)
    }
    io = socketio
  }

  addRoom(roomName, visibility = 'public') {
    this.rooms[roomName] = {
      game: null,
      gameInProgress: false,
      clients: [],
      visibility
    }
  }

  getRooms() {
    return Object.keys(this.rooms).reduce((previous, curRoom) => {
      previous[curRoom] = this.getRoom(curRoom)
      return previous
    }, {})
  }

  getPublicRooms() {
    return Object.keys(this.rooms).reduce((previous, curRoom) => {
      if (this.rooms[curRoom].visibility == 'public') {
        previous[curRoom] = this.getRoom(curRoom)
      }
      return previous
    }, {})
  }

  getRoom(room) {
    if (!(room in this.rooms)) {
      return null
    }
    let game = { ...emptyGame }
    let clients = usersByRoom(room)
    if (this.rooms[room].game != null) {
      game = this.rooms[room].game.gameState
      this.rooms[room].game.updatePlayers(clients)
    }

    return {
      displayWinners: this.rooms[room].displayWinners,
      winners: this.rooms[room].winners,
      clients,
      game
    }
  }

  newGame(room) {
    let players = usersByRoom(room)
    if (
      room in this.rooms &&
      this.rooms[room].gameInProgress == false &&
      players.length > 1
    ) {
      console.log(`game started in room ${room}`)
      let dmtGame = new DMT(players, room, (winners) =>
        this.endGame(room, winners)
      )
      this.rooms[room].game = dmtGame
      this.rooms[room].gameInProgress = true
      dmtGame.start()
    } else if (players.length < 2) {
      console.log(`game already started in room ${room}`)
    }
  }

  endGame(room, winners) {
    console.log(`end game in room ${room}`)
    if (room in this.rooms && this.rooms[room].gameInProgress) {
      this.rooms[room].gameInProgress = false
      if (winners && winners.length > 0) {
        this.rooms[room].displayWinners = true
        this.rooms[room].winners = winners
        let curRoom = this.getRoom(room)
        let rooms = this.getRooms()
        let roomData = {
          rooms,
          curRoom
        }
        io.sockets.in(room).emit('update room', roomData)
        this.rooms[room].displayWinners = false
        let roomDataAfter = {
          rooms: this.getRooms(),
          curRoom: this.getRoom(room)
        }
        setTimeout(
          () => io.sockets.in(room).emit('update room', roomDataAfter),
          10000
        )
      }
    }
  }

  testWinner(room, msg) {
    if (room in this.rooms && this.rooms[room].gameInProgress) {
      return this.rooms[room].game.testWord(
        msg.author,
        msg.text.trim().toLowerCase()
      )
    } else {
      return false
    }
  }

  getGame(room) {
    console.log(`getting game in room ${room}`)
    if (room in this.rooms && this.rooms[room].gameInProgress) {
      return this.rooms[room].game.gameState
    }
    return { ...emptyGame }
  }

  updateGame(room, stateChange) {
    if (room in this.rooms) {
      this.rooms[room].game.setState(stateChange)
    }
  }
}

class DMT {
  constructor(players, room, endGame) {
    this.pointsForGuesser = [3, 2, 1]
    this.pointsForArtist = 2
    this.correctGuessers = 0
    this.room = room
    this.players = players.reduce((previous, curPlayer) => {
      previous[curPlayer] = {
        points: 0,
        pointsThisTurn: 0
      }
      return previous
    }, {})
    this.playerOrder = this.shufflePlayers(players)
    this.endGame = endGame
    this.curArtist = 0
    this.curWord = 'NONE'
    this.secondsPerTurn = 60
    this.numRounds = 2
    this.curRound = 1
    this.gameState = { ...emptyGame }
  }

  updatePlayers(newPlayers) {
    for (let player in this.players) {
      if (newPlayers.indexOf(player) <= -1) this.removePlayer(player)
    }
    for (let i = 0; i < newPlayers.length; i++) {
      if (!(newPlayers[i] in this.players)) this.addPlayer(newPlayers[i])
    }
  }

  sendNotification(text) {
    io.sockets.in(this.room).emit('notification', text)
  }

  removePlayer(player) {
    this.sendNotification(`${player} left the room`)
    if (player === this.currentArtist()) {
      this.endTurn()
      this.sendNotification('artist left -- turn ended')
    }
    this.playerOrder.splice(this.playerOrder.indexOf(player), 1)
    delete this.players[player]
    if (this.numPlayers() < 2) {
      this.sendNotification('not enough players left in the room -- game ended')
      this.endGame()
      clearTimeout(this.gameTimer)
      this.setState({ gameInProgress: false })
    }
  }

  addPlayer(player) {
    this.sendNotification(`${player} joined the room`)
    this.players[player] = {
      points: 0,
      pointsThisTurn: 0
    }
    this.playerOrder.push(player)
  }

  numPlayers() {
    return this.playerOrder.length
  }

  start() {
    this.resetInterval()
    this.startTurn()
  }

  resetInterval() {
    clearInterval(this.gameTimer)
    this.gameTimer = setInterval(() => this.updateGame(), 1000)
  }

  testWord(player, guess) {
    const wordNoSpaces = this.curWord.replace(/ /g, '')
    const guessNoSpaces = guess.replace(/ /g, '')
    if (
      player !== this.currentArtist() &&
      guessNoSpaces.includes(wordNoSpaces)
    ) {
      this.allocatePoints(player)
      return true
    }
    return false
  }

  allocatePoints(player) {
    let guesserPoints =
      this.correctGuessers < this.pointsForGuesser.length
        ? this.pointsForGuesser[this.correctGuessers]
        : this.pointsForGuesser[this.pointsForGuesser.length - 1]
    if (this.players[player].pointsThisTurn === 0) {
      this.sendNotification(`${player} guessed the word`)
      this.resetInterval()
      this.players[player].points += guesserPoints
      this.players[player].pointsThisTurn += guesserPoints
      this.correctGuessers++
      if (this.players[this.currentArtist()].pointsThisTurn === 0) {
        this.players[this.currentArtist()].points += this.pointsForArtist
        this.players[
          this.currentArtist()
        ].pointsThisTurn += this.pointsForArtist
      }
      if (this.correctGuessers >= this.numPlayers() - 1) {
        this.endTurn()
      } else {
        let timeLeft = Math.min(this.gameState.timeLeft, 10)
        this.sendNotification(`${timeLeft} seconds left`)
        this.setState({
          players: this.players,
          timeLeft,
          totalTime:
            this.gameState.timeLeft < 10 ? this.gameState.totalTime : 10
        })
      }
    }
  }

  endRound() {
    if (this.curRound < this.numRounds) {
      this.curRound++
      this.curArtist = 0
      this.startTurn()
    } else {
      let props = Object.keys(this.players).map(function(playerName) {
        return { name: playerName, score: this[playerName].points }
      }, this.players)
      props.sort(function(p1, p2) {
        return p2.score - p1.score
      })
      let winners = props.slice(0, 3)
      this.endGame(winners || [])
      clearTimeout(this.gameTimer)
      this.setState({ gameInProgress: false })
    }
  }

  startTurn() {
    this.correctGuessers = 0
    this.curWord = words[Math.floor(Math.random() * words.length) + 0]
    for (let player in this.players) {
      this.players[player].pointsThisTurn = 0
    }
    this.setState({
      gameInProgress: true,
      turnStatus: 'starting',
      players: this.players,
      word: this.curWord,
      artist: this.currentArtist(),
      timeLeft: 2,
      totalRounds: this.numRounds,
      round: this.curRound,
      totalTime: this.secondsPerTurn,
      canvasData: null
    })
  }

  endTurn() {
    this.setState({ turnStatus: 'finished', timeLeft: 10, totalTime: 10 })
  }

  updateGame() {
    if (this.gameState['timeLeft'] > 0) {
      this.setState({ timeLeft: this.gameState.timeLeft - 1 })
    } else if (this.gameState.turnStatus === 'drawing') {
      this.endTurn()
    } else if (this.gameState.turnStatus === 'starting') {
      this.setState({ turnStatus: 'drawing', timeLeft: this.secondsPerTurn })
    } else if (this.gameState.turnStatus === 'finished') {
      this.curArtist++
      if (this.curArtist >= this.numPlayers()) {
        this.endRound()
      } else {
        this.startTurn()
      }
    }
  }

  currentArtist() {
    return this.playerOrder[this.curArtist]
  }

  shufflePlayers(players) {
    for (var i = players.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1))
      var temp = players[i]
      players[i] = players[j]
      players[j] = temp
    }
    return players
  }

  setState(newStates) {
    for (let key in newStates) {
      this.gameState[key] = newStates[key]
    }
    io.sockets.in(this.room).emit('update game', this.gameState)
  }
}

module.exports = (io, rooms) => new DMTManager(io, rooms)
