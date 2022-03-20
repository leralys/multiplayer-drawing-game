import { createContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { Toaster } from 'react-hot-toast';
import { serverUrl } from './utilities/socket';
import Game from './components/game/Game';
import Welcome from './components/welcome/Welcome';
import './styles.scss';

export const AppContext = createContext(null);

const App = () => {
  const [username, setUsername] = useState();
  const [roomNo, setRoomNo] = useState();
  const [turn, setTurn] = useState();
  const [socket, setSocket] = useState(null);
  useEffect(() => {
    setSocket(io(serverUrl));
  }, []);
  return (
    <AppContext.Provider value={{
      user: {
        username,
        setUsername,
        turn,
        setTurn,
        roomNo,
        setRoomNo
      },
      socket
    }} >
      <div className='app'>
        {username ? <Game /> : <Welcome />}
      </div>
      <Toaster />
    </AppContext.Provider >
  );
}
export default App;