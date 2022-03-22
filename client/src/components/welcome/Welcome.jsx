import { io } from 'socket.io-client';
import { useState, useContext, useEffect } from 'react';
import { AppContext } from '../../App';
// import { notifySorry } from '../../utilities/toastNotifyFunc';

import './welcome.scss';

const serverURL = (process.env.NODE_ENV === 'production'
    ? process.env.REACT_APP_PRODUCTION_SERVER
    : process.env.REACT_APP_DEVELOPMENT_SERVER);

const Welcome = () => {
    const { setUsername, sestTurn, setRoomNo } = useContext(AppContext).user;
    const { socket, setSocket } = useContext(AppContext).socket;
    const [input, changeInput] = useState('');
    useEffect(() => {
        setSocket(io(serverURL), {
            autoConnect: false,
            reconnection: false
        });
    }, []);
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(input);
    }
    return (
        <div className='welcome-container'>
            <h1>Welcome to "Draw & Guess"</h1>
            <form onSubmit={handleSubmit}>
                <input type='text'
                    placeholder='enter your name'
                    name='name'
                    maxLength='10'
                    onChange={e => changeInput(e.target.value)} />
                <button>Enter</button>
            </form>
        </div>
    );
}

export default Welcome;