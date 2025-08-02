
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
        
        // Use symbol-specific mock data when API fails
        const getCompanyMockData = (symbol: string) => {
          switch(symbol.toUpperCase()) {
            case 'AAPL':
              return {
                symbol: 'AAPL',
                name: 'Apple Inc.',
                price: 180.75,
                change: -2.45,
                changePercent: -1.34,
                sector: 'Technology',
                industry: 'Consumer Electronics',
                marketCap: 2850000000000,
                employees: 164000,
                headquarters: 'Cupertino, CA, USA',
                description: 'Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide. The company operates through iPhone, Mac, iPad, Wearables, Home and Accessories, and Services segments.',
                website: 'https://www.apple.com',
                currency: 'USD',
                volume: 45623000,
                high52w: 199.62,
                low52w: 164.08,
                pe: 29.4,
                eps: 6.13,
                beta: 1.29,
                dividendYield: 0.47
              };
            case 'MSFT':
              return {
                symbol: 'MSFT',
                name: 'Microsoft Corporation',
                price: 425.31,
                change: 8.21,
                changePercent: 1.97,
                sector: 'Technology',
                industry: 'Software',
                marketCap: 3160000000000,
                employees: 228000,
                headquarters: 'Redmond, WA, USA',
                description: 'Microsoft Corporation develops, licenses, and supports software, services, devices, and solutions worldwide. The company operates through Productivity and Business Processes, Intelligent Cloud, and More Personal Computing segments.',
                website: 'https://www.microsoft.com',
                currency: 'USD',
                volume: 28000000,
                high52w: 468.35,
                low52w: 309.45,
                pe: 35.8,
                eps: 11.86,
                beta: 0.89,
                dividendYield: 0.68
              };
            case 'NVDA':
              return {
                symbol: 'NVDA',
                name: 'NVIDIA Corporation',
                price: 875.28,
                change: 15.67,
                changePercent: 1.82,
                sector: 'Technology',
                industry: 'Semiconductors',
                marketCap: 2150000000000,
                employees: 29600,
                headquarters: 'Santa Clara, CA, USA',
                description: 'NVIDIA Corporation operates as a visual computing company worldwide. It operates in two segments, Graphics and Compute & Networking. The company develops and markets graphics processing units for gaming, professional visualization, data centers, and automotive markets.',
                website: 'https://www.nvidia.com',
                currency: 'USD',
                volume: 52000000,
                high52w: 974.00,
                low52w: 108.13,
                pe: 65.5,
                eps: 2.95,
                beta: 1.68,
                dividendYield: 0.03
              };
            case 'TSLA':
              return {
                symbol: 'TSLA',
                name: 'Tesla, Inc.',
                price: 248.42,
                change: -3.15,
                changePercent: -1.25,
                sector: 'Consumer Cyclical',
                industry: 'Auto Manufacturers',
                marketCap: 791000000000,
                employees: 140473,
                headquarters: 'Austin, TX, USA',
                description: 'Tesla, Inc. designs, develops, manufactures, leases, and sells electric vehicles, and energy generation and storage systems in the United States, China, and internationally. The company operates through Automotive and Energy Generation and Storage segments.',
                website: 'https://www.tesla.com',
                currency: 'USD',
                volume: 88000000,
                high52w: 299.29,
                low52w: 138.80,
                pe: 63.9,
                eps: 4.73,
                beta: 2.32,
                dividendYield: 0.00
              };
            case 'META':
              return {
                symbol: 'META',
                name: 'Meta Platforms, Inc.',
                price: 531.44,
                change: 12.87,
                changePercent: 2.48,
                sector: 'Communication Services',
                industry: 'Internet Content & Information',
                marketCap: 1350000000000,
                employees: 70799,
                headquarters: 'Menlo Park, CA, USA',
                description: 'Meta Platforms, Inc. develops products that enable people to connect and share with friends and family through mobile devices, personal computers, virtual reality headsets, and wearables worldwide. It operates through Family of Apps and Reality Labs segments.',
                website: 'https://www.meta.com',
                currency: 'USD',
                volume: 25000000,
                high52w: 542.81,
                low52w: 279.49,
                pe: 24.7,
                eps: 14.87,
                beta: 1.12,
                dividendYield: 0.37
              };
            default:
              return {
                symbol: symbol,
                name: `${symbol} Inc.`,
                price: 175.42,
                change: 2.15,
                changePercent: 1.24,
                sector: 'Technology',
                industry: 'Software',
                marketCap: 2850000000000,
                employees: 164000,
                headquarters: 'Cupertino, CA, USA',
                description: `${symbol} is a multinational technology company that designs, develops, and sells consumer electronics, computer software, and online services. The company is known for its innovative products and services across multiple technology segments.`,
                website: 'https://www.apple.com',
                currency: 'USD',
                volume: 45623000,
                high52w: 198.23,
                low52w: 145.03,
                pe: 28.5,
                eps: 6.15,
                beta: 1.23,
                dividendYield: 0.44
              };
          }
        };

        const mockCompanyData = getCompanyMockData(symbol);
        
        setData(mockCompanyData);
        
        toast({
          title: "Using Sample Data",
          description: "Showing sample company data for " + symbol,
          variant: "default"
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
