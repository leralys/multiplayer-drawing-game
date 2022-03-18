import { socket } from '../../services/socketService';
import { useEffect, useRef, useState } from 'react';
import './canvas.scss';

const colors = [
    'black',
    'red',
    'green',
    'yellow',
    'blue'
]

const Canvas = () => {
    const [isDrawing, setIsDrawing] = useState(false);
    const [canvasSize, setCanvasSize] = useState({ width: 300, height: 400 });
    const [selectedColor, setSelectedColor] = useState(colors[0]);
    const [position, setPosition] = useState({ x: undefined, y: undefined });
    const canvasRef = useRef(null);
    // store 2d context in a ref
    const contextRef = useRef(null);

    useEffect(() => {
        // need to move to separate function maybe 
        const canvas = canvasRef.current;
        if (window.innerWidth > 425) {
            setCanvasSize({ width: 400, height: 600 });
        }
        const context = canvas.getContext('2d');
        // initial setting for the context
        context.lineCap = 'round'; //round endings for the lines
        context.strokeStyle = selectedColor; //color of the pen
        context.lineWidth = 5;
        contextRef.current = context;
    }, [selectedColor]);

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
            const rect = e.target.getBoundingClientRect();
            const x = e.targetTouches[0].pageX - rect.left;
            const y = e.targetTouches[0].pageY - rect.top;
            setPosition({ x, y });
        }
        //desktop
        else {
            setPosition({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY });
        }
        // contextRef.current.moveTo(position.x, position.y); //doesn't work
        contextRef.current.lineTo(position.x, position.y);
        contextRef.current.stroke();
    };
    //clear canvas
    const clear = () => {
        contextRef.current.clearRect(0, 0, contextRef.current.canvas.width, contextRef.current.canvas.height);
    }
    const send = () => {
        socket.emit('clientToClient', 'hello from client to all clients');
    }
    const pass = () => {
        console.log('pass logic')
    }
    return (
        <div className='canvas-container'>
            <canvas className='canvas'
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
            <div className='buttons-container'
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
                <button onClick={clear}>Clear</button>
                <button onClick={pass}>Pass</button>
                <button onClick={send}>Send</button>
            </div>
        </div>
    )
}

export default Canvas;