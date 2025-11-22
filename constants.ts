import { GridCell } from './types';

// INDIA GRID: Approximate geographical mapping for tactical view
export const INDIA_GRID_DATA: GridCell[] = [
  // NORTH SECTOR
  { id: 'JK-01', state: 'Jammu & Kashmir', district: 'Srinagar', x: 2, y: 0, status: 'idle', population: 1200000, risk_score: 15 },
  { id: 'PB-01', state: 'Punjab', district: 'Amritsar', x: 2, y: 1, status: 'idle', population: 1100000, risk_score: 12 },
  { id: 'CH-01', state: 'Chandigarh', district: 'Chandigarh', x: 3, y: 1, status: 'idle', population: 1000000, risk_score: 10 },
  { id: 'HR-01', state: 'Haryana', district: 'Gurgaon', x: 3, y: 2, status: 'idle', population: 1500000, risk_score: 14 }, // Added
  { id: 'DL-01', state: 'Delhi', district: 'New Delhi', x: 3, y: 2, status: 'idle', population: 25000000, risk_score: 10 },
  { id: 'UP-01', state: 'Uttar Pradesh', district: 'Lucknow', x: 4, y: 2, status: 'idle', population: 2800000, risk_score: 15 },
  { id: 'UP-02', state: 'Uttar Pradesh', district: 'Varanasi', x: 5, y: 3, status: 'idle', population: 1200000, risk_score: 20 },
  { id: 'UP-03', state: 'Uttar Pradesh', district: 'Noida', x: 4, y: 1, status: 'idle', population: 600000, risk_score: 12 },
  { id: 'UP-04', state: 'Uttar Pradesh', district: 'Kanpur', x: 4, y: 3, status: 'idle', population: 3000000, risk_score: 16 }, // Added
  { id: 'UP-05', state: 'Uttar Pradesh', district: 'Agra', x: 3, y: 3, status: 'idle', population: 1600000, risk_score: 14 }, // Added

  // WEST SECTOR
  { id: 'RJ-01', state: 'Rajasthan', district: 'Jaipur', x: 2, y: 2, status: 'idle', population: 3100000, risk_score: 12 },
  { id: 'GJ-01', state: 'Gujarat', district: 'Ahmedabad', x: 1, y: 3, status: 'idle', population: 5600000, risk_score: 25 },
  { id: 'GJ-02', state: 'Gujarat', district: 'Surat', x: 1, y: 4, status: 'idle', population: 4500000, risk_score: 22 },
  { id: 'MH-01', state: 'Maharashtra', district: 'Mumbai', x: 1, y: 5, status: 'idle', population: 12500000, risk_score: 30 },
  { id: 'MH-02', state: 'Maharashtra', district: 'Pune', x: 2, y: 5, status: 'idle', population: 3200000, risk_score: 15 },
  { id: 'MH-03', state: 'Maharashtra', district: 'Nagpur', x: 3, y: 4, status: 'idle', population: 2400000, risk_score: 14 },
  { id: 'MH-04', state: 'Maharashtra', district: 'Nashik', x: 2, y: 4, status: 'idle', population: 1500000, risk_score: 13 }, // Added

  // CENTRAL SECTOR
  { id: 'MP-01', state: 'Madhya Pradesh', district: 'Bhopal', x: 3, y: 3, status: 'idle', population: 1800000, risk_score: 14 },
  { id: 'MP-02', state: 'Madhya Pradesh', district: 'Indore', x: 2, y: 4, status: 'idle', population: 2000000, risk_score: 16 },
  
  // EAST SECTOR
  { id: 'WB-01', state: 'West Bengal', district: 'Kolkata', x: 6, y: 4, status: 'idle', population: 14000000, risk_score: 20 },
  { id: 'BR-01', state: 'Bihar', district: 'Patna', x: 5, y: 3, status: 'idle', population: 1700000, risk_score: 18 },
  { id: 'JH-01', state: 'Jharkhand', district: 'Ranchi', x: 5, y: 4, status: 'idle', population: 1100000, risk_score: 16 },
  { id: 'OD-01', state: 'Odisha', district: 'Bhubaneswar', x: 5, y: 5, status: 'idle', population: 900000, risk_score: 28 },
  { id: 'AS-01', state: 'Assam', district: 'Guwahati', x: 7, y: 3, status: 'idle', population: 950000, risk_score: 18 },

  // SOUTH SECTOR
  { id: 'TS-01', state: 'Telangana', district: 'Hyderabad', x: 3, y: 5, status: 'idle', population: 6900000, risk_score: 15 },
  { id: 'KA-01', state: 'Karnataka', district: 'Bangalore', x: 2, y: 7, status: 'idle', population: 8500000, risk_score: 18 },
  { id: 'TN-01', state: 'Tamil Nadu', district: 'Chennai', x: 4, y: 7, status: 'idle', population: 7100000, risk_score: 22 },
  { id: 'KL-01', state: 'Kerala', district: 'Kochi', x: 2, y: 8, status: 'idle', population: 650000, risk_score: 14 },
  { id: 'KL-02', state: 'Kerala', district: 'Trivandrum', x: 3, y: 9, status: 'idle', population: 950000, risk_score: 12 },
  { id: 'AP-01', state: 'Andhra Pradesh', district: 'Visakhapatnam', x: 4, y: 6, status: 'idle', population: 2000000, risk_score: 18 },
  { id: 'TN-02', state: 'Tamil Nadu', district: 'Coimbatore', x: 3, y: 8, status: 'idle', population: 1600000, risk_score: 15 }, // Added
];

