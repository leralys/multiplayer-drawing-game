import { useContext, useState } from 'react';

import { AppContext } from '../../App';

import './nav.scss';

const Nav = ({ words }) => {
    const { username } = useContext(AppContext);
    const [score, setScore] = useState(0);
    return (
        <nav className='nav'>
            <div className='top'>
                <span>Hi, {username}</span>
                <span>Time left: 180s</span>
                <span>Score: {score}</span>
            </div>
            <div className='bottom'>
                You word is <span className='word-guess'>{words.medium}</span>
            </div>
        </nav>
    )
}

export default Nav;