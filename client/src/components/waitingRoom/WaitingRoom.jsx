import { useContext, useEffect } from 'react';
import { AppContext } from '../../App';
import './waitingRoom.scss';

const WaitingRoom = ({ startGame, setGuessTheWord }) => {

    const { setTurn } = useContext(AppContext).user;
    const socket = useContext(AppContext).socket;

    useEffect(() => {
        // get the image to start guessing
        socket.on('guessTheWord', ({ dataURL, selectedWord }) => {
            setGuessTheWord({ imgData: dataURL, word: selectedWord.word, points: selectedWord.points });
            setTurn(1);
        });
        return () => {
            socket.removeListener('guessTheWord');
        }
    }, [socket, setTurn, setGuessTheWord]);
    let message = '';
    if (!startGame) {
        message = 'Waiting for other player to connect ...'
    } else {
        message = 'Your turn starts soon ...';
    }
    return (
        <div className='waiting-room'>
            <h3>{message}</h3>
        </div>
    )
}

export default WaitingRoom;