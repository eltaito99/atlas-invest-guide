
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, TrendingDown, DollarSign, BarChart3 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface FinancialMetricsProps {
  symbol: string;
}

export const FinancialMetrics = ({ symbol }: FinancialMetricsProps) => {
  const [financialData, setFinancialData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFinancialData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const { data, error } = await supabase.functions.invoke('market-data', {
          body: { symbol, type: 'stock' }
        });
        
        if (error) throw error;
        setFinancialData(data);
      } catch (err) {
        console.error('Error fetching financial data:', err);
        setError('Failed to load financial data');
      } finally {
        setLoading(false);
      }
    };

    if (symbol) {
      fetchFinancialData();
    }
  }, [symbol]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <Skeleton className="h-4 w-16 mb-2" />
                    <Skeleton className="h-8 w-20 mb-1" />
                    <Skeleton className="h-3 w-12" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !financialData) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="text-red-500 mb-2">Failed to load financial data</div>
          <p className="text-sm text-gray-500">Please try searching for another symbol</p>
        </CardContent>
      </Card>
    );
  }

  const formatValue = (value: number, type: string) => {
    if (!value) return 'N/A';
    
    switch (type) {
      case 'currency':
        return value >= 1e12 ? `${(value / 1e12).toFixed(1)}T` :
               value >= 1e9 ? `${(value / 1e9).toFixed(1)}B` :
               value >= 1e6 ? `${(value / 1e6).toFixed(1)}M` :
               `${value.toFixed(0)}`;
      case 'percentage':
        return `${(value * 100).toFixed(1)}%`;
      case 'ratio':
        return value.toFixed(2);
      default:
        return value.toString();
    }
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
              value={`$${formatValue(financialData.totalRevenue, 'currency')}`}
              change={Math.random() * 10 - 5} // Mock change until we have historical data
              period="TTM"
              icon={DollarSign}
            />
            <MetricCard
              title="Net Income"
              value={`$${formatValue(financialData.netIncomeToCommon, 'currency')}`}
              change={Math.random() * 10 - 5}
              period="TTM"
              icon={TrendingUp}
            />
            <MetricCard
              title="EPS"
              value={financialData.trailingEps ? `$${financialData.trailingEps.toFixed(2)}` : 'N/A'}
              change={Math.random() * 10 - 5}
              period="TTM"
              icon={BarChart3}
            />
            <MetricCard
              title="P/E Ratio"
              value={financialData.trailingPE ? financialData.trailingPE.toFixed(2) : 'N/A'}
              change={Math.random() * 10 - 5}
              period="Current"
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
              value={formatValue(financialData.grossMargins, 'percentage')}
              change={Math.random() * 5 - 2.5}
              period="TTM"
              icon={BarChart3}
            />
            <MetricCard
              title="Operating Margin"
              value={formatValue(financialData.operatingMargins, 'percentage')}
              change={Math.random() * 5 - 2.5}
              period="TTM"
              icon={BarChart3}
            />
            <MetricCard
              title="ROE"
              value={formatValue(financialData.returnOnEquity, 'percentage')}
              change={Math.random() * 5 - 2.5}
              period="TTM"
              icon={TrendingUp}
            />
            <MetricCard
              title="Debt/Equity"
              value={formatValue(financialData.debtToEquity, 'ratio')}
              change={Math.random() * 5 - 2.5}
              period="Current"
              icon={BarChart3}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
