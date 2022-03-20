import { useEffect, useContext } from 'react';
import { AppContext } from '../../App';
import Canvas from '../canvas/Canvas';
import './chooseAndDraw.scss';

const ChooseAndDraw = (props) => {
    const { turn } = useContext(AppContext).user;
    const {
        words,
        selectedWord,
        setSelectedWord,
        timer,
        setTimer,
        timerStart,
        SetTimerStart,
        guessTheWord,
        setGuessTheWord,
        setScore
    } = props;
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
    }, [timerStart, setTimer, SetTimerStart]);

    useEffect(() => {
        if (timer === 0) {
            setTimer('...');
        }
    }, [timer, setTimer]);

    const startDraw = (e) => {
        setSelectedWord({
            word: e.target.innerText,
            points: e.target.dataset.points
        });
        SetTimerStart(true);
    }
    return (
        <>
            {turn === 1 && selectedWord.word === '' && guessTheWord.word === ''
                ? <div className='choose-word'>
                    <h3>Select you word</h3>
                    <ul>
                        {list.map(level => (
                            <li key={level[0]}>
                                <span>{level[0]}</span>
                                <button
                                    data-points={level[1].points}
                                    onClick={(e) => startDraw(e)}>
                                    {level[1].word}
                                </button>
                                <span>{level[1].points} points</span>
                            </li>
                        ))}
                    </ul>
                </div>
                : <Canvas
                    selectedWord={selectedWord}
                    setSelectedWord={setSelectedWord}
                    timerStart={timerStart}
                    SetTimerStart={SetTimerStart}
                    timer={timer}
                    setTimer={setTimer}
                    guessTheWord={guessTheWord}
                    setGuessTheWord={setGuessTheWord}
                    setScore={setScore} />
            }
        </>
    )
}

export default ChooseAndDraw;