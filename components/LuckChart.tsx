import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine
} from 'recharts';
import { MonthlyLuck } from '../types';

interface LuckChartProps {
  data: MonthlyLuck[];
  color: string;
}

export const LuckChart: React.FC<LuckChartProps> = ({ data, color }) => {
  return (
    <div className="w-full h-64 md:h-80 bg-slate-800/30 rounded-xl p-4 border border-slate-700">
      <h3 className="text-lg font-serif text-slate-300 mb-4 text-center">월별 운세 흐름 (Luck Flow)</h3>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.8}/>
              <stop offset="95%" stopColor={color} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
          <XAxis 
            dataKey="month" 
            tickFormatter={(val) => `${val}월`} 
            stroke="#94a3b8" 
            tick={{fontSize: 12}}
          />
          <YAxis 
            domain={[0, 100]} 
            stroke="#94a3b8" 
            tick={{fontSize: 12}}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#f1f5f9' }}
            itemStyle={{ color: color }}
            formatter={(value: number) => [`${value}점`, '운세 지수']}
            labelFormatter={(label) => `${label}월`}
          />
          <ReferenceLine y={50} stroke="#64748b" strokeDasharray="3 3" />
          <Area 
            type="monotone" 
            dataKey="score" 
            stroke={color} 
            fillOpacity={1} 
            fill="url(#colorScore)" 
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
