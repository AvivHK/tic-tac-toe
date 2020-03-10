const express = require('express')
const path = require('path');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const port = 3000

let rooms = 0;

app.use(express.static('.'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'game.html'));
});

io.on('connection', (socket) => {
    console.log("Player Connected!")
    socket.on('createGame', (data) => {
        socket.join(`${++rooms}`);
        socket.emit('newGame', { name: data.name, room: `${rooms}` });
        console.log("** Room " + rooms + " created by " + data.name + " **" )
    });

    socket.on('joinGame', function (data) {
        let room = io.nsps['/'].adapter.rooms[data.room];
        if (room && room.length === 1) {
            socket.join(data.room);
            socket.broadcast.to(data.room).emit('player1', {});
            socket.emit('player2', { name: data.name, room: data.room })
            console.log("-- " +  data.name + " is connected to room: " + data.room+ " --")
        } else {
            socket.emit('err', { message: 'Sorry, The room is full!' });
        }
    });


    socket.on('playTurn', (data) => {
        socket.broadcast.to(data.room).emit('turnPlayed', {
            tile: data.tile,
            room: data.room
        });
    });

});

let server = app.listen(process.env.PORT || port, function(){
    console.log('server running on port ' + port)
});