import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../App';
import { notifyError } from '../../utilities/toastNotifyFunc';
import './nav.scss';


const Nav = (props) => {
    const {
        selectedWord,
        timer,
        score,
        opponentScore,
        setOpponentScore
    } = props;
    const { username, setUsername } = useContext(AppContext).user;
    const [opponent, setOpponent] = useState('...');
    const socket = useContext(AppContext).socket;

    useEffect(() => {
        // get opponent
        socket.on('opponentInfo', opponent => {
            setOpponent(opponent);
        });
        socket.on('opponentScore', opponentScore => {
            setOpponentScore(opponentScore);
        });
        return () => {
            socket.removeListener('opponentInfo');
            socket.removeListener('opponentScore');
        }
    }, [socket, setOpponentScore]);

    useEffect(() => {
        // notify other player when leaving
        socket.on('leavingPlayer', leavingPlayer => {
            notifyError(`${leavingPlayer} has left`);
            setUsername(undefined);
            // end game logic
        });
        return () => {
            socket.removeAllListeners();
        }
    }, [socket, setUsername]);

    return (
        <nav className='nav'>
            <div className='left'>
                <div className='top'>{username}</div>
                <div className='bottom'>{score}</div>
            </div>
            <div className='center'>
                <div className='top'>Time left: {timer}</div>
                <div className='bottom'>
                    You word is <span className='word-guess'>
                        {selectedWord.word === '' ? ' ...' : selectedWord.word}
                    </span>
                </div>
            </div>
            <div className='right'>
                <div className='top'>{opponent}</div>
                <div className='bottom'>{opponentScore}</div>
            </div>
        </nav>
    )
}

export default Nav;