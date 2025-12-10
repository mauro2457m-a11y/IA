import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Message, MessageRole } from '../types';

const API_KEY = process.env.API_KEY;
let ai: GoogleGenAI | undefined;

if (API_KEY) {
  ai = new GoogleGenAI({ apiKey: API_KEY });
} else {
  console.error("API_KEY environment variable is not set.");
}


const GENERATION_KEYWORDS = ['gere', 'crie uma imagem', 'desenhe', 'ilustre', 'faça uma imagem', 'gera', 'cria uma imagem'];

const isGenerationRequest = (prompt: string): boolean => {
    const lowerCasePrompt = prompt.toLowerCase();
    return GENERATION_KEYWORDS.some(keyword => lowerCasePrompt.includes(keyword));
};

export const runQuery = async (prompt: string, image?: { data: string; mimeType: string }): Promise<Message> => {
  if (!ai) {
    return {
      role: MessageRole.ERROR,
      text: "A chave da API do Google não está configurada. Verifique as variáveis de ambiente.",
    };
  }

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
