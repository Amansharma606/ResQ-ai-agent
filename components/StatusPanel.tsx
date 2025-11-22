import React from 'react';
import { AgentResponse, IncidentSeverity } from '../types';

// Simple SVG Icons inline
const ThreatIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>;
const UnitIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const DroneIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>;
const RouteIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>;
const GraphIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>;

interface StatusPanelProps {
  data: AgentResponse | null;
}

export const StatusPanel: React.FC<StatusPanelProps> = ({ data }) => {
  // Scenario 1: No data yet
  if (!data) return (
    <div className="flex flex-col items-center justify-center h-full text-gray-600 font-mono text-sm border border-gray-800 rounded bg-gray-900/30">
      <span className="animate-pulse">SYSTEM STANDBY</span>
    </div>
  );

  // Scenario 2: Casual Conversation (No Emergency)
  if (data.interaction_type === 'CASUAL') {
      return (
        <div className="flex flex-col items-center justify-center h-full border border-gray-800 rounded bg-gray-900/30 p-6 text-center">
            <div className="w-16 h-16 bg-safe-green/20 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-safe-green" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <h3 className="text-safe-green font-bold font-mono tracking-widest mb-2">SYSTEM NORMAL</h3>
            <p className="text-gray-500 text-xs max-w-xs">AI is monitoring channels. No active threats detected. ResQ-AI is ready to assist.</p>
        </div>
      );
  }

  // Scenario 3: Emergency Active (Ensure all fields exist)
  if (!data.analysis || !data.drone_report || !data.prediction || !data.recommended_units || !data.evacuation_route) {
      // Fallback for partial data (e.g. initial incomplete emergency report)
      return (
        <div className="flex flex-col items-center justify-center h-full text-alert-red font-mono text-sm border border-alert-red/30 rounded bg-alert-red/5 animate-pulse">
            <span>⚠️ INCOMPLETE THREAT DATA. ANALYZING...</span>
        </div>
      );
  }

  const isCritical = data.threat_level === IncidentSeverity.CRITICAL || data.threat_level === IncidentSeverity.HIGH;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-sm overflow-y-auto max-h-[400px] scrollbar-hide pr-2">
      
      {/* 1. THREAT_AGENT Output */}
      <div className={`col-span-1 md:col-span-2 p-4 rounded-lg border ${isCritical ? 'border-alert-red/50 bg-alert-red/10' : 'border-gray-700 bg-gray-800/50'}`}>
        <div className="flex items-center justify-between mb-3 border-b border-gray-700 pb-2">
          <div className="flex items-center gap-2 text-alert-red font-bold uppercase">
            <ThreatIcon />
            <span>THREAT_AGENT</span>
          </div>
          <div className="text-xs text-gray-400">SCORE: {data.analysis.threat_score_calculated}/100</div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <div className={`text-2xl font-bold tracking-tighter ${isCritical ? 'text-alert-red animate-pulse' : 'text-warn-amber'}`}>
              {data.threat_level}
            </div>
            <div className="text-xs text-gray-300 flex flex-wrap gap-1">
              {data.hazards?.map((h, i) => (
                <span key={i} className="px-2 py-0.5 rounded bg-black border border-gray-600">{h}</span>
              ))}
            </div>
          </div>
          <p className="text-xs text-gray-300 bg-black/30 p-2 rounded border-l-2 border-gray-600">
            "{data.analysis.situation_summary}"
          </p>
          {data.location && (
            <div className="text-xs text-gray-400 flex gap-4">
               <span>LOC: {data.location.district}, {data.location.state}</span>
               <span>CASUALTIES (EST): {data.analysis.casualty_estimate}</span>
            </div>
          )}
        </div>
      </div>

      {/* 2. PREDICTION_AGENT Output */}
      <div className="p-4 rounded-lg border border-purple-500/30 bg-purple-900/10">
        <div className="flex items-center gap-2 mb-3 text-purple-400 font-bold uppercase border-b border-purple-500/30 pb-2">
          <GraphIcon />
          <span>PREDICTION_AGENT</span>
        </div>
        <div className="space-y-2 text-xs">
          <div>
            <span className="text-gray-500 block mb-1">SPREAD FORECAST (+3H)</span>
            <span className="text-gray-200">{data.prediction.spread_forecast || "Calculating..."}</span>
          </div>
          <div>
            <span className="text-gray-500 block mb-1">RISK PROJECTION</span>
            <span className="text-purple-300 font-semibold">{data.prediction.next_hour_risk || "Stable"}</span>
          </div>
          {data.analysis.weather_impact && (
             <div>
                <span className="text-gray-500 block mb-1">WEATHER IMPACT</span>
                <span className="text-gray-400">{data.analysis.weather_impact}</span>
             </div>
          )}
        </div>
      </div>

      {/* 3. DRONE_AGENT Output */}
      <div className="p-4 rounded-lg border border-hud-blue/30 bg-hud-blue/5">
        <div className="flex items-center gap-2 mb-3 text-hud-blue font-bold uppercase border-b border-hud-blue/30 pb-2">
          <DroneIcon />
          <span>DRONE_RECON</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
           <div className="bg-black/40 p-1 rounded">
             <span className="text-gray-500 block">VISUAL</span>
             <span className={data.drone_report.visual_confirmation ? 'text-safe-green' : 'text-alert-red'}>
              {data.drone_report.visual_confirmation ? 'CONFIRMED' : 'NO_VISUAL'}
             </span>
           </div>
           <div className="bg-black/40 p-1 rounded">
             <span className="text-gray-500 block">SURVIVORS</span>
             <span className="text-warn-amber font-bold text-lg">{data.drone_report.survivors_detected}</span>
           </div>
           <div className="col-span-2 bg-black/40 p-1 rounded">
             <span className="text-gray-500 block">THERMAL SCAN</span>
             <span className="text-white">{data.drone_report.thermal_anomalies}</span>
           </div>
           <div className="col-span-2 bg-black/40 p-1 rounded">
             <span className="text-gray-500 block">STRUCTURAL DAMAGE</span>
             <div className="w-full bg-gray-700 h-1.5 mt-1 rounded-full overflow-hidden">
                <div className="bg-alert-red h-full" style={{ width: `${data.drone_report.structural_damage_percent}%` }}></div>
             </div>
             <span className="text-right block mt-0.5 text-alert-red">{data.drone_report.structural_damage_percent}%</span>
           </div>
        </div>
      </div>

      {/* 4. RESOURCE_AGENT Output */}
      <div className="p-4 rounded-lg border border-safe-green/30 bg-safe-green/5">
        <div className="flex items-center gap-2 mb-3 text-safe-green font-bold uppercase border-b border-safe-green/30 pb-2">
          <UnitIcon />
          <span>RESOURCE_AGENT</span>
        </div>
        <ul className="text-xs space-y-1.5 text-gray-300">
          {data.recommended_units.map((u, i) => (
            <li key={i} className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-safe-green rounded-full"></span>
              {u}
            </li>
          ))}
        </ul>
      </div>

      {/* 5. EVACUATION_AGENT Output */}
      <div className="p-4 rounded-lg border border-warn-amber/30 bg-warn-amber/5 md:col-span-2">
        <div className="flex items-center gap-2 mb-3 text-warn-amber font-bold uppercase border-b border-warn-amber/30 pb-2">
          <RouteIcon />
          <span>EVACUATION_AGENT</span>
        </div>
        <div className="flex flex-col gap-2">
             {data.evacuation_route.map((route, i) => (
                 <div key={i} className="flex items-center gap-3 text-xs text-gray-300 bg-black/20 p-2 rounded border border-warn-amber/10">
                     <span className="text-warn-amber font-bold">PATH {i+1}</span>
                     <span>{route}</span>
                 </div>
             ))}
             {data.safety_notes && data.safety_notes.length > 0 && (
                <div className="mt-2 pt-2 border-t border-gray-700/50">
                    <span className="text-xs text-gray-500 block mb-1">SAFETY NOTES</span>
                    <ul className="list-disc pl-4 text-xs text-gray-400">
                        {data.safety_notes.map((note, i) => <li key={i}>{note}</li>)}
                    </ul>
                </div>
             )}
        </div>
      </div>
    </div>
  );
};