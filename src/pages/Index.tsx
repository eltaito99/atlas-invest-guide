
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Chatbot } from "@/components/Chatbot";
import {
  ArrowRight,
  LineChart,
  BarChart,
  PieChart,
  TrendingUp,
  Bot,
  Target,
  Shield,
  Zap,
  Brain,
  Globe,
} from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        {/* Header */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Atlas Hedge</h1>
                <p className="text-slate-600">AI-Powered Investment Advisory</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <Link to="/portfolio" className="text-slate-600 hover:text-slate-800 transition-colors font-medium">Portfolio</Link>
              <Link to="/forecaster" className="text-slate-600 hover:text-slate-800 transition-colors font-medium">Forecaster</Link>
              <Link to="/news" className="text-slate-600 hover:text-slate-800 transition-colors font-medium">News</Link>
              <Link to="/alerts" className="text-slate-600 hover:text-slate-800 transition-colors font-medium">Alerts</Link>
            </div>
          </div>

          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-5xl font-bold text-slate-900 mb-6">
                Your AI Investment 
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Advisory Agent</span>
              </h2>
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                Atlas Hedge combines cutting-edge artificial intelligence with comprehensive market analysis to provide 
                personalized investment insights, real-time portfolio management, and advanced forecasting capabilities. 
                Make smarter investment decisions with our AI-powered advisory platform.
              </p>
              <div className="flex justify-center space-x-4">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Bot className="mr-2 h-5 w-5" />
                  Start Chatting with AI
                </Button>
                <Button variant="outline" size="lg">
                  <LineChart className="mr-2 h-5 w-5" />
                  View Demo
                </Button>
              </div>
            </div>
          </div>

          {/* Key Features */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-16">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Brain className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl">AI-Powered Analysis</CardTitle>
                <CardDescription>
                  Advanced machine learning algorithms analyze market trends, company fundamentals, and economic indicators to provide actionable insights.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-xl">Precision Forecasting</CardTitle>
                <CardDescription>
                  Get detailed stock forecasts with DCF valuations, technical analysis, and comprehensive financial metrics for informed decision-making.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle className="text-xl">Risk Management</CardTitle>
                <CardDescription>
                  Intelligent portfolio monitoring with real-time alerts and risk assessment to protect your investments.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Feature Showcase */}
          <div className="mb-16">
            <h3 className="text-3xl font-bold text-center text-slate-900 mb-12">Comprehensive Investment Platform</h3>
            <div className="grid gap-8 lg:grid-cols-2">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <PieChart className="h-8 w-8 text-blue-600" />
                    <div>
                      <CardTitle className="text-2xl">Portfolio Management</CardTitle>
                      <CardDescription>Track and optimize your investment portfolio</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-slate-600">
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <span>Real-time portfolio tracking and performance analysis</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <span>Asset allocation recommendations</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <span>Risk assessment and diversification insights</span>
                    </li>
                  </ul>
                  <Link to="/portfolio">
                    <Button className="mt-4 w-full" variant="outline">
                      Explore Portfolio <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="h-8 w-8 text-green-600" />
                    <div>
                      <CardTitle className="text-2xl">Stock Forecaster</CardTitle>
                      <CardDescription>Advanced stock analysis and predictions</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-slate-600">
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      <span>DCF valuation and financial metrics analysis</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      <span>Technical indicators (RSI, EMA, MACD, Bollinger Bands)</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      <span>Company fundamentals and performance charts</span>
                    </li>
                  </ul>
                  <Link to="/forecaster">
                    <Button className="mt-4 w-full" variant="outline">
                      Try Forecaster <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <Globe className="h-8 w-8 text-purple-600" />
                    <div>
                      <CardTitle className="text-2xl">Market News & Insights</CardTitle>
                      <CardDescription>Stay informed with AI-curated news</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-slate-600">
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                      <span>AI-filtered relevant market news</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                      <span>Sentiment analysis and market impact assessment</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                      <span>Personalized news recommendations</span>
                    </li>
                  </ul>
                  <Link to="/news">
                    <Button className="mt-4 w-full" variant="outline">
                      Read News <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <Zap className="h-8 w-8 text-orange-600" />
                    <div>
                      <CardTitle className="text-2xl">Smart Alerts</CardTitle>
                      <CardDescription>Never miss important market movements</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-slate-600">
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                      <span>Custom price and volume alerts</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                      <span>AI-detected unusual market activity</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                      <span>Portfolio performance notifications</span>
                    </li>
                  </ul>
                  <Link to="/alerts">
                    <Button className="mt-4 w-full" variant="outline">
                      Setup Alerts <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white">
            <h3 className="text-3xl font-bold mb-4">Ready to Transform Your Investment Strategy?</h3>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of investors who trust Atlas Hedge AI for smarter investment decisions.
            </p>
            <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
              <Bot className="mr-2 h-5 w-5" />
              Start Your AI Advisory Journey
            </Button>
          </div>
        </div>
      </div>
      <Chatbot />
    </>
  );
};

export default Index;
