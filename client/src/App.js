import { createContext, useState, useEffect } from 'react';

import Game from './components/game/Game';
import Welcome from './components/welcome/Welcome';

import './styles.scss';

export const AppContext = createContext(null);

const App = () => {
  const [username, setUsername] = useState();
  // useEffect(() => {
  //   socket.on('serverToClient', (msg) => {
  //     console.log(msg);
  //   });
  // }, []);
  return (
    <AppContext.Provider value={{ username, setUsername }}>
      <div className="app">
        {username ? <Game /> : <Welcome />}
      </div>
    </AppContext.Provider>
  );
}

export default App;