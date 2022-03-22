import { useEffect, useRef, useState, useContext } from 'react';
import { AppContext } from '../../App';
import Controls from '../controls/Controls';
import colors from '../../utilities/colors';
import './canvas.scss';


const Canvas = (props) => {
    const {
        selectedWord,
        setSelectedWord,
        timerStart,
        SetTimerStart,
        timer,
        setTimer,
        guessTheWord,
        setGuessTheWord,
        score,
        setScore
    } = props;

    const { roomNo, setTurn } = useContext(AppContext).user;
    const socket = useContext(AppContext).socket;
    const [isDrawing, setIsDrawing] = useState(false);
    const [canvasSize, setCanvasSize] = useState({ width: window.innerWidth, height: 350 });
    const [selectedColor, setSelectedColor] = useState(colors[0]);
    const [position, setPosition] = useState({ x: undefined, y: undefined });
    const canvasRef = useRef(null);
    const contextRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (window.innerWidth > 425) {
            setCanvasSize({ width: 425 });
        }
        const context = canvas.getContext('2d');
        // initial setting for the context
        context.lineCap = 'round'; //round endings for the lines
        context.strokeStyle = selectedColor; //initial color of the pen
        window.innerWidth > 425 ? context.lineWidth = 6 : context.lineWidth = 3; //pen width
        contextRef.current = context;
    }, [selectedColor]);

    useEffect(() => {
        const { word } = guessTheWord;
        if (word !== '') {
            let myImage = new Image();
            myImage.src = guessTheWord.imgData;
            myImage.onload = () => {
                contextRef.current.drawImage(myImage, 0, 0, canvasSize.width, canvasSize.height);
            }
            SetTimerStart(true);
        }
    }, [guessTheWord, SetTimerStart, canvasSize]);

    // mousedown || touchstart
    const startDrawing = (e) => {
        contextRef.current.beginPath();
        setIsDrawing(true);
    };
    // mouseup && mouseleave || touchend && touchcancel
    const finishDrawing = () => {
        contextRef.current.closePath();
        setPosition({ x: undefined, y: undefined });
        setIsDrawing(false);
    };
    // mousemove || touchmove
    const draw = (e) => {
        if (!isDrawing) {
            return;
        }
        //mobile
        if (e.nativeEvent.touches) {
            // e.preventDefault();
            const rect = e.target.getBoundingClientRect();
            const x = e.targetTouches[0].pageX - rect.left;
            const y = e.targetTouches[0].pageY - rect.top;
            setPosition({ x, y });
        }
        //desktop
        else {
            setPosition({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY });
        }
        contextRef.current.lineTo(position.x, position.y);
        contextRef.current.stroke();
    };
    //clear canvas
    const clear = () => {
        contextRef.current.clearRect(0, 0, contextRef.current.canvas.width, contextRef.current.canvas.height);
    }
    const send = () => {
        const dataURL = canvasRef.current.toDataURL();
        socket.emit('image', { dataURL, roomNo, selectedWord });
        SetTimerStart(false);
        setTimer('...');
        setSelectedWord({ word: '' });
        setTurn(2);
    }
    return (
        <div className={'canvas-container' + (!timerStart ? ' deactivated' : '')}>
            <canvas className={'canvas' + (!timerStart ? ' deactivated' : '')}
                ref={canvasRef}
                width={canvasSize.width} height={canvasSize.height}
                onMouseDown={startDrawing}
                onTouchStart={startDrawing}
                onMouseUp={finishDrawing}
                onTouchEnd={finishDrawing}
                onMouseLeave={finishDrawing}
                onTouchCancel={finishDrawing}
                onMouseMove={draw}
                onTouchMove={draw}
            />
            <div className={'buttons-container' + (guessTheWord.word !== '' ? ' hidden' : '')}
                style={{ width: canvasSize.width }}>
                <div className='colors-container'>
                    {
                        colors.map(color => {
                            return <button className='color'
                                key={color}
                                id={color}
                                onClick={(e) => setSelectedColor(e.target.id)}
                                style={{ background: color }}>
                            </button>
                        })
                    }
                </div>
                <button id='clear'
                    className={(!timerStart ? 'deactivated' : '')}
                    onClick={clear}>
                    Clear
                </button>
                <button id='send'
                    className={(!timerStart ? 'active' : '')}
                    onClick={send}>
                    Send
                </button>
            </div>
            <Controls
                guessTheWord={guessTheWord}
                setGuessTheWord={setGuessTheWord}
                score={score}
                setScore={setScore}
                timerStart={timerStart}
                SetTimerStart={SetTimerStart}
                timer={timer}
                setTimer={setTimer} />
        </div>
    )
}

export default Canvas;