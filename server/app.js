import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
// import cors from 'cors';
import { config } from 'dotenv';
import playersController from './playersController.js';

const PORT = process.env.PORT || 8080;

config();
// app.use(cors());

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: ['http://localhost:3000'],
        credentials: true
    }
});

let clientNum = 0;

const connected = socket => {
    socket.on('newPlayer', data => {
        const msg = playersController.addNewPlayer(data);
        if (!msg.status) {
            // username taken - notify player
            io.to(data.socketId).emit('notifyPlayer', { msg });
        } else {
            //username doesn't exist - may connect
            clientNum++;
            // send a player to a room where only two players can be
            let roomNo = Math.round(clientNum / 2);
            socket.join(roomNo);
            let turn = 0;
            // first player in a room
            clientNum % 2 === 1 ? turn = 1 : turn = 2;
            // notify a player that he is connected successfully, his roomNo, and his turn
            io.to(data.socketId).emit('notifyPlayer', { msg, roomNo, turn });
        }
    });
    // when second player comes to a room, notify the first one that the game starts
    socket.on('startNewGame', ({ roomNo, username }) => {
        socket.to(roomNo).emit('startNewGame', { startNewGame: true });
        //and send info about the second user the room
        socket.to(roomNo).emit('opponentInfo', username);
    });
    socket.on('some event', ({ username, roomNo }) => {
        // socket.to(roomNo).emit('getOpponent ', username);
        roomNo && socket.to(roomNo).emit('opponentInfo', username);
    });
    // notify other players when leaving the room
    socket.on('disconnecting', () => {
        // socket.rooms is a Set which contains at least the socket ID
        for (let room of socket.rooms) {
            const leavingPlayer = playersController.getDisconnectingPlayer(socket.id);
            if (leavingPlayer) {
                io.to(room).emit('leavingPlayer', leavingPlayer.username);
            }
        }
    });
    socket.on('disconnect', () => {
        // clientNum--; ???
        playersController.deletePlayer(socket.id);
    });
}

io.on('connection', connected);

httpServer.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
});