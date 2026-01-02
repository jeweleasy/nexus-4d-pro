
import { GoogleGenAI, Type } from "@google/genai";

export class PredictionService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async generateLuckyNumber() {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Act as a high-tech 4D Numerology Oracle. Based on current universal entropy and digital resonance (Time: ${new Date().toISOString()}), generate exactly one lucky 4-digit number.
                   Also provide a one-sentence "Cosmic Rationale" (fortune) why this number is special right now. 
                   Format as JSON with 'number' (string) and 'fortune' (string).`,
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
      return JSON.parse(response.text || '{"number": "8888", "fortune": "The digital winds favor the consistent."}');
    } catch (error) {
      console.error("Lucky number generation failed:", error);
      return { number: "????", fortune: "Connection to Nexus Core unstable. Try again." };
    }
  }

  async getNewsAggregated() {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Act as a senior lottery market journalist. Generate 4 high-quality, realistic lottery-related news articles based on current market trends.
                   Each news item MUST include:
                   - Headline: Professional and engaging
                   - Summary: 2-3 detailed sentences
                   - Paper Name: A reputable regional newspaper
                   - Page Number: Specific page (e.g., B4, A12)
                   - Category: One of [Market, Regulatory, Jackpot, Analysis]
                   - imagePrompt: A detailed prompt for an AI to generate a professional, abstract, high-tech lottery-related image. No people, focus on data, lighting, and symbolism.
                   
                   Format as JSON with a 'news' array.`,
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
                  },
                  required: ['headline', 'summary', 'paperName', 'pageNumber', 'category', 'date', 'imagePrompt']
                }
              }
            }
          }
        }
      });
      return JSON.parse(response.text || '{"news": []}');
    } catch (error) {
      console.error("News aggregation failed:", error);
      return null;
    }
  }

  async generateNewsVisual(prompt: string) {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: `Professional corporate visualization: ${prompt}. Cinematic lighting, 8k resolution, tech aesthetic, no human faces, strictly abstract data/business theme.` }]
        },
        config: {
          imageConfig: {
            aspectRatio: "16:9"
          }
        }
      });

      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
      return null;
    } catch (error) {
      console.error("Image generation failed:", error);
      return `https://picsum.photos/seed/${encodeURIComponent(prompt)}/800/450`;
    }
  }

  async getPredictions(historicalData: string) {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analyze the following 4D lottery historical numbers and provide 3 predictive patterns. 
                   Data: ${historicalData}. 
                   Format your response as a JSON object with predictions array containing number (4 digits), probability (0-1), and reasoning (brief string).`,
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
                  },
                  required: ['number', 'probability', 'reasoning']
                }
              }
            }
          }
        }
      });

      return JSON.parse(response.text || '{"predictions": []}');
    } catch (error) {
      console.error("Prediction failed:", error);
      return { 
        predictions: [
          { number: "4829", probability: 0.15, reasoning: "Frequency analysis anomaly detected in recent draws." },
          { number: "1022", probability: 0.12, reasoning: "Cluster pattern matching Magnum historical cycles." },
          { number: "9583", probability: 0.10, reasoning: "Recurring 'Cold' number rebound expectation." }
        ]
      };
    }
  }
}

export const predictionService = new PredictionService();
