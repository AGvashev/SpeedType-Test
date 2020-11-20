const app = require('express')();
const server = require('http').createServer(app);
const io = require("socket.io")(server);

io.on('connection', socket=> {
  console.log('Server say: user connected')
})

const port = process.env.PORT || 3001
server.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
