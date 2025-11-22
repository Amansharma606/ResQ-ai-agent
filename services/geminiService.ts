import { GoogleGenAI, Type } from "@google/genai";
import { AgentResponse, IncidentSeverity } from '../types';
import { DEFAULT_SYSTEM_INSTRUCTION } from '../constants';

export class ResQOrchestrator {
  private ai: GoogleGenAI;
  private model: string = 'gemini-2.5-flash';

  constructor() {
    // SECURITY: The API key is obtained from process.env.API_KEY.
    const apiKey = process.env.API_KEY || '';
    this.ai = new GoogleGenAI({ apiKey });
  }

  async processIncident(input: string): Promise<AgentResponse> {
    if (!process.env.API_KEY) {
        console.warn("API Key missing. Falling back to simulation mode.");
        return this.getMockResponse(input);
    }

    try {
      const response = await this.ai.models.generateContent({
        model: this.model,
        contents: input,
        config: {
          systemInstruction: DEFAULT_SYSTEM_INSTRUCTION,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              interaction_type: { type: Type.STRING, enum: ["CASUAL", "EMERGENCY", "COMMAND"] },
              human_message: { type: Type.STRING },
              agent: { type: Type.STRING },
              incident_type: { type: Type.STRING },
              location: {
                type: Type.OBJECT,
                properties: {
                  state: { type: Type.STRING },
                  district: { type: Type.STRING },
                },
                nullable: true
              },
              threat_level: { type: Type.STRING, enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"], nullable: true },
              hazards: { type: Type.ARRAY, items: { type: Type.STRING }, nullable: true },
              analysis: {
                type: Type.OBJECT,
                properties: {
                  situation_summary: { type: Type.STRING },
                  structural_integrity: { type: Type.STRING },
                  weather_impact: { type: Type.STRING },
                  casualty_estimate: { type: Type.STRING },
                  threat_score_calculated: { type: Type.NUMBER }
                },
                nullable: true
              },
              recommended_units: { type: Type.ARRAY, items: { type: Type.STRING }, nullable: true },
              evacuation_route: { type: Type.ARRAY, items: { type: Type.STRING }, nullable: true },
              drone_report: {
                type: Type.OBJECT,
                properties: {
                  visual_confirmation: { type: Type.BOOLEAN },
                  thermal_anomalies: { type: Type.STRING },
                  survivors_detected: { type: Type.NUMBER },
                  structural_damage_percent: { type: Type.NUMBER }
                },
                nullable: true
              },
              prediction: {
                type: Type.OBJECT,
                properties: {
                  spread_forecast: { type: Type.STRING },
                  next_hour_risk: { type: Type.STRING }
                },
                nullable: true
              },
              action_plan: { type: Type.ARRAY, items: { type: Type.STRING }, nullable: true },
              safety_notes: { type: Type.ARRAY, items: { type: Type.STRING }, nullable: true },
              needs_authorization: { type: Type.BOOLEAN, nullable: true }
            },
            required: ["interaction_type", "human_message"]
          }
        }
      });

      if (response.text) {
        return JSON.parse(response.text) as AgentResponse;
      }
      throw new Error("Empty response from AI");

    } catch (error) {
      console.error("Gemini API Error:", error);
      return this.getMockResponse(input);
    }
  }

  // Fallback purely for resilience if API key fails
  private getMockResponse(input: string): AgentResponse {
    const isCommand = input.toLowerCase().includes('activate') || input.toLowerCase().includes('reset');
    const isEmergency = input.toLowerCase().includes('fire') || input.toLowerCase().includes('help');
    
    if (isCommand) {
        return {
            interaction_type: "COMMAND",
            human_message: "Mock Command: System updated based on input.",
            location: { state: "Maharashtra", district: "Mumbai" }
        }
    }

    if (!isEmergency) {
        return {
            interaction_type: "CASUAL",
            human_message: "Hello! I am ResQ-AI. How can I assist you today? If you are in danger, please tell me your location.",
        };
    }

    return {
      interaction_type: "EMERGENCY",
      human_message: "I have detected a fire emergency. Please stay calm. I am deploying units to Mumbai. Please cover your nose and exit the building immediately.",
      agent: "COMMANDER_FALLBACK",
      incident_type: "Simulated Incident",
      location: {
        state: "Maharashtra",
        district: "Mumbai",
      },
      threat_level: IncidentSeverity.HIGH,
      hazards: ["Toxic Smoke", "Structural Collapse"],
      analysis: {
        situation_summary: "Simulated fallback: Major fire detected in high-density commercial zone.",
        casualty_estimate: "20-30 Trapped",
        threat_score_calculated: 85,
        structural_integrity: "Compromised"
      },
      recommended_units: ["Unit-Fire-12", "NDRF-Team-Bravo", "Amb-X1"],
      evacuation_route: ["Route A: Via Marine Drive", "Route B: Avoid Station Road"],
      drone_report: {
        visual_confirmation: true,
        thermal_anomalies: "High heat signature on Floor 3",
        survivors_detected: 12,
        structural_damage_percent: 45
      },
      prediction: {
        spread_forecast: "Wind SE 12km/h pushing smoke to residential blocks.",
        next_hour_risk: "High probability of roof collapse."
      },
      action_plan: ["Deploy Fire Tenders", "Establish Perimeter", "Drone Recon"],
      safety_notes: ["High wind speed predicted", "Wear Hazmat suits"],
      needs_authorization: true
    };
  }
}