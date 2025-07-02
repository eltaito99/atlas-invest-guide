
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";

interface StockChartProps {
  symbol: string;
}

export const StockChart = ({ symbol }: StockChartProps) => {
  // Mock data - in a real app, this would come from a financial API
  const chartData = [
    { date: "Jan", price: 150.25 },
    { date: "Feb", price: 155.80 },
    { date: "Mar", price: 148.30 },
    { date: "Apr", price: 162.15 },
    { date: "May", price: 171.90 },
    { date: "Jun", price: 168.75 },
    { date: "Jul", price: 175.20 },
    { date: "Aug", price: 180.50 },
    { date: "Sep", price: 185.64 },
  ];

  const chartConfig = {
    price: {
      label: "Price",
      color: "hsl(var(--chart-1))",
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {symbol} Stock Performance
          <span className="text-sm font-normal text-gray-500">(Last 9 Months)</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[400px] w-full">
          <LineChart data={chartData}>
            <XAxis dataKey="date" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line 
              type="monotone" 
              dataKey="price" 
              stroke="url(#gradient)" 
              strokeWidth={3}
              dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
            />
            <defs>
              <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
