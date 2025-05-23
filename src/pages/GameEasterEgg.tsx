import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Home, RefreshCw, Gamepad2, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Heart, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import StoreLayout from "@/components/layout/StoreLayout";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

// Define our puzzle piece type
type PuzzlePiece = {
  value: number;
  x: number;
  y: number;
};
const GameEasterEgg = () => {
  // Game state
  const [gridSize, setGridSize] = useState(3);
  const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
  const [emptyPos, setEmptyPos] = useState({
    x: gridSize - 1,
    y: gridSize - 1
  });
  const [moves, setMoves] = useState(0);
  const [isSolved, setIsSolved] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [startTime, setStartTime] = useState(0);
  const [time, setTime] = useState(0);
  const [touchStart, setTouchStart] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const [sparkleAnimation, setSparkleAnimation] = useState(false);

  // Game constants
  const tileSize = Math.min(window.innerWidth - 40, 300) / gridSize;
  const boardSize = tileSize * gridSize;

  // Calculate difficulty settings
  const getDifficultySettings = () => {
    switch (difficulty) {
      case 'easy':
        return {
          gridSize: 3,
          shuffleCount: 20
        };
      case 'medium':
        return {
          gridSize: 4,
          shuffleCount: 40
        };
      case 'hard':
        return {
          gridSize: 5,
          shuffleCount: 80
        };
      default:
        return {
          gridSize: 3,
          shuffleCount: 20
        };
    }
  };

  // Initialize and reset game
  const initGame = () => {
    const {
      gridSize: newSize
    } = getDifficultySettings();
    setGridSize(newSize);
    setEmptyPos({
      x: newSize - 1,
      y: newSize - 1
    });
    setMoves(0);
    setIsSolved(false);
    setIsPlaying(false);
    setTime(0);

    // Create ordered pieces
    const newPieces: PuzzlePiece[] = [];
    for (let y = 0; y < newSize; y++) {
      for (let x = 0; x < newSize; x++) {
        if (x !== newSize - 1 || y !== newSize - 1) {
          newPieces.push({
            value: y * newSize + x + 1,
            x,
            y
          });
        }
      }
    }
    setPieces(newPieces);
  };

  // Start game with shuffled pieces
  const startGame = () => {
    const {
      shuffleCount
    } = getDifficultySettings();

    // Shuffle pieces by making random valid moves
    let currentPieces = [...pieces];
    let currentEmpty = {
      ...emptyPos
    };
    for (let i = 0; i < shuffleCount; i++) {
      // Get possible moves
      const possibleMoves = [{
        x: currentEmpty.x + 1,
        y: currentEmpty.y
      },
      // Right
      {
        x: currentEmpty.x - 1,
        y: currentEmpty.y
      },
      // Left
      {
        x: currentEmpty.x,
        y: currentEmpty.y + 1
      },
      // Down
      {
        x: currentEmpty.x,
        y: currentEmpty.y - 1
      } // Up
      ].filter(move => move.x >= 0 && move.x < gridSize && move.y >= 0 && move.y < gridSize);

      // Pick random move
      const move = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];

      // Find piece at move position
      const pieceIndex = currentPieces.findIndex(p => p.x === move.x && p.y === move.y);
      if (pieceIndex !== -1) {
        // Move piece to empty spot
        currentPieces[pieceIndex] = {
          ...currentPieces[pieceIndex],
          x: currentEmpty.x,
          y: currentEmpty.y
        };

        // Update empty position
        currentEmpty = {
          x: move.x,
          y: move.y
        };
      }
    }
    setPieces(currentPieces);
    setEmptyPos(currentEmpty);
    setIsPlaying(true);
    setStartTime(Date.now());
  };

  // Check if puzzle is solved
  const checkSolution = () => {
    for (let piece of pieces) {
      const correctPos = {
        x: (piece.value - 1) % gridSize,
        y: Math.floor((piece.value - 1) / gridSize)
      };
      if (piece.x !== correctPos.x || piece.y !== correctPos.y) {
        return false;
      }
    }
    return true;
  };

  // Handle piece movement
  const movePiece = (piece: PuzzlePiece) => {
    if (!isPlaying || isSolved) return;

    // Check if piece is adjacent to empty space
    const isAdjacent = Math.abs(piece.x - emptyPos.x) === 1 && piece.y === emptyPos.y || Math.abs(piece.y - emptyPos.y) === 1 && piece.x === emptyPos.x;
    if (isAdjacent) {
      // Move piece to empty position
      const newPieces = pieces.map(p => {
        if (p.value === piece.value) {
          return {
            ...p,
            x: emptyPos.x,
            y: emptyPos.y
          };
        }
        return p;
      });

      // Update empty position
      setEmptyPos({
        x: piece.x,
        y: piece.y
      });

      // Update pieces and count move
      setPieces(newPieces);
      setMoves(moves + 1);
    }
  };

  // Handle keyboard controls
  const handleKeyDown = (e: React.KeyboardEvent | KeyboardEvent) => {
    if (!isPlaying || isSolved) return;
    let dx = 0,
      dy = 0;
    switch (e.key) {
      case 'ArrowUp':
        dy = 1;
        break;
      case 'ArrowDown':
        dy = -1;
        break;
      case 'ArrowLeft':
        dx = 1;
        break;
      case 'ArrowRight':
        dx = -1;
        break;
      default:
        return;
    }

    // Find piece that would move into the empty space
    const pieceToMove = pieces.find(p => p.x === emptyPos.x + dx && p.y === emptyPos.y + dy);
    if (pieceToMove) {
      movePiece(pieceToMove);
    }
  };

  // Handle touch controls for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isPlaying || isSolved) return;
    const touch = e.touches[0];
    setTouchStart({
      x: touch.clientX,
      y: touch.clientY
    });
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart || !isPlaying || isSolved) return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStart.x;
    const dy = touch.clientY - touchStart.y;

    // Determine swipe direction (require min distance to count as swipe)
    const minSwipeDistance = 30;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > minSwipeDistance) {
      // Horizontal swipe
      const pieceToMove = pieces.find(p => dx > 0 && p.x === emptyPos.x - 1 && p.y === emptyPos.y || dx < 0 && p.x === emptyPos.x + 1 && p.y === emptyPos.y);
      if (pieceToMove) movePiece(pieceToMove);
    } else if (Math.abs(dy) > minSwipeDistance) {
      // Vertical swipe
      const pieceToMove = pieces.find(p => dy > 0 && p.x === emptyPos.x && p.y === emptyPos.y - 1 || dy < 0 && p.x === emptyPos.x && p.y === emptyPos.y + 1);
      if (pieceToMove) movePiece(pieceToMove);
    }
    setTouchStart(null);
  };

  // Animation for the developer button
  const triggerSparkleAnimation = () => {
    setSparkleAnimation(true);
    setTimeout(() => setSparkleAnimation(false), 1000);
  };

  // Key press effect
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pieces, emptyPos, isPlaying, isSolved]);

  // Timer effect
  useEffect(() => {
    let timer: number;
    if (isPlaying && !isSolved) {
      timer = window.setInterval(() => {
        setTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, isSolved, startTime]);

  // Check win condition
  useEffect(() => {
    if (isPlaying && pieces.length > 0) {
      const solved = checkSolution();
      if (solved) {
        setIsSolved(true);
        setIsPlaying(false);
      }
    }
  }, [pieces, isPlaying]);

  // Initialize game on mount and when difficulty changes
  useEffect(() => {
    initGame();
  }, [difficulty]);

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Render each puzzle piece
  const renderPiece = (piece: PuzzlePiece) => {
    const isCorrectPosition = piece.x === (piece.value - 1) % gridSize && piece.y === Math.floor((piece.value - 1) / gridSize);
    return <div key={piece.value} onClick={() => movePiece(piece)} className={`absolute flex items-center justify-center rounded-md cursor-pointer transition-all duration-200
          ${isCorrectPosition ? 'bg-green-100' : 'bg-white'} 
          border-2 ${isPlaying ? 'border-gray-200' : 'border-store-pink'}
          shadow-md hover:shadow-lg active:scale-95 select-none`} style={{
      width: tileSize + 'px',
      height: tileSize + 'px',
      left: piece.x * tileSize + 'px',
      top: piece.y * tileSize + 'px',
      fontSize: tileSize / 2.5 + 'px',
      fontWeight: 'bold',
      color: isCorrectPosition ? 'rgb(22, 163, 74)' : '#FF1B8D',
      transition: 'left 0.2s, top 0.2s'
    }}>
        {piece.value}
      </div>;
  };

  // Main render
  return <StoreLayout>
      <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <h1 className="mb-6 text-center text-2xl font-bold text-gradient">
            {isSolved ? 'Parabéns!' : 'Quebra-cabeça'}
          </h1>
          
          {/* Game info panel */}
          <div className="mb-4 flex items-center justify-between">
            <div className="text-sm space-y-1">
              <div><span className="font-bold text-store-pink">Movimentos:</span> {moves}</div>
              <div><span className="font-bold text-store-pink">Tempo:</span> {formatTime(time)}</div>
            </div>
            
            {!isPlaying ? <Button onClick={startGame} className="flex items-center gap-2">
                <Gamepad2 size={18} />
                {pieces.length > 0 ? 'Jogar' : 'Carregando...'}
              </Button> : <Button variant="outline" onClick={initGame} className="flex items-center gap-2">
                <RefreshCw size={18} />
                Reiniciar
              </Button>}
          </div>
          
          {/* Difficulty selector */}
          <div className="mb-4 flex justify-center space-x-2">
            {(['easy', 'medium', 'hard'] as const).map(level => <Button key={level} variant={difficulty === level ? "default" : "outline"} size="sm" onClick={() => {
            if (!isPlaying || window.confirm('Alterar a dificuldade reiniciará o jogo. Continuar?')) {
              setDifficulty(level);
            }
          }}>
                {{
              easy: 'Fácil',
              medium: 'Médio',
              hard: 'Difícil'
            }[level]}
              </Button>)}
          </div>
          
          {/* Game board */}
          <div className="relative mb-6 mx-auto bg-gray-100 rounded-lg overflow-hidden border border-gray-200 shadow-lg touch-none" style={{
          width: boardSize + 'px',
          height: boardSize + 'px',
          maxWidth: '100%',
          touchAction: 'none'
        }} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
            {pieces.map(renderPiece)}
            
            {/* Game overlay messages */}
            {!isPlaying && pieces.length > 0 && !isSolved && <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white rounded-lg">
                <div className="text-center p-4">
                  <p className="text-lg font-bold mb-2">Pronto para começar?</p>
                  <Button onClick={startGame}>Iniciar Jogo</Button>
                </div>
              </div>}
            
            {isSolved && <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-white rounded-lg animate-fade-in">
                <div className="text-center p-6">
                  <p className="text-xl font-bold mb-2">Você venceu! 🎉</p>
                  <p className="mb-4">
                    Movimentos: {moves} | Tempo: {formatTime(time)}
                  </p>
                  <Button onClick={initGame}>Jogar Novamente</Button>
                </div>
              </div>}
          </div>
          
          {/* Help Accordion */}
          <div className="mb-6">
            <Accordion type="single" collapsible className="bg-white rounded-lg shadow-md border border-gray-200">
              <AccordionItem value="instructions" className="border-b-0">
                <AccordionTrigger className="px-4 py-3 text-store-pink hover:no-underline">
                  <span className="flex items-center">
                    <Gamepad2 className="mr-2 h-4 w-4" />
                    Como Jogar
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 text-gray-700">
                  <div className="space-y-3">
                    <p><strong>Objetivo:</strong> Organizar os números em ordem crescente, deixando o espaço vazio no canto inferior direito.</p>
                    
                    <div>
                      <p className="font-medium mb-1">Como mover as peças:</p>
                      <ul className="list-disc pl-5 space-y-1 text-sm">
                        <li>Clique em uma peça adjacente ao espaço vazio para movê-la</li>
                        <li>Use as setas do teclado para mover as peças</li>
                        <li>Em dispositivos móveis, deslize na direção desejada</li>
                      </ul>
                    </div>
                    
                    <div>
                      <p className="font-medium mb-1">Níveis de dificuldade:</p>
                      <ul className="list-disc pl-5 space-y-1 text-sm">
                        <li><span className="font-medium">Fácil:</span> Grade 3×3 (8 peças)</li>
                        <li><span className="font-medium">Médio:</span> Grade 4×4 (15 peças)</li>
                        <li><span className="font-medium">Difícil:</span> Grade 5×5 (24 peças)</li>
                      </ul>
                    </div>
                    
                    <p><strong>Dica:</strong> Tente resolver primeiro as linhas superiores, depois foque nas peças restantes.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          
          {/* Mobile control hints */}
          <div className="mb-6 text-center">
            <p className="text-sm text-gray-500 mb-2">Como jogar:</p>
            <div className="flex justify-center gap-4">
              <div className="flex flex-col items-center">
                <div className="flex gap-1 mb-1">
                  <Button variant="outline" size="icon" disabled className="h-8 w-8 cursor-default">
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex gap-1">
                  <Button variant="outline" size="icon" disabled className="h-8 w-8 cursor-default">
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" disabled className="h-8 w-8 cursor-default">
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" disabled className="h-8 w-8 cursor-default">
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-1">Use setas ou deslize</p>
              </div>
            </div>
          </div>
          
          {/* Developer credit button with special animation */}
          <div className="my-8 text-center relative">
            <a href="https://kuky.pro" target="_blank" rel="noopener noreferrer" onMouseEnter={triggerSparkleAnimation} onClick={triggerSparkleAnimation} className="inline-block">
              <div className="relative">
                <Button size="lg" className={`
                    group relative overflow-hidden transition-all duration-500 
                    bg-gradient-to-r from-store-pink via-store-purple to-store-blue 
                    hover:from-store-blue hover:via-store-purple hover:to-store-pink
                    shadow-lg hover:shadow-xl text-white font-bold py-3 px-6
                    ${sparkleAnimation ? 'animate-pulse' : ''}
                  `}>
                  <div className="relative z-10 flex items-center gap-2">
                    <Heart className="h-5 w-5 text-white animate-pulse" />
                    <span>Site Criado por Kuky</span>
                    <Sparkles className={`h-5 w-5 text-white ${sparkleAnimation ? 'animate-bounce-subtle' : ''}`} />
                  </div>
                  <div className="absolute inset-0 w-full h-full bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
                </Button>
                {sparkleAnimation && <div className="absolute -inset-4 pointer-events-none">
                    <div className="absolute top-0 left-1/4 w-2 h-2 bg-yellow-300 rounded-full animate-ping" style={{
                  animationDuration: '1s'
                }}></div>
                    <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-store-pink rounded-full animate-ping" style={{
                  animationDuration: '1.5s'
                }}></div>
                    <div className="absolute bottom-0 right-1/3 w-2 h-2 bg-store-blue rounded-full animate-ping" style={{
                  animationDuration: '0.8s'
                }}></div>
                    <div className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-store-purple rounded-full animate-ping" style={{
                  animationDuration: '1.2s'
                }}></div>
                    <div className="absolute -top-2 right-1/2 w-2 h-2 bg-store-yellow rounded-full animate-ping" style={{
                  animationDuration: '1s'
                }}></div>
                  </div>}
              </div>
            </a>
          </div>
          
          {/* Return button */}
          <div className="text-center">
            <Link to="/">
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <Home size={16} />
                Voltar para a Loja
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </StoreLayout>;
};
export default GameEasterEgg;