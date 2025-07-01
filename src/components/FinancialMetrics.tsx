
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingUp, TrendingDown, PieChart, BarChart3 } from "lucide-react";

interface StockData {
  symbol: string;
  name: string;
  price: number;
  marketCap: string;
  peRatio: number;
  dividend: number;
}

interface FinancialMetricsProps {
  stock: StockData;
}

const mockFinancialData = {
  revenue: {
    current: "394.3B",
    growth: "2.8%",
    trend: "up"
  },
  netIncome: {
    current: "99.8B",
    growth: "5.4%",
    trend: "up"
  },
  grossMargin: {
    current: "43.3%",
    previous: "41.8%",
    trend: "up"
  },
  operatingMargin: {
    current: "30.8%",
    previous: "29.2%",
    trend: "up"
  },
  debtToEquity: {
    current: "2.18",
    industry: "1.85",
    trend: "neutral"
  },
  roe: {
    current: "175.4%",
    industry: "15.2%",
    trend: "up"
  },
  currentRatio: {
    current: "0.93",
    industry: "1.25",
    trend: "down"
  },
  quickRatio: {
    current: "0.81",
    industry: "1.05",
    trend: "down"
  }
};

export const FinancialMetrics = ({ stock }: FinancialMetricsProps) => {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case "down":
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <BarChart3 className="w-4 h-4 text-slate-600" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "up":
        return "text-green-600";
      case "down":
        return "text-red-600";
      default:
        return "text-slate-600";
    }
  };

  return (
    <div className="space-y-6">
      {/* Income Statement */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Income Statement - {stock.symbol}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600">Revenue (TTM)</span>
                {getTrendIcon(mockFinancialData.revenue.trend)}
              </div>
              <div className="text-2xl font-bold">${mockFinancialData.revenue.current}</div>
              <div className={`text-sm ${getTrendColor(mockFinancialData.revenue.trend)}`}>
                {mockFinancialData.revenue.growth} YoY
              </div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600">Net Income</span>
                {getTrendIcon(mockFinancialData.netIncome.trend)}
              </div>
              <div className="text-2xl font-bold">${mockFinancialData.netIncome.current}</div>
              <div className={`text-sm ${getTrendColor(mockFinancialData.netIncome.trend)}`}>
                {mockFinancialData.netIncome.growth} YoY
              </div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600">Gross Margin</span>
                {getTrendIcon(mockFinancialData.grossMargin.trend)}
              </div>
              <div className="text-2xl font-bold">{mockFinancialData.grossMargin.current}</div>
              <div className="text-sm text-slate-500">
                Prev: {mockFinancialData.grossMargin.previous}
              </div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600">Operating Margin</span>
                {getTrendIcon(mockFinancialData.operatingMargin.trend)}
              </div>
              <div className="text-2xl font-bold">{mockFinancialData.operatingMargin.current}</div>
              <div className="text-sm text-slate-500">
                Prev: {mockFinancialData.operatingMargin.previous}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Financial Ratios */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="w-5 h-5" />
            Key Financial Ratios
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600">P/E Ratio</span>
                <Badge variant="outline">{stock.peRatio}</Badge>
              </div>
              <div className="text-lg font-semibold">{stock.peRatio}</div>
              <div className="text-sm text-slate-500">Industry Avg: 22.4</div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600">ROE</span>
                {getTrendIcon(mockFinancialData.roe.trend)}
              </div>
              <div className="text-lg font-semibold">{mockFinancialData.roe.current}</div>
              <div className="text-sm text-slate-500">
                Industry: {mockFinancialData.roe.industry}
              </div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600">Debt/Equity</span>
                {getTrendIcon(mockFinancialData.debtToEquity.trend)}
              </div>
              <div className="text-lg font-semibold">{mockFinancialData.debtToEquity.current}</div>
              <div className="text-sm text-slate-500">
                Industry: {mockFinancialData.debtToEquity.industry}
              </div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600">Current Ratio</span>
                {getTrendIcon(mockFinancialData.currentRatio.trend)}
              </div>
              <div className="text-lg font-semibold">{mockFinancialData.currentRatio.current}</div>
              <div className="text-sm text-slate-500">
                Industry: {mockFinancialData.currentRatio.industry}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Balance Sheet Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Balance Sheet Highlights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-sm text-slate-600 mb-2">Total Assets</div>
              <div className="text-2xl font-bold">$352.8B</div>
              <div className="text-sm text-green-600">+3.2% YoY</div>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <div className="text-sm text-slate-600 mb-2">Total Liabilities</div>
              <div className="text-2xl font-bold">$290.4B</div>
              <div className="text-sm text-yellow-600">+1.8% YoY</div>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <div className="text-sm text-slate-600 mb-2">Shareholders' Equity</div>
              <div className="text-2xl font-bold">$62.4B</div>
              <div className="text-sm text-green-600">+8.7% YoY</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
