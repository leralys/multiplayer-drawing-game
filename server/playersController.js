const players = [];

// checks if a user is in the players array by a user name (true/false)
const findUsername = username => {
    return players.some(p => p.username === username);
}
// finds the index of a specific user in the players array by the socketId
const findIndx = socketId => {
    return players.findIndex(p => p.socketId === socketId);
}
// finds the user in the players array by the socket id
const findUserById = socketId => {
    return players.find(p => p.socketId === socketId);
}

class PlayersController {
    addNewPlayer(player) {
        let msg = {};
        if (!findUsername(player.username)) {
            players.push(player);

            console.log('new player is online now:', `username: ${player.username}, socketId: ${player.socketId}`);

            msg = { status: true, text: 'successfully connected' };
        } else {
            msg = { status: false, text: 'username taken' };
        }
        return msg;
    }
    deletePlayer(socketId) {
        players.splice(findIndx(socketId), 1);
    }
    getDisconnectingPlayer(socketId) {
        if (findUserById(socketId)) {
            console.log(`${findUserById(socketId).username} is leaving`);
        }
        return findUserById(socketId);
    }
    addUserRoom(username, room) {
        let i = players.findIndex(p => p.username === username);
        players[i] = { ...players[i], room: room }
    }
    cleanTheRoom(room) {
        let indx = players.findIndex(p => p.room === room);
        players.splice(indx, 1);
    }
}


export default new PlayersController;