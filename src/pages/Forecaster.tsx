

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, TrendingUp, DollarSign, BarChart3, Calculator, Activity, Loader2 } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Chatbot } from "@/components/Chatbot";
import { StockChart } from "@/components/StockChart";
import { CompanySummary } from "@/components/CompanySummary";
import { FinancialMetrics } from "@/components/FinancialMetrics";
import { DCFValuation } from "@/components/DCFValuation";
import { TechnicalAnalysis } from "@/components/TechnicalAnalysis";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const Forecaster = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStock, setSelectedStock] = useState("AAPL");
  const [marketData, setMarketData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setSelectedStock(searchTerm.toUpperCase());
      setLoading(true);
      
      try {
        // Fetch market data for the symbol
        const { data, error } = await supabase.functions.invoke('market-data', {
          body: { symbol: searchTerm.trim(), type: 'stock' }
        });
        
        if (error) throw error;
        
        setMarketData(data);
      } catch (error) {
        console.error('Error fetching market data:', error);
        toast({
          title: "Error",
          description: "Failed to fetch market data for " + searchTerm,
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Stock Forecaster</h1>
          <p className="text-gray-600">Comprehensive analysis and valuation for any stock</p>
        </div>

        {/* Search Bar */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <form onSubmit={handleSearch} className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Enter stock symbol (e.g., AAPL, TSLA, GOOGL)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button 
                type="submit" 
                className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Analyze
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Company Summary */}
          <div className="lg:col-span-1">
            <CompanySummary symbol={selectedStock} />
          </div>

          {/* Right Column - Analysis Tabs */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="chart" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="chart" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Chart
                </TabsTrigger>
                <TabsTrigger value="financials" className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Financials
                </TabsTrigger>
                <TabsTrigger value="valuation" className="flex items-center gap-2">
                  <Calculator className="h-4 w-4" />
                  DCF
                </TabsTrigger>
                <TabsTrigger value="technical" className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Technical
                </TabsTrigger>
              </TabsList>

              <TabsContent value="chart" className="mt-6">
                <StockChart symbol={selectedStock} />
              </TabsContent>

              <TabsContent value="financials" className="mt-6">
                <FinancialMetrics symbol={selectedStock} />
              </TabsContent>

              <TabsContent value="valuation" className="mt-6">
                <DCFValuation symbol={selectedStock} />
              </TabsContent>

              <TabsContent value="technical" className="mt-6">
                <TechnicalAnalysis symbol={selectedStock} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      <Chatbot />
    </div>
  );
};

export default Forecaster;

