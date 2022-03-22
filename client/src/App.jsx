import { createContext, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import Game from './components/game/Game';
import Welcome from './components/welcome/Welcome';
import './styles.scss';

export const AppContext = createContext(null);

const App = () => {
  const [username, setUsername] = useState(null);
  const [roomNo, setRoomNo] = useState(null);
  const [turn, setTurn] = useState(null);
  const [socket, setSocket] = useState(null);
  return (
    <>
      <AppContext.Provider value={{
        user: {
          username,
          setUsername,
          turn,
          setTurn,
          roomNo,
          setRoomNo
        },
        socket: {
          socket,
          setSocket
        }
      }} >
        <div className='app'>
          {username ? <Game /> : <Welcome />}
        </div>
      </AppContext.Provider >
      <Toaster />
    </>
  );
}
export default App;