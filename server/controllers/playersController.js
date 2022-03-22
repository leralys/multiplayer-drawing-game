const players = [];


// CALBACK FUNCTIONS


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


// CONTROLLER METHODS


class PlayersController {
    addNewPlayer(player) {
        let res = {};
        if (!findUsername(player.username)) {
            players.push(player);

            res = { status: true, text: 'successfully connected' };

            console.log('new player is online now:', `username: ${player.username}, socketId: ${player.socketId}`);
            console.log(players);
        } else {
            res = { status: false, text: 'username taken' };
            console.log(players);
        }
        return res;
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