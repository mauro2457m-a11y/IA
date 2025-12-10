import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Message, MessageRole } from '../types';

// Helper function to create an instance on demand
const getAiInstance = (apiKey: string) => {
  return new GoogleGenAI({ apiKey });
};


const GENERATION_KEYWORDS = ['gere', 'crie uma imagem', 'desenhe', 'ilustre', 'faça uma imagem', 'gera', 'cria uma imagem'];

const isGenerationRequest = (prompt: string): boolean => {
    const lowerCasePrompt = prompt.toLowerCase();
    return GENERATION_KEYWORDS.some(keyword => lowerCasePrompt.includes(keyword));
};

export const runQuery = async (prompt: string, apiKey: string, image?: { data: string; mimeType: string }): Promise<Message> => {
  if (!apiKey) {
    return {
      role: MessageRole.ERROR,
      text: "A chave da API do Google não foi fornecida. Por favor, configure-a para continuar.",
    };
  }

  const ai = getAiInstance(apiKey);

  try {
    if (isGenerationRequest(prompt) && !image) {
      // Image Generation
      const model = 'gemini-2.5-flash-image';
      const response = await ai.models.generateContent({
          model,
          contents: { parts: [{ text: prompt }] },
      });

      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const base64Data = part.inlineData.data;
          const mimeType = part.inlineData.mimeType;
          return {
            role: MessageRole.MODEL,
            imageUrl: `data:${mimeType};base64,${base64Data}`,
            text: `Aqui está a imagem que você pediu:`,
          };
        }
      }
      return {
          role: MessageRole.ERROR,
          text: "Desculpe, não consegui gerar uma imagem com esse prompt.",
      };

    } else {
      // Text or Multimodal Query
      const model = 'gemini-2.5-flash';
      const contents: any = { parts: [] };

      if (image) {
        contents.parts.push({
          inlineData: {
            data: image.data,
            mimeType: image.mimeType,
          },
        });
      }

      if (prompt) {
        contents.parts.push({ text: prompt });
      }

      const response: GenerateContentResponse = await ai.models.generateContent({
          model,
          contents,
      });

      if (response.text) {
          return {
              role: MessageRole.MODEL,
              text: response.text,
          };
      } else {
          return {
              role: MessageRole.ERROR,
              text: "Desculpe, não recebi uma resposta válida. Tente novamente.",
          };
      }
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return {
      role: MessageRole.ERROR,
      text: `Ocorreu um erro ao comunicar com a IA: ${errorMessage}`,
    };
  }
};