
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, BarChart3, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface FinancialMetricsProps {
  symbol: string;
  marketData?: any;
}

interface FinancialData {
  symbol: string;
  revenue: {
    value: string;
    raw: number;
    change: number;
    period: string;
  };
  netIncome: {
    value: string;
    raw: number;
    change: number;
    period: string;
  };
  eps: {
    value: string;
    raw: number;
    change: number;
    period: string;
  };
  peRatio: {
    value: string;
    raw: number;
    change: number;
    period: string;
  };
  grossMargin: {
    value: string;
    raw: number;
    change: number;
    period: string;
  };
  operatingMargin: {
    value: string;
    raw: number;
    change: number;
    period: string;
  };
  roe: {
    value: string;
    raw: number;
    change: number;
    period: string;
  };
  debtToEquity: {
    value: string;
    raw: number;
    change: number;
    period: string;
  };
}

export const FinancialMetrics = ({ symbol, marketData }: FinancialMetricsProps) => {
  const { toast } = useToast();
  const [financialData, setFinancialData] = useState<FinancialData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock financial data based on symbol
    const getCompanyData = (symbol: string) => {
      switch(symbol.toUpperCase()) {
        case 'AAPL':
          return {
            revenue: { value: "383.3B", raw: 383300000000, change: 2.8, period: "TTM" },
            netIncome: { value: "97.0B", raw: 97000000000, change: -2.8, period: "TTM" },
            eps: { value: "6.13", raw: 6.13, change: -2.4, period: "TTM" },
            peRatio: { value: "29.4", raw: 29.4, change: 8.2, period: "Current" },
            grossMargin: { value: "45.6%", raw: 45.6, change: 0.4, period: "TTM" },
            operatingMargin: { value: "30.3%", raw: 30.3, change: -1.1, period: "TTM" },
            roe: { value: "160.6%", raw: 160.6, change: 4.2, period: "TTM" },
            debtToEquity: { value: "1.95", raw: 1.95, change: -0.2, period: "Current" }
          };
        case 'MSFT':
          return {
            revenue: { value: "245.1B", raw: 245100000000, change: 15.7, period: "TTM" },
            netIncome: { value: "88.1B", raw: 88100000000, change: 38.3, period: "TTM" },
            eps: { value: "11.86", raw: 11.86, change: 37.7, period: "TTM" },
            peRatio: { value: "35.8", raw: 35.8, change: -5.2, period: "Current" },
            grossMargin: { value: "69.4%", raw: 69.4, change: 1.8, period: "TTM" },
            operatingMargin: { value: "42.0%", raw: 42.0, change: 7.2, period: "TTM" },
            roe: { value: "35.8%", raw: 35.8, change: 5.4, period: "TTM" },
            debtToEquity: { value: "0.35", raw: 0.35, change: -0.1, period: "Current" }
          };
        case 'NVDA':
          return {
            revenue: { value: "126.0B", raw: 126000000000, change: 126.0, period: "TTM" },
            netIncome: { value: "73.0B", raw: 73000000000, change: 581.0, period: "TTM" },
            eps: { value: "2.95", raw: 2.95, change: 486.0, period: "TTM" },
            peRatio: { value: "65.5", raw: 65.5, change: -15.2, period: "Current" },
            grossMargin: { value: "73.0%", raw: 73.0, change: 26.0, period: "TTM" },
            operatingMargin: { value: "62.1%", raw: 62.1, change: 48.5, period: "TTM" },
            roe: { value: "123.0%", raw: 123.0, change: 85.2, period: "TTM" },
            debtToEquity: { value: "0.15", raw: 0.15, change: -0.05, period: "Current" }
          };
        case 'TSLA':
          return {
            revenue: { value: "96.8B", raw: 96800000000, change: 19.3, period: "TTM" },
            netIncome: { value: "15.0B", raw: 15000000000, change: 19.3, period: "TTM" },
            eps: { value: "4.73", raw: 4.73, change: 19.6, period: "TTM" },
            peRatio: { value: "63.9", raw: 63.9, change: -40.2, period: "Current" },
            grossMargin: { value: "18.7%", raw: 18.7, change: -1.4, period: "TTM" },
            operatingMargin: { value: "8.2%", raw: 8.2, change: 2.8, period: "TTM" },
            roe: { value: "19.7%", raw: 19.7, change: 5.2, period: "TTM" },
            debtToEquity: { value: "0.05", raw: 0.05, change: -0.02, period: "Current" }
          };
        case 'META':
          return {
            revenue: { value: "134.9B", raw: 134900000000, change: 22.1, period: "TTM" },
            netIncome: { value: "39.1B", raw: 39100000000, change: 69.2, period: "TTM" },
            eps: { value: "14.87", raw: 14.87, change: 73.2, period: "TTM" },
            peRatio: { value: "24.7", raw: 24.7, change: -28.5, period: "Current" },
            grossMargin: { value: "81.5%", raw: 81.5, change: 1.2, period: "TTM" },
            operatingMargin: { value: "38.3%", raw: 38.3, change: 12.8, period: "TTM" },
            roe: { value: "36.3%", raw: 36.3, change: 15.4, period: "TTM" },
            debtToEquity: { value: "0.18", raw: 0.18, change: 0.02, period: "Current" }
          };
        default:
          return {
            revenue: { value: "125.7B", raw: 125700000000, change: 8.5, period: "TTM" },
            netIncome: { value: "23.6B", raw: 23600000000, change: 12.3, period: "TTM" },
            eps: { value: "6.15", raw: 6.15, change: 15.2, period: "TTM" },
            peRatio: { value: "28.5", raw: 28.5, change: -2.1, period: "Current" },
            grossMargin: { value: "42.3%", raw: 42.3, change: 1.8, period: "TTM" },
            operatingMargin: { value: "28.7%", raw: 28.7, change: 2.4, period: "TTM" },
            roe: { value: "21.4%", raw: 21.4, change: 3.1, period: "TTM" },
            debtToEquity: { value: "0.85", raw: 0.85, change: -5.2, period: "Current" }
          };
      }
    };

    const companyData = getCompanyData(symbol);
    const mockFinancialData = {
      symbol: symbol,
      ...companyData
    };
    
    setFinancialData(mockFinancialData);
    setLoading(false);
    
    toast({
      title: "Financial Data Loaded",
      description: "Showing sample financial data for " + symbol,
      variant: "default"
    });
  }, [symbol, marketData, toast]);

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
          {change !== 0 && (
            <span className={`text-xs flex items-center gap-1 ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {Math.abs(change).toFixed(1)}%
            </span>
          )}
        </div>
        <div className="space-y-1">
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-xs text-gray-500">{title}</p>
          <p className="text-xs text-gray-400">{period}</p>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6 flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading financial data...</span>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!financialData) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-gray-500">No financial data available</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Financial Overview - {financialData.symbol}</CardTitle>
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
              value={`$${financialData.eps.value}`}
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
