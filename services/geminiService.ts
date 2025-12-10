import { Message, MessageRole } from '../types';

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

  try {
    const { GoogleGenAI } = await import('@google/genai');
    const ai = new GoogleGenAI({ apiKey });

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

      const response = await ai.models.generateContent({
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
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    
    // Tenta extrair a mensagem de erro, seja de um objeto Error ou de uma string JSON
    const rawMessage = error instanceof Error ? error.message : String(error);
    let friendlyMessage = "Ocorreu um erro inesperado ao processar sua solicitação.";

    // Verifica erros de cota (429)
    if (rawMessage.includes('429') || rawMessage.includes('RESOURCE_EXHAUSTED') || rawMessage.includes('quota')) {
        friendlyMessage = "⚠️ **Limite de uso atingido (Erro 429)**\n\nVocê atingiu o limite de requisições do plano gratuito do Google Gemini. Por favor, aguarde cerca de 1 minuto antes de tentar novamente.";
    } 
    // Verifica erros de segurança
    else if (rawMessage.includes('SAFETY') || rawMessage.includes('blocked')) {
        friendlyMessage = "⚠️ **Conteúdo Bloqueado**\n\nA IA recusou gerar o conteúdo por motivos de segurança. Tente reformular seu pedido.";
    }
    // Trata erros genéricos para não mostrar JSON bruto
    else {
        friendlyMessage = `Desculpe, ocorreu um erro técnico na comunicação com a IA. Tente novamente.`;
    }

    return {
      role: MessageRole.ERROR,
      text: friendlyMessage,
    };
  }
};