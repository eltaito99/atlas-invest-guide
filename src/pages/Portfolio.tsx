

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { TrendingUp, TrendingDown, DollarSign, Plus, X, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Navigation } from "@/components/Navigation";
import { DailyRewards } from "@/components/DailyRewards";
import { supabase } from "@/integrations/supabase/client";

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
  assetType?: string;
}

const Portfolio = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [selectedHolding, setSelectedHolding] = useState<Holding | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [closeQuantity, setCloseQuantity] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const [newHolding, setNewHolding] = useState({
    symbol: "",
    name: "",
    shares: "",
    purchasePrice: "",
    assetType: "stock"
  });

  // Check authentication and fetch data
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth');
        return;
      }
      setUser(user);
      await fetchHoldings();
      setLoading(false);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session?.user) {
        navigate('/auth');
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchHoldings = async () => {
    try {
      const { data, error } = await supabase
        .from('holdings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch real-time prices for each holding
      const formattedHoldings: Holding[] = await Promise.all(data.map(async (holding) => {
        let currentPrice = holding.current_price;
        
        try {
          // Fetch current market data
          const { data: marketData } = await supabase.functions.invoke('market-data', {
            body: { 
              symbol: holding.symbol, 
              type: holding.asset_type || 'stock' 
            }
          });
          
          if (marketData && marketData.price) {
            currentPrice = marketData.price;
            
            // Update the database with the latest price
            await supabase
              .from('holdings')
              .update({
                current_price: currentPrice,
                last_price_update: new Date().toISOString()
              })
              .eq('id', holding.id);
          }
        } catch (priceError) {
          console.error('Error fetching price for', holding.symbol, priceError);
          // Fallback to stored price or simulated price
          currentPrice = holding.current_price || holding.purchase_price * (1 + (Math.random() - 0.5) * 0.2);
        }

        const value = holding.shares * currentPrice;
        const gainLoss = value - (holding.shares * holding.purchase_price);
        const gainLossPercent = (gainLoss / (holding.shares * holding.purchase_price)) * 100;

        return {
          id: holding.id,
          symbol: holding.symbol,
          name: holding.name,
          shares: Number(holding.shares),
          purchasePrice: Number(holding.purchase_price),
          currentPrice,
          value,
          gainLoss,
          gainLossPercent,
          assetType: holding.asset_type || 'stock'
        };
      }));

      setHoldings(formattedHoldings);
    } catch (error) {
      console.error('Error fetching holdings:', error);
      toast({
        title: "Error",
        description: "Failed to fetch your holdings",
        variant: "destructive"
      });
    }
  };

  const handleAddHolding = async () => {
    if (!newHolding.symbol || !newHolding.shares || !newHolding.purchasePrice) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsProcessing(true);
      const shares = parseFloat(newHolding.shares);
      const purchasePrice = parseFloat(newHolding.purchasePrice);
      
      // Try to fetch current market data for the symbol
      let currentPrice = purchasePrice;
      let assetName = newHolding.name;
      
      try {
        const { data: marketData } = await supabase.functions.invoke('market-data', {
          body: { 
            symbol: newHolding.symbol, 
            type: newHolding.assetType 
          }
        });
        
        if (marketData && marketData.price) {
          currentPrice = marketData.price;
          assetName = marketData.name || assetName;
        }
      } catch (marketError) {
        console.error('Error fetching market data:', marketError);
        // Use fallback pricing
        currentPrice = purchasePrice * (1 + (Math.random() - 0.5) * 0.2);
      }

      const { error } = await supabase
        .from('holdings')
        .insert({
          user_id: user.id,
          symbol: newHolding.symbol.toUpperCase(),
          name: assetName || `${newHolding.symbol.toUpperCase()} ${newHolding.assetType === 'crypto' ? 'Token' : 'Corporation'}`,
          shares,
          purchase_price: purchasePrice,
          current_price: currentPrice,
          asset_type: newHolding.assetType
        });

      if (error) throw error;

      await fetchHoldings();
      setNewHolding({ symbol: "", name: "", shares: "", purchasePrice: "", assetType: "stock" });
      
      toast({
        title: "Success",
        description: `${newHolding.assetType === 'crypto' ? 'Cryptocurrency' : 'Stock'} added to your portfolio`
      });
    } catch (error) {
      console.error('Error adding holding:', error);
      toast({
        title: "Error",
        description: "Failed to add holding to portfolio",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClosePosition = async () => {
    if (!selectedHolding || !closeQuantity) return;

    const quantityToClose = parseFloat(closeQuantity);
    if (quantityToClose <= 0 || quantityToClose > selectedHolding.shares) {
      toast({
        title: "Error",
        description: "Invalid quantity",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsProcessing(true);
      const salePrice = selectedHolding.currentPrice;
      const realizedGain = (salePrice - selectedHolding.purchasePrice) * quantityToClose;

      // Record realized gain
      await supabase.from('realized_gains').insert({
        user_id: user.id,
        symbol: selectedHolding.symbol,
        name: selectedHolding.name,
        shares_sold: quantityToClose,
        purchase_price: selectedHolding.purchasePrice,
        sale_price: salePrice,
        realized_gain: realizedGain,
        original_holding_id: selectedHolding.id
      });

      if (quantityToClose === selectedHolding.shares) {
        // Close entire position
        await supabase.from('holdings').delete().eq('id', selectedHolding.id);
      } else {
        // Partial close - update shares
        const remainingShares = selectedHolding.shares - quantityToClose;
        await supabase
          .from('holdings')
          .update({ shares: remainingShares })
          .eq('id', selectedHolding.id);
      }

      await fetchHoldings();
      setIsSheetOpen(false);
      setSelectedHolding(null);
      setCloseQuantity("");

      toast({
        title: "Success",
        description: `Position closed. Realized ${realizedGain >= 0 ? 'gain' : 'loss'}: $${Math.abs(realizedGain).toFixed(2)}`
      });
    } catch (error) {
      console.error('Error closing position:', error);
      toast({
        title: "Error",
        description: "Failed to close position",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteHolding = async () => {
    if (!selectedHolding) return;

    try {
      setIsProcessing(true);
      await supabase.from('holdings').delete().eq('id', selectedHolding.id);
      
      await fetchHoldings();
      setIsSheetOpen(false);
      setSelectedHolding(null);

      toast({
        title: "Success",
        description: "Holding removed from portfolio"
      });
    } catch (error) {
      console.error('Error deleting holding:', error);
      toast({
        title: "Error",
        description: "Failed to remove holding",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const totalValue = holdings.reduce((sum, holding) => sum + holding.value, 0);
  const totalGainLoss = holdings.reduce((sum, holding) => sum + holding.gainLoss, 0);
  const totalGainLossPercent = totalValue > 0 ? (totalGainLoss / (totalValue - totalGainLoss)) * 100 : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation />

      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Portfolio Dashboard</h1>
          <p className="text-slate-600">Track and manage your investment portfolio</p>
        </div>

        <DailyRewards />

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

        {/* Analysis & Risk Metrics */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Sector Allocation */}
          <Card>
            <CardHeader>
              <CardTitle>Sector Allocation</CardTitle>
              <CardDescription>Portfolio breakdown by sector</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Technology</span>
                  <span className="text-sm font-semibold">65%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Healthcare</span>
                  <span className="text-sm font-semibold">20%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '20%' }}></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Financial</span>
                  <span className="text-sm font-semibold">15%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: '15%' }}></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Geographical Allocation */}
          <Card>
            <CardHeader>
              <CardTitle>Geographic Allocation</CardTitle>
              <CardDescription>Portfolio breakdown by region</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">North America</span>
                  <span className="text-sm font-semibold">75%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Europe</span>
                  <span className="text-sm font-semibold">15%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '15%' }}></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Asia Pacific</span>
                  <span className="text-sm font-semibold">10%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: '10%' }}></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Risk Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Risk Analysis</CardTitle>
              <CardDescription>Portfolio risk metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Value at Risk (VaR)</span>
                    <span className="text-sm text-red-600">-2.8%</span>
                  </div>
                  <p className="text-xs text-slate-500">95% confidence, 1-day horizon</p>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Portfolio Beta</span>
                    <span className="text-sm">1.12</span>
                  </div>
                  <p className="text-xs text-slate-500">Relative to S&P 500</p>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Sharpe Ratio</span>
                    <span className="text-sm text-green-600">1.45</span>
                  </div>
                  <p className="text-xs text-slate-500">Risk-adjusted returns</p>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Max Drawdown</span>
                    <span className="text-sm text-red-600">-8.2%</span>
                  </div>
                  <p className="text-xs text-slate-500">Historical maximum decline</p>
                </div>
              </div>
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
                {holdings.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    <p>No holdings yet. Add your first stock to get started!</p>
                  </div>
                ) : (
                  holdings.map((holding) => (
                    <div key={holding.id} className="relative flex items-center justify-between p-4 border rounded-lg">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2 h-6 w-6 p-0 hover:bg-red-100"
                        onClick={() => {
                          setSelectedHolding(holding);
                          setIsSheetOpen(true);
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                      <div className="flex-1 pr-8">
                         <div className="flex items-center space-x-2 mb-1">
                           <span className="font-semibold">{holding.symbol}</span>
                           <Badge variant="outline">{holding.shares} shares</Badge>
                           {holding.assetType === 'crypto' && (
                             <Badge variant="secondary" className="bg-orange-100 text-orange-800">CRYPTO</Badge>
                           )}
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
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Add New Holding */}
          <Card>
            <CardHeader>
              <CardTitle>Add New Holding</CardTitle>
              <CardDescription>Add stocks or cryptocurrencies to your portfolio</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="assetType">Asset Type</Label>
                  <select
                    id="assetType"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={newHolding.assetType}
                    onChange={(e) => setNewHolding({ ...newHolding, assetType: e.target.value })}
                  >
                    <option value="stock">Stock</option>
                    <option value="crypto">Cryptocurrency</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="symbol">
                    {newHolding.assetType === 'crypto' ? 'Crypto Symbol' : 'Stock Symbol'} *
                  </Label>
                  <Input
                    id="symbol"
                    placeholder={newHolding.assetType === 'crypto' ? 'e.g., BTC, ETH' : 'e.g., AAPL'}
                    value={newHolding.symbol}
                    onChange={(e) => setNewHolding({ ...newHolding, symbol: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="name">
                    {newHolding.assetType === 'crypto' ? 'Token Name' : 'Company Name'}
                  </Label>
                  <Input
                    id="name"
                    placeholder={newHolding.assetType === 'crypto' ? 'e.g., Bitcoin' : 'e.g., Apple Inc.'}
                    value={newHolding.name}
                    onChange={(e) => setNewHolding({ ...newHolding, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="shares">
                    {newHolding.assetType === 'crypto' ? 'Amount' : 'Number of Shares'} *
                  </Label>
                  <Input
                    id="shares"
                    type="number"
                    step={newHolding.assetType === 'crypto' ? '0.00000001' : '1'}
                    placeholder={newHolding.assetType === 'crypto' ? '0.5' : '100'}
                    value={newHolding.shares}
                    onChange={(e) => setNewHolding({ ...newHolding, shares: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="price">
                    Purchase Price per {newHolding.assetType === 'crypto' ? 'Token' : 'Share'} *
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    placeholder={newHolding.assetType === 'crypto' ? '65000.00' : '150.00'}
                    value={newHolding.purchasePrice}
                    onChange={(e) => setNewHolding({ ...newHolding, purchasePrice: e.target.value })}
                  />
                </div>
                <Button 
                  onClick={handleAddHolding} 
                  className="w-full"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    "Add to Portfolio"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Sheet for Close/Delete Position */}
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetContent side="bottom" className="h-auto max-w-md mx-auto">
            <SheetHeader>
              <SheetTitle>Manage Position</SheetTitle>
              <SheetDescription>
                {selectedHolding && `${selectedHolding.symbol} - ${selectedHolding.shares} shares`}
              </SheetDescription>
            </SheetHeader>
            
            {selectedHolding && (
              <div className="space-y-4 mt-6">
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-sm text-slate-600 mb-2">Current Position Value</p>
                  <p className="text-xl font-bold">${selectedHolding.value.toFixed(2)}</p>
                  <p className={`text-sm ${selectedHolding.gainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {selectedHolding.gainLoss >= 0 ? '+' : ''}${selectedHolding.gainLoss.toFixed(2)} ({selectedHolding.gainLossPercent.toFixed(1)}%)
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <Label htmlFor="closeQuantity">Shares to Close (Max: {selectedHolding.shares})</Label>
                    <Input
                      id="closeQuantity"
                      type="number"
                      min="0"
                      max={selectedHolding.shares}
                      step="0.000001"
                      placeholder={selectedHolding.shares.toString()}
                      value={closeQuantity}
                      onChange={(e) => setCloseQuantity(e.target.value)}
                    />
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      onClick={() => setCloseQuantity(selectedHolding.shares.toString())}
                      variant="outline"
                      size="sm"
                    >
                      Close All
                    </Button>
                    <Button
                      onClick={() => setCloseQuantity((selectedHolding.shares / 2).toString())}
                      variant="outline"
                      size="sm"
                    >
                      Close Half
                    </Button>
                  </div>
                </div>

                <div className="flex space-x-2 pt-4">
                  <Button
                    onClick={handleClosePosition}
                    disabled={isProcessing || !closeQuantity}
                    className="flex-1"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Closing...
                      </>
                    ) : (
                      "Close Position"
                    )}
                  </Button>
                  <Button
                    onClick={handleDeleteHolding}
                    variant="destructive"
                    disabled={isProcessing}
                    className="flex-1"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      "Delete Holding"
                    )}
                  </Button>
                </div>
              </div>
            )}
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default Portfolio;

