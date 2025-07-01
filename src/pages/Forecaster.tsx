
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, TrendingUp, ArrowLeft, Building2, DollarSign, BarChart3, Calculator, Activity } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { StockChart } from "@/components/StockChart";
import { TechnicalIndicators } from "@/components/TechnicalIndicators";
import { FinancialMetrics } from "@/components/FinancialMetrics";
import { DCFValuation } from "@/components/DCFValuation";

interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap: string;
  peRatio: number;
  dividend: number;
  volume: string;
  high52Week: number;
  low52Week: number;
  description: string;
  sector: string;
  industry: string;
  employees: string;
}

const mockStockData: Record<string, StockData> = {
  AAPL: {
    symbol: "AAPL",
    name: "Apple Inc.",
    price: 175.43,
    change: 2.15,
    changePercent: 1.24,
    marketCap: "2.75T",
    peRatio: 28.5,
    dividend: 0.96,
    volume: "45.2M",
    high52Week: 199.62,
    low52Week: 164.08,
    description: "Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide.",
    sector: "Technology",
    industry: "Consumer Electronics",
    employees: "164,000"
  },
  MSFT: {
    symbol: "MSFT",
    name: "Microsoft Corporation",
    price: 285.76,
    change: -1.82,
    changePercent: -0.63,
    marketCap: "2.12T",
    peRatio: 24.8,
    dividend: 3.00,
    volume: "28.1M",
    high52Week: 348.10,
    low52Week: 276.51,
    description: "Microsoft Corporation develops, licenses, and supports software, services, devices, and solutions worldwide.",
    sector: "Technology",
    industry: "Software",
    employees: "221,000"
  }
};

const Forecaster = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStock, setSelectedStock] = useState<StockData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      toast({
        title: "Error",
        description: "Please enter a stock symbol",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const stockSymbol = searchTerm.toUpperCase();
      const stockData = mockStockData[stockSymbol];
      
      if (stockData) {
        setSelectedStock(stockData);
        toast({
          title: "Success",
          description: `Analysis loaded for ${stockData.name}`
        });
      } else {
        toast({
          title: "Not Found",
          description: "Stock symbol not found. Try AAPL or MSFT for demo.",
          variant: "destructive"
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button asChild variant="ghost" size="sm">
                <Link to="/">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Link>
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-slate-800">Stock Forecaster</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/portfolio" className="text-slate-600 hover:text-slate-800 transition-colors">Portfolio</Link>
              <Link to="/news" className="text-slate-600 hover:text-slate-800 transition-colors">News</Link>
              <Link to="/alerts" className="text-slate-600 hover:text-slate-800 transition-colors">Alerts</Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-8">
        {/* Header and Search */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Stock Analysis & Forecasting</h1>
          <p className="text-slate-600 mb-6">Get comprehensive analysis, valuation, and technical indicators for any stock</p>
          
          <div className="flex gap-4 max-w-md">
            <Input
              placeholder="Enter stock symbol (e.g., AAPL, MSFT)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button 
              onClick={handleSearch}
              disabled={isLoading}
              className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
            >
              <Search className="w-4 h-4 mr-2" />
              {isLoading ? "Searching..." : "Analyze"}
            </Button>
          </div>
        </div>

        {selectedStock && (
          <div className="space-y-6">
            {/* Stock Header */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl flex items-center gap-2">
                      {selectedStock.name}
                      <Badge variant="outline">{selectedStock.symbol}</Badge>
                    </CardTitle>
                    <CardDescription className="flex items-center gap-4 mt-2">
                      <span>{selectedStock.sector} • {selectedStock.industry}</span>
                      <span>{selectedStock.employees} employees</span>
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold">${selectedStock.price}</div>
                    <div className={`flex items-center ${selectedStock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      <TrendingUp className="w-4 h-4 mr-1" />
                      {selectedStock.change >= 0 ? '+' : ''}${selectedStock.change.toFixed(2)} ({selectedStock.changePercent.toFixed(2)}%)
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">{selectedStock.description}</p>
              </CardContent>
            </Card>

            {/* Analysis Tabs */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview" className="flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="chart" className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Chart
                </TabsTrigger>
                <TabsTrigger value="financials" className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Financials
                </TabsTrigger>
                <TabsTrigger value="valuation" className="flex items-center gap-2">
                  <Calculator className="w-4 h-4" />
                  DCF
                </TabsTrigger>
                <TabsTrigger value="technical" className="flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Technical
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-sm text-slate-600">Market Cap</div>
                      <div className="text-xl font-semibold">${selectedStock.marketCap}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-sm text-slate-600">P/E Ratio</div>
                      <div className="text-xl font-semibold">{selectedStock.peRatio}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-sm text-slate-600">Dividend Yield</div>
                      <div className="text-xl font-semibold">{selectedStock.dividend}%</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-sm text-slate-600">Volume</div>
                      <div className="text-xl font-semibold">{selectedStock.volume}</div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="chart" className="mt-6">
                <StockChart symbol={selectedStock.symbol} />
              </TabsContent>

              <TabsContent value="financials" className="mt-6">
                <FinancialMetrics stock={selectedStock} />
              </TabsContent>

              <TabsContent value="valuation" className="mt-6">
                <DCFValuation stock={selectedStock} />
              </TabsContent>

              <TabsContent value="technical" className="mt-6">
                <TechnicalIndicators symbol={selectedStock.symbol} />
              </TabsContent>
            </Tabs>
          </div>
        )}

        {!selectedStock && (
          <Card className="text-center py-12">
            <CardContent>
              <Search className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-600 mb-2">Search for a Stock</h3>
              <p className="text-slate-500">Enter a stock symbol above to get comprehensive analysis and forecasting</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Forecaster;
