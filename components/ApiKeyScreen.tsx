import React, { useState } from 'react';
import { KeyIcon } from './icons/KeyIcon';
import { SparklesIcon } from './icons/SparklesIcon';

interface ApiKeyScreenProps {
  onKeySubmit: (key: string) => void;
}

export const ApiKeyScreen: React.FC<ApiKeyScreenProps> = ({ onKeySubmit }) => {
  const [apiKey, setApiKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      onKeySubmit(apiKey.trim());
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white p-4">
      <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-700">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center bg-indigo-500/10 p-3 rounded-full mb-4">
              <SparklesIcon className="w-8 h-8 text-indigo-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-100">Bem-vindo à IA Universal</h1>
          <p className="text-gray-400 mt-2">Para começar, por favor, insira sua chave da API do Google Gemini.</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="relative mb-4">
              <KeyIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Cole sua chave da API aqui"
                className="w-full bg-gray-700 text-gray-200 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
          </div>
          
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-500 disabled:bg-indigo-800 disabled:cursor-not-allowed transition-colors duration-200"
            disabled={!apiKey.trim()}
          >
            Salvar e Iniciar
          </button>
        </form>

        <div className="text-center mt-6">
            <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-400 hover:text-indigo-300 underline">
                Não tem uma chave? Obtenha uma aqui.
            </a>
        </div>
      </div>
    </div>
  );
};
