const express = require('express')
const app = express()
const server = require('http').Server(app)
app.set('view engine', 'ejs')
app.use(express.static('public'))
const{v4: uuidv4} = require('uuid')
const io = require('socket.io')(server, {cors: {origin: '*'}})
const {ExpressPeerServer} = require('peer')
const peerServer = ExpressPeerServer(server, {debug: true})
app.use('/peerjs', peerServer)
app.get('/', (req, res)=>{
    res.redirect(`/${uuidv4()}`)
})
app.get('/:room', (req, res) => {
    res.render('index', {roomid: req.params.room})
})

io.on('connection', (socket) => {
    socket.on('join-room', (roomid, userid, username)=>{
        socket.join(roomid)
        socket.on('message', (message) => {
            io.to(roomid).emit('create_message', message, username)
        })
    })
})
server.listen(5500)
