import React, { useState } from 'react';
import { INDIA_GRID_DATA } from './constants';
import { GridCell, ChatMessage, AgentResponse, IncidentSeverity } from './types';
import { MapGrid } from './components/MapGrid';
import { AgentTerminal } from './components/AgentTerminal';
import { CommandInput } from './components/CommandInput';
import { StatusPanel } from './components/StatusPanel';
import { ResQOrchestrator } from './services/geminiService';

const App: React.FC = () => {
  const [grid, setGrid] = useState<GridCell[]>(INDIA_GRID_DATA);
  const [activeDistrict, setActiveDistrict] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [agentResponse, setAgentResponse] = useState<AgentResponse | null>(null);

  const orchestrator = new ResQOrchestrator();

  const addMessage = (sender: 'user' | 'ai', text: string) => {
    setChatHistory(prev => [...prev, {
      id: Math.random().toString(36).substr(2, 9),
      sender,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
  };

  const handleIncident = async (input: string) => {
    setIsProcessing(true);
    addMessage('user', input);

    try {
      const response = await orchestrator.processIncident(input);
      setAgentResponse(response);
      
      // Add the Human Readable Message to Chat
      addMessage('ai', response.human_message);

      // === LOGIC 1: RESET COMMAND ===
      if (response.interaction_type === 'COMMAND' && response.action_plan?.includes('RESET_GRID')) {
         setGrid(INDIA_GRID_DATA);
         setActiveDistrict(null);
         setIsProcessing(false);
         return;
      }

      // === LOGIC 2: LOCATION & GRID UPDATES (Shared by COMMAND and EMERGENCY) ===
      if (response.location && response.location.district && response.location.district !== 'Unknown') {
         const responseDistrict = response.location.district.toLowerCase().trim();
         const responseState = response.location.state.toLowerCase().trim();

         // Find matching cells in our grid data
         const matchedIndices: number[] = [];
         
         grid.forEach((c, idx) => {
            const gridD = c.district.toLowerCase();
            const gridS = c.state.toLowerCase();
            
            // Match logic:
            // 1. Direct district match or substring
            // 2. If no district match, check for state match if the command was about the state
            const districtMatch = gridD === responseDistrict || responseDistrict.includes(gridD) || gridD.includes(responseDistrict);
            
            // Only match state if explicit district wasn't successfully matched OR if the user asked for the whole state
            // Here we simplify: if district matches, use it. 
            // If interaction is COMMAND and they said "Activate Maharashtra", we might want all MH cells.
            // But for safety, we prioritize strict district matching first.
            
            if (districtMatch) {
                matchedIndices.push(idx);
            }
         });
         
         // If no district matches found, but it's a COMMAND for a STATE, try matching state
         if (matchedIndices.length === 0 && response.interaction_type === 'COMMAND') {
             grid.forEach((c, idx) => {
                 if (c.state.toLowerCase().includes(responseState)) {
                     matchedIndices.push(idx);
                 }
             });
         }

         if (matchedIndices.length > 0) {
             const isCritical = response.threat_level === IncidentSeverity.CRITICAL || response.threat_level === IncidentSeverity.HIGH;
             
             // Update visual grid
             setGrid(prev => prev.map((c, idx) => {
                 if (matchedIndices.includes(idx)) {
                     return { 
                         ...c, 
                         status: isCritical ? 'critical' : 'active', 
                         // Update risk score only if provided, otherwise keep existing or bump slightly for command
                         risk_score: response.analysis?.threat_score_calculated || (response.interaction_type === 'COMMAND' ? 50 : c.risk_score) 
                     };
                 }
                 return c;
             }));

             // Set active district to the first matched one for focus
             setActiveDistrict(grid[matchedIndices[0]].district);
         } else {
             console.log("Location found in AI response but no matching grid cell:", responseDistrict);
             if (response.interaction_type === 'COMMAND') {
                 // If command failed to match grid, maybe reset active district
                 setActiveDistrict(null);
             }
         }
      }

    } catch (error) {
      addMessage('ai', "System Error: Connection interrupted.");
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDistrictClick = (district: string) => {
    setActiveDistrict(district);
  };

  const getHeaderStatusColor = () => {
      if (agentResponse?.interaction_type === 'EMERGENCY') return 'bg-alert-red animate-pulse-fast';
      if (agentResponse?.interaction_type === 'COMMAND') return 'bg-hud-blue';
      return 'bg-safe-green';
  };

  const getModeLabel = () => {
      if (agentResponse?.interaction_type === 'EMERGENCY') return 'EMERGENCY_ACTIVE';
      if (agentResponse?.interaction_type === 'COMMAND') return 'SYSTEM_COMMAND';
      return 'HUMAN_INTERACTION';
  };

  return (
    <div className="flex flex-col h-screen bg-black text-gray-200 overflow-hidden font-sans">
      {/* Top Bar */}
      <header className="h-14 border-b border-gray-800 bg-tactical-gray flex items-center px-6 justify-between shrink-0 z-20 shadow-md">
        <div className="flex items-center gap-3">
           <div className={`w-3 h-3 rounded-full ${getHeaderStatusColor()}`}></div>
           <h1 className="font-bold tracking-wider text-lg font-mono text-gray-100">ResQ-AI <span className="text-gray-600">|</span> ASSISTANT</h1>
        </div>
        <div className="hidden md:flex gap-8 font-mono text-xs text-gray-400">
          <div className="flex items-center gap-2">MODE: <span className={agentResponse?.interaction_type === 'EMERGENCY' ? "text-alert-red font-bold" : (agentResponse?.interaction_type === 'COMMAND' ? "text-hud-blue font-bold" : "text-safe-green")}>{getModeLabel()}</span></div>
          <div className="flex items-center gap-2">AGENTS: <span className="text-hud-blue">STANDBY</span></div>
        </div>
      </header>

      {/* Main Content Layout */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        
        {/* Left Panel: Map & Visuals (Hidden on mobile if chatting, visible on desktop) */}
        <div className="hidden lg:flex flex-1 flex-col p-4 gap-4 overflow-y-auto bg-black/50 custom-scrollbar border-r border-gray-800">
          
          {/* Map Section */}
          <div className="flex-none">
            <h2 className="text-[10px] font-bold text-gray-500 mb-2 tracking-[0.2em] font-mono">INDIA_SECTOR_VIEW</h2>
            <MapGrid 
              grid={grid} 
              activeDistrict={activeDistrict} 
              onDistrictClick={handleDistrictClick} 
            />
          </div>

          {/* Status/Output Section */}
          <div className="flex-1 min-h-[300px]">
             <h2 className="text-[10px] font-bold text-gray-500 mb-2 tracking-[0.2em] font-mono">INTERNAL_BACKEND_STATE</h2>
             <StatusPanel data={agentResponse} />
          </div>
        </div>

        {/* Right Panel: Chat Interface (Full width on mobile) */}
        <div className="w-full lg:w-[450px] flex flex-col bg-tactical-black z-10 border-l border-gray-800">
           <AgentTerminal 
              logs={chatHistory} 
              isProcessing={isProcessing} 
           />
           <CommandInput onSubmit={handleIncident} disabled={isProcessing} />
        </div>

      </main>
    </div>
  );
};

export default App;