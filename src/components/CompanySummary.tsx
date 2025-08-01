
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building, MapPin, Users, TrendingUp, TrendingDown, Loader2, Globe } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface CompanySummaryProps {
  symbol: string;
  marketData?: any;
}

interface CompanyData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  sector: string;
  industry: string;
  marketCap: number;
  employees: string | number;
  headquarters: string;
  description: string;
  website: string;
  currency: string;
  volume: number;
  high52w: number;
  low52w: number;
  pe: number;
  eps: number;
  beta: number;
  dividendYield: number;
}

export const CompanySummary = ({ symbol, marketData }: CompanySummaryProps) => {
  const { toast } = useToast();
  const [data, setData] = useState<CompanyData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If marketData is provided, use it directly
    if (marketData) {
      setData(marketData);
      setLoading(false);
      return;
    }

    const fetchCompanyData = async () => {
      setLoading(true);
      try {
        const { data: companyData, error } = await supabase.functions.invoke('market-data', {
          body: { symbol, dataType: 'company' }
        });
        
        if (error) throw error;
        
        setData(companyData);
      } catch (error) {
        console.error('Error fetching company data:', error);
        toast({
          title: "Error",
          description: "Failed to fetch company data for " + symbol,
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    if (symbol) {
      fetchCompanyData();
    }
  }, [symbol, marketData, toast]);

  const formatMarketCap = (value: number | undefined | null) => {
    if (!value || isNaN(value)) return 'N/A';
    if (value >= 1e12) return `$${(value / 1e12).toFixed(1)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
    return `$${value.toFixed(0)}`;
  };

  const formatEmployees = (value: string | number) => {
    if (typeof value === 'number') {
      return value.toLocaleString();
    }
    return value;
  };

  if (loading) {
    return (
      <Card className="h-fit">
        <CardContent className="p-6 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="ml-2">Loading company data...</span>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card className="h-fit">
        <CardContent className="p-6">
          <p className="text-center text-gray-500">No company data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-fit">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">{data.symbol}</CardTitle>
          <Badge variant="outline" className="bg-green-50 text-green-700">
            {data.sector}
          </Badge>
        </div>
        <p className="text-sm text-gray-600">{data.name}</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Price */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl font-bold">${data.price ? data.price.toFixed(2) : 'N/A'}</span>
            {data.change !== undefined && data.changePercent !== undefined && (
              <span className={`text-sm flex items-center gap-1 ${data.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {data.change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {data.change >= 0 ? '+' : ''}{data.change.toFixed(2)} ({data.changePercent.toFixed(2)}%)
              </span>
            )}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Building className="h-4 w-4 text-gray-400" />
            <span className="text-gray-600">Market Cap:</span>
            <span className="font-medium">{formatMarketCap(data.marketCap)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-gray-400" />
            <span className="text-gray-600">Employees:</span>
            <span className="font-medium">{formatEmployees(data.employees)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-gray-400" />
            <span className="text-gray-600">HQ:</span>
            <span className="font-medium">{data.headquarters}</span>
          </div>
          {data.website && data.website !== 'N/A' && (
            <div className="flex items-center gap-2 text-sm">
              <Globe className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600">Website:</span>
              <a 
                href={data.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-medium text-blue-600 hover:underline"
              >
                {data.website.replace(/^https?:\/\//, '')}
              </a>
            </div>
          )}
        </div>

        {/* Financial Ratios */}
        <div>
          <h4 className="font-medium mb-3">Key Financial Ratios</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">P/E Ratio:</span>
              <div className="font-medium text-lg">{data.pe ? data.pe.toFixed(2) : 'N/A'}</div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">EPS:</span>
              <div className="font-medium text-lg">${data.eps ? data.eps.toFixed(2) : 'N/A'}</div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Beta:</span>
              <div className="font-medium text-lg">{data.beta ? data.beta.toFixed(2) : 'N/A'}</div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Div Yield:</span>
              <div className="font-medium text-lg">{data.dividendYield ? `${data.dividendYield.toFixed(2)}%` : 'N/A'}</div>
            </div>
          </div>
        </div>

        {/* Trading Information */}
        <div>
          <h4 className="font-medium mb-3">Trading Information</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="p-3 bg-blue-50 rounded-lg">
              <span className="text-gray-600">Volume:</span>
              <div className="font-medium text-lg">{data.volume ? data.volume.toLocaleString() : 'N/A'}</div>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <span className="text-gray-600">52W High:</span>
              <div className="font-medium text-lg">${data.high52w ? data.high52w.toFixed(2) : 'N/A'}</div>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <span className="text-gray-600">52W Low:</span>
              <div className="font-medium text-lg">${data.low52w ? data.low52w.toFixed(2) : 'N/A'}</div>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <span className="text-gray-600">Currency:</span>
              <div className="font-medium text-lg">{data.currency || 'USD'}</div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <h4 className="font-medium mb-2">About</h4>
          <p className="text-sm text-gray-600 leading-relaxed">
            {data.description}
          </p>
        </div>

        {/* Industry */}
        <div>
          <h4 className="font-medium mb-2">Industry</h4>
          <Badge variant="secondary">{data.industry}</Badge>
        </div>
      </CardContent>
    </Card>
  );
};
