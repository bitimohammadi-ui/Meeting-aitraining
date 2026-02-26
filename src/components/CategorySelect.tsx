import type { CategoryId } from '../types';
import { CATEGORIES } from '../data/categories';
import { Card } from './ui/Card';
import { Button } from './ui/Button';

interface Props {
  onSelect: (categoryId: CategoryId) => void;
  onBack: () => void;
}

export function CategorySelect({ onSelect, onBack }: Props) {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <Button variant="ghost" size="sm" onClick={onBack} className="mb-6">
          ← Back
        </Button>

        <h2 className="text-3xl font-bold text-gray-900 mb-2">Choose a Category</h2>
        <p className="text-gray-600 mb-8">Pick a buzzword pack for your bingo card</p>

        <div className="grid gap-4 sm:grid-cols-3">
          {CATEGORIES.map(category => (
            <Card
              key={category.id}
              onClick={() => onSelect(category.id)}
              className="hover:ring-2 hover:ring-blue-400 transition-all"
            >
              <div className="text-4xl mb-3">{category.icon}</div>
              <h3 className="text-lg font-bold text-gray-900">{category.name}</h3>
              <p className="text-sm text-gray-500 mb-4">{category.description}</p>
              <div className="flex flex-wrap gap-1">
                {category.words.slice(0, 5).map(word => (
                  <span
                    key={word}
                    className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
                  >
                    {word}
                  </span>
                ))}
                <span className="text-xs text-gray-400">+{category.words.length - 5} more</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
