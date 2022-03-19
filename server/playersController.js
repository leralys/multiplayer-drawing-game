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
        // console.log('all players:', players);
        // console.log('num players:', players.length);
        return msg;
    }
    deletePlayer(socketId) {
        // console.log('num players before:', players.length);
        players.splice(findIndx(socketId), 1);
        // console.log('num players after:', players.length);
    }
    getDisconnectingPlayer(socketId) {
        if (findUserById(socketId)) {
            console.log(`${findUserById(socketId).username} is leaving`);
        }
        return findUserById(socketId);
    }
}


export default new PlayersController;

