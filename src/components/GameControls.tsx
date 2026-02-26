import { Button } from './ui/Button';
import { cn } from '../lib/utils';

interface Props {
  isListening: boolean;
  isSpeechSupported: boolean;
  onToggleListening: () => void;
  onNewCard: () => void;
}

export function GameControls({ isListening, isSpeechSupported, onToggleListening, onNewCard }: Props) {
  return (
    <div className="flex gap-3 justify-center mt-4">
      {isSpeechSupported && (
        <Button
          variant={isListening ? 'primary' : 'secondary'}
          onClick={onToggleListening}
          className={cn(isListening && 'bg-red-500 hover:bg-red-600')}
        >
          {isListening ? '🎤 Stop Listening' : '🎤 Start Listening'}
        </Button>
      )}
      <Button variant="secondary" onClick={onNewCard}>
        🔄 New Card
      </Button>
    </div>
  );
}
