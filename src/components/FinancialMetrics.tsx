
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
    // If marketData is provided and has financials, use it directly
    if (marketData && marketData.financials) {
      setFinancialData(marketData.financials);
      setLoading(false);
      return;
    }

    const fetchFinancialData = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.functions.invoke('market-data', {
          body: { symbol, dataType: 'financials' }
        });
        
        if (error) throw error;
        
        setFinancialData(data);
      } catch (error) {
        console.error('Error fetching financial data:', error);
        
        // Use mock financial data when API fails
        const mockFinancialData = {
          symbol: symbol,
          revenue: {
            value: "125.7B",
            raw: 125700000000,
            change: 8.5,
            period: "TTM"
          },
          netIncome: {
            value: "23.6B",
            raw: 23600000000,
            change: 12.3,
            period: "TTM"
          },
          eps: {
            value: "6.15",
            raw: 6.15,
            change: 15.2,
            period: "TTM"
          },
          peRatio: {
            value: "28.5",
            raw: 28.5,
            change: -2.1,
            period: "Current"
          },
          grossMargin: {
            value: "42.3%",
            raw: 42.3,
            change: 1.8,
            period: "TTM"
          },
          operatingMargin: {
            value: "28.7%",
            raw: 28.7,
            change: 2.4,
            period: "TTM"
          },
          roe: {
            value: "21.4%",
            raw: 21.4,
            change: 3.1,
            period: "TTM"
          },
          debtToEquity: {
            value: "0.85",
            raw: 0.85,
            change: -5.2,
            period: "Current"
          }
        };
        
        setFinancialData(mockFinancialData);
        
        toast({
          title: "Using Sample Data",
          description: "Showing sample financial data for " + symbol,
          variant: "default"
        });
      } finally {
        setLoading(false);
      }
    };

    if (symbol) {
      fetchFinancialData();
    }
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
