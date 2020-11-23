const app = require('express')();
const server = require('http').createServer(app);
const io = require("socket.io")(server);

let clientNo = 0;
let testRooms = [];

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
    let error = false
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
  socket.on('userJoinRoom', (roomIndex)=> {
    console.log('Server IO say: user join in a room')
    socket.join(roomIndex)
    socket.emit('serverMsg', roomIndex)
  })
  

  socket.on('clientKeyPressed', data => {
   socket.to(data.room).broadcast.emit("serverKey", { key : data.key, userName: data.userName })
  })

  socket.on('userDisconnect', ()=> {
    console.log('Server IO say: user leave in a room')
    clientNo--;
  })
})


const port = process.env.PORT || 3001
server.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
