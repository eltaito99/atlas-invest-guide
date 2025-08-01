
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUp, TrendingUp, Shield, Bell } from "lucide-react";
import { Link } from "react-router-dom";
import { Chatbot } from "@/components/Chatbot";
import { CountdownTimer } from "@/components/CountdownTimer";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-800">Atlas Hedge</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/portfolio" className="text-slate-600 hover:text-slate-800 transition-colors">Portfolio</Link>
              <Link to="/forecaster" className="text-slate-600 hover:text-slate-800 transition-colors">Forecaster</Link>
              <Link to="/news" className="text-slate-600 hover:text-slate-800 transition-colors">Market News</Link>
              <Link to="/alerts" className="text-slate-600 hover:text-slate-800 transition-colors">Alerts</Link>
              <Link to="/social" className="text-slate-600 hover:text-slate-800 transition-colors">Social</Link>
              <Link to="/about" className="text-slate-600 hover:text-slate-800 transition-colors">About Us</Link>
              <Button asChild className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
                <Link to="/auth">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-800 mb-6">
            Your AI-Powered
            <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent"> Financial Advisor</span>
          </h1>
          <p className="text-xl text-slate-600 mb-8 leading-relaxed">
            Make smarter investment decisions with real-time market analysis, personalized portfolio management, and intelligent alerts. Atlas Hedge combines cutting-edge AI with financial expertise.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-lg px-8 py-6">
              <Link to="/auth">Start Building Portfolio</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6 border-slate-300 hover:bg-slate-50">
              <Link to="/news">View Market News</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-800 mb-4">Why Choose Atlas Hedge?</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Our platform combines advanced analytics with intuitive design to help you make informed investment decisions.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="border-slate-200 hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-slate-800">Portfolio Management</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center text-slate-600">
                Track your investments in real-time with comprehensive portfolio analytics and performance insights.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-slate-200 hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <ArrowUp className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-slate-800">Market Intelligence</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center text-slate-600">
                Stay informed with curated financial news and AI-powered market analysis to guide your decisions.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-slate-200 hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Bell className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-slate-800">Smart Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center text-slate-600">
                Receive personalized alerts about buying opportunities and market movements that affect your portfolio.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Countdown Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="max-w-2xl mx-auto">
          <CountdownTimer />
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-slate-800 to-slate-900 py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Take Control of Your Investments?</h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Join thousands of investors who trust Atlas Hedge to guide their financial decisions.
          </p>
          <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-lg px-8 py-6">
            <Link to="/auth">Get Started Today</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-800 text-slate-300 py-12">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">Atlas Hedge</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4" />
              <span className="text-sm">Secure & Trusted Financial Advisory</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Chatbot */}
      <Chatbot />
    </div>
  );
};

export default Index;

