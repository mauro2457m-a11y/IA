
import React, { useState } from 'react';
import { AcademicCapIcon } from './icons/AcademicCapIcon';
import { BookOpenIcon } from './icons/BookOpenIcon';

export type CreationType = 'COURSE' | 'EBOOK';

interface CreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (prompt: string) => void;
}

export const CreationModal: React.FC<CreationModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [type, setType] = useState<CreationType | null>(null);
  
  // Form States
  const [topic, setTopic] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [style, setStyle] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let prompt = '';

    if (type === 'COURSE') {
      prompt = `Atue como um especialista em design instrucional e educação.
Crie uma ESTRUTURA COMPLETA DE CURSO sobre o tema: "${topic}".
Público-alvo: "${targetAudience}".
Tom/Estilo: "${style || 'Profissional e didático'}".

A resposta deve ser formatada em Markdown e incluir:
1. Título do Curso (Cativante).
2. Descrição e Objetivos de Aprendizado.
3. Estrutura de Módulos (Mínimo 5 módulos).
4. Para cada módulo, liste as aulas e um breve resumo do conteúdo de cada aula.
5. Sugestão de exercícios práticos ou projetos.`;
    } else if (type === 'EBOOK') {
      prompt = `Atue como um autor best-seller e editor profissional.
Crie o PLANEJAMENTO E O PRIMEIRO CAPÍTULO de um E-book sobre: "${topic}".
Público-alvo: "${targetAudience}".
Gênero/Estilo: "${style || 'Informativo e envolvente'}".

A resposta deve ser formatada em Markdown e incluir:
1. Título e Subtítulo Sugeridos.
2. Sumário Detalhado (Lista de capítulos com breves descrições).
3. Uma Introdução completa e engajadora.
4. O CAPÍTULO 1 COMPLETO escrito no estilo solicitado.`;
    }

    onSubmit(prompt);
    resetForm();
  };

  const resetForm = () => {
    setTopic('');
    setTargetAudience('');
    setStyle('');
    setType(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-gray-800 border border-gray-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-gray-900/50 p-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            {type === 'COURSE' && <AcademicCapIcon className="w-6 h-6 text-indigo-400" />}
            {type === 'EBOOK' && <BookOpenIcon className="w-6 h-6 text-emerald-400" />}
            {!type && "Ferramentas de Criação"}
            {type === 'COURSE' ? 'Criar Curso' : type === 'EBOOK' ? 'Criar E-book' : ''}
          </h2>
          <button onClick={resetForm} className="text-gray-400 hover:text-white transition-colors">
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {!type ? (
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setType('COURSE')}
                className="flex flex-col items-center justify-center p-6 bg-gray-700/50 hover:bg-indigo-600/20 border border-gray-600 hover:border-indigo-500 rounded-xl transition-all group"
              >
                <AcademicCapIcon className="w-12 h-12 text-gray-300 group-hover:text-indigo-400 mb-3" />
                <span className="text-lg font-medium text-gray-200 group-hover:text-white">Criar Curso</span>
                <p className="text-xs text-gray-400 text-center mt-2">Estrutura completa, módulos e aulas.</p>
              </button>

              <button
                onClick={() => setType('EBOOK')}
                className="flex flex-col items-center justify-center p-6 bg-gray-700/50 hover:bg-emerald-600/20 border border-gray-600 hover:border-emerald-500 rounded-xl transition-all group"
              >
                <BookOpenIcon className="w-12 h-12 text-gray-300 group-hover:text-emerald-400 mb-3" />
                <span className="text-lg font-medium text-gray-200 group-hover:text-white">Criar E-book</span>
                <p className="text-xs text-gray-400 text-center mt-2">Título, sumário e primeiro capítulo.</p>
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Tema / Assunto
                </label>
                <input
                  type="text"
                  required
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder={type === 'COURSE' ? "Ex: Marketing Digital para Iniciantes" : "Ex: Guia de Alimentação Saudável"}
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none border border-gray-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Público-Alvo
                </label>
                <input
                  type="text"
                  required
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  placeholder="Ex: Jovens empreendedores, Donas de casa, Estudantes..."
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none border border-gray-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Estilo / Tom (Opcional)
                </label>
                <input
                  type="text"
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  placeholder="Ex: Divertido, Formal, Acadêmico, Motivacional..."
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none border border-gray-600"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setType(null)}
                  className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  Voltar
                </button>
                <button
                  type="submit"
                  className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors font-semibold ${
                    type === 'COURSE' 
                      ? 'bg-indigo-600 hover:bg-indigo-500' 
                      : 'bg-emerald-600 hover:bg-emerald-500'
                  }`}
                >
                  Gerar {type === 'COURSE' ? 'Curso' : 'E-book'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
