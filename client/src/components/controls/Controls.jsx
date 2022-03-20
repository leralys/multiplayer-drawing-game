import { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../App';
import { notifySuccess } from '../../utilities/toastNotifyFunc';
import ready from '../../assets/readyIcon.png';
import leave from '../../assets/logoutIcon.png';

import './controls.scss';

const Controls = (props) => {
    const {
        guessTheWord,
        setGuessTheWord,
        score,
        setScore,
        timerStart,
        SetTimerStart,
        timer,
        setTimer
    } = props;
    const { socket } = useContext(AppContext);
    const { roomNo, username, setUsername, setRoomNo, setTurn } = useContext(AppContext).user;
    const [input, changeInput] = useState('');

    useEffect(() => {
        if (timerStart && guessTheWord.word !== '') {
            let seconds = 30;
            setTimer(seconds);
            const interval = setInterval(() => {
                if (seconds === 1) {
                    clearInterval(interval);
                    SetTimerStart(false);
                    setGuessTheWord({ word: '' });
                }
                seconds--;
                setTimer(seconds);
            }, 1000);
            return () => {
                clearInterval(interval);
                SetTimerStart(false);
                setGuessTheWord({ word: '' });
            }
        }
    }, [timerStart, setTimer, SetTimerStart, guessTheWord.word, setGuessTheWord]);

    useEffect(() => {
        if (timer === 0) {
            setTimer('...');
        }
    }, [timer, setTimer]);

    // send the score to the server each time it updates so the oppponent will know 
    useEffect(() => {
        socket.emit('updateScore', { score, roomNo });
        return () => {
            socket.removeListener('updateScore');
        }
    }, [score]);

    const handleSubmit = (e) => {
        e.preventDefault();
        // when guessed right update the score, send it to server, update state
        if (guessTheWord.word === input) {
            notifySuccess('Good job!');
            setScore(s => Number(score) + Number(guessTheWord.points));
            setGuessTheWord({ word: '' });
            SetTimerStart(false);
            setTimer('...');
        }
    }
    const leaveGame = () => {
        // notify the other player when leaving
        socket.emit('leaveGame', { username, roomNo });
        // reset state
        setUsername(undefined);
        setRoomNo(undefined);
        setTurn(undefined);
        setGuessTheWord({ word: '' })
        // remove all socket io listeners to prevent memory leak when components unmount
        socket.removeAllListeners();
    }
    return (
        <div className='controls'>
            <form
                onSubmit={handleSubmit}
                className={(guessTheWord.word === '' ? 'hidden' : '')}
            >
                <input
                    type='text'
                    onChange={e => changeInput(e.target.value)}
                    placeholder='guess the word' />
                <img src={ready} alt='' />
            </form>
            <img
                onClick={leaveGame}
                src={leave} alt=''
            />
        </div>
    );
}

export default Controls;