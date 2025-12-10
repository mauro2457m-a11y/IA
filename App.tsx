import React, { useState, useEffect, useRef } from 'react';
import { Message, MessageRole } from './types';
import { ChatBubble } from './components/ChatBubble';
import { InputBar } from './components/InputBar';
import { runQuery } from './services/geminiService';
import { SparklesIcon } from './components/icons/SparklesIcon';
import { ApiKeyScreen } from './components/ApiKeyScreen';

const App: React.FC = () => {
  const [apiKey, setApiKey] = useState<string | null>(localStorage.getItem('gemini-api-key'));
  const [messages, setMessages] = useState<Message[]>([
    {
      role: MessageRole.MODEL,
      text: "Olá! Eu sou sua IA Universal. Como posso te ajudar hoje? Você pode me fazer perguntas, pedir para eu analisar uma imagem ou até mesmo gerar uma para você.",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleKeySubmit = (key: string) => {
    localStorage.setItem('gemini-api-key', key);
    setApiKey(key);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const fileToBase64 = (file: File): Promise<{ data: string, mimeType: string }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        const data = result.split(',')[1];
        const mimeType = result.split(';')[0].split(':')[1];
        resolve({ data, mimeType });
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSend = async (prompt: string, imageFile?: File) => {
    if (isLoading || (!prompt && !imageFile) || !apiKey) return;

    setIsLoading(true);

    let userMessage: Message = {
      role: MessageRole.USER,
      text: prompt,
    };

    let imagePayload: { data: string; mimeType: string; } | undefined = undefined;

    if (imageFile) {
      try {
        const { data, mimeType } = await fileToBase64(imageFile);
        userMessage.imageUrl = `data:${mimeType};base64,${data}`;
        imagePayload = { data, mimeType };
      } catch (error) {
        console.error("Error converting file to base64:", error);
        setMessages(prev => [
          ...prev, 
          userMessage,
          {
            role: MessageRole.ERROR,
            text: 'Desculpe, houve um erro ao processar sua imagem.'
          }
        ]);
        setIsLoading(false);
        return;
      }
    }
    
    setMessages(prev => [...prev, userMessage]);

    try {
      const aiResponse = await runQuery(prompt, apiKey, imagePayload);
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error("Error from Gemini API:", error);
      const errorMessage = error instanceof Error ? error.message : "Ocorreu um erro desconhecido.";
      setMessages(prev => [
        ...prev,
        {
          role: MessageRole.ERROR,
          text: `Desculpe, algo deu errado: ${errorMessage}`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!apiKey) {
    return <ApiKeyScreen onKeySubmit={handleKeySubmit} />;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <header className="bg-gray-800/50 backdrop-blur-sm shadow-lg p-4 flex items-center justify-center sticky top-0 z-10">
        <SparklesIcon className="w-6 h-6 text-indigo-400 mr-2" />
        <h1 className="text-xl font-bold text-gray-100">IA Universal</h1>
      </header>
      <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {messages.map((msg, index) => (
          <ChatBubble key={index} message={msg} />
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-center space-x-2 bg-gray-800 p-3 rounded-lg max-w-lg">
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </main>
      <footer className="p-4 bg-gray-900/80 backdrop-blur-sm sticky bottom-0">
        <InputBar onSend={handleSend} isLoading={isLoading} />
      </footer>
    </div>
  );
};

export default App;