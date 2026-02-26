import type { GameState } from '../types';

export function generateShareText(game: GameState): string {
  if (!game.card) return '';

  const grid = game.card.squares
    .map(row =>
      row.map(sq => {
        if (sq.isFreeSpace) return '⭐';
        if (sq.isFilled) return '🟩';
        return '⬜';
      }).join('')
    )
    .join('\n');

  const duration = game.startedAt && game.completedAt
    ? Math.round((game.completedAt - game.startedAt) / 1000)
    : null;

  const lines = [
    '🎯 Meeting Bingo!',
    '',
    grid,
    '',
    `📊 ${game.filledCount}/25 squares filled`,
  ];

  if (duration) {
    const mins = Math.floor(duration / 60);
    const secs = duration % 60;
    lines.push(`⏱️ ${mins}m ${secs}s`);
  }

  if (game.winningWord) {
    lines.push(`🏆 Winning word: "${game.winningWord}"`);
  }

  return lines.join('\n');
}

export async function shareResult(game: GameState): Promise<boolean> {
  const text = generateShareText(game);

  if (navigator.share) {
    try {
      await navigator.share({ text });
      return true;
    } catch {
      // User cancelled or share failed, fall through to clipboard
    }
  }

  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
