const app = require('express')();
const server = require('http').createServer(app);
const io = require("socket.io")(server);

let clientNo = 0;
let testRooms = [];
let roomInTest = [];

io.on('connection', socket => {
  console.log('Server IO say: user connected')

  // Сокеты testVS
  socket.on('roomCreated', (data)=> {
      let error = false
      if (!data.userAuth) return socket.emit('errorFromServer', 'Вы не авторизировались')
      testRooms.forEach( el=> {
        if (el.userName == data.userName) {
          error = true
          return socket.emit('errorFromServer', 'Нельзя создать больше одной комнаты')
        } else if (el.roomName == data.roomName) {
          error = true
          return socket.emit('errorFromServer', 'Название комнаты уже занято')
        }
      })
      if (!error) {
        testRooms.push(data)
        io.emit('roomsCreateFromServer', data)
      }
  })
  
  socket.on('roomDelete', (roomIndex)=> {
    testRooms.splice(roomIndex, 1)
    io.emit('roomsDeleteFromServer', roomIndex)
  })
  
  socket.on('joinedInRoom', data => {
    if (!data.userAuth) return socket.emit('errorFromServer', 'Вы не авторизировались')
    if (testRooms[data.roomIndex].userName == data.joinedUserName) return socket.emit('errorFromServer', 'Вы не можете войти в свою комнату')
    testRooms[data.roomIndex].joinedUserName = data.joinedUserName
    testRooms[data.roomIndex].joinedUserImage = data.joinedUserImage
    io.emit('joinedRoomFromServer', data)
  })

  socket.on('userConnectedInTestPVP', () => {
    socket.emit('roomsFromServer', testRooms)
  })


  // Сокеты testVSroom
  socket.on('testStarted', (i)=> {
        if (!roomInTest[i]) {
          roomInTest[i] = testRooms[i]
        }
        
  })

  socket.on('userJoinRoom', (data)=> {
    let serverMsg = ''
    if (data.roomIndex == null || !roomInTest[data.roomIndex]) {
      serverMsg = 'Не верный номер комнаты'
      return socket.emit('serverErr', serverMsg)
    } else if (roomInTest[data.roomIndex].playerInGameCount > 2) {
      serverMsg = 'Вы не можете войти в данную комнату'
      return socket.emit('serverErr', serverMsg)
    } else if (data.userName == roomInTest[data.roomIndex].userName || data.userName == roomInTest[data.roomIndex].joinedUserName) {
      console.log('Server IO say: user join in a room')
      socket.join(data.roomIndex)
      roomInTest[data.roomIndex].playerInGameCount++
    } else {
      serverMsg = 'Незивестная ошибка'
      return socket.emit('serverErr', serverMsg)
    }
  })
  
  socket.on('clientKeyPressed', data => {
   socket.to(data.room).broadcast.emit("serverKey", { key : data.key, userName: data.userName })
  })

  socket.on('userDisconnect', (i)=> {
    console.log('Server IO say: user leave in a room')
    if (roomInTest[i]) {
      roomInTest[i].playerInGameCount--
      if (roomInTest[i].playerInGameCount == 0) {
          roomInTest.splice(i, 1)
      }
    }
  })
})


const port = process.env.PORT || 3001
server.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
