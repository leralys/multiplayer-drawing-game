import { useEffect, useRef, useState } from 'react';

import './canvas.scss';


const Canvas = () => {
    const [isDrawing, setIsDrawing] = useState(false);
    const [canvasSize, setCanvasSize] = useState({ width: 300, height: 500 });
    const [position, setPosition] = useState({ x: undefined, y: undefined });
    const canvasRef = useRef(null);
    // store 2d context in a ref
    const contextRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (window.innerWidth > 425) {
            setCanvasSize({ width: 400, height: 600 })
        }
        const context = canvas.getContext('2d');
        // initial setting for the context
        context.lineCap = "round"; //round endings for the lines
        context.strokeStyle = "black"; //color of the pen
        context.lineWidth = 5;
        contextRef.current = context;
    }, []);

    // mousedown || touchstart
    const startDrawing = ({ nativeEvent }) => {
        if (nativeEvent.touches) {
            setPosition({ x: nativeEvent.touches[0].clientX, y: nativeEvent.touches[0].clientY });
        } else {
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
        if (nativeEvent.touches) {
            setPosition({ x: nativeEvent.touches[0].clientX, y: nativeEvent.touches[0].clientY });
        }
        else {
            setPosition({ x: nativeEvent.offsetX, y: nativeEvent.offsetY });
        }
        contextRef.current.lineTo(position.x, position.y);
        contextRef.current.stroke();
    };
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
        </div>
    )
}

export default Canvas;