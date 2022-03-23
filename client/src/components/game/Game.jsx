import { useState, useContext, useEffect } from 'react';
import { AppContext } from '../../App';
import ChooseAndDraw from '../chooseAndDraw/ChooseAndDraw';
import Nav from '../nav/Nav';
import WaitingRoom from '../waitingRoom/WaitingRoom';
import { categories, generateWord } from '../../utilities/generateWords';
import './game.scss';

const Game = () => {
    const { turn, username, roomNo } = useContext(AppContext).user;
    const socket = useContext(AppContext).socket;
    const [startGame, setStartGame] = useState(false);
    const [timerStart, SetTimerStart] = useState(false);
    const [timer, setTimer] = useState('...');
    const [words, setWords] = useState({
        easy: generateWord(categories.easy),
        medium: generateWord(categories.medium),
        hard: generateWord(categories.easy),
    });
    const [selectedWord, setSelectedWord] = useState({
        word: '',
        points: 0
    });
    const [guessTheWord, setGuessTheWord] = useState({
        imgData: '',
        word: '',
        points: 0
    });
    const [score, setScore] = useState(0);
    const [opponentScore, setOpponentScore] = useState(0);

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
                    // send info about this player to the other player in the room
                    socket.emit('userInfo', { username, roomNo });
                }
            });
            return () => {
                socket.removeListener('startNewGame');
            }
        }
    }, [turn, setStartGame, roomNo, socket, username]);

    return (
        <div className='game'>
            <Nav selectedWord={selectedWord}
                timer={timer}
                score={score}
                opponentScore={opponentScore}
                setOpponentScore={setOpponentScore}
            />
            {!startGame || (startGame && turn === 2)
                ? <WaitingRoom
                    startGame={startGame}
                    setGuessTheWord={setGuessTheWord} />
                : <ChooseAndDraw
                    words={words}
                    setWords={setWords}
                    selectedWord={selectedWord}
                    setSelectedWord={setSelectedWord}
                    timer={timer}
                    setTimer={setTimer}
                    timerStart={timerStart}
                    SetTimerStart={SetTimerStart}
                    guessTheWord={guessTheWord}
                    setGuessTheWord={setGuessTheWord}
                    score={score}
                    setScore={setScore}
                />
            }
        </div>
    )
}
export default Game;



