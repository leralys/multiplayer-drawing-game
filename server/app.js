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

const connected = (socket) => {
    socket.on('newPlayer', (data) => {
        const msg = playersController.addNewPlayer(data);
        if (!msg.status) {
            // username taken
            io.to(data.socketId).emit('notifyPlayer', msg);
        } else {
            //username doesn't exist - may connect
            clientNum++;
            // send a player to a room where only two players can be
            let roomNo = Math.round(clientNum / 2);
            socket.join(roomNo);
            // notify a user that he is connected successfully , and his roomNo
            io.to(data.socketId).emit('notifyPlayer', msg, roomNo);
        }
    });
    socket.on('disconnecting', () => {
        // socket.rooms is a Set which contains at least the socket ID
        // notify other players in the room upon leaving the room
        for (let room of socket.rooms) {
            const leavingPlayer = playersController.getDisconnectingPlayer(socket.id);
            if (leavingPlayer) {
                io.to(room).emit('notifyPlayer', leavingPlayer.username);
            }
        }
    });
    socket.on('disconnect', () => {
        // clientNum--; ???
        playersController.deletePlayer(socket.id);
    });
}

// io.on('connection', (socket) => {
//     // console.log(socket.id);
//     io.emit('serverToClient', 'hello from the server');
//     socket.on('clientToServer', msg => {
//         console.log(msg);
//     });
//     socket.on('clientToClient', msg => {
//         socket.broadcast.emit('serverToClient', msg);
//     });
//     socket.on('disconnectMe', msg => {
//         console.log(msg);
//     });
//     socket.on('disconnect', () => {
//         console.log(socket.id + ' left');
//     });
// });

io.on('connection', connected);

// app.get('/', (req, res) => {
//     res.send('hello world');
// });

httpServer.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
});