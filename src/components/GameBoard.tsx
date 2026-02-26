import { useState, useCallback } from 'react';
import type { GameState } from '../types';
import { checkForBingo, countFilled } from '../lib/bingoChecker';
import { detectWordsWithAliases } from '../lib/wordDetector';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { BingoCard } from './BingoCard';
import { GameControls } from './GameControls';
import { TranscriptPanel } from './TranscriptPanel';
import { generateCard } from '../lib/cardGenerator';

interface Props {
  game: GameState;
  setGame: React.Dispatch<React.SetStateAction<GameState>>;
  onWin: (winningLine: any, winningWord: string) => void;
}

export function GameBoard({ game, setGame, onWin }: Props) {
  const [detectedWords, setDetectedWords] = useState<string[]>([]);
  const speech = useSpeechRecognition();

  const handleSquareClick = useCallback((row: number, col: number) => {
    if (!game.card) return;
    const square = game.card.squares[row][col];
    if (square.isFreeSpace) return;

    setGame(prev => {
      if (!prev.card) return prev;
      const newSquares = prev.card.squares.map(r => r.map(s => ({ ...s })));
      const target = newSquares[row][col];
      target.isFilled = !target.isFilled;
      target.filledAt = target.isFilled ? Date.now() : null;

      const newCard = { ...prev.card, squares: newSquares };
      const winningLine = checkForBingo(newCard);
      const filled = countFilled(newCard);

      if (winningLine) {
        setTimeout(() => onWin(winningLine, target.word), 100);
      }

      return { ...prev, card: newCard, filledCount: filled };
    });
  }, [game.card, setGame, onWin]);

  const handleTranscriptResult = useCallback((transcript: string) => {
    if (!game.card) return;

    const filledWords = new Set(
      game.card.squares.flat()
        .filter(sq => sq.isFilled)
        .map(sq => sq.word.toLowerCase())
    );

    const detected = detectWordsWithAliases(transcript, game.card.words, filledWords);
    if (detected.length === 0) return;

    setDetectedWords(prev => [...prev, ...detected]);

    setGame(prev => {
      if (!prev.card) return prev;
      const newSquares = prev.card.squares.map(r => r.map(s => ({ ...s })));
      let lastFilledWord = '';

      for (const word of detected) {
        for (const row of newSquares) {
          for (const sq of row) {
            if (sq.word.toLowerCase() === word.toLowerCase() && !sq.isFilled) {
              sq.isFilled = true;
              sq.isAutoFilled = true;
              sq.filledAt = Date.now();
              lastFilledWord = sq.word;
            }
          }
        }
      }

      const newCard = { ...prev.card, squares: newSquares };
      const winningLine = checkForBingo(newCard);
      const filled = countFilled(newCard);

      if (winningLine) {
        setTimeout(() => onWin(winningLine, lastFilledWord), 100);
      }

      return { ...prev, card: newCard, filledCount: filled };
    });
  }, [game.card, setGame, onWin]);

  const handleToggleListening = useCallback(() => {
    if (speech.isListening) {
      speech.stopListening();
    } else {
      speech.startListening(handleTranscriptResult);
    }
  }, [speech, handleTranscriptResult]);

  const handleNewCard = useCallback(() => {
    if (!game.category) return;
    speech.stopListening();
    speech.resetTranscript();
    setDetectedWords([]);
    const card = generateCard(game.category);
    setGame(prev => ({
      ...prev,
      card,
      filledCount: 1,
      winningLine: null,
      winningWord: null,
      startedAt: Date.now(),
    }));
  }, [game.category, setGame, speech]);

  if (!game.card) return null;

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Meeting Bingo</h2>
          <span className="text-sm text-gray-500">
            {game.filledCount}/25 filled
          </span>
        </div>

        <BingoCard
          card={game.card}
          winningLine={game.winningLine}
          onSquareClick={handleSquareClick}
        />

        <GameControls
          isListening={speech.isListening}
          isSpeechSupported={speech.isSupported}
          onToggleListening={handleToggleListening}
          onNewCard={handleNewCard}
        />

        {speech.isSupported && (
          <TranscriptPanel
            transcript={speech.transcript}
            interimTranscript={speech.interimTranscript}
            detectedWords={detectedWords}
            isListening={speech.isListening}
          />
        )}

        {!speech.isSupported && (
          <p className="text-center text-sm text-amber-600 mt-4">
            Speech recognition is not supported in your browser. You can still play manually by tapping squares!
          </p>
        )}
      </div>
    </div>
  );
}
