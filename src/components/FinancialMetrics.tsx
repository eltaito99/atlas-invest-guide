
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, BarChart3 } from "lucide-react";

interface FinancialMetricsProps {
  symbol: string;
}

export const FinancialMetrics = ({ symbol }: FinancialMetricsProps) => {
  // Mock data - in a real app, this would come from a financial API
  const financialData = {
    revenue: { value: "394.3B", change: 8.1, period: "TTM" },
    netIncome: { value: "99.8B", change: 5.4, period: "TTM" },
    eps: { value: "6.13", change: 4.8, period: "TTM" },
    peRatio: { value: "30.3", change: -2.1, period: "Current" },
    grossMargin: { value: "44.1%", change: 1.2, period: "TTM" },
    operatingMargin: { value: "29.8%", change: 0.8, period: "TTM" },
    roe: { value: "26.4%", change: 2.3, period: "TTM" },
    debtToEquity: { value: "1.73", change: -0.15, period: "Current" },
  };

  const MetricCard = ({ 
    title, 
    value, 
    change, 
    period, 
    icon: Icon 
  }: { 
    title: string; 
    value: string; 
    change: number; 
    period: string; 
    icon: any; 
  }) => (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <Icon className="h-4 w-4 text-gray-400" />
          <span className={`text-xs flex items-center gap-1 ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {Math.abs(change)}%
          </span>
        </div>
        <div className="space-y-1">
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-xs text-gray-500">{title}</p>
          <p className="text-xs text-gray-400">{period}</p>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Financial Overview - {symbol}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard
              title="Revenue"
              value={financialData.revenue.value}
              change={financialData.revenue.change}
              period={financialData.revenue.period}
              icon={DollarSign}
            />
            <MetricCard
              title="Net Income"
              value={financialData.netIncome.value}
              change={financialData.netIncome.change}
              period={financialData.netIncome.period}
              icon={TrendingUp}
            />
            <MetricCard
              title="EPS"
              value={financialData.eps.value}
              change={financialData.eps.change}
              period={financialData.eps.period}
              icon={BarChart3}
            />
            <MetricCard
              title="P/E Ratio"
              value={financialData.peRatio.value}
              change={financialData.peRatio.change}
              period={financialData.peRatio.period}
              icon={BarChart3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Profitability Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard
              title="Gross Margin"
              value={financialData.grossMargin.value}
              change={financialData.grossMargin.change}
              period={financialData.grossMargin.period}
              icon={BarChart3}
            />
            <MetricCard
              title="Operating Margin"
              value={financialData.operatingMargin.value}
              change={financialData.operatingMargin.change}
              period={financialData.operatingMargin.period}
              icon={BarChart3}
            />
            <MetricCard
              title="ROE"
              value={financialData.roe.value}
              change={financialData.roe.change}
              period={financialData.roe.period}
              icon={TrendingUp}
            />
            <MetricCard
              title="Debt/Equity"
              value={financialData.debtToEquity.value}
              change={financialData.debtToEquity.change}
              period={financialData.debtToEquity.period}
              icon={BarChart3}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
