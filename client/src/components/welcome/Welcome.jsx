import { useState, useContext } from 'react';
import { AppContext } from '../../App';
import { socket } from '../../services/socketService';

import './welcome.scss';

const Welcome = () => {
    const { setUsername } = useContext(AppContext);
    const [input, changeInput] = useState('');
    const handleSubmit = (e) => {
        e.preventDefault();
        socket.emit('clientToServer', `Hello, I am ${input}, id ${socket.id}`)
        setUsername(input);
    }
    return (
        <div className='welcome-container'>
            <h1>Welcome to "Draw & Guess"</h1>
            <form onSubmit={handleSubmit}>
                <input type='text'
                    placeholder='enter your name'
                    name='name'
                    maxLength="10"
                    onChange={e => changeInput(e.target.value)} />
                <button>Enter</button>
            </form>

        </div>
    )
}

export default Welcome;