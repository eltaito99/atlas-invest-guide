
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { ComposedChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";

interface StockChartProps {
  symbol: string;
}

export const StockChart = ({ symbol }: StockChartProps) => {
  // Generate 2 years of daily mock candlestick data
  const generateDailyData = () => {
    const data = [];
    const startDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - 2);
    
    let currentPrice = 150;
    
    for (let i = 0; i < 730; i++) { // 2 years of daily data
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      
      // Skip weekends for realistic stock data
      if (date.getDay() === 0 || date.getDay() === 6) continue;
      
      // Generate realistic price movements
      const volatility = 0.02;
      const trend = 0.0002;
      const randomChange = (Math.random() - 0.5) * volatility;
      
      const open = currentPrice;
      const change = currentPrice * (trend + randomChange);
      const close = Math.max(1, currentPrice + change);
      
      // Generate high and low based on open and close
      const minPrice = Math.min(open, close);
      const maxPrice = Math.max(open, close);
      const wiggleRoom = Math.abs(open - close) * 0.5 + currentPrice * 0.01;
      
      const high = maxPrice + Math.random() * wiggleRoom;
      const low = Math.max(1, minPrice - Math.random() * wiggleRoom);
      
      // Generate realistic volume
      const baseVolume = 25000000;
      const volumeVariation = Math.random() * 0.8 + 0.6; // 60% to 140% of base
      const volume = Math.floor(baseVolume * volumeVariation);
      
      data.push({
        date: date.toISOString().split('T')[0],
        open: Number(open.toFixed(2)),
        high: Number(high.toFixed(2)),
        low: Number(low.toFixed(2)),
        close: Number(close.toFixed(2)),
        volume: volume
      });
      
      currentPrice = close;
    }
    
    return data.reverse(); // Most recent first
  };

  const chartData = generateDailyData();

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
          stroke={isGreen ? "hsl(142 71% 45%)" : "hsl(217 91% 60%)"}
          strokeWidth={1}
        />
        {/* Body */}
        <rect
          x={x + width * 0.25}
          y={y + (high - Math.max(open, close)) * height / (high - low)}
          width={width * 0.5}
          height={(bodyHeight * height) / (high - low)}
          fill={isGreen ? "hsl(142 71% 45%)" : "hsl(217 91% 60%)"}
          stroke={isGreen ? "hsl(142 71% 45%)" : "hsl(217 91% 60%)"}
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
          {symbol} Daily Candlestick Chart
          <span className="text-sm font-normal text-muted-foreground">(2 Years)</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[500px] w-full">
          <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <XAxis 
              dataKey="date" 
              tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })}
              interval="preserveStartEnd"
            />
            <YAxis 
              domain={['dataMin - 2', 'dataMax + 2']} 
              tickFormatter={(value) => `$${value.toFixed(0)}`}
            />
            <ChartTooltip 
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">Date</span>
                          <span className="font-bold text-muted-foreground">{new Date(label).toLocaleDateString()}</span>
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
                          <span className="font-bold" style={{color: "hsl(142 71% 45%)"}}>${data.high?.toFixed(2)}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">Low</span>
                          <span className="font-bold" style={{color: "hsl(217 91% 60%)"}}>${data.low?.toFixed(2)}</span>
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
