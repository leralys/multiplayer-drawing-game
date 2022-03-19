import './waitingRoom.scss';

const WaitingRoom = ({ startGame }) => {
    const waitingJoin = 'Waiting for other player to connect ...';
    const waitingGuess = 'Your opponent is drawing ...';
    return (
        <div className='waiting-room'>
            <h3>{!startGame ? waitingJoin : waitingGuess}</h3>
        </div>
    )
}

export default WaitingRoom;