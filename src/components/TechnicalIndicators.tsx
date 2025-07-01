
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Activity, TrendingUp, TrendingDown } from "lucide-react";

interface TechnicalIndicatorsProps {
  symbol: string;
}

const mockTechnicalData = [
  { date: "Jan", price: 150, rsi: 45, stochastic: 60, ema: 148, macd: 2.1, bollinger_upper: 155, bollinger_lower: 145 },
  { date: "Feb", price: 155, rsi: 52, stochastic: 65, ema: 151, macd: 1.8, bollinger_upper: 160, bollinger_lower: 150 },
  { date: "Mar", price: 148, rsi: 38, stochastic: 40, ema: 150, macd: -0.5, bollinger_upper: 153, bollinger_lower: 143 },
  { date: "Apr", price: 162, rsi: 68, stochastic: 80, ema: 154, macd: 3.2, bollinger_upper: 167, bollinger_lower: 157 },
  { date: "May", price: 158, rsi: 55, stochastic: 55, ema: 156, macd: 1.1, bollinger_upper: 163, bollinger_lower: 153 },
  { date: "Jun", price: 170, rsi: 72, stochastic: 85, ema: 161, macd: 4.1, bollinger_upper: 175, bollinger_lower: 165 },
  { date: "Jul", price: 175, rsi: 78, stochastic: 90, ema: 166, macd: 5.2, bollinger_upper: 180, bollinger_lower: 170 },
  { date: "Aug", price: 168, rsi: 62, stochastic: 70, ema: 167, macd: 2.8, bollinger_upper: 173, bollinger_lower: 163 },
  { date: "Sep", price: 172, rsi: 65, stochastic: 75, ema: 169, macd: 3.5, bollinger_upper: 177, bollinger_lower: 167 },
  { date: "Oct", price: 178, rsi: 74, stochastic: 82, ema: 172, macd: 4.8, bollinger_upper: 183, bollinger_lower: 173 },
  { date: "Nov", price: 175, rsi: 68, stochastic: 78, ema: 173, macd: 3.9, bollinger_upper: 180, bollinger_lower: 170 },
  { date: "Dec", price: 175, rsi: 66, stochastic: 76, ema: 174, macd: 3.2, bollinger_upper: 180, bollinger_lower: 170 },
];

const indicators = [
  { id: "rsi", name: "RSI", description: "Relative Strength Index", color: "#f59e0b" },
  { id: "stochastic", name: "Stochastic", description: "Stochastic Oscillator", color: "#8b5cf6" },
  { id: "ema", name: "EMA", description: "Exponential Moving Average", color: "#10b981" },
  { id: "macd", name: "MACD", description: "Moving Average Convergence Divergence", color: "#ef4444" },
  { id: "bollinger", name: "Bollinger Bands", description: "Bollinger Bands", color: "#3b82f6" },
];

