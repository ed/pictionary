'use strict';

var DMTManager = require('./DMTManager');

let mainRoom = 'draw_stuff';
let colors = ['#FF0000','#800000','#FFFF00','#808000','#008080','#F08080','#DAF7A6','#581845'];
let users = {};
let rooms = {'room2': [], 'room3' : []};
rooms[mainRoom] = [];

module.exports = (app, io) => {
	let dmtManager = DMTManager(io, rooms);

  const usersByRoom = (room) => {
    let sockets = io.sockets.adapter.rooms[room].sockets;
    return Object.keys(sockets).map((socketId) => {
      var clientSocket = io.sockets.connected[socketId];
      return clientSocket.user;
    });
  }

  const leaveRooms = (socket, rooms) => {
    for (let room in rooms) {
      socket.leave(room);
      updateRoom(room);
    }
  }

  const updateRoom = (roomName) => {
    let curRoom = dmtManager.getRoom(roomName);
    let rooms = dmtManager.getRooms();
    let roomData = {
      rooms,
      curRoom
    }
    console.log(roomData)
    io.sockets.in(roomName).emit('update room', roomData);
  }
  
  io.on('connection', (socket) => { 

    socket.on('join room', (roomName) => {
      console.log(socket.user + ' tried joining: ' + roomName);
      if (roomName in dmtManager.getRooms()) {
        console.log(socket.user + ' joined room: ' + roomName);
        leaveRooms(socket,{...socket.rooms});
        socket.join(roomName);
        socket.curRoom = roomName;
        console.log(socket.rooms)
        updateRoom(socket.curRoom);
      } 
    });

    socket.on('chat msg', (msg) => {
      console.log(`${socket.user} sent ${msg.text} to thread: ${socket.curRoom}`);
      console.log(socket.rooms)
      console.log(usersByRoom(socket.curRoom))    
      if ( !dmtManager.testWinner(socket.curRoom,msg) ) {
        msg['color'] = socket.color;
        io.sockets.in(socket.curRoom).emit('update chat', msg);
      }
    });

    socket.on('client update canvas', (canvasData) => {
      dmtManager.updateGame(socket.curRoom,{canvasData});
      socket.broadcast.to(socket.curRoom).emit('update canvas', canvasData);
    });

    socket.on('start game', () => {
      let players = usersByRoom(socket.curRoom);
      dmtManager.newGame(socket.curRoom,players);
    });

    socket.on('add user', (username) => {
      socket.user = username;
      socket.color = colors[Math.floor(Math.random()*colors.length)];
    });
    
  });


  app.post('/register', (req, res) => {
    console.log(req.body);
    res.send('hello world');
  });

  app.get('/roomData/roomList', (req, res) => {
    console.log('getting room LIST')
    let roomList = dmtManager.getRooms();
    console.log(roomList)
    res.send(roomList);
  });

  app.post('/roomData/newRoom', (req, res) => {
    let roomName = req.body.roomName;
    let rooms = dmtManager.getRooms();

    if (roomName in rooms) {
      res.send({
      	error: '??'
      })
    }
    else {
      dmtManager.addRoom(roomName);
      rooms = dmtManager.getRooms();

      res.send({
      	rooms
      })
    }
  });

  app.get('/roomData/room/:roomName', (req, res) => {
    let room = req.params.roomName;
    let roomData = dmtManager.getRoom(room);
    if (roomData != null) {
      res.send({
        room: roomData
      });
    }
    else {
      res.send({
        error: true
      });
    }
  });
}