
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calculator, TrendingUp, TrendingDown, AlertCircle } from "lucide-react";

interface StockData {
  symbol: string;
  name: string;
  price: number;
}

interface DCFValuationProps {
  stock: StockData;
}

export const DCFValuation = ({ stock }: DCFValuationProps) => {
  const [assumptions, setAssumptions] = useState({
    revenueGrowth: 8.5,
    terminalGrowth: 2.5,
    discountRate: 9.2,
    fcfMargin: 25.3,
    sharesOutstanding: 15.7
  });

  // Mock DCF calculation
  const calculateDCF = () => {
    const years = 5;
    const currentRevenue = 394.3; // Billions
    let totalPV = 0;
    
    // Project 5 years of cash flows
    for (let year = 1; year <= years; year++) {
      const projectedRevenue = currentRevenue * Math.pow(1 + assumptions.revenueGrowth / 100, year);
      const fcf = projectedRevenue * (assumptions.fcfMargin / 100);
      const pv = fcf / Math.pow(1 + assumptions.discountRate / 100, year);
      totalPV += pv;
    }
    
    // Terminal value
    const terminalYear = currentRevenue * Math.pow(1 + assumptions.revenueGrowth / 100, years + 1);
    const terminalFCF = terminalYear * (assumptions.fcfMargin / 100);
    const terminalValue = (terminalFCF * (1 + assumptions.terminalGrowth / 100)) / 
                         (assumptions.discountRate / 100 - assumptions.terminalGrowth / 100);
    const terminalPV = terminalValue / Math.pow(1 + assumptions.discountRate / 100, years);
    
    const enterpriseValue = totalPV + terminalPV;
    const equityValue = enterpriseValue; // Simplified - not accounting for debt/cash
    const pricePerShare = equityValue / assumptions.sharesOutstanding;
    
    return {
      pricePerShare: pricePerShare,
      enterpriseValue: enterpriseValue,
      terminalValue: terminalPV,
      pvOfProjections: totalPV
    };
  };

  const dcfResult = calculateDCF();
  const upside = ((dcfResult.pricePerShare - stock.price) / stock.price) * 100;

  const updateAssumption = (key: string, value: string) => {
    setAssumptions(prev => ({
      ...prev,
      [key]: parseFloat(value) || 0
    }));
  };

  return (
    <div className="space-y-6">
      {/* DCF Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            DCF Valuation - {stock.symbol}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 border rounded-lg bg-gradient-to-br from-blue-50 to-green-50">
              <div className="text-sm text-slate-600 mb-2">Fair Value</div>
              <div className="text-3xl font-bold text-blue-600">
                ${dcfResult.pricePerShare.toFixed(2)}
              </div>
              <div className="text-sm text-slate-500">Per Share</div>
            </div>
            
            <div className="text-center p-6 border rounded-lg">
              <div className="text-sm text-slate-600 mb-2">Current Price</div>
              <div className="text-3xl font-bold">${stock.price.toFixed(2)}</div>
              <div className="text-sm text-slate-500">Market Price</div>
            </div>
            
            <div className="text-center p-6 border rounded-lg">
              <div className="text-sm text-slate-600 mb-2">Upside/Downside</div>
              <div className={`text-3xl font-bold flex items-center justify-center gap-2 ${
                upside >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {upside >= 0 ? <TrendingUp className="w-6 h-6" /> : <TrendingDown className="w-6 h-6" />}
                {upside >= 0 ? '+' : ''}{upside.toFixed(1)}%
              </div>
              <Badge variant={upside >= 0 ? "default" : "destructive"} className="mt-2">
                {upside >= 0 ? 'Undervalued' : 'Overvalued'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* DCF Components */}
      <Card>
        <CardHeader>
          <CardTitle>Valuation Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">DCF Components</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-slate-50 rounded">
                  <span className="text-sm">PV of 5-Year Projections</span>
                  <span className="font-semibold">${dcfResult.pvOfProjections.toFixed(1)}B</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-50 rounded">
                  <span className="text-sm">PV of Terminal Value</span>
                  <span className="font-semibold">${dcfResult.terminalValue.toFixed(1)}B</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded border-2 border-blue-200">
                  <span className="text-sm font-medium">Enterprise Value</span>
                  <span className="font-bold">${dcfResult.enterpriseValue.toFixed(1)}B</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Sensitivity Analysis</h4>
              <div className="space-y-2">
                <div className="text-sm text-slate-600">
                  <AlertCircle className="w-4 h-4 inline mr-1" />
                  Discount Rate ±1%: ${(dcfResult.pricePerShare * 0.9).toFixed(2)} - ${(dcfResult.pricePerShare * 1.1).toFixed(2)}
                </div>
                <div className="text-sm text-slate-600">
                  <AlertCircle className="w-4 h-4 inline mr-1" />
                  Growth Rate ±1%: ${(dcfResult.pricePerShare * 0.85).toFixed(2)} - ${(dcfResult.pricePerShare * 1.15).toFixed(2)}
                </div>
                <div className="text-sm text-slate-600">
                  <AlertCircle className="w-4 h-4 inline mr-1" />
                  FCF Margin ±2%: ${(dcfResult.pricePerShare * 0.88).toFixed(2)} - ${(dcfResult.pricePerShare * 1.12).toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assumptions */}
      <Card>
        <CardHeader>
          <CardTitle>DCF Assumptions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="revenueGrowth">Revenue Growth Rate (%)</Label>
              <Input
                id="revenueGrowth"
                type="number"
                step="0.1"
                value={assumptions.revenueGrowth}
                onChange={(e) => updateAssumption('revenueGrowth', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="terminalGrowth">Terminal Growth Rate (%)</Label>
              <Input
                id="terminalGrowth"
                type="number"
                step="0.1"
                value={assumptions.terminalGrowth}
                onChange={(e) => updateAssumption('terminalGrowth', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="discountRate">Discount Rate (WACC) (%)</Label>
              <Input
                id="discountRate"
                type="number"
                step="0.1"
                value={assumptions.discountRate}
                onChange={(e) => updateAssumption('discountRate', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="fcfMargin">FCF Margin (%)</Label>
              <Input
                id="fcfMargin"
                type="number"
                step="0.1"
                value={assumptions.fcfMargin}
                onChange={(e) => updateAssumption('fcfMargin', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="sharesOutstanding">Shares Outstanding (B)</Label>
              <Input
                id="sharesOutstanding"
                type="number"
                step="0.1"
                value={assumptions.sharesOutstanding}
                onChange={(e) => updateAssumption('sharesOutstanding', e.target.value)}
              />
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <strong>Disclaimer:</strong> This DCF model is for educational purposes only. 
                Actual valuations require more detailed financial analysis and should not be used 
                as the sole basis for investment decisions.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
