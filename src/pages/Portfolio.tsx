

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, DollarSign, Plus, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface Holding {
  id: string;
  symbol: string;
  name: string;
  shares: number;
  purchasePrice: number;
  currentPrice: number;
  value: number;
  gainLoss: number;
  gainLossPercent: number;
}

const Portfolio = () => {
  const { toast } = useToast();
  const [holdings, setHoldings] = useState<Holding[]>([
    {
      id: "1",
      symbol: "AAPL",
      name: "Apple Inc.",
      shares: 50,
      purchasePrice: 150,
      currentPrice: 175,
      value: 8750,
      gainLoss: 1250,
      gainLossPercent: 16.67
    },
    {
      id: "2",
      symbol: "MSFT",
      name: "Microsoft Corporation",
      shares: 30,
      purchasePrice: 300,
      currentPrice: 285,
      value: 8550,
      gainLoss: -450,
      gainLossPercent: -5.0
    }
  ]);

  const [newHolding, setNewHolding] = useState({
    symbol: "",
    name: "",
    shares: "",
    purchasePrice: ""
  });

  const totalValue = holdings.reduce((sum, holding) => sum + holding.value, 0);
  const totalGainLoss = holdings.reduce((sum, holding) => sum + holding.gainLoss, 0);
  const totalGainLossPercent = totalValue > 0 ? (totalGainLoss / (totalValue - totalGainLoss)) * 100 : 0;

  const handleAddHolding = () => {
    if (!newHolding.symbol || !newHolding.shares || !newHolding.purchasePrice) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const shares = parseFloat(newHolding.shares);
    const purchasePrice = parseFloat(newHolding.purchasePrice);
    const currentPrice = purchasePrice * (1 + (Math.random() - 0.5) * 0.2); // Simulate current price
    const value = shares * currentPrice;
    const gainLoss = value - (shares * purchasePrice);
    const gainLossPercent = (gainLoss / (shares * purchasePrice)) * 100;

    const holding: Holding = {
      id: Date.now().toString(),
      symbol: newHolding.symbol.toUpperCase(),
      name: newHolding.name || `${newHolding.symbol.toUpperCase()} Corporation`,
      shares,
      purchasePrice,
      currentPrice,
      value,
      gainLoss,
      gainLossPercent
    };

    setHoldings([...holdings, holding]);
    setNewHolding({ symbol: "", name: "", shares: "", purchasePrice: "" });
    
    toast({
      title: "Success",
      description: "Holding added to your portfolio"
    });
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
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-slate-800">Atlas Hedge</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/forecaster" className="text-slate-600 hover:text-slate-800 transition-colors">Forecaster</Link>
              <Link to="/news" className="text-slate-600 hover:text-slate-800 transition-colors">Market News</Link>
              <Link to="/alerts" className="text-slate-600 hover:text-slate-800 transition-colors">Alerts</Link>
              <Link to="/social" className="text-slate-600 hover:text-slate-800 transition-colors">Social</Link>
              <Link to="/about" className="text-slate-600 hover:text-slate-800 transition-colors">About Us</Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Portfolio Dashboard</h1>
          <p className="text-slate-600">Track and manage your investment portfolio</p>
        </div>

        {/* Portfolio Summary */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Gain/Loss</CardTitle>
              {totalGainLoss >= 0 ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600" />
              )}
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${Math.abs(totalGainLoss).toLocaleString()}
              </div>
              <p className={`text-xs ${totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {totalGainLoss >= 0 ? '+' : '-'}{Math.abs(totalGainLossPercent).toFixed(2)}%
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Holdings</CardTitle>
              <Plus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{holdings.length}</div>
              <p className="text-xs text-muted-foreground">Active positions</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Holdings List */}
          <Card>
            <CardHeader>
              <CardTitle>Your Holdings</CardTitle>
              <CardDescription>Current portfolio positions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {holdings.map((holding) => (
                  <div key={holding.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-semibold">{holding.symbol}</span>
                        <Badge variant="outline">{holding.shares} shares</Badge>
                      </div>
                      <p className="text-sm text-slate-600">{holding.name}</p>
                      <p className="text-sm text-slate-500">
                        Avg Cost: ${holding.purchasePrice.toFixed(2)} | Current: ${holding.currentPrice.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${holding.value.toLocaleString()}</p>
                      <p className={`text-sm ${holding.gainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {holding.gainLoss >= 0 ? '+' : ''}${holding.gainLoss.toFixed(0)} ({holding.gainLossPercent.toFixed(1)}%)
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Add New Holding */}
          <Card>
            <CardHeader>
              <CardTitle>Add New Holding</CardTitle>
              <CardDescription>Add a new stock to your portfolio</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="symbol">Stock Symbol *</Label>
                  <Input
                    id="symbol"
                    placeholder="e.g., AAPL"
                    value={newHolding.symbol}
                    onChange={(e) => setNewHolding({ ...newHolding, symbol: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="name">Company Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Apple Inc."
                    value={newHolding.name}
                    onChange={(e) => setNewHolding({ ...newHolding, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="shares">Number of Shares *</Label>
                  <Input
                    id="shares"
                    type="number"
                    placeholder="100"
                    value={newHolding.shares}
                    onChange={(e) => setNewHolding({ ...newHolding, shares: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="price">Purchase Price per Share *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    placeholder="150.00"
                    value={newHolding.purchasePrice}
                    onChange={(e) => setNewHolding({ ...newHolding, purchasePrice: e.target.value })}
                  />
                </div>
                <Button onClick={handleAddHolding} className="w-full">
                  Add to Portfolio
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;

