
import React from 'react';
import { Message, MessageRole } from '../types';
import { SparklesIcon } from './icons/SparklesIcon';

interface ChatBubbleProps {
  message: Message;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isUser = message.role === MessageRole.USER;
  const isError = message.role === MessageRole.ERROR;

  const bubbleClasses = isUser
    ? 'bg-indigo-600 text-white self-end'
    : isError
    ? 'bg-red-500/20 text-red-300 border border-red-500/50'
    : 'bg-gray-800 text-gray-200 self-start';
  
  const containerClasses = isUser ? 'justify-end' : 'justify-start';

  return (
    <div className={`flex ${containerClasses}`}>
      <div className={`flex flex-col rounded-lg p-3 max-w-xs md:max-w-md lg:max-w-2xl shadow-md ${bubbleClasses}`}>
        {!isUser && !isError && (
            <div className="flex items-center mb-2 text-indigo-400">
                <SparklesIcon className="w-4 h-4 mr-1" />
                <span className="text-xs font-bold">IA Universal</span>
            </div>
        )}
        {message.imageUrl && (
          <img
            src={message.imageUrl}
            alt="User upload"
            className="rounded-lg mb-2 max-h-64 w-full object-contain"
          />
        )}
        {message.text && (
          <p className="whitespace-pre-wrap text-sm">{message.text}</p>
        )}
      </div>
    </div>
  );
};
