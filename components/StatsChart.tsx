
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { HOT_NUMBERS } from '../constants';

export const StatsChart: React.FC = () => {
  return (
    <div className="h-[300px] w-full mt-6">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={HOT_NUMBERS}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis 
            dataKey="number" 
            stroke="#64748b" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false}
          />
          <YAxis 
            stroke="#64748b" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
            itemStyle={{ color: '#3b82f6' }}
          />
          <Bar dataKey="frequency" radius={[4, 4, 0, 0]}>
            {HOT_NUMBERS.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.status === 'hot' ? '#f59e0b' : entry.status === 'cold' ? '#ef4444' : '#3b82f6'} 
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
