const app = require('express')();
const server = require('http').createServer(app);
const io = require("socket.io")(server);

let clientNo = 0;

io.on('connection', socket => {
  console.log('Server IO say: user connected')
  
  socket.on('userConnected', ()=> {
    console.log('Server IO say: user join in a room')
    clientNo++;
    socket.join(Math.round(clientNo/2))
    socket.emit('serverMsg', Math.round(clientNo/2))
  })
  

  socket.on('keyPressedOnServer', data => {
    console.log('keyPressedOnServer пришел' + data.key)
    socket.to(data.room).broadcast.emit("keyPressedFromServer", data.key)
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
