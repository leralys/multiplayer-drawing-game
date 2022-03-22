import players from './playersController.js';

// GLOBAL VARIABLE TO DIRECT PLAYERS TO ROOM
let clientNum = 0;

// CONTROLLER METHODS


class GameController {
    onNewPlayer(userData) {
        let turn;
        let roomNo;
        const res = players.addNewPlayer(userData);
        if (!res.status) {
            // username taken
            return { res };
        } else {
            //username doesn't exist - may connect
            clientNum++;
            // room for two
            roomNo = Math.round(clientNum / 2);
            players.addUserRoom(userData.username, roomNo);
            // if odd player - turn is 1
            clientNum % 2 === 1 ? turn = 1 : turn = 2;
            return { res, roomNo, turn }
        }
    }
}


export default new GameController;