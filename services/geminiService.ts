import { GoogleGenAI } from "@google/genai";
import type { NewsArticle } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getBandNews = async (): Promise<NewsArticle[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Dame las ultimas 5 noticias sobre bandas de rock japonesas, especialmente sobre giras o lanzamientos en Chile o Latinoamerica.",
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text;
    
    // This is a simple parser. A more robust solution would be to use a responseSchema, 
    // but googleSearch tool does not support it. We will parse the markdown-like response.
    const articles: NewsArticle[] = [];
    const lines = text.split('\n');
    let currentArticle: Partial<NewsArticle> = {};

    for (const line of lines) {
      if (line.startsWith('**') && line.endsWith('**')) {
        if (currentArticle.title) {
          articles.push(currentArticle as NewsArticle);
        }
        currentArticle = { title: line.replace(/\*\*/g, '') };
      } else if (line.trim().length > 0) {
        if (currentArticle.title) {
          currentArticle.summary = (currentArticle.summary || '') + line + ' ';
        }
      }
    }
    if (currentArticle.title) {
      articles.push(currentArticle as NewsArticle);
    }
    
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (groundingChunks && articles.length > 0) {
      groundingChunks.forEach((chunk, index) => {
        if (articles[index] && chunk.web) {
          articles[index].url = chunk.web.uri;
          articles[index].source = chunk.web.title || new URL(chunk.web.uri).hostname;
        }
      });
    }

    return articles.filter(a => a.title && a.summary);
    
  } catch (error) {
    console.error("Error fetching band news:", error);
    return [];
  }
};

export const analyzeImage = async (base64Image: string, mimeType: string): Promise<string> => {
    try {
        const imagePart = {
            inlineData: {
                mimeType,
                data: base64Image,
            },
        };
        const textPart = {
            text: "Analiza esta foto de un fan del J-Rock. Describe la escena con la energía de un presentador de conciertos de rock. Sé entusiasta y genial.",
        };
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, textPart] },
        });

        return response.text;
    } catch (error) {
        console.error("Error analyzing image:", error);
        return "Hubo un error al analizar la imagen. ¡El espíritu del rock fue demasiado fuerte!";
    }
};

export const getTextToSpeechAudio = async (text: string): Promise<string | null> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text: `Lee esta noticia con entusiasmo: ${text}` }] }],
            config: {
                responseModalities: ['AUDIO'],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: 'Kore' },
                    },
                },
            },
        });
        
        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        return base64Audio || null;
    } catch (error) {
        console.error("Error generating text-to-speech:", error);
        return null;
    }
};
