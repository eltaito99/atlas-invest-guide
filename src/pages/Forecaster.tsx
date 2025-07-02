import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, TrendingUp, DollarSign, BarChart3, Calculator, Activity } from "lucide-react";
import { Link } from "react-router-dom";
import { Chatbot } from "@/components/Chatbot";
import { StockChart } from "@/components/StockChart";
import { CompanySummary } from "@/components/CompanySummary";
import { FinancialMetrics } from "@/components/FinancialMetrics";
import { DCFValuation } from "@/components/DCFValuation";
import { TechnicalAnalysis } from "@/components/TechnicalAnalysis";

const Forecaster = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStock, setSelectedStock] = useState("AAPL");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setSelectedStock(searchTerm.toUpperCase());
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-slate-800">Atlas Hedge</h1>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link to="/" className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium">
                  Home
                </Link>
                <Link to="/portfolio" className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium">
                  Portfolio
                </Link>
                <Link to="/forecaster" className="text-blue-600 border-b-2 border-blue-600 px-3 py-2 text-sm font-medium">
                  Forecaster
                </Link>
                <Link to="/news" className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium">
                  Market News
                </Link>
                <Link to="/alerts" className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium">
                  Alerts
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

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
              <Button type="submit" className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
                Analyze
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
