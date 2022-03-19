import { useState, useContext } from 'react';
import { AppContext } from '../../App';
import { notifySorry } from '../../utilities/toastNotifyFunc';
import './welcome.scss';


const Welcome = () => {
    const { setUsername, setTurn, setRoomNo } = useContext(AppContext).user;
    const { socket } = useContext(AppContext);
    // const { setTurn } = useContext(AppContext).room;
    const [input, changeInput] = useState('');
    const handleSubmit = (e) => {
        e.preventDefault();
        // send event to the server
        if (input === '') return;
        socket?.emit('newPlayer', { username: input, socketId: socket.id });
        // get event from the server
        socket.on('notifyPlayer', data => {
            if (!data.msg.status) {
                // error, may not enter - username taken
                notifySorry(data.msg.text);
                // setUsername('');
            } else {
                // success, may enter - username does not exist
                setUsername(input);
                setRoomNo(data.roomNo);
                setTurn(data.turn);
                console.log(input, 'roomNo:', data.roomNo, 'turn:', data.turn);
            }
        });
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
    )
}

export default Welcome;