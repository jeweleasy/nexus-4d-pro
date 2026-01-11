
import { GoogleGenAI, Type, Modality } from "@google/genai";

export class PredictionService {
  private get ai() {
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
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
      console.error("Assistant Error:", error);
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
      console.error("Lucky Engine Error:", error);
      return { number: "8888", fortune: "Universal entropy suggests a balanced pick." };
    }
  }

  async generateDrawSimulation(prompt: string) {
    try {
      let operation = await this.ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: `A high-quality 4D lottery draw simulation in a futuristic sci-fi setting. Holographic balls with numbers ${prompt} emerging from a glowing nexus sphere. 4k resolution, cinematic lighting.`,
        config: {
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio: '16:9'
        }
      });
      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await this.ai.operations.getVideosOperation({ operation: operation });
      }
      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      return `${downloadLink}&key=${process.env.API_KEY}`;
    } catch (error) {
      console.error("Video Generation Error:", error);
      return null;
    }
  }

  async connectToLiveStrategist(callbacks: any) {
    return this.ai.live.connect({
      model: 'gemini-2.5-flash-native-audio-preview-12-2025',
      callbacks,
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
        },
        systemInstruction: 'You are the 4D Nexus Pro Live Strategist. Speak in a professional, calm, and slightly futuristic tone. You help users understand lottery trends, calculate probability, and offer strategic advice based on data patterns. Always maintain a focus on responsible gaming.'
      }
    });
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

  async getNewsAggregated() {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Aggregate 5 news articles related to 4D Lottery, Gaming Industry, and Jackpot winners in Malaysia. 
        Sources: The Edge, Sin Chew, Berita Harian. Return JSON.`,
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
                    sourceLink: { type: Type.STRING },
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
      console.error("News Aggregator Error:", error);
      return null;
    }
  }

  async generateNewsVisual(prompt: string) {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: `High-resolution editorial abstract photo for a Malaysian newspaper. Subject: ${prompt}. Cinematic lighting.` }]
        },
        config: { imageConfig: { aspectRatio: "16:9" } }
      });
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
      }
      return null;
    } catch (error) {
      console.error("Image Generator Error:", error);
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
      console.error("Predictor Error:", error);
      return { predictions: [] };
    }
  }

  // Added getDeepInsights method to fix the missing property error in Predictor component
  async getDeepInsights(historicalData: string) {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Analyze these lottery numbers: ${historicalData}. 
                   Provide a 'sentiment' (e.g., Optimistic, Volatile, Balanced) and a 'convergence' percentage (0-100) based on pattern density.
                   Return JSON.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              sentiment: { type: Type.STRING },
              convergence: { type: Type.NUMBER }
            },
            required: ['sentiment', 'convergence']
          }
        }
      });
      return JSON.parse(response.text || '{"sentiment": "Neutral", "convergence": 50}');
    } catch (error) {
      console.error("Insights Error:", error);
      return { sentiment: "Neutral", convergence: 50 };
    }
  }
}

export const predictionService = new PredictionService();