export const TechnicalIndicators = ({ symbol }: TechnicalIndicatorsProps) => {
  const [activeIndicators, setActiveIndicators] = useState<string[]>(["rsi", "ema"]);
  const [selectedIndicator, setSelectedIndicator] = useState("rsi");

  const toggleIndicator = (indicatorId: string) => {
    if (activeIndicators.includes(indicatorId)) {
      setActiveIndicators(activeIndicators.filter(id => id !== indicatorId));
    } else {
      setActiveIndicators([...activeIndicators, indicatorId]);
    }
  };

  const getIndicatorSignal = (indicator: string, value: number) => {
    switch (indicator) {
      case "rsi":
        if (value > 70) return { signal: "Sell", color: "text-red-600", icon: TrendingDown };
        if (value < 30) return { signal: "Buy", color: "text-green-600", icon: TrendingUp };
        return { signal: "Hold", color: "text-yellow-600", icon: Activity };
      case "stochastic":
        if (value > 80) return { signal: "Sell", color: "text-red-600", icon: TrendingDown };
        if (value < 20) return { signal: "Buy", color: "text-green-600", icon: TrendingUp };
        return { signal: "Hold", color: "text-yellow-600", icon: Activity };
      case "macd":
        if (value > 0) return { signal: "Buy", color: "text-green-600", icon: TrendingUp };
        return { signal: "Sell", color: "text-red-600", icon: TrendingDown };
      default:
        return { signal: "Neutral", color: "text-slate-600", icon: Activity };
    }
  };

  const currentRSI = mockTechnicalData[mockTechnicalData.length - 1].rsi;
  const currentStochastic = mockTechnicalData[mockTechnicalData.length - 1].stochastic;
  const currentMACD = mockTechnicalData[mockTechnicalData.length - 1].macd;

  return (
    <div className="space-y-6">
      {/* Indicator Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Technical Indicators - {symbol}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            {indicators.map((indicator) => (
              <Button
                key={indicator.id}
                variant={activeIndicators.includes(indicator.id) ? "default" : "outline"}
                size="sm"
                onClick={() => toggleIndicator(indicator.id)}
                className={activeIndicators.includes(indicator.id) ? "bg-gradient-to-r from-blue-600 to-green-600" : ""}
              >
                {indicator.name}
              </Button>
            ))}
          </div>
          
          {/* Current Signals */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-slate-600">RSI (14)</div>
                    <div className="text-xl font-semibold">{currentRSI}</div>
                  </div>
                  <div className="text-right">
                    {(() => {
                      const signal = getIndicatorSignal("rsi", currentRSI);
                      const Icon = signal.icon;
                      return (
                        <div className={`flex items-center gap-1 ${signal.color}`}>
                          <Icon className="w-4 h-4" />
                          <Badge variant="outline" className={signal.color}>
                            {signal.signal}
                          </Badge>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-slate-600">Stochastic</div>
                    <div className="text-xl font-semibold">{currentStochastic}</div>
                  </div>
                  <div className="text-right">
                    {(() => {
                      const signal = getIndicatorSignal("stochastic", currentStochastic);
                      const Icon = signal.icon;
                      return (
                        <div className={`flex items-center gap-1 ${signal.color}`}>
                          <Icon className="w-4 h-4" />
                          <Badge variant="outline" className={signal.color}>
                            {signal.signal}
                          </Badge>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-slate-600">MACD</div>
                    <div className="text-xl font-semibold">{currentMACD.toFixed(2)}</div>
                  </div>
                  <div className="text-right">
                    {(() => {
                      const signal = getIndicatorSignal("macd", currentMACD);
                      const Icon = signal.icon;
                      return (
                        <div className={`flex items-center gap-1 ${signal.color}`}>
                          <Icon className="w-4 h-4" />
                          <Badge variant="outline" className={signal.color}>
                            {signal.signal}
                          </Badge>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Chart with Indicators */}
      {activeIndicators.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Technical Analysis Chart</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}} className="min-h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockTechnicalData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  
                  {activeIndicators.includes("rsi") && (
                    <Line 
                      type="monotone" 
                      dataKey="rsi" 
                      stroke="#f59e0b" 
                      strokeWidth={2}
                      dot={false}
                      name="RSI"
                    />
                  )}
                  
                  {activeIndicators.includes("stochastic") && (
                    <Line 
                      type="monotone" 
                      dataKey="stochastic" 
                      stroke="#8b5cf6" 
                      strokeWidth={2}
                      dot={false}
                      name="Stochastic"
                    />
                  )}
                  
                  {activeIndicators.includes("ema") && (
                    <Line 
                      type="monotone" 
                      dataKey="ema" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      dot={false}
                      name="EMA"
                    />
                  )}
                  
                  {activeIndicators.includes("macd") && (
                    <Line 
                      type="monotone" 
                      dataKey="macd" 
                      stroke="#ef4444" 
                      strokeWidth={2}
                      dot={false}
                      name="MACD"
                    />
                  )}
                  
                  {activeIndicators.includes("bollinger") && (
                    <>
                      <Line 
                        type="monotone" 
                        dataKey="bollinger_upper" 
                        stroke="#3b82f6" 
                        strokeWidth={1}
                        strokeDasharray="5 5"
                        dot={false}
                        name="Bollinger Upper"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="bollinger_lower" 
                        stroke="#3b82f6" 
                        strokeWidth={1}
                        strokeDasharray="5 5"
                        dot={false}
                        name="Bollinger Lower"
                      />
                    </>
                  )}
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
