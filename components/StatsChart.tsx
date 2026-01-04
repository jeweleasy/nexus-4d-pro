
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { HOT_NUMBERS } from '../constants';

export const StatsChart: React.FC = () => {
  return (
    <div className="h-[300px] w-full mt-6 overflow-hidden relative min-h-0 min-w-0">
      {/* 
        The "width(-1)" error is often triggered by Recharts' inner ResizeObserver 
        firing before the CSS transitions or flex layouts have calculated the final bounding box.
        Ensuring min-h-0 and min-w-0 on the wrapper prevents negative dimension calculations.
      */}
      <div className="absolute inset-0 min-h-0 min-w-0">
        <ResponsiveContainer width="100%" height="100%" debounce={100}>
          <BarChart 
            data={HOT_NUMBERS}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis 
              dataKey="number" 
              stroke="#64748b" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false}
              dy={10}
            />
            <YAxis 
              stroke="#64748b" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false}
            />
            <Tooltip 
              cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
              contentStyle={{ 
                backgroundColor: '#0f172a', 
                border: '1px solid rgba(255,255,255,0.1)', 
                borderRadius: '12px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
              }}
              itemStyle={{ color: '#3b82f6', fontWeight: 'bold' }}
            />
            <Bar dataKey="frequency" radius={[6, 6, 0, 0]} barSize={40}>
              {HOT_NUMBERS.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.status === 'hot' ? '#f59e0b' : entry.status === 'cold' ? '#ef4444' : '#3b82f6'} 
                  className="transition-all duration-300 hover:opacity-80"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
