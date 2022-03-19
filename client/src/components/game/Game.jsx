import { useState, useContext, useEffect } from 'react';
import { AppContext } from '../../App';

import { generateSlug } from 'random-word-slugs';

import Canvas from '../canvas/Canvas';
import Nav from '../nav/Nav';
import WaitingRoom from '../waitingRoom/WaitingRoom';

import ready from '../../assets/readyIcon.png';
import play from '../../assets/playIcon.png';
import leave from '../../assets/logoutIcon.png';

import './game.scss';


const easyCategory = 'food';
const mediumCategory = 'animals';
const hardCategory = 'education';

const Game = () => {
    const { turn, username, roomNo } = useContext(AppContext).user;
    const socket = useContext(AppContext).socket;
    const [startGame, setStartGame] = useState(false);
    // const [score, setScore] = useState('');
    // const [timer, setTimer] = useState('');
    // const [opponent, setOpponent] = useState('');
    useEffect(() => {
        // if player comes second - the game starts
        if (turn % 2 === 0) {
            setStartGame(true);
            socket.emit('startNewGame', { roomNo, username });
        } else {
            // wait for another player to join in order to start the game
            socket.on('startNewGame', data => {
                if (data.startNewGame) {
                    setStartGame(true);
                    // //  send info about this player to the other player in the room
                    socket.emit('some event', { username, roomNo });
                }
            });
        }
    }, [turn, setStartGame, roomNo, socket, username]);
    const generateWord = category => {
        const word = generateSlug(1, {
            partsOfSpeech: ['noun'],
            categories: {
                noun: [`${category}`]
            }
        });
        return word;
    }
    // const [words, setWords] = useState({
    //     easy: generateWord(easyCategory),
    //     medium: generateWord(mediumCategory),
    //     hard: generateWord(hardCategory)
    // });
    const [words, setWords] = useState({
        easy: '...',
        medium: '...',
        hard: '...'
    });
    const leaveGame = () => {
        // console.log({ username, socketId: socket.id });
        console.log('leave game logic');
    }
    const pass = () => {
        console.log('pass logic')
    }
    return (
        <div className='game'>
            <Nav words={words}
            // score={score}
            // timer={timer}
            />
            {!startGame
                ? <WaitingRoom />
                : <Canvas />
            }
            <div className='controls'>
                <button onClick={pass}>Pass</button>
                <img src={ready} id={'ready'} alt='' />
                <img src={play} id='play' alt='' />
                <img onClick={leaveGame}
                    src={leave} alt=''
                />
            </div>
        </div>
    )
}
export default Game;



