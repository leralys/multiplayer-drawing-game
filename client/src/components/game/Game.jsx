import { useState, useContext, useEffect } from 'react';
import { AppContext } from '../../App';

import { generateSlug } from 'random-word-slugs';
import { socket } from '../../services/socketService';

import Canvas from '../canvas/Canvas';
import Nav from '../nav/Nav';


import ready from '../../assets/readyIcon.png';
import play from '../../assets/playIcon.png';
import leave from '../../assets/logoutIcon.png';

import './game.scss';


const easyCategory = 'food';
const mediumCategory = 'animals';
const hardCategory = 'education';

const Game = () => {
    const { username, setUsername } = useContext(AppContext);
    // const [messageToAll, setMessageToAll] = useState('');
    useEffect(() => {
        socket.on('serverToClient', (msg) => {
            console.log(msg);
        });
    }, []);
    const generateWord = category => {
        const word = generateSlug(1, {
            partsOfSpeech: ['noun'],
            categories: {
                noun: [`${category}`]
            }
        });
        return word;
    }
    const [words, setWords] = useState({
        easy: generateWord(easyCategory),
        medium: generateWord(mediumCategory),
        hard: generateWord(hardCategory)
    });
    const leaveGame = () => {
        socket.emit('disconnectMe', `I ${username}, id ${socket.id} am leaving you!`)
        setUsername('');
    }
    return (
        <div className='game'>
            <Nav words={words} />
            <Canvas />
            <div className='buttons'>
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



