
import React from 'react';
import { Button } from "@/components/ui/button";
import { Gamepad2, RefreshCw, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-react";

interface GameControlsProps {
  moves: number;
  time: number;
  isPlaying: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
  onStartGame: () => void;
  onResetGame: () => void;
  onDifficultyChange: (difficulty: 'easy' | 'medium' | 'hard') => void;
}

const GameControls: React.FC<GameControlsProps> = ({
  moves,
  time,
  isPlaying,
  difficulty,
  onStartGame,
  onResetGame,
  onDifficultyChange
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      {/* Game info panel */}
      <div className="mb-4 flex items-center justify-between">
        <div className="text-sm space-y-1">
          <div><span className="font-bold text-store-pink">Movimentos:</span> {moves}</div>
          <div><span className="font-bold text-store-pink">Tempo:</span> {formatTime(time)}</div>
        </div>
        
        {!isPlaying ? (
          <Button onClick={onStartGame} className="flex items-center gap-2">
            <Gamepad2 size={18} />
            Jogar
          </Button>
        ) : (
          <Button variant="outline" onClick={onResetGame} className="flex items-center gap-2">
            <RefreshCw size={18} />
            Reiniciar
          </Button>
        )}
      </div>
      
      {/* Difficulty selector */}
      <div className="mb-4 flex justify-center space-x-2">
        {(['easy', 'medium', 'hard'] as const).map(level => (
          <Button
            key={level}
            variant={difficulty === level ? "default" : "outline"}
            size="sm"
            onClick={() => {
              if (!isPlaying || window.confirm('Alterar a dificuldade reiniciará o jogo. Continuar?')) {
                onDifficultyChange(level);
              }
            }}
          >
            {{
              easy: 'Fácil',
              medium: 'Médio',
              hard: 'Difícil'
            }[level]}
          </Button>
        ))}
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
    </>
  );
};

export default GameControls;
