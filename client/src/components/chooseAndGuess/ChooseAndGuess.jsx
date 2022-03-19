import { useState, useEffect } from 'react';
import Canvas from '../canvas/Canvas';
import './chooseAndGuess.scss';

const ChooseAndGuess = (props) => {
    const { words, selectedWord, setSelectedWord, timer, setTimer } = props;
    const [timerStart, SetTimerStart] = useState(false);
    // const [seconds, setSeconds] = useState(120);
    const list = Object.entries(words);
    useEffect(() => {
        if (timerStart) {
            let seconds = 10;
            setTimer(seconds);
            const interval = setInterval(() => {
                if (seconds === 1) {
                    clearInterval(interval);
                    SetTimerStart(false);
                }
                seconds--;
                setTimer(seconds);
            }, 1000);
            return () => {
                clearInterval(interval);
                SetTimerStart(false);
            }
        }
    }, [timerStart, setTimer]);
    useEffect(() => {
        if (timer === 0) {
            setTimer('...');
        }
    }, [timer, setTimer])
    const startDraw = (e) => {
        setSelectedWord(e.target.innerText);
        SetTimerStart(true);
    }
    return (
        <>
            {selectedWord === ''
                ? <div className='choose-and-guess'>
                    <h3>Select you word</h3>
                    <ul>
                        {list.map(level => (
                            <li key={level[0]}>
                                <span>{level[0]}</span>
                                <button onClick={(e) => startDraw(e)}>
                                    {level[1].word}
                                </button>
                                <span>{level[1].points} points</span>
                            </li>
                        ))}
                    </ul>
                </div>
                : <Canvas />
            }
        </>
    )
}

export default ChooseAndGuess;