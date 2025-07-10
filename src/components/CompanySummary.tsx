
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Building, MapPin, Users, TrendingUp, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface CompanySummaryProps {
  symbol: string;
}

export const CompanySummary = ({ symbol }: CompanySummaryProps) => {
  const [companyData, setCompanyData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompanyData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const { data, error } = await supabase.functions.invoke('market-data', {
          body: { symbol, type: 'stock' }
        });
        
        if (error) throw error;
        setCompanyData(data);
      } catch (err) {
        console.error('Error fetching company data:', err);
        setError('Failed to load company data');
      } finally {
        setLoading(false);
      }
    };

    if (symbol) {
      fetchCompanyData();
    }
  }, [symbol]);

  if (loading) {
    return (
      <Card className="h-fit">
        <CardHeader>
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-5 w-20" />
          </div>
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-16 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !companyData) {
    return (
      <Card className="h-fit">
        <CardContent className="p-6 text-center">
          <div className="text-red-500 mb-2">Failed to load data</div>
          <p className="text-sm text-gray-500">Please try searching for another symbol</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-fit">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">{symbol}</CardTitle>
          {companyData.sector && (
            <Badge variant="outline" className="bg-green-50 text-green-700">
              {companyData.sector}
            </Badge>
          )}
        </div>
        <p className="text-sm text-gray-600">{companyData.name || companyData.longName}</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Price */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl font-bold">
              ${companyData.currentPrice || companyData.regularMarketPrice || 'N/A'}
            </span>
            {companyData.regularMarketChange && (
              <span className={`text-sm flex items-center gap-1 ${
                companyData.regularMarketChange >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                <TrendingUp className="h-3 w-3" />
                {companyData.regularMarketChange > 0 ? '+' : ''}{companyData.regularMarketChange.toFixed(2)} 
                ({companyData.regularMarketChangePercent?.toFixed(2)}%)
              </span>
            )}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="space-y-3">
          {companyData.marketCap && (
            <div className="flex items-center gap-2 text-sm">
              <Building className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600">Market Cap:</span>
              <span className="font-medium">
                ${(companyData.marketCap / 1e12).toFixed(2)}T
              </span>
            </div>
          )}
          {companyData.fullTimeEmployees && (
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600">Employees:</span>
              <span className="font-medium">{companyData.fullTimeEmployees.toLocaleString()}</span>
            </div>
          )}
          {(companyData.city || companyData.state) && (
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600">HQ:</span>
              <span className="font-medium">
                {[companyData.city, companyData.state].filter(Boolean).join(', ')}
              </span>
            </div>
          )}
        </div>

        {/* Description */}
        {companyData.longBusinessSummary && (
          <div>
            <h4 className="font-medium mb-2">About</h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              {companyData.longBusinessSummary.length > 300 
                ? `${companyData.longBusinessSummary.substring(0, 300)}...`
                : companyData.longBusinessSummary
              }
            </p>
          </div>
        )}

        {/* Industry */}
        {companyData.industry && (
          <div>
            <h4 className="font-medium mb-2">Industry</h4>
            <Badge variant="secondary">{companyData.industry}</Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
