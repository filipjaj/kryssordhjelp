import React from 'react';
import { X } from 'lucide-react';

interface Category {
  id: string;
  name: string;
}

interface CategoryFilterProps {
  selectedCategories: string[];
  onSelectCategory: (category: string) => void;
  onRemoveCategory: (category: string) => void;
}

const categories: Category[] = [
  { id: 'all', name: 'Alle kategorier' },
  { id: 'fugl', name: 'Fugl' },
  { id: 'fisk', name: 'Fisk' },
  { id: 'dyr', name: 'Dyr' },
  { id: 'plante', name: 'Plante' },
  { id: 'elv', name: 'Elv' }
];

export default function CategoryFilter({ 
  selectedCategories, 
  onSelectCategory, 
  onRemoveCategory 
}: CategoryFilterProps) {
  return (
    <div className="mb-6">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Legg til nytt søkeområde:
        </label>
        <div className="relative">
          <select
            onChange={(e) => onSelectCategory(e.target.value)}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 transition-colors"
            value=""
          >
            <option value="" disabled>Velg søkeområde</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedCategories.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Valgte søkeområder:
          </label>
          <div className="flex flex-wrap gap-2">
            {selectedCategories.map((categoryId) => {
              const category = categories.find(c => c.id === categoryId);
              return (
                <div
                  key={categoryId}
                  className="inline-flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-lg"
                >
                  <span>{category?.name}</span>
                  <button
                    onClick={() => onRemoveCategory(categoryId)}
                    className="ml-2 text-blue-500 hover:text-blue-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}