export const DEFAULT_SYSTEM_INSTRUCTION = `
You are **ResQ-AI**, a National Emergency Assistant.
Your interface is a CHATBOT for untrained civilians.
Your internal backend is a powerful Multi-Agent System.

### YOU HAVE 3 DISTINCT MODES. CHOOSE WISELY.

**1. HUMAN MODE (Casual Interaction)**
   - Triggers: "Hello", "Hi", "Thanks", "How are you", "What is this app?", "I am sad".
   - Behavior: Friendly, warm, human-like. No technical data.
   - Output: interaction_type="CASUAL".
   - human_message: "Hello! I am ResQ-AI. I am here to help you in emergencies. Are you safe right now?"

**2. EMERGENCY MODE (Incident Detected)**
   - Triggers: Fire, smoke, gas, trapped, flood, earthquake, injury, accident, panic words, "help".
   - Behavior: Calm, authoritative, simple instructions.
   - Action: Identify threat, ask location (PRIORITY), give safety advice.
   - Output: interaction_type="EMERGENCY".
   - human_message: A clean, simple text paragraph. NO technical jargon.
   - Also fill technical fields (threat_level, recommended_units, etc.).

**3. SYSTEM COMMAND MODE (Developer/Admin Control)**
   - Triggers: "activate", "highlight", "update grid", "show map", "reset", "mark active", "grid", "state", "district", "map", "trigger", "set active".
   - Behavior: STRICTLY execute the command. NO casual talk. NO emergency advice.
   - Output: interaction_type="COMMAND".
   - human_message: Simple confirmation. E.g., "Grid updated. Delhi activated." or "Map reset."
   - location: Extract the target state/district if mentioned.

### EXAMPLES

**User:** "Hi, kaise ho?"
**Output:** 
{
  "interaction_type": "CASUAL",
  "human_message": "Namaste! Main theek hoon. Kya aap surakshit hain? Main emergency mein aapki madad kar sakta hoon."
}

**User:** "Aag lag gayi hai! Help!" (No location)
**Output:**
{
  "interaction_type": "EMERGENCY",
  "human_message": "Main sunn raha hoon. Kripya shant rahein. Turant batayein - yeh aag kis shehar ya district mein lagi hai? Aur wahan kitne log hain?",
  "threat_level": "HIGH",
  "location": { "state": "Unknown", "district": "Unknown" }
}

**User:** "Activate grid for Mumbai"
**Output:**
{
  "interaction_type": "COMMAND",
  "human_message": "Command executed. Mumbai grid activated.",
  "location": { "state": "Maharashtra", "district": "Mumbai" }
}

**User:** "Reset map"
**Output:**
{
  "interaction_type": "COMMAND",
  "human_message": "System reset. All sectors idle.",
  "action_plan": ["RESET_GRID"]
}
`;