import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../App';
import { notifyError, notifyPaint } from '../../utilities/toastNotifyFunc';
import './nav.scss';


const Nav = ({ selectedWord, timer }) => {
    const { username, setUsername } = useContext(AppContext).user;
    const [opponent, setOpponent] = useState('...');
    const socket = useContext(AppContext).socket;

    useEffect(() => {
        // get opponent
        socket.on('opponentInfo', opponent => {
            notifyPaint(`You are playing now with ${opponent}`);
            setOpponent(opponent);
        });
    }, [socket]);

    useEffect(() => {
        // notify other player when leaving
        socket.on('leavingPlayer', leavingPlayer => {
            notifyError(`${leavingPlayer} has left`);
            setUsername(undefined);
            // end game logic
        });
    }, [socket, setUsername]);

    return (
        <nav className='nav'>
            <div className='left'>
                <div className='top'>{username}</div>
                <div className='bottom'>...</div>
            </div>
            <div className='center'>
                <div className='top'>Time left: {timer}</div>
                <div className='bottom'>
                    You word is <span className='word-guess'>
                        {selectedWord === '' ? ' ...' : selectedWord}
                    </span>
                </div>
            </div>
            <div className='right'>
                <div className='top'>{opponent}</div>
                <div className='bottom'>...</div>
            </div>
        </nav>
    )
}

export default Nav;