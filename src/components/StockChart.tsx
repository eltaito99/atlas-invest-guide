
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";

interface StockChartProps {
  symbol: string;
}

const mockChartData = [
  { date: "Jan", price: 150, volume: 45000000 },
  { date: "Feb", price: 155, volume: 42000000 },
  { date: "Mar", price: 148, volume: 48000000 },
  { date: "Apr", price: 162, volume: 51000000 },
  { date: "May", price: 158, volume: 46000000 },
  { date: "Jun", price: 170, volume: 44000000 },
  { date: "Jul", price: 175, volume: 47000000 },
  { date: "Aug", price: 168, volume: 49000000 },
  { date: "Sep", price: 172, volume: 45000000 },
  { date: "Oct", price: 178, volume: 43000000 },
  { date: "Nov", price: 175, volume: 46000000 },
  { date: "Dec", price: 175, volume: 45000000 },
];

const chartConfig = {
  price: {
    label: "Price",
    color: "hsl(var(--chart-1))",
  },
};

export const StockChart = ({ symbol }: StockChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Stock Price Performance - {symbol}</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockChartData}>
              <CartesianGrid strokeDasharray="3 3" />
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
                domain={['dataMin - 10', 'dataMax + 10']}
              />
              <ChartTooltip 
                content={<ChartTooltipContent />}
                formatter={(value: any) => [`$${value}`, "Price"]}
              />
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke="url(#gradient)" 
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6, fill: "#3b82f6" }}
              />
              <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
