import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Clock, TrendingDown, Loader2 } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  category: string;
  timestamp: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  impact: 'high' | 'medium' | 'low';
  link?: string;
}

const News = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const { toast } = useToast();

  const fetchNews = async (isLoadMore = false) => {
    if (isLoadMore) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }

    try {
      const { data, error } = await supabase.functions.invoke('market-news', {
        body: { 
          symbol: 'market', 
          type: 'general'
        }
      });

      if (error) throw error;

      if (data?.news) {
        const formattedNews: NewsItem[] = data.news.map((item: any, index: number) => ({
          id: `${Date.now()}-${index}`,
          title: item.title || 'Market News',
          summary: item.description || item.summary || 'No description available',
          category: item.category || 'Market',
          timestamp: item.pubDate ? new Date(item.pubDate).toLocaleString() : 'Recent',
          sentiment: Math.random() > 0.6 ? 'positive' : Math.random() > 0.3 ? 'neutral' : 'negative',
          impact: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low',
          link: item.link
        }));

        if (isLoadMore) {
          setNews(prev => [...prev, ...formattedNews]);
        } else {
          setNews(formattedNews);
        }
        
        toast({
          title: "News Updated",
          description: `${formattedNews.length} articles loaded`
        });
      }
    } catch (error) {
      console.error('Error fetching news:', error);
      
      // Fallback to mock data
      const mockNews: NewsItem[] = [
        {
          id: "1",
          title: "Federal Reserve Signals Potential Rate Cuts in Q2 2024",
          summary: "The Federal Reserve indicated in their latest meeting minutes that they may consider lowering interest rates if inflation continues to moderate. This could provide significant stimulus to equity markets.",
          category: "Federal Reserve",
          timestamp: "2 hours ago",
          sentiment: "positive",
          impact: "high"
        },
        {
          id: "2",
          title: "Tech Sector Shows Strong Earnings Growth",
          summary: "Major technology companies are reporting better-than-expected quarterly earnings, with cloud computing and AI services driving revenue growth across the sector.",
          category: "Technology",
          timestamp: "4 hours ago",
          sentiment: "positive",
          impact: "medium"
        },
        {
          id: "3",
          title: "Oil Prices Surge on Middle East Tensions",
          summary: "Crude oil prices jumped 5% today following reports of escalating tensions in the Middle East, raising concerns about potential supply disruptions.",
          category: "Energy",
          timestamp: "6 hours ago",
          sentiment: "negative",
          impact: "high"
        },
        {
          id: "4",
          title: "Housing Market Shows Signs of Stabilization",
          summary: "Recent data suggests the housing market may be finding its footing as mortgage rates begin to stabilize after months of volatility.",
          category: "Real Estate",
          timestamp: "8 hours ago",
          sentiment: "neutral",
          impact: "medium"
        },
        {
          id: "5",
          title: "Consumer Spending Remains Resilient Despite Inflation",
          summary: "Latest retail sales data shows consumers continue to spend, though there's a noticeable shift towards value-oriented purchases and essential goods.",
          category: "Consumer",
          timestamp: "10 hours ago",
          sentiment: "neutral",
          impact: "medium"
        }
      ];

      if (isLoadMore) {
        setNews(prev => [...prev, ...mockNews]);
      } else {
        setNews(mockNews);
      }
      
      toast({
        title: "Using Sample Data",
        description: "Unable to fetch live news, showing sample articles"
      });
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleLoadMore = () => {
    fetchNews(true);
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600 bg-green-50 border-green-200';
      case 'negative': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return <TrendingUp className="w-4 h-4" />;
      case 'negative': return <TrendingDown className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation />

      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Market News & Analysis</h1>
          <p className="text-slate-600">Stay informed with the latest financial news and market insights</p>
        </div>

        {/* Market Summary */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <span>Market Summary</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-slate-600">S&P 500</p>
                <p className="text-2xl font-bold text-green-600">+1.2%</p>
                <p className="text-xs text-slate-500">4,827.31</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-slate-600">NASDAQ</p>
                <p className="text-2xl font-bold text-blue-600">+0.8%</p>
                <p className="text-xs text-slate-500">15,342.56</p>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <p className="text-sm text-slate-600">DOW</p>
                <p className="text-2xl font-bold text-red-600">-0.3%</p>
                <p className="text-xs text-slate-500">37,891.78</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* News Feed */}
        <div className="space-y-6">
          {news.map((item) => (
            <Card key={item.id} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant="outline" className={getSentimentColor(item.sentiment)}>
                        {getSentimentIcon(item.sentiment)}
                        <span className="ml-1 capitalize">{item.sentiment}</span>
                      </Badge>
                      <Badge className={getImpactColor(item.impact)}>
                        {item.impact.toUpperCase()} IMPACT
                      </Badge>
                      <Badge variant="secondary">{item.category}</Badge>
                    </div>
                    <CardTitle className="text-xl mb-2">{item.title}</CardTitle>
                    <div className="flex items-center space-x-2 text-sm text-slate-500">
                      <Clock className="w-4 h-4" />
                      <span>{item.timestamp}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-slate-700 leading-relaxed">
                  {item.summary}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-8">
          <Button 
            variant="outline" 
            size="lg" 
            onClick={handleLoadMore}
            disabled={loadingMore}
          >
            {loadingMore ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Loading More...
              </>
            ) : (
              'Load More News'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default News;
