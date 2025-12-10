
import React, { useState, useRef, ChangeEvent, KeyboardEvent } from 'react';
import { PaperAirplaneIcon } from './icons/PaperAirplaneIcon';
import { PaperClipIcon } from './icons/PaperClipIcon';
import { SquaresPlusIcon } from './icons/SquaresPlusIcon';

interface InputBarProps {
  onSend: (prompt: string, image?: File) => void;
  onOpenTools: () => void;
  isLoading: boolean;
}

export const InputBar: React.FC<InputBarProps> = ({ onSend, onOpenTools, isLoading }) => {
  const [text, setText] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if ((!text.trim() && !imageFile) || isLoading) return;
    onSend(text, imageFile || undefined);
    setText('');
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  }

  return (
    <div className="bg-gray-800 border-t border-gray-700 p-2 rounded-lg shadow-inner max-w-4xl mx-auto">
      {imagePreview && (
        <div className="relative inline-block mb-2 ml-2">
          <img src={imagePreview} alt="Preview" className="h-20 w-20 object-cover rounded-md border border-gray-600"/>
          <button 
            onClick={removeImage} 
            className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold z-10 shadow-sm hover:bg-red-700 transition-colors"
            disabled={isLoading}>
            &times;
          </button>
        </div>
      )}
      <div className="flex items-center space-x-2">
        <button
          onClick={onOpenTools}
          className="p-2 text-gray-400 hover:text-indigo-400 disabled:text-gray-600 transition-colors"
          disabled={isLoading}
          title="Ferramentas de Criação (Cursos, E-books)"
        >
          <SquaresPlusIcon className="w-6 h-6" />
        </button>
        
        <div className="h-6 w-px bg-gray-700 mx-1"></div>

        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-2 text-gray-400 hover:text-indigo-400 disabled:text-gray-600 transition-colors"
          disabled={isLoading}
          aria-label="Anexar imagem"
        >
          <PaperClipIcon className="w-6 h-6" />
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*"
        />
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Digite sua mensagem..."
          className="flex-1 bg-gray-700 text-gray-200 rounded-lg px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-600 placeholder-gray-500"
          rows={1}
          disabled={isLoading}
          style={{ minHeight: '44px', maxHeight: '120px' }}
        />
        <button
          onClick={handleSend}
          className="bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-500 disabled:bg-indigo-800 disabled:cursor-not-allowed transition-colors shadow-md"
          disabled={isLoading || (!text.trim() && !imageFile)}
          aria-label="Enviar mensagem"
        >
          <PaperAirplaneIcon className="w-6 h-6 transform rotate-90" />
        </button>
      </div>
    </div>
  );
};
