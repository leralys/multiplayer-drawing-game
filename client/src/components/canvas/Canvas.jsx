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
    const [canvasSize, setCanvasSize] = useState({ width: 300, height: 500 });
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
    const startDrawing = ({ nativeEvent }) => {
        //mobile
        if (nativeEvent.touches) {
            setPosition({ x: nativeEvent.touches[0].clientX, y: nativeEvent.touches[0].clientY });
        }
        //desktop
        else {
            setPosition({ x: nativeEvent.offsetX, y: nativeEvent.offsetY });
        }
        contextRef.current.beginPath();
        contextRef.current.moveTo(position.x, position.y);
        setIsDrawing(true);
    };
    // mouseup && mouseleave || touchend && touchcancel
    const finishDrawing = () => {
        contextRef.current.closePath();
        setPosition({ x: undefined, y: undefined });
        setIsDrawing(false);
    };
    // mousemove || touchmove
    const draw = ({ nativeEvent }) => {
        if (!isDrawing) {
            return;
        }
        //mobile
        if (nativeEvent.touches) {
            setPosition({ x: nativeEvent.touches[0].clientX, y: nativeEvent.touches[0].clientY });
        }
        //desktop
        else {
            setPosition({ x: nativeEvent.offsetX, y: nativeEvent.offsetY });
        }
        contextRef.current.lineTo(position.x, position.y);
        contextRef.current.stroke();
    };
    //clear canvas
    const clear = () => {
        contextRef.current.clearRect(0, 0, contextRef.current.canvas.width, contextRef.current.canvas.height);
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
                <button>Send</button>
            </div>
        </div>
    )
}

export default Canvas;