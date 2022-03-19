import { useContext, useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { AppContext } from '../../App';

import './nav.scss';

const notify = (text) => {
    toast.error(text, {
        duration: 2000,
        id: 'endGame'
    });
}

const Nav = (props) => {
    const { username, setUsername } = useContext(AppContext).user;
    const [opponent, setOpponent] = useState('...');
    const socket = useContext(AppContext).socket;

    useEffect(() => {
        // get opponent
        socket.on('opponentInfo', opponent => {
            setOpponent(opponent);
        });
    }, [socket]);

    useEffect(() => {
        // notify other player when leaving
        socket.on('leavingPlayer', leavingPlayer => {
            notify(`${leavingPlayer} has left`);
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
                <div className='top'>Time left: ...</div>
                <div className='bottom'>
                    You word is <span className='word-guess'>...</span>
                </div>
            </div>
            <div className='right'>
                <div className='top'>{opponent}</div>
                <div className='bottom'>...</div>
            </div>
            <Toaster />
        </nav>
    )
}

export default Nav;