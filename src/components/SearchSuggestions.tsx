import React, { useState, useCallback } from 'react';
import { Search, Loader2, BookOpen, Languages } from 'lucide-react';
import useDebounce from '../hooks/useDebounce';
import CategoryFilter from './CategoryFilter';
import LetterCount from './LetterCount';
import PatternSearch from './PatternSearch';

interface Suggestion {
  word: string;
  dict: string[];
  wordClass: string;
}

export default function SearchSuggestions() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedSuggestion, setSelectedSuggestion] = useState<Suggestion | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [letterCount, setLetterCount] = useState<number>(0);
  const [searchMode, setSearchMode] = useState<'text' | 'pattern'>('pattern');

  const fetchSuggestions = useCallback(async (searchQuery: string, isPattern: boolean = false) => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Base URL with common parameters
      let apiUrl = 'https://ord.uib.no/api/suggest?dict=bm,nn&n=50&include=ef';
      
      if (isPattern) {
        // For pattern search, use the exact pattern with wildcards
        apiUrl += `&q=${encodeURIComponent(searchQuery.replace(/\./g, '_'))}`;
      } else {
        // For text search, use regular query with optional letter count
        apiUrl += `&q=${encodeURIComponent(searchQuery)}`;
        if (letterCount > 0) {
          apiUrl += `&w=.{${letterCount}}`;
        }
      }
      
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error('Failed to fetch suggestions');
      
      const data = await response.json();
      
      // Combine exact and freetext matches for better results
      const exactMatches = (data.a.exact || []).map((item: [string, string[]]) => ({
        word: item[0],
        dict: item[1],
        wordClass: 'Unknown'
      }));

      const freetextMatches = (data.a.freetext || []).map((item: [string, string[]]) => ({
        word: item[0],
        dict: item[1],
        wordClass: 'Unknown'
      }));

      // Combine and deduplicate results
      const allMatches = [...exactMatches, ...freetextMatches];
      const uniqueMatches = Array.from(new Map(allMatches.map(item => [item.word, item])).values());
      
      setSuggestions(uniqueMatches);
    } catch (err) {
      setError('Failed to fetch suggestions. Please try again.');
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, [letterCount]);

  const debouncedFetch = useDebounce(fetchSuggestions, 300);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setSelectedSuggestion(null);
    debouncedFetch(value, false);
  };

  const handlePatternSearch = (pattern: string) => {
    fetchSuggestions(pattern, true);
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
    setSelectedSuggestion(suggestion);
    setQuery(suggestion.word);
    setSuggestions([]);
  };

  const handleCategorySelect = (category: string) => {
    if (!selectedCategories.includes(category)) {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleCategoryRemove = (category: string) => {
    setSelectedCategories(selectedCategories.filter(c => c !== category));
  };

  const handleLetterCountSelect = (count: number) => {
    setLetterCount(letterCount === count ? 0 : count);
    if (query) {
      debouncedFetch(query, false);
    }
  };

  const getDictionaryLabel = (dict: string[]) => {
    const labels = {
      bm: 'Bokmål',
      nn: 'Nynorsk'
    };
    return dict.map(d => labels[d as keyof typeof labels]).join(', ');
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="mb-6">
        <div className="flex space-x-4 mb-6">
        <button
            onClick={() => setSearchMode('pattern')}
            className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
              searchMode === 'pattern'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Pattern Search
          </button>
          <button
            onClick={() => setSearchMode('text')}
            className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
              searchMode === 'text'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Text Search
          </button>
   
        </div>
      </div>

  

      {searchMode === 'text' ? (
        <>
          <LetterCount
            selectedCount={letterCount}
            onSelectCount={handleLetterCountSelect}
          />

          <div className="relative">
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={handleInputChange}
                placeholder="Start typing to search Norwegian words..."
                className="w-full px-4 py-4 pl-12 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-lg"
                autoComplete="off"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>
        </>
      ) : (
        <PatternSearch onSearch={handlePatternSearch} letterCount={letterCount} />
      )}

      {isLoading && (
        <div className="flex justify-center my-4">
          <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
        </div>
      )}

      {error && (
        <div className="mt-2 text-red-500 text-sm flex items-center space-x-1">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {suggestions.length > 0 && (
        <div className="mt-4 bg-white rounded-xl shadow-lg border border-gray-200 max-h-96 overflow-y-auto">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <span className="text-sm text-gray-600">
              Found {suggestions.length} matches
            </span>
          </div>
          {suggestions.map((suggestion, index) => (
            <div
              key={`${suggestion.word}-${index}`}
              onClick={() => handleSuggestionClick(suggestion)}
              className="px-6 py-4 hover:bg-blue-50 cursor-pointer border-b last:border-b-0 transition-colors"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-4 h-4 text-gray-400" />
                  <span className="font-medium text-gray-900">{suggestion.word}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Languages className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {getDictionaryLabel(suggestion.dict)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedSuggestion && !suggestions.length && (
        <div className="mt-4 p-6 bg-blue-50 rounded-xl border border-blue-100">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {selectedSuggestion.word}
              </h3>
              <p className="text-gray-600">
                Available in: {getDictionaryLabel(selectedSuggestion.dict)}
              </p>
            </div>
            <a
              href={`https://ordbokene.no/bm/search?q=${encodeURIComponent(selectedSuggestion.word)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 text-sm flex items-center space-x-1"
            >
              <span>View in Dictionary</span>
              <span>↗</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}