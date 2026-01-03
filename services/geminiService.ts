
import { GoogleGenAI, Type } from "@google/genai";

export class PredictionService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async chatWithAssistant(history: {role: 'user' | 'model', text: string}[], currentInput: string) {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          ...history.map(h => ({ role: h.role, parts: [{ text: h.text }] })),
          { role: 'user', parts: [{ text: currentInput }] }
        ],
        config: {
          systemInstruction: `You are the 4D Nexus Pro AI Assistant. 
          Help users with lottery results, predictions, and platform features. 
          Be professional, tech-focused, and concise. 
          Remind users about responsible gaming if they seem distressed about losses.
          Latest results available in context: Magnum, Toto, Da Ma Cai (Simulated).`
        }
      });
      return response.text || "I'm processing the nexus streams. Please repeat.";
    } catch (error) {
      return "Connectivity to the AI Core is intermittent. Please try again.";
    }
  }

  async generatePersonalizedLucky(data: { birthdate?: string; zodiac?: string; pickType?: string }) {
    try {
      const prompt = `Generate a 4D lucky number based on these parameters: 
                      Birthdate: ${data.birthdate || 'Unknown'}, 
                      Zodiac: ${data.zodiac || 'Unknown'}, 
                      Preference: ${data.pickType || 'Random'}.
                      Provide the number and a 1-sentence "Cosmic Insight".`;
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              number: { type: Type.STRING },
              fortune: { type: Type.STRING }
            },
            required: ['number', 'fortune']
          }
        }
      });
      return JSON.parse(response.text || '{"number": "7777", "fortune": "The stars align for your path."}');
    } catch (error) {
      return { number: "8888", fortune: "Universal entropy suggests a balanced pick." };
    }
  }

  async parseVoiceCommand(transcript: string) {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analyze this voice command: "${transcript}". 
                   Determine the user's intent related to a 4D lottery app.
                   Available Intents: [CHECK_RESULT, GENERATE_LUCKY, VIEW_STATS, OPEN_COMMUNITY, OPEN_AR].
                   Return JSON with 'intent' and 'provider' (null if not mentioned).`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              intent: { type: Type.STRING },
              provider: { type: Type.STRING, nullable: true }
            },
            required: ['intent']
          }
        }
      });
      return JSON.parse(response.text || '{"intent": "UNKNOWN"}');
    } catch (error) {
      return { intent: "UNKNOWN" };
    }
  }

  async getDeepInsights(historicalData: string) {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analyze winner sequence: ${historicalData}. Format as JSON.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              sentiment: { type: Type.STRING },
              convergence: { type: Type.NUMBER },
              recommendation: { type: Type.STRING }
            }
          }
        }
      });
      return JSON.parse(response.text || '{}');
    } catch (error) {
      return { sentiment: "Neutral", convergence: 50, recommendation: "Stable clusters" };
    }
  }

  async generateLuckyNumber() {
    return this.generatePersonalizedLucky({});
  }

  async getNewsAggregated() {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Generate 4 realistic lottery-related news articles. Format as JSON.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              news: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    headline: { type: Type.STRING },
                    summary: { type: Type.STRING },
                    paperName: { type: Type.STRING },
                    pageNumber: { type: Type.STRING },
                    category: { type: Type.STRING },
                    date: { type: Type.STRING },
                    imagePrompt: { type: Type.STRING }
                  }
                }
              }
            }
          }
        }
      });
      return JSON.parse(response.text || '{"news": []}');
    } catch (error) {
      return null;
    }
  }

  async generateNewsVisual(prompt: string) {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: `Professional corporate visualization: ${prompt}. Cinematic lighting.` }]
        },
        config: { imageConfig: { aspectRatio: "16:9" } }
      });
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  async getPredictions(historicalData: string) {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Analyze historical data: ${historicalData}. Return 3 predictions with JSON.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              predictions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    number: { type: Type.STRING },
                    probability: { type: Type.NUMBER },
                    reasoning: { type: Type.STRING }
                  }
                }
              }
            }
          }
        }
      });
      return JSON.parse(response.text || '{"predictions": []}');
    } catch (error) {
      return { predictions: [] };
    }
  }
}

export const predictionService = new PredictionService();
