import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
// import cors from 'cors';
import { config } from 'dotenv';

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

io.on("connection", (socket) => {
    // console.log(socket.id);
    io.emit('serverToClient', 'hello from the server');
    socket.on('clientToServer', msg => {
        console.log(msg);
    });
    socket.on('clientToClient', msg => {
        socket.broadcast.emit('serverToClient', msg);
    });
    socket.on('disconnectMe', msg => {
        console.log(msg);
    });
    socket.on('disconnect', () => {
        console.log(socket.id + ' left');
    });
});


app.get('/', (req, res) => {
    res.send('hello world');
});

httpServer.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
});