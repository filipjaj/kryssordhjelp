import React, { useState, useEffect } from 'react';
import { Minus, Plus, Search, ArrowLeft } from 'lucide-react';

interface PatternSearchProps {
  onSearch: (pattern: string) => void;
  letterCount: number;
}

export default function PatternSearch({ onSearch, letterCount }: PatternSearchProps) {
  const [letters, setLetters] = useState<string[]>(Array(letterCount || 3).fill(''));

  useEffect(() => {
    if (letterCount > 0) {
      setLetters(Array(letterCount).fill(''));
    }
  }, [letterCount]);

  const handleLetterChange = (index: number, value: string) => {
    const newLetters = [...letters];
    newLetters[index] = value.toUpperCase();
    setLetters(newLetters);
    
    // Convert pattern to API format (underscores for empty spaces)
    const pattern = newLetters.map(l => l || '_').join('');
    onSearch(pattern);
  };

  const addLetter = () => {
    setLetters([...letters, '']);
  };

  const removeLetter = () => {
    if (letters.length > 1) {
      const newLetters = letters.slice(0, -1);
      setLetters(newLetters);
      onSearch(newLetters.map(l => l || '_').join(''));
    }
  };

  const clearLetters = () => {
    const emptyLetters = Array(letters.length).fill('');
    setLetters(emptyLetters);
    onSearch(emptyLetters.map(() => '_').join(''));
  };

  return (
    <div className="mb-8">
      <label className="block text-sm font-medium text-gray-700 mb-4">
        Enter known letters (leave empty for unknown):
      </label>
      
      <div className="flex flex-wrap items-center gap-2 mb-6">
        {letters.map((letter, index) => (
          <input
            key={index}
            type="text"
            maxLength={1}
            value={letter}
            onChange={(e) => handleLetterChange(index, e.target.value)}
            className="w-12 h-12 text-center text-xl font-medium border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all uppercase"
            placeholder="_"
          />
        ))}
        
        <div className="flex space-x-2">
          <button
            onClick={removeLetter}
            disabled={letters.length <= 1}
            className="w-12 h-12 flex items-center justify-center bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Remove letter"
          >
            <Minus className="w-5 h-5" />
          </button>
          
          <button
            onClick={addLetter}
            className="w-12 h-12 flex items-center justify-center bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
            title="Add letter"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex space-x-3">
        <button
          onClick={clearLetters}
          className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Clear</span>
        </button>
        
        <button
          onClick={() => onSearch(letters.map(l => l || '_').join(''))}
          className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
        >
          <Search className="w-4 h-4" />
          <span>Search</span>
        </button>
      </div>
    </div>
  );
}