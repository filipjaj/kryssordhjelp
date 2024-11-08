import React from 'react';

interface LetterCountProps {
  selectedCount: number;
  onSelectCount: (count: number) => void;
}

export default function LetterCount({ selectedCount, onSelectCount }: LetterCountProps) {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Antall bokstaver for ordet:
      </label>
      <div className="grid grid-cols-7 sm:grid-cols-13 gap-2">
        {Array.from({ length: 30 }, (_, i) => i + 1).map((num) => (
          <button
            key={num}
            onClick={() => onSelectCount(num)}
            className={`
              p-2 text-center rounded-lg transition-colors
              ${selectedCount === num
                ? 'bg-teal-500 text-white'
                : 'bg-teal-100 text-teal-700 hover:bg-teal-200'
              }
            `}
          >
            {num}
          </button>
        ))}
      </div>
    </div>
  );
}