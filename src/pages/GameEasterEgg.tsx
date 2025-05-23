
import React, { useEffect, useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Home } from "lucide-react";
import { Link } from "react-router-dom";
import StoreLayout from "@/components/layout/StoreLayout";

type Position = { x: number; y: number };
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

const GameEasterEgg = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [paused, setPaused] = useState(false);
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [snake, setSnake] = useState<Position[]>([
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 }
  ]);
  const [food, setFood] = useState<Position>({ x: 15, y: 15 });
  const [gameSpeed, setGameSpeed] = useState(150);
  const [canChangeDirection, setCanChangeDirection] = useState(true);
  const [touchStart, setTouchStart] = useState<Position | null>(null);

  // Canvas settings
  const boardSize = Math.min(window.innerWidth - 40, 400);
  const gridSize = 20; // 20x20 grid
  const cellSize = boardSize / gridSize;
  
  // Game loop
  useEffect(() => {
    if (gameOver || paused) return;
    
    const moveSnake = () => {
      setCanChangeDirection(true);
      const head = { ...snake[0] };
      
      switch (direction) {
        case 'UP': head.y -= 1; break;
        case 'DOWN': head.y += 1; break;
        case 'LEFT': head.x -= 1; break;
        case 'RIGHT': head.x += 1; break;
      }
      
      // Wall collision
      if (
        head.x < 0 || 
        head.x >= gridSize || 
        head.y < 0 || 
        head.y >= gridSize ||
        snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)
      ) {
        setGameOver(true);
        return;
      }
      
      const newSnake = [head, ...snake];
      
      // Food collision
      if (head.x === food.x && head.y === food.y) {
        setScore(prev => prev + 1);
        generateFood(newSnake);
        
        // Increase speed every 5 points
        if (score > 0 && score % 5 === 0) {
          setGameSpeed(prev => Math.max(prev - 10, 60));
        }
      } else {
        newSnake.pop(); // Remove tail if no food eaten
      }
      
      setSnake(newSnake);
    };
    
    const gameInterval = setInterval(moveSnake, gameSpeed);
    return () => clearInterval(gameInterval);
  }, [snake, direction, food, gameOver, paused, gameSpeed, score]);
  
  // Draw game
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.fillStyle = '#f8fafc'; // Light background
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw snake
    snake.forEach((segment, index) => {
      const isHead = index === 0;
      ctx.fillStyle = isHead ? '#FF1B8D' : '#9747FF'; // Store pink/purple gradient theme
      const x = segment.x * cellSize;
      const y = segment.y * cellSize;
      
      // Rounded segments for smoother look
      ctx.beginPath();
      ctx.roundRect(x, y, cellSize, cellSize, isHead ? 3 : 5);
      ctx.fill();
      
      // Add eyes to head
      if (isHead) {
        ctx.fillStyle = '#ffffff';
        // Eyes position depends on direction
        const eyeSize = cellSize / 5;
        let eyeX1, eyeX2, eyeY1, eyeY2;
        
        switch (direction) {
          case 'UP':
            eyeX1 = x + cellSize / 3 - eyeSize / 2;
            eyeY1 = y + cellSize / 3 - eyeSize / 2;
            eyeX2 = x + 2 * cellSize / 3 - eyeSize / 2;
            eyeY2 = y + cellSize / 3 - eyeSize / 2;
            break;
          case 'DOWN':
            eyeX1 = x + cellSize / 3 - eyeSize / 2;
            eyeY1 = y + 2 * cellSize / 3 - eyeSize / 2;
            eyeX2 = x + 2 * cellSize / 3 - eyeSize / 2;
            eyeY2 = y + 2 * cellSize / 3 - eyeSize / 2;
            break;
          case 'LEFT':
            eyeX1 = x + cellSize / 3 - eyeSize / 2;
            eyeY1 = y + cellSize / 3 - eyeSize / 2;
            eyeX2 = x + cellSize / 3 - eyeSize / 2;
            eyeY2 = y + 2 * cellSize / 3 - eyeSize / 2;
            break;
          case 'RIGHT':
            eyeX1 = x + 2 * cellSize / 3 - eyeSize / 2;
            eyeY1 = y + cellSize / 3 - eyeSize / 2;
            eyeX2 = x + 2 * cellSize / 3 - eyeSize / 2;
            eyeY2 = y + 2 * cellSize / 3 - eyeSize / 2;
            break;
        }
        
        ctx.beginPath();
        ctx.arc(eyeX1, eyeY1, eyeSize, 0, 2 * Math.PI);
        ctx.arc(eyeX2, eyeY2, eyeSize, 0, 2 * Math.PI);
        ctx.fill();
      }
    });
    
    // Draw food
    ctx.fillStyle = '#FF1B8D'; // Pink food
    ctx.beginPath();
    ctx.roundRect(
      food.x * cellSize, 
      food.y * cellSize, 
      cellSize, 
      cellSize, 
      cellSize / 2
    );
    ctx.fill();
    
    // Add a sparkle to the food
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(
      food.x * cellSize + cellSize / 4, 
      food.y * cellSize + cellSize / 4, 
      cellSize / 8, 
      0, 
      2 * Math.PI
    );
    ctx.fill();
    
  }, [snake, food, cellSize]);
  
  // Generate new food
  const generateFood = (currentSnake = snake) => {
    let newFood;
    let foodOnSnake = true;
    
    while (foodOnSnake) {
      newFood = {
        x: Math.floor(Math.random() * gridSize),
        y: Math.floor(Math.random() * gridSize)
      };
      
      foodOnSnake = currentSnake.some(
        segment => segment.x === newFood.x && segment.y === newFood.y
      );
    }
    
    setFood(newFood as Position);
  };
  
  // Handle keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!canChangeDirection) return;
      
      setCanChangeDirection(false);
      switch (e.key) {
        case 'ArrowUp':
          if (direction !== 'DOWN') setDirection('UP');
          break;
        case 'ArrowDown':
          if (direction !== 'UP') setDirection('DOWN');
          break;
        case 'ArrowLeft':
          if (direction !== 'RIGHT') setDirection('LEFT');
          break;
        case 'ArrowRight':
          if (direction !== 'LEFT') setDirection('RIGHT');
          break;
        case ' ':
          setPaused(prev => !prev);
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction, canChangeDirection]);
  
  // Handle touch controls for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
  };
  
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart || !canChangeDirection) return;
    
    const touch = e.changedTouches[0];
    const endX = touch.clientX;
    const endY = touch.clientY;
    
    const dx = endX - touchStart.x;
    const dy = endY - touchStart.y;
    
    // Determine which direction had the largest movement
    if (Math.abs(dx) > Math.abs(dy)) {
      // Horizontal swipe
      if (dx > 0 && direction !== 'LEFT') {
        setDirection('RIGHT');
      } else if (dx < 0 && direction !== 'RIGHT') {
        setDirection('LEFT');
      }
    } else {
      // Vertical swipe
      if (dy > 0 && direction !== 'UP') {
        setDirection('DOWN');
      } else if (dy < 0 && direction !== 'DOWN') {
        setDirection('UP');
      }
    }
    
    setCanChangeDirection(false);
    setTouchStart(null);
  };
  
  // Reset game
  const resetGame = () => {
    setSnake([
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 }
    ]);
    setDirection('RIGHT');
    setScore(0);
    setGameOver(false);
    setPaused(false);
    setGameSpeed(150);
    generateFood();
  };
  
  // Direction button handlers
  const handleDirectionButton = (newDirection: Direction) => {
    if (!canChangeDirection) return;
    
    switch (newDirection) {
      case 'UP':
        if (direction !== 'DOWN') setDirection('UP');
        break;
      case 'DOWN':
        if (direction !== 'UP') setDirection('DOWN');
        break;
      case 'LEFT':
        if (direction !== 'RIGHT') setDirection('LEFT');
        break;
      case 'RIGHT':
        if (direction !== 'LEFT') setDirection('RIGHT');
        break;
    }
    setCanChangeDirection(false);
  };
  
  return (
    <StoreLayout>
      <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <h1 className="mb-6 text-center text-2xl font-bold text-gradient">
            {gameOver ? 'Game Over!' : 'Snake Game'}
          </h1>
          
          <div className="mb-4 flex items-center justify-between">
            <div className="text-lg font-bold text-store-pink">Score: {score}</div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setPaused(prev => !prev)}
              disabled={gameOver}
            >
              {paused ? 'Resume' : 'Pause'}
            </Button>
          </div>
          
          <div className="relative mb-6 overflow-hidden rounded-lg border border-gray-200 shadow-lg">
            <canvas
              ref={canvasRef}
              width={boardSize}
              height={boardSize}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              className="block touch-none bg-gray-50"
            />
            
            {(gameOver || paused) && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 text-white">
                <p className="mb-4 text-xl font-bold">
                  {gameOver ? `Game Over! Score: ${score}` : 'Paused'}
                </p>
                <Button variant="outline" onClick={gameOver ? resetGame : () => setPaused(false)}>
                  {gameOver ? 'Play Again' : 'Resume'}
                </Button>
              </div>
            )}
          </div>
          
          {/* Mobile controls */}
          <div className="mb-6 hidden touch-none flex-col items-center sm:hidden">
            <div className="mb-2">
              <Button 
                variant="outline" 
                size="icon" 
                className="h-12 w-12 rounded-full" 
                onClick={() => handleDirectionButton('UP')}
                disabled={gameOver || paused}
              >
                <ArrowUp />
              </Button>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Button 
                variant="outline" 
                size="icon" 
                className="h-12 w-12 rounded-full" 
                onClick={() => handleDirectionButton('LEFT')}
                disabled={gameOver || paused}
              >
                <ArrowLeft />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-12 w-12 rounded-full" 
                onClick={() => handleDirectionButton('DOWN')}
                disabled={gameOver || paused}
              >
                <ArrowDown />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-12 w-12 rounded-full" 
                onClick={() => handleDirectionButton('RIGHT')}
                disabled={gameOver || paused}
              >
                <ArrowRight />
              </Button>
            </div>
          </div>
          
          <div className="mb-2 text-center text-sm text-gray-500">
            <p className="mb-1">Use arrow keys or swipe to control on mobile.</p>
            <p>Press space to pause/resume.</p>
          </div>
          
          <div className="text-center">
            <Link to="/">
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <Home size={16} />
                Return to Store
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </StoreLayout>
  );
};

export default GameEasterEgg;
