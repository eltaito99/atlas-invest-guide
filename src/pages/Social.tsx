
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TrendingUp, Heart, MessageCircle, Share2, Search, Plus, User, Star } from "lucide-react";
import { Navigation } from "@/components/Navigation";

interface SocialPost {
  id: string;
  author: string;
  avatar: string;
  title: string;
  content: string;
  strategy: string;
  performance: string;
  likes: number;
  comments: number;
  timestamp: string;
  tags: string[];
}

const Social = () => {
  const [posts, setPosts] = useState<SocialPost[]>([
    {
      id: "1",
      author: "Sarah Chen",
      avatar: "SC",
      title: "Tech Growth Strategy - 15% YTD Returns",
      content: "My portfolio has been performing well this year with a focus on AI and cloud computing stocks. Key holdings include NVDA, MSFT, and GOOGL. The key is staying disciplined during volatility and focusing on long-term fundamentals.",
      strategy: "Growth",
      performance: "+15.2%",
      likes: 24,
      comments: 8,
      timestamp: "2 hours ago",
      tags: ["tech", "growth", "AI"]
    },
    {
      id: "2",
      author: "Michael Rodriguez",
      avatar: "MR",
      title: "Dividend Aristocrats Portfolio Update",
      content: "Sharing my dividend-focused portfolio that's been generating steady income. Current yield is 4.2% with holdings in JNJ, KO, PG, and other dividend aristocrats. Perfect for conservative investors seeking income.",
      strategy: "Income",
      performance: "+8.5%",
      likes: 31,
      comments: 12,
      timestamp: "4 hours ago",
      tags: ["dividends", "income", "conservative"]
    },
    {
      id: "3",
      author: "Emma Thompson",
      avatar: "ET",
      title: "ESG Investing: Returns with Purpose",
      content: "My ESG portfolio has outperformed the market this year. Focusing on companies with strong environmental and social governance practices. Top performers include TSLA, NEE, and several clean energy ETFs.",
      strategy: "ESG",
      performance: "+12.8%",
      likes: 18,
      comments: 6,
      timestamp: "6 hours ago",
      tags: ["ESG", "sustainable", "clean-energy"]
    }
  ]);

  const [showCreatePost, setShowCreatePost] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation />

      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 mb-2">Investment Social</h1>
              <p className="text-slate-600">Share strategies, learn from others, and grow together</p>
            </div>
            <Button 
              onClick={() => setShowCreatePost(!showCreatePost)}
              className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Share Strategy
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex gap-4 items-center">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search strategies, users, or topics..."
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Badge variant="outline" className="cursor-pointer hover:bg-slate-100">Growth</Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-slate-100">Income</Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-slate-100">ESG</Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-slate-100">Value</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Create Post Form */}
        {showCreatePost && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Share Your Strategy</CardTitle>
              <CardDescription>Share your investment approach with the community</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input placeholder="Strategy title (e.g., 'Tech Growth Portfolio')" />
              <Textarea 
                placeholder="Describe your strategy, key holdings, and insights..."
                className="min-h-[120px]"
              />
              <div className="flex gap-4">
                <Input placeholder="Strategy Type (Growth, Income, etc.)" className="flex-1" />
                <Input placeholder="YTD Performance (e.g., +12.5%)" className="flex-1" />
              </div>
              <Input placeholder="Tags (comma-separated)" />
              <div className="flex gap-2">
                <Button className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
                  Publish Strategy
                </Button>
                <Button variant="outline" onClick={() => setShowCreatePost(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Posts Feed */}
        <div className="space-y-6">
          {posts.map((post) => (
            <Card key={post.id} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {post.avatar}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">{post.author}</h3>
                      <p className="text-sm text-slate-500">{post.timestamp}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-800">{post.performance}</Badge>
                    <Badge variant="secondary">{post.strategy}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <h4 className="text-lg font-semibold text-slate-800 mb-2">{post.title}</h4>
                  <p className="text-slate-700 leading-relaxed">{post.content}</p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" className="text-slate-600 hover:text-red-500">
                      <Heart className="w-4 h-4 mr-1" />
                      {post.likes}
                    </Button>
                    <Button variant="ghost" size="sm" className="text-slate-600 hover:text-blue-500">
                      <MessageCircle className="w-4 h-4 mr-1" />
                      {post.comments}
                    </Button>
                    <Button variant="ghost" size="sm" className="text-slate-600 hover:text-green-500">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-8">
          <Button variant="outline" size="lg">
            Load More Strategies
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Social;
