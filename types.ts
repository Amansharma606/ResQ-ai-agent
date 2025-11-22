export enum IncidentSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export interface Coordinates {
  x: number;
  y: number;
}

export interface LocationInfo {
  state: string;
  district: string;
  coordinates?: Coordinates;
}

export interface GridCell {
  id: string;
  state: string;
  district: string;
  x: number;
  y: number;
  status: 'idle' | 'active' | 'critical' | 'hazard';
  population: number;
  risk_score: number;
}

// Structured Output for the Multi-Agent System
export interface AgentResponse {
  interaction_type: 'CASUAL' | 'EMERGENCY' | 'COMMAND';
  human_message: string;
  
  // Technical fields are optional/nullable if interaction is CASUAL
  agent?: string;
  incident_type?: string;
  location?: LocationInfo;
  threat_level?: IncidentSeverity;
  hazards?: string[];
  analysis?: {
    situation_summary: string;
    structural_integrity?: string;
    weather_impact?: string;
    casualty_estimate?: string;
    threat_score_calculated: number;
  };
  recommended_units?: string[];
  evacuation_route?: string[];
  drone_report?: {
    visual_confirmation: boolean;
    thermal_anomalies: string;
    survivors_detected: number;
    structural_damage_percent: number;
  };
  prediction?: {
    spread_forecast: string;
    next_hour_risk: string;
  };
  action_plan?: string[];
  safety_notes?: string[];
  needs_authorization?: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  agent: string;
  message: string;
  type: 'info' | 'warning' | 'critical' | 'success';
}