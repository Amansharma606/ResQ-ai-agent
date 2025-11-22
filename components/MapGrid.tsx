import React from 'react';
import { GridCell } from '../types';

interface MapGridProps {
  grid: GridCell[];
  activeDistrict: string | null;
  onDistrictClick: (district: string) => void;
}

export const MapGrid: React.FC<MapGridProps> = ({ grid, activeDistrict, onDistrictClick }) => {
  // Determine grid bounds for rendering
  const xs = grid.map(c => c.x);
  const ys = grid.map(c => c.y);
  
  // Default bounds if grid is empty
  const minX = xs.length ? Math.min(...xs) : 0;
  const maxX = xs.length ? Math.max(...xs) : 5;
  const minY = ys.length ? Math.min(...ys) : 0;
  const maxY = ys.length ? Math.max(...ys) : 5;

  const gridWidth = maxX - minX + 1;
  const gridHeight = maxY - minY + 1;

  // Create a 2D array for the grid
  // Using explicit types for rows and cells to avoid inference issues
  const matrix: (GridCell | null)[][] = Array.from({ length: gridHeight }, () => 
    Array.from({ length: gridWidth }, () => null)
  );

  grid.forEach(cell => {
    // Safety check to ensure cell is within bounds
    if (cell.y - minY >= 0 && cell.y - minY < gridHeight && cell.x - minX >= 0 && cell.x - minX < gridWidth) {
        matrix[cell.y - minY][cell.x - minX] = cell;
    }
  });

  return (
    <div className="relative p-6 bg-tactical-gray border border-gray-800 rounded-lg shadow-2xl overflow-auto min-h-[500px] flex items-center justify-center">
      {/* Background Grid Effect */}
      <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none w-[200%] h-[200%]"></div>
      
      <div className="absolute top-2 left-4 text-xs text-hud-blue font-mono opacity-70">
        INDIA_SECTOR_GRID_V3.0 [NATIONAL_VIEW]
      </div>

      <div className="relative z-10 flex flex-col gap-2">
        {matrix.map((row, rIndex) => (
          <div key={`row-${rIndex}`} className="flex gap-2">
            {row.map((cell, cIndex) => {
              if (!cell) {
                // Empty spacer for irregular grid shapes (approx 96px width for w-24)
                return <div key={`empty-${rIndex}-${cIndex}`} className="w-20 h-20 md:w-24 md:h-24 opacity-5 border border-white/5 rounded-sm" />;
              }

              const isActive = activeDistrict === cell.district;
              
              let statusColor = 'border-gray-700 bg-gray-900/50 text-gray-500';
              if (isActive || cell.status === 'active') statusColor = 'border-warn-amber bg-warn-amber/20 text-warn-amber shadow-[0_0_15px_rgba(255,170,0,0.3)]';
              if (cell.status === 'critical') statusColor = 'border-alert-red bg-alert-red/20 text-alert-red animate-pulse shadow-[0_0_15px_rgba(255,51,51,0.4)]';
              if (cell.status === 'hazard') statusColor = 'border-purple-500 bg-purple-500/20 text-purple-400';

              return (
                <button
                  key={cell.id}
                  onClick={() => onDistrictClick(cell.district)}
                  className={`
                    relative w-20 h-20 md:w-24 md:h-24 flex flex-col items-center justify-center 
                    border-2 transition-all duration-300 hover:scale-105 hover:bg-gray-800
                    backdrop-blur-sm rounded-md group overflow-hidden
                    ${statusColor}
                  `}
                >
                  <span className="text-[9px] md:text-[10px] font-mono font-bold uppercase mb-0.5 z-10">{cell.district}</span>
                  <span className="text-[7px] md:text-[8px] opacity-60 uppercase z-10">{cell.state}</span>
                  
                  {/* Status Dot */}
                  <div className={`absolute top-1 right-1 w-1.5 h-1.5 rounded-full z-10 ${cell.status === 'critical' ? 'bg-red-500 animate-ping' : 'bg-current opacity-50'}`}></div>
                  
                  {/* Stats */}
                  <div className="absolute bottom-1 w-full px-1 flex justify-between text-[6px] md:text-[7px] font-mono opacity-60 z-10">
                     <span>R:{cell.risk_score}</span>
                     <span>{(cell.population / 1000000).toFixed(1)}M</span>
                  </div>
                  
                  {/* Active Scan Overlay */}
                  {isActive && (
                    <div className="absolute inset-0 overflow-hidden rounded-md pointer-events-none z-0">
                      <div className="w-full h-2 bg-current opacity-20 animate-scan blur-sm"></div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};