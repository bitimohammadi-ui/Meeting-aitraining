import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import type { GameState } from '../types';
import { shareResult } from '../lib/shareUtils';
import { BingoCard } from './BingoCard';
import { Button } from './ui/Button';

interface Props {
  game: GameState;
  onPlayAgain: () => void;
  onHome: () => void;
}

export function WinScreen({ game, onPlayAgain, onHome }: Props) {
  useEffect(() => {
    const duration = 2000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  }, []);

  const duration = game.startedAt && game.completedAt
    ? Math.round((game.completedAt - game.startedAt) / 1000)
    : null;

  const handleShare = async () => {
    const success = await shareResult(game);
    if (success) {
      // Could show a toast here
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white px-4 py-8">
      <div className="max-w-lg mx-auto text-center">
        <h1 className="text-6xl font-bold text-green-600 mb-2 animate-bounce-in">
          BINGO!
        </h1>
        <p className="text-xl text-gray-600 mb-6">You got 5 in a row!</p>

        {game.card && (
          <div className="mb-6">
            <BingoCard
              card={game.card}
              winningLine={game.winningLine}
              onSquareClick={() => {}}
            />
          </div>
        )}

        <div className="bg-white rounded-xl shadow-md p-6 mb-6 text-left">
          <h3 className="font-bold text-gray-900 mb-3">Game Stats</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Squares Filled</span>
              <p className="font-semibold text-gray-900">{game.filledCount}/25</p>
            </div>
            {duration !== null && (
              <div>
                <span className="text-gray-500">Time</span>
                <p className="font-semibold text-gray-900">
                  {Math.floor(duration / 60)}m {duration % 60}s
                </p>
              </div>
            )}
            {game.winningWord && (
              <div>
                <span className="text-gray-500">Winning Word</span>
                <p className="font-semibold text-gray-900">"{game.winningWord}"</p>
              </div>
            )}
            {game.category && (
              <div>
                <span className="text-gray-500">Category</span>
                <p className="font-semibold text-gray-900 capitalize">{game.category}</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3 justify-center">
          <Button onClick={handleShare} variant="secondary">
            Share Result
          </Button>
          <Button onClick={onPlayAgain}>
            Play Again
          </Button>
          <Button variant="ghost" onClick={onHome}>
            Home
          </Button>
        </div>
      </div>
    </div>
  );
}
