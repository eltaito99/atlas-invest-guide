
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { Activity, TrendingUp, TrendingDown } from "lucide-react";

interface TechnicalAnalysisProps {
  symbol: string;
}

export const TechnicalAnalysis = ({ symbol }: TechnicalAnalysisProps) => {
  const [selectedIndicators, setSelectedIndicators] = useState<string[]>(["RSI", "EMA"]);

  // Mock data for technical indicators
  const chartData = [
    { date: "Jan", price: 150.25, rsi: 45, ema: 148.5, stochastic: 42, macd: 1.2, bollinger: 152.1 },
    { date: "Feb", price: 155.80, rsi: 52, ema: 152.3, stochastic: 58, macd: 1.8, bollinger: 156.2 },
    { date: "Mar", price: 148.30, rsi: 38, ema: 150.1, stochastic: 35, macd: 0.5, bollinger: 149.8 },
    { date: "Apr", price: 162.15, rsi: 61, ema: 156.2, stochastic: 68, macd: 2.1, bollinger: 160.5 },
    { date: "May", price: 171.90, rsi: 72, ema: 164.8, stochastic: 78, macd: 3.2, bollinger: 169.3 },
    { date: "Jun", price: 168.75, rsi: 65, ema: 166.5, stochastic: 62, macd: 2.8, bollinger: 167.2 },
    { date: "Jul", price: 175.20, rsi: 68, ema: 170.9, stochastic: 71, macd: 2.9, bollinger: 172.8 },
    { date: "Aug", price: 180.50, rsi: 75, ema: 175.2, stochastic: 82, macd: 3.5, bollinger: 178.1 },
    { date: "Sep", price: 185.64, rsi: 78, ema: 180.1, stochastic: 85, macd: 4.1, bollinger: 183.2 },
  ];

  const indicators = [
    { name: "RSI", label: "Relative Strength Index", color: "#ef4444" },
    { name: "EMA", label: "Exponential Moving Average", color: "#10b981" },
    { name: "Stochastic", label: "Stochastic Oscillator", color: "#f59e0b" },
    { name: "MACD", label: "MACD", color: "#8b5cf6" },
    { name: "Bollinger", label: "Bollinger Bands", color: "#06b6d4" },
  ];

  const toggleIndicator = (indicatorName: string) => {
    setSelectedIndicators(prev => 
      prev.includes(indicatorName)
        ? prev.filter(name => name !== indicatorName)
        : [...prev, indicatorName]
    );
  };

  const getIndicatorSignal = (indicator: string, latestValue: number) => {
    switch (indicator) {
      case "RSI":
        if (latestValue > 70) return { signal: "Overbought", color: "text-red-600" };
        if (latestValue < 30) return { signal: "Oversold", color: "text-green-600" };
        return { signal: "Neutral", color: "text-gray-600" };
      case "Stochastic":
        if (latestValue > 80) return { signal: "Overbought", color: "text-red-600" };
        if (latestValue < 20) return { signal: "Oversold", color: "text-green-600" };
        return { signal: "Neutral", color: "text-gray-600" };
      default:
        return { signal: "Neutral", color: "text-gray-600" };
    }
  };

  const chartConfig = {
    price: { label: "Price", color: "#3b82f6" },
    rsi: { label: "RSI", color: "#ef4444" },
    ema: { label: "EMA", color: "#10b981" },
    stochastic: { label: "Stochastic", color: "#f59e0b" },
    macd: { label: "MACD", color: "#8b5cf6" },
    bollinger: { label: "Bollinger", color: "#06b6d4" },
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Technical Analysis - {symbol}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Indicator Selection */}
          <div className="mb-6">
            <h3 className="font-medium mb-3">Select Indicators</h3>
            <div className="flex flex-wrap gap-2">
              {indicators.map((indicator) => (
                <Button
                  key={indicator.name}
                  variant={selectedIndicators.includes(indicator.name) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleIndicator(indicator.name)}
                  className={selectedIndicators.includes(indicator.name) 
                    ? "bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700" 
                    : ""
                  }
                >
                  {indicator.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Chart */}
          <ChartContainer config={chartConfig} className="h-[400px] w-full">
            <LineChart data={chartData}>
              <XAxis dataKey="date" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              
              {/* Always show price */}
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ r: 3 }}
              />
              
              {/* Conditionally show selected indicators */}
              {selectedIndicators.includes("RSI") && (
                <Line 
                  type="monotone" 
                  dataKey="rsi" 
                  stroke="#ef4444" 
                  strokeWidth={1}
                  strokeDasharray="5 5"
                  dot={{ r: 2 }}
                />
              )}
              
              {selectedIndicators.includes("EMA") && (
                <Line 
                  type="monotone" 
                  dataKey="ema" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  dot={{ r: 2 }}
                />
              )}
              
              {selectedIndicators.includes("Stochastic") && (
                <Line 
                  type="monotone" 
                  dataKey="stochastic" 
                  stroke="#f59e0b" 
                  strokeWidth={1}
                  strokeDasharray="3 3"
                  dot={{ r: 2 }}
                />
              )}
              
              {selectedIndicators.includes("MACD") && (
                <Line 
                  type="monotone" 
                  dataKey="macd" 
                  stroke="#8b5cf6" 
                  strokeWidth={1}
                  dot={{ r: 2 }}
                />
              )}
              
              {selectedIndicators.includes("Bollinger") && (
                <Line 
                  type="monotone" 
                  dataKey="bollinger" 
                  stroke="#06b6d4" 
                  strokeWidth={1}
                  strokeDasharray="2 2"
                  dot={{ r: 2 }}
                />
              )}
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Indicator Signals */}
      <Card>
        <CardHeader>
          <CardTitle>Current Signals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {selectedIndicators.map((indicatorName) => {
              const indicator = indicators.find(i => i.name === indicatorName);
              const latestData = chartData[chartData.length - 1];
              const value = latestData[indicatorName.toLowerCase() as keyof typeof latestData] as number;
              const signal = getIndicatorSignal(indicatorName, value);
              
              return (
                <Card key={indicatorName} className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{indicator?.label}</h4>
                    <Badge variant="outline" className={signal.color}>
                      {signal.signal}
                    </Badge>
                  </div>
                  <div className="text-2xl font-bold mb-1">
                    {value.toFixed(2)}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    {signal.signal === "Overbought" && <TrendingDown className="h-3 w-3" />}
                    {signal.signal === "Oversold" && <TrendingUp className="h-3 w-3" />}
                    Current reading
                  </div>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
