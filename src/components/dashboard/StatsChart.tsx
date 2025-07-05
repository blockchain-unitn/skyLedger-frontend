
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { day: 'Mon', flights: 45 },
  { day: 'Tue', flights: 52 },
  { day: 'Wed', flights: 38 },
  { day: 'Thu', flights: 61 },
  { day: 'Fri', flights: 55 },
  { day: 'Sat', flights: 67 },
  { day: 'Sun', flights: 43 },
];

export const StatsChart = () => {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="day" stroke="#64748b" />
        <YAxis stroke="#64748b" />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#1e293b', 
            border: 'none', 
            borderRadius: '8px',
            color: 'white'
          }} 
        />
        <Line 
          type="monotone" 
          dataKey="flights" 
          stroke="#3b82f6" 
          strokeWidth={3}
          dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
