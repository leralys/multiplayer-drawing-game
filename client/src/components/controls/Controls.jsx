import ready from '../../assets/readyIcon.png';
import play from '../../assets/playIcon.png';
import leave from '../../assets/logoutIcon.png';

import './controls.scss';


const Controls = () => {
    const leaveGame = () => {
        // console.log({ username, socketId: socket.id });
        console.log('leave game logic');
    }
    const pass = () => {
        console.log('pass logic')
    }
    return (
        <div className='controls'>
            <button onClick={pass}>Pass</button>
            <img src={ready} id={'ready'} alt='' />
            <img src={play} id='play' alt='' />
            <img onClick={leaveGame}
                src={leave} alt=''
            />
        </div>
    );
}

export default Controls;