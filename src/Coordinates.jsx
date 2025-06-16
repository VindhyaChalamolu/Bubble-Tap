import React, { useRef, useState, useEffect } from "react";

const ClickCoordinates = () => {
  const canvasRef = useRef(null);
  const [coordinates, setCoordinates] = useState([]);
  const [currentBubble, setCurrentBubble] = useState(-1);
  const [currentCoordinates, setCurrentCoordinates] = useState({})
  const [action, setAcion] = useState('');

  useEffect(() => {
    if (coordinates && coordinates.length) {
      paintCircle(currentBubble, coordinates[currentBubble].color)
    }
  }, [coordinates])

  useEffect(() => {
    if (currentBubble >= 0 && action === '') {
      let c = [...coordinates];
      c.splice(currentBubble, c.length)
      c[currentBubble] = currentCoordinates;
      setCoordinates(c);
    }

  }, [currentBubble])

  const paintCircle = (index, color, radius = 15) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.arc(coordinates[index].x, coordinates[index].y, radius, 0, Math.PI * 2); // small circle
    ctx.fillStyle = color;
    ctx.fill();
  }

  const handleClick = (event) => {
    setAcion('')
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    setCurrentCoordinates({ x, y, color })
    setCurrentBubble(prev => prev + 1);
  };

  const redo = () => {
    setAcion('redo')
    if (currentBubble < coordinates.length - 1) {
      paintCircle(currentBubble + 1, coordinates[currentBubble + 1].color)
      setCurrentBubble(prev => prev + 1);
    }
  }

  const undo = () => {
    setAcion('undo')
    if (coordinates && coordinates.length && currentBubble >= 0) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < currentBubble; i++) {
        paintCircle(i, coordinates[i].color)
      }
      // paintCircle(currentBubble, "white", 17)
      setCurrentBubble(prev => prev - 1)
    }
  }

  const reset = () => {
    setAcion('reset')
    // for (let i = 0; i < coordinates.length; i++) {
    //   paintCircle(i, "white")
    // }
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setCurrentBubble(-1)
    setCoordinates([]);
  }

  return (
    <div>
      <div style={{ display: "flex", columnGap: "5px", justifyContent: "center", alignItems: "center", margin: "10px" }}>
        <button onClick={undo}>Undo</button>
        <button onClick={redo}>Redo</button>
        <button onClick={reset}>Reset</button>
      </div>
      <h2>Click to Paint a Dot</h2>
      <canvas
        ref={canvasRef}
        width={800}
        height={500}
        style={{ border: "1px solid black" }}
        onClick={handleClick}
      />
    </div>
  );
};


export default ClickCoordinates;
