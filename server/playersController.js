const players = [];

const findUsername = username => {
    return players.some(p => p.username === username);
}

const findIndx = socketId => {
    return players.findIndex(p => p.socketId === socketId);
}

const findUserById = socketId => {
    return players.find(p => p.socketId === socketId);
}

class PlayersController {
    addNewPlayer(player) {
        let msg = {};
        if (!findUsername(player.username)) {
            players.push(player);
            console.log('new player is online now:',
                `username: ${player.username},
            socketId: ${player.socketId}`);
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
}


export default new PlayersController;

