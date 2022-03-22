import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { config } from 'dotenv';
import players from './controllers/playersController.js';
import game from './controllers/gameController.js';

const PORT = process.env.PORT || 8080;

config();

const app = express();
app.use(cors());
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: ['http://localhost:3000'],
        credentials: true
    }
});


// GLOBAL VARIABLE TO DIRECT PLAYERS TO ROOM
let clientNum = 0;

const connected = socket => {
    socket.on('newPlayer', userData => {
        const isAdded = game.onNewPlayer(userData);
        if (!isAdded.res.status) {
            io.to(userData.socketId).emit('notifyPlayer', isAdded.res);
        } else {
            io.to(userData.socketId).emit('notifyPlayer', isAdded);
        }
    });
    // when second player comes to a room, notify the first one that the game starts
    socket.on('startNewGame', ({ roomNo, username }) => {
        socket.to(roomNo).emit('startNewGame', { startNewGame: true });
        //and send info about the second player the room
        socket.to(roomNo).emit('opponentInfo', username);
    });
    // player (first one) sends his roomNo and username to the opponent (second player)
    socket.on('userInfo', ({ username, roomNo }) => {
        roomNo && socket.to(roomNo).emit('opponentInfo', username);
    });
    // player sends image + info about it, send it to the other player in the room
    socket.on('image', ({ dataURL, roomNo, selectedWord }) => {
        socket.to(roomNo).emit('guessTheWord', { dataURL, selectedWord });
    });
    // update opponents score
    socket.on('updateScore', ({ score, roomNo }) => {
        socket.to(roomNo).emit('opponentScore', score);
    });
    // leaveGame button was clicked - delete the other player from the room
    socket.on('leaveGame', ({ username, roomNo }) => {
        socket.to(roomNo).emit('leavingPlayer', username);
        players.deletePlayer(socket.id);
        players.cleanTheRoom(roomNo);
    });
    // notify other player when leaving the room
    socket.on('disconnecting', () => {
        console.log('disconnected', socket.id);
        // socket.rooms is a Set which contains at least the socket ID
        // let rooms = Array.from(socket.rooms);
        // const leavingPlayer = players.getDisconnectingPlayer(socket.id);
        // if (leavingPlayer && rooms.length > 1) {
        //     // send the the of the user who is leaving
        //     io.to(rooms[1]).emit('leavingPlayer', leavingPlayer.username);
        //     // clean the room - the game must restart
        //     players.cleanTheRoom(rooms[1]);
        // }
    });
    socket.on("connect_error", () => {

    })
    socket.on('disconnect', () => {
        players.deletePlayer(socket.id);
    });
}
io.on('connection', connected);

httpServer.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
});