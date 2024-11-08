import React from 'react';
import SearchSuggestions from './components/SearchSuggestions';
import { GlobeIcon, BookOpenIcon } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <GlobeIcon className="h-6 w-6 text-blue-600" />
              <span className="text-xl font-semibold text-gray-900">OrdSøk</span>
            </div>
            <a 
              href="https://ordbokene.no/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
            >
              Visit Ordbøkene
            </a>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Norwegian Word Search
            </h1>
            <div className="flex items-center justify-center space-x-2 text-gray-600">
              <BookOpenIcon className="h-5 w-5" />
              <p>Discover Norwegian words with instant suggestions</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <SearchSuggestions />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Search Tips</h2>
              <ul className="space-y-2 text-gray-600">
                <li>• Use * for wildcard searches (e.g., "bil*")</li>
                <li>• Search both Bokmål and Nynorsk</li>
                <li>• Click on suggestions to see details</li>
              </ul>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">About</h2>
              <p className="text-gray-600">
                This search tool uses the official Norwegian Dictionary API from the University of Bergen (UiB).
                Perfect for students, writers, and language enthusiasts.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-16 bg-gray-50 border-t border-gray-200">
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-gray-500 text-sm">
            Data provided by the University of Bergen's Dictionary Service
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;