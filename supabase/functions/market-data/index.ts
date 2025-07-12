import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { symbol, type = 'stock', dataType = 'basic' } = await req.json();
    
    if (!symbol) {
      throw new Error('Symbol is required');
    }

    let result = {};

    if (dataType === 'company') {
      // Fetch comprehensive company data
      const companyData = await fetchCompanyData(symbol);
      result = companyData;
    } else if (dataType === 'financials') {
      // Fetch detailed financial metrics
      const financialData = await fetchFinancialData(symbol);
      result = financialData;
    } else {
      // Default basic market data
      result = await fetchBasicMarketData(symbol, type);
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in market-data function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

async function fetchBasicMarketData(symbol: string, type: string) {
  let apiUrl;
  let transformData;

  if (type === 'crypto') {
    const cryptoSymbol = symbol.toUpperCase() + '-USD';
    apiUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${cryptoSymbol}`;
    
    transformData = (data: any) => {
      const result = data.chart.result[0];
      const meta = result.meta;
      
      return {
        symbol: symbol.toUpperCase(),
        name: meta.longName || symbol.toUpperCase(),
        price: meta.regularMarketPrice,
        change: meta.regularMarketPrice - meta.previousClose,
        changePercent: ((meta.regularMarketPrice - meta.previousClose) / meta.previousClose) * 100,
        currency: meta.currency,
        marketCap: meta.marketCap,
        volume: meta.regularMarketVolume,
        high52w: meta.fiftyTwoWeekHigh,
        low52w: meta.fiftyTwoWeekLow,
        type: 'crypto'
      };
    };
  } else {
    apiUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol.toUpperCase()}`;
    
    transformData = (data: any) => {
      const result = data.chart.result[0];
      const meta = result.meta;
      
      return {
        symbol: symbol.toUpperCase(),
        name: meta.longName || symbol.toUpperCase(),
        price: meta.regularMarketPrice,
        change: meta.regularMarketPrice - meta.previousClose,
        changePercent: ((meta.regularMarketPrice - meta.previousClose) / meta.previousClose) * 100,
        currency: meta.currency,
        marketCap: meta.marketCap,
        volume: meta.regularMarketVolume,
        high52w: meta.fiftyTwoWeekHigh,
        low52w: meta.fiftyTwoWeekLow,
        pe: meta.trailingPE,
        eps: meta.trailingEps,
        type: 'stock'
      };
    };
  }

  const response = await fetch(apiUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  });

  if (!response.ok) {
    throw new Error(`Yahoo Finance API error: ${response.status}`);
  }

  const data = await response.json();
  
  if (!data.chart?.result?.[0]) {
    throw new Error('No data found for symbol');
  }

  return transformData(data);
}

async function fetchCompanyData(symbol: string) {
  try {
    // Fetch company summary from Yahoo Finance
    const summaryUrl = `https://query2.finance.yahoo.com/v10/finance/quoteSummary/${symbol.toUpperCase()}?modules=summaryProfile,price,summaryDetail,defaultKeyStatistics`;
    
    const response = await fetch(summaryUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`Yahoo Finance API error: ${response.status}`);
    }

    const data = await response.json();
    const result = data.quoteSummary?.result?.[0];
    
    if (!result) {
      throw new Error('No company data found');
    }

    const profile = result.summaryProfile || {};
    const price = result.price || {};
    const summaryDetail = result.summaryDetail || {};
    const keyStats = result.defaultKeyStatistics || {};

    return {
      symbol: symbol.toUpperCase(),
      name: price.longName || price.shortName || symbol.toUpperCase(),
      price: price.regularMarketPrice?.raw || 0,
      change: price.regularMarketChange?.raw || 0,
      changePercent: price.regularMarketChangePercent?.raw * 100 || 0,
      sector: profile.sector || 'N/A',
      industry: profile.industry || 'N/A',
      marketCap: price.marketCap?.raw || keyStats.marketCap?.raw || 0,
      employees: profile.fullTimeEmployees || 'N/A',
      headquarters: `${profile.city || ''}, ${profile.state || ''} ${profile.country || ''}`.trim() || 'N/A',
      description: profile.longBusinessSummary || 'No description available',
      website: profile.website || 'N/A',
      currency: price.currency || 'USD',
      volume: price.regularMarketVolume?.raw || 0,
      high52w: summaryDetail.fiftyTwoWeekHigh?.raw || 0,
      low52w: summaryDetail.fiftyTwoWeekLow?.raw || 0,
      pe: summaryDetail.trailingPE?.raw || keyStats.trailingPE?.raw || 0,
      eps: keyStats.trailingEps?.raw || 0,
      beta: keyStats.beta?.raw || 0,
      dividendYield: summaryDetail.dividendYield?.raw * 100 || 0
    };
  } catch (error) {
    console.error('Error fetching company data:', error);
    throw new Error('Failed to fetch company data');
  }
}

