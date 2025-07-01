
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";

interface SparklineProps {
  data: Array<{
    date: string;
    revenue: number;
    profit: number;
    expenses: number;
    visitors: number;
  }>;
}

export const Sparkline = ({ data }: SparklineProps) => {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
        <XAxis 
          dataKey="date" 
          tick={{ fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis 
          tick={{ fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <Line 
          type="monotone" 
          dataKey="revenue" 
          stroke="#3b82f6" 
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
        />
        <Line 
          type="monotone" 
          dataKey="profit" 
          stroke="#10b981" 
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
