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
    const { symbol, type = 'stock' } = await req.json();
    
    if (!symbol) {
      throw new Error('Symbol is required');
    }

    let apiUrl;
    let transformData;

    if (type === 'crypto') {
      // For crypto, we'll use Yahoo Finance with proper crypto symbols
      const cryptoSymbol = symbol.toUpperCase() + '-USD';
      apiUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${cryptoSymbol}`;
      
      transformData = (data: any) => {
        const result = data.chart.result[0];
        const meta = result.meta;
        const quote = result.indicators.quote[0];
        
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
      // For stocks, use Yahoo Finance
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

    console.log(`Fetching data for ${symbol} (${type}) from: ${apiUrl}`);

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

    const transformedData = transformData(data);

    return new Response(JSON.stringify(transformedData), {
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