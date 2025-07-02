
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calculator, TrendingUp, TrendingDown } from "lucide-react";
import { useState } from "react";

interface DCFValuationProps {
  symbol: string;
}

export const DCFValuation = ({ symbol }: DCFValuationProps) => {
  const [inputs, setInputs] = useState({
    revenue: "394.3",
    revenueGrowth: "8.1",
    fcfMargin: "26.4",
    discountRate: "10.0",
    terminalGrowth: "3.0",
  });

  const [valuation, setValuation] = useState({
    intrinsicValue: 195.45,
    currentPrice: 185.64,
    upside: 5.29,
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const calculateDCF = () => {
    // Simplified DCF calculation for demo
    const revenue = parseFloat(inputs.revenue);
    const growth = parseFloat(inputs.revenueGrowth) / 100;
    const margin = parseFloat(inputs.fcfMargin) / 100;
    const discount = parseFloat(inputs.discountRate) / 100;
    
    // Simple 5-year DCF projection
    let totalPV = 0;
    for (let year = 1; year <= 5; year++) {
      const projectedRevenue = revenue * Math.pow(1 + growth, year);
      const fcf = projectedRevenue * margin;
      const pv = fcf / Math.pow(1 + discount, year);
      totalPV += pv;
    }
    
    const terminalValue = (totalPV * (1 + parseFloat(inputs.terminalGrowth) / 100)) / (discount - parseFloat(inputs.terminalGrowth) / 100);
    const totalValue = totalPV + terminalValue / Math.pow(1 + discount, 5);
    
    // Assuming 16B shares outstanding for AAPL
    const sharePrice = totalValue / 16;
    const upside = ((sharePrice - valuation.currentPrice) / valuation.currentPrice) * 100;
    
    setValuation({
      intrinsicValue: sharePrice,
      currentPrice: valuation.currentPrice,
      upside: upside,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            DCF Valuation Model - {symbol}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Inputs */}
            <div className="space-y-4">
              <h3 className="font-medium text-lg">Model Inputs</h3>
              
              <div className="space-y-2">
                <Label htmlFor="revenue">Current Revenue (B)</Label>
                <Input
                  id="revenue"
                  value={inputs.revenue}
                  onChange={(e) => handleInputChange("revenue", e.target.value)}
                  placeholder="394.3"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="growth">Revenue Growth Rate (%)</Label>
                <Input
                  id="growth"
                  value={inputs.revenueGrowth}
                  onChange={(e) => handleInputChange("revenueGrowth", e.target.value)}
                  placeholder="8.1"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="margin">FCF Margin (%)</Label>
                <Input
                  id="margin"
                  value={inputs.fcfMargin}
                  onChange={(e) => handleInputChange("fcfMargin", e.target.value)}
                  placeholder="26.4"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="discount">Discount Rate (%)</Label>
                <Input
                  id="discount"
                  value={inputs.discountRate}
                  onChange={(e) => handleInputChange("discountRate", e.target.value)}
                  placeholder="10.0"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="terminal">Terminal Growth (%)</Label>
                <Input
                  id="terminal"
                  value={inputs.terminalGrowth}
                  onChange={(e) => handleInputChange("terminalGrowth", e.target.value)}
                  placeholder="3.0"
                />
              </div>
              
              <Button 
                onClick={calculateDCF}
                className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
              >
                Calculate Fair Value
              </Button>
            </div>

            {/* Results */}
            <div className="space-y-4">
              <h3 className="font-medium text-lg">Valuation Results</h3>
              
              <div className="space-y-4">
                <Card className="bg-gradient-to-r from-blue-50 to-green-50">
                  <CardContent className="p-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-1">Intrinsic Value</p>
                      <p className="text-3xl font-bold text-blue-600">
                        ${valuation.intrinsicValue.toFixed(2)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-sm text-gray-600 mb-1">Current Price</p>
                      <p className="text-xl font-bold">${valuation.currentPrice}</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-sm text-gray-600 mb-1">Upside/Downside</p>
                      <p className={`text-xl font-bold flex items-center justify-center gap-1 ${
                        valuation.upside >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {valuation.upside >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                        {valuation.upside.toFixed(1)}%
                      </p>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Key Assumptions</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• 5-year projection period</li>
                    <li>• Terminal value using Gordon Growth Model</li>
                    <li>• Shares outstanding: ~16B</li>
                    <li>• No adjustment for net cash/debt</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
