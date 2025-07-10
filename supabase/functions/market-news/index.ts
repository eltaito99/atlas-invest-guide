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
    const { symbol, type = 'general' } = await req.json();

    let searchQuery;
    if (symbol && type !== 'general') {
      searchQuery = type === 'crypto' ? `${symbol} cryptocurrency` : `${symbol} stock`;
    } else {
      searchQuery = 'financial markets stock market';
    }

    // Use Yahoo Finance news RSS feed as a free alternative
    const rssUrl = `https://feeds.finance.yahoo.com/rss/2.0/headline`;
    
    console.log(`Fetching news for query: ${searchQuery}`);

    const response = await fetch(rssUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`News API error: ${response.status}`);
    }

    const rssText = await response.text();
    
    // Simple RSS parsing (in production, you'd want a proper XML parser)
    const items = rssText.match(/<item>[\s\S]*?<\/item>/g) || [];
    
    const news = items.slice(0, 10).map((item, index) => {
      const titleMatch = item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/);
      const linkMatch = item.match(/<link>(.*?)<\/link>/);
      const descMatch = item.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/);
      const pubDateMatch = item.match(/<pubDate>(.*?)<\/pubDate>/);
      
      return {
        id: `news-${index}`,
        title: titleMatch ? titleMatch[1] : 'Financial News',
        description: descMatch ? descMatch[1].replace(/<[^>]*>/g, '').substring(0, 200) + '...' : '',
        url: linkMatch ? linkMatch[1] : '',
        publishedAt: pubDateMatch ? new Date(pubDateMatch[1]).toISOString() : new Date().toISOString(),
        source: 'Yahoo Finance'
      };
    });

    return new Response(JSON.stringify({ articles: news }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in market-news function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});