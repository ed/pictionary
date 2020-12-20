'use strict'

const { customAlphabet } = require('nanoid/non-secure')
var DMTManager = require('./DMTManager')

const nanoid = customAlphabet(
  '1234567890abcdefghijklmnopqrstuvxyzABCDEFGHIJKLMNOPQRSTUVXYZ',
  4
)

let mainRoom = 'draw_stuff'
let colors = [
  '#FF68B0',
  '#D05860',
  '#F0E890',
  '#80FFD0',
  '#FFE0C0',
  '#FF0000',
  '#FF00E0',
  '#B0E0E0',
  '#B08800',
  '#000000',
  '#006000',
  '#FF8800',
  '#000080'
]
let users = {}
let rooms = { room2: [], room3: [] }
rooms[mainRoom] = []

module.exports = (app, io) => {
  let dmtManager = DMTManager(io, rooms)

  const usersByRoom = (room) => {
    const root = io.of('/')
    const rooms = Array.from(root.adapter.rooms.get(room) ?? [])
    const sockets = root.sockets
    return rooms.map((socketId) => {
      return sockets.get(socketId).user
    })
  }

  const leaveRooms = (socket, rooms) => {
    for (let room in rooms) {
      socket.leave(room)
      updateRoom(room)
    }
  }

  const updateRoom = (roomName) => {
    let curRoom = dmtManager.getRoom(roomName)
    let rooms = dmtManager.getRooms()
    let roomData = {
      rooms,
      curRoom
    }
    io.sockets.in(roomName).emit('update room', roomData)
  }

  io.on('connection', (socket) => {
    socket.on('disconnect', () => {
      socket.leave(socket.curRoom)
      updateRoom(socket.curRoom)
    })

    socket.on('join room', (roomName) => {
      if (roomName in dmtManager.getRooms() && socket.curRoom !== roomName) {
        console.log(socket.user + ' joined room: ' + roomName)
        let rooms = { ...socket.rooms }
        delete rooms[roomName]
        leaveRooms(socket, rooms)
        socket.join(roomName)
        socket.curRoom = roomName
      }
      updateRoom(socket.curRoom)
    })

    socket.on('chat msg', (msg) => {
      console.log(
        `${socket.user} sent ${msg.text} to thread: ${socket.curRoom}`
      )
      if (!dmtManager.testWinner(socket.curRoom, msg)) {
        msg['color'] = socket.color
        io.sockets.in(socket.curRoom).emit('update chat', msg)
      }
    })

    socket.on('update canvas', (canvasData) => {
      dmtManager.updateGame(socket.curRoom, { canvasData })
      socket.broadcast.to(socket.curRoom).emit('update canvas', canvasData)
    })

    socket.on('stroke', (strokeData) => {
      if (strokeData.action !== 'noop') {
        socket.broadcast.to(socket.curRoom).emit('stroke', strokeData)
      }
      if (strokeData.action === 'end') {
        dmtManager.updateGame(socket.curRoom, {
          canvasData: strokeData.canvasData
        })
      }
    })

    socket.on('start game', () => {
      let players = usersByRoom(socket.curRoom)
      dmtManager.newGame(socket.curRoom, players)
    })

    socket.on('add user', (username) => {
      socket.user = username
      socket.color = colors[Math.floor(Math.random() * colors.length)]
    })
  })

  app.get('/room/list', (req, res) => {
    let roomList = dmtManager.getPublicRooms()
    res.send(roomList)
  })

  app.post('/room/new', (req, res) => {
    let { roomName, visibility } = req.body
    let rooms = dmtManager.getRooms()
    console.log(JSON.stringify(req.body))

    if (visibility == 'public') {
      if (roomName in rooms) {
        res.send({
          error: 'Room already exists'
        })
      } else {
        dmtManager.addRoom(roomName)
        rooms = dmtManager.getPublicRooms()

        res.send({
          rooms,
          roomName
        })
      }
    } else {
      var nameExists = true
      while (nameExists) {
        roomName = nanoid(4)
        if (!Boolean(rooms && rooms[roomName])) {
          nameExists = false
        }
      }

      dmtManager.addRoom(roomName, visibility)
      rooms = dmtManager.getPublicRooms()
      res.send({
        rooms,
        roomName
      })
    }
  })

  app.get('/room/:roomName', (req, res) => {
    let room = req.params.roomName
    let roomData = dmtManager.getRoom(room)
    if (roomData != null) {
      res.send({
        room: roomData
      })
    } else {
      res.send({
        error: true
      })
    }
  })
}
