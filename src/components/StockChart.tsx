
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { ComposedChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";

interface StockChartProps {
  symbol: string;
}

export const StockChart = ({ symbol }: StockChartProps) => {
  // Mock candlestick data - in a real app, this would come from a financial API
  const chartData = [
    { date: "Jan", open: 148.50, high: 152.75, low: 147.20, close: 150.25, volume: 2500000 },
    { date: "Feb", open: 150.25, high: 158.90, low: 149.10, close: 155.80, volume: 2800000 },
    { date: "Mar", open: 155.80, high: 157.45, low: 146.85, close: 148.30, volume: 3200000 },
    { date: "Apr", open: 148.30, high: 165.20, low: 147.90, close: 162.15, volume: 2900000 },
    { date: "May", open: 162.15, high: 173.40, low: 160.80, close: 171.90, volume: 2600000 },
    { date: "Jun", open: 171.90, high: 174.25, low: 166.50, close: 168.75, volume: 2400000 },
    { date: "Jul", open: 168.75, high: 177.80, low: 167.90, close: 175.20, volume: 2700000 },
    { date: "Aug", open: 175.20, high: 182.30, low: 174.10, close: 180.50, volume: 3100000 },
    { date: "Sep", open: 180.50, high: 188.75, low: 179.20, close: 185.64, volume: 2850000 },
  ];

  const CandlestickBar = (props: any) => {
    const { payload, x, y, width, height } = props;
    if (!payload) return null;
    
    const { open, high, low, close } = payload;
    const isGreen = close >= open;
    const bodyHeight = Math.abs(close - open);
    const bodyY = Math.min(open, close);
    
    return (
      <g>
        {/* Wick */}
        <line
          x1={x + width / 2}
          y1={y + (high - Math.max(open, close)) * height / (high - low)}
          x2={x + width / 2}
          y2={y + (high - Math.min(open, close)) * height / (high - low)}
          stroke={isGreen ? "hsl(var(--primary))" : "hsl(var(--destructive))"}
          strokeWidth={1}
        />
        {/* Body */}
        <rect
          x={x + width * 0.2}
          y={y + (high - Math.max(open, close)) * height / (high - low)}
          width={width * 0.6}
          height={(bodyHeight * height) / (high - low)}
          fill={isGreen ? "hsl(var(--primary))" : "hsl(var(--destructive))"}
          stroke={isGreen ? "hsl(var(--primary))" : "hsl(var(--destructive))"}
          strokeWidth={1}
        />
      </g>
    );
  };

  const chartConfig = {
    open: { label: "Open", color: "hsl(var(--chart-1))" },
    high: { label: "High", color: "hsl(var(--chart-2))" },
    low: { label: "Low", color: "hsl(var(--chart-3))" },
    close: { label: "Close", color: "hsl(var(--chart-4))" },
    volume: { label: "Volume", color: "hsl(var(--chart-5))" },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {symbol} Candlestick Chart
          <span className="text-sm font-normal text-muted-foreground">(Last 9 Months)</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[400px] w-full">
          <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <XAxis dataKey="date" />
            <YAxis domain={['dataMin - 5', 'dataMax + 5']} />
            <ChartTooltip 
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">Date</span>
                          <span className="font-bold text-muted-foreground">{label}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">Volume</span>
                          <span className="font-bold">{data.volume?.toLocaleString()}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">Open</span>
                          <span className="font-bold">${data.open?.toFixed(2)}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">High</span>
                          <span className="font-bold text-green-600">${data.high?.toFixed(2)}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">Low</span>
                          <span className="font-bold text-red-600">${data.low?.toFixed(2)}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">Close</span>
                          <span className="font-bold">${data.close?.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="close" shape={<CandlestickBar />} />
          </ComposedChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