async function fetchFinancialData(symbol: string) {
  try {
    // Fetch financial data from Yahoo Finance
    const financialUrl = `https://query2.finance.yahoo.com/v10/finance/quoteSummary/${symbol.toUpperCase()}?modules=financialData,defaultKeyStatistics,incomeStatementHistory`;
    
    const response = await fetch(financialUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`Yahoo Finance API error: ${response.status}`);
    }

    const data = await response.json();
    const result = data.quoteSummary?.result?.[0];
    
    if (!result) {
      throw new Error('No financial data found');
    }

    const financialData = result.financialData || {};
    const keyStats = result.defaultKeyStatistics || {};
    const incomeStatement = result.incomeStatementHistory?.incomeStatementHistory?.[0] || {};

    return {
      symbol: symbol.toUpperCase(),
      revenue: {
        value: formatCurrency(financialData.totalRevenue?.raw || incomeStatement.totalRevenue?.raw || 0),
        raw: financialData.totalRevenue?.raw || incomeStatement.totalRevenue?.raw || 0,
        change: financialData.revenueGrowth?.raw * 100 || 0,
        period: "TTM"
      },
      netIncome: {
        value: formatCurrency(incomeStatement.netIncome?.raw || 0),
        raw: incomeStatement.netIncome?.raw || 0,
        change: 0, // Would need historical data for this
        period: "TTM"
      },
      eps: {
        value: (keyStats.trailingEps?.raw || 0).toFixed(2),
        raw: keyStats.trailingEps?.raw || 0,
        change: keyStats.epsTrailingTwelveMonths?.raw || 0,
        period: "TTM"
      },
      peRatio: {
        value: (keyStats.trailingPE?.raw || 0).toFixed(1),
        raw: keyStats.trailingPE?.raw || 0,
        change: 0,
        period: "Current"
      },
      grossMargin: {
        value: `${((financialData.grossMargins?.raw || 0) * 100).toFixed(1)}%`,
        raw: (financialData.grossMargins?.raw || 0) * 100,
        change: 0,
        period: "TTM"
      },
      operatingMargin: {
        value: `${((financialData.operatingMargins?.raw || 0) * 100).toFixed(1)}%`,
        raw: (financialData.operatingMargins?.raw || 0) * 100,
        change: 0,
        period: "TTM"
      },
      roe: {
        value: `${((keyStats.returnOnEquity?.raw || 0) * 100).toFixed(1)}%`,
        raw: (keyStats.returnOnEquity?.raw || 0) * 100,
        change: 0,
        period: "TTM"
      },
      debtToEquity: {
        value: (financialData.debtToEquity?.raw || 0).toFixed(2),
        raw: financialData.debtToEquity?.raw || 0,
        change: 0,
        period: "Current"
      }
    };
  } catch (error) {
    console.error('Error fetching financial data:', error);
    throw new Error('Failed to fetch financial data');
  }
}

function formatCurrency(value: number): string {
  if (value >= 1e12) {
    return `${(value / 1e12).toFixed(1)}T`;
  } else if (value >= 1e9) {
    return `${(value / 1e9).toFixed(1)}B`;
  } else if (value >= 1e6) {
    return `${(value / 1e6).toFixed(1)}M`;
  } else if (value >= 1e3) {
    return `${(value / 1e3).toFixed(1)}K`;
  }
  return value.toFixed(2);
}