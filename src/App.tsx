import { useState } from 'react';
import type { GameState, CategoryId, WinningLine } from './types';
import { LandingPage } from './components/LandingPage';
import { CategorySelect } from './components/CategorySelect';
import { GameBoard } from './components/GameBoard';
import { WinScreen } from './components/WinScreen';
import { generateCard } from './lib/cardGenerator';

type Screen = 'landing' | 'category' | 'game' | 'win';

const INITIAL_GAME_STATE: GameState = {
  status: 'idle',
  category: null,
  card: null,
  isListening: false,
  startedAt: null,
  completedAt: null,
  winningLine: null,
  winningWord: null,
  filledCount: 0,
};

export default function App() {
  const [screen, setScreen] = useState<Screen>('landing');
  const [game, setGame] = useState<GameState>(INITIAL_GAME_STATE);

  const handleStart = () => setScreen('category');

  const handleCategorySelect = (categoryId: CategoryId) => {
    const card = generateCard(categoryId);
    setGame({
      status: 'playing',
      category: categoryId,
      card,
      isListening: false,
      startedAt: Date.now(),
      completedAt: null,
      winningLine: null,
      winningWord: null,
      filledCount: 1,
    });
    setScreen('game');
  };

  const handleWin = (winningLine: WinningLine, winningWord: string) => {
    setGame(prev => ({
      ...prev,
      status: 'won',
      completedAt: Date.now(),
      winningLine,
      winningWord,
    }));
    setScreen('win');
  };

  const handlePlayAgain = () => setScreen('category');

  const handleBackToHome = () => {
    setScreen('landing');
    setGame(INITIAL_GAME_STATE);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {screen === 'landing' && <LandingPage onStart={handleStart} />}
      {screen === 'category' && (
        <CategorySelect onSelect={handleCategorySelect} onBack={handleBackToHome} />
      )}
      {screen === 'game' && game.card && (
        <GameBoard game={game} setGame={setGame} onWin={handleWin} />
      )}
      {screen === 'win' && (
        <WinScreen game={game} onPlayAgain={handlePlayAgain} onHome={handleBackToHome} />
      )}
    </div>
  );
}
