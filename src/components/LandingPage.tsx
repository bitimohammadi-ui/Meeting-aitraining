import { Button } from './ui/Button';

interface Props {
  onStart: () => void;
}

export function LandingPage({ onStart }: Props) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-b from-blue-50 to-white">
      <div className="text-center max-w-lg">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Meeting Bingo
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Turn boring meetings into a game! Listen for buzzwords and fill your bingo card.
        </p>

        <Button size="lg" onClick={onStart}>
          New Game
        </Button>

        <div className="mt-12 grid grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-3xl mb-2">🎯</div>
            <h3 className="font-semibold text-gray-800">Pick a Category</h3>
            <p className="text-sm text-gray-500">Choose your buzzword pack</p>
          </div>
          <div>
            <div className="text-3xl mb-2">🎤</div>
            <h3 className="font-semibold text-gray-800">Listen</h3>
            <p className="text-sm text-gray-500">Auto-detects words from your mic</p>
          </div>
          <div>
            <div className="text-3xl mb-2">🏆</div>
            <h3 className="font-semibold text-gray-800">Win!</h3>
            <p className="text-sm text-gray-500">Get 5 in a row for BINGO</p>
          </div>
        </div>

        <p className="mt-8 text-xs text-gray-400">
          Audio is processed locally in your browser and is never recorded or sent to any server.
        </p>
      </div>
    </div>
  );
}
