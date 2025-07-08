
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Linkedin, Mail } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation />

      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-slate-800">About Atlas Hedge</h1>
          </div>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Revolutionizing investment management with AI-powered insights and cutting-edge financial technology.
          </p>
        </div>

        {/* Company History */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl text-slate-800">Our Story</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-slate-600 leading-relaxed">
              Founded in 2025, Atlas Hedge emerged from a vision to democratize sophisticated investment strategies and make institutional-grade financial analysis accessible to every investor. Our platform represents the convergence of artificial intelligence, financial expertise, and user-centric design.
            </p>
            <p className="text-slate-600 leading-relaxed">
              In an era where financial markets are increasingly complex and data-driven, we recognized the need for a comprehensive platform that could provide real-time market analysis, intelligent portfolio management, and personalized investment insights. Atlas Hedge was born to bridge the gap between traditional investment approaches and the future of finance.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Our mission is to empower investors with the tools, knowledge, and community they need to make informed decisions and achieve their financial goals. By combining advanced analytics with social investing features, we've created a unique ecosystem where technology meets human insight.
            </p>
          </CardContent>
        </Card>

        {/* Team Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-slate-800 text-center mb-8">Meet Our Team</h2>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Team Member 1 */}
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-8 text-center">
                <Avatar className="w-32 h-32 mx-auto mb-6">
                  <AvatarImage src="/lovable-uploads/8deec6ed-ed5e-4b02-8b47-56647f8a71f8.png" alt="Founder" />
                  <AvatarFallback className="text-2xl bg-gradient-to-r from-blue-500 to-green-500 text-white">DT</AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Davide Tait</h3>
                <p className="text-blue-600 font-semibold mb-4">Co-Founder & CEO</p>
                <p className="text-slate-600 leading-relaxed mb-6">
                  Experienced financial professional with a strong track record across global markets, financial analysis, and strategic execution. Led corporate strategy and international fundraising for a European fintech company specializing in asset tokenization, and advised top-tier financial institutions of Capital Markets Division on trading, business and technology-driven transformations.
                </p>
                <div className="flex justify-center space-x-4">
                  <Button variant="outline" size="sm" asChild>
                    <a href="https://www.linkedin.com/in/davide-tait-12b87420b/" target="_blank" rel="noopener noreferrer">
                      <Linkedin className="w-4 h-4 mr-2" />
                      LinkedIn
                    </a>
                  </Button>
                  <Button variant="outline" size="sm">
                    <Mail className="w-4 h-4 mr-2" />
                    Contact
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Team Member 2 */}
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-8 text-center">
                <Avatar className="w-32 h-32 mx-auto mb-6">
                  <AvatarFallback className="text-2xl bg-gradient-to-r from-green-500 to-blue-500 text-white">ST</AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Sarah Thompson</h3>
                <p className="text-green-600 font-semibold mb-4">Co-Founder & CTO</p>
                <p className="text-slate-600 leading-relaxed mb-6">
                  Veteran technology leader with over 15 years of experience in fintech and AI development. Previously led engineering teams at major investment banks and pioneered machine learning applications in algorithmic trading. Expert in building scalable financial platforms and implementing cutting-edge AI solutions for investment analysis.
                </p>
                <div className="flex justify-center space-x-4">
                  <Button variant="outline" size="sm">
                    <Linkedin className="w-4 h-4 mr-2" />
                    LinkedIn
                  </Button>
                  <Button variant="outline" size="sm">
                    <Mail className="w-4 h-4 mr-2" />
                    Contact
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Values Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-slate-800 text-center">Our Values</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">Innovation</h3>
                <p className="text-slate-600">Continuously pushing the boundaries of financial technology to deliver cutting-edge solutions.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">Transparency</h3>
                <p className="text-slate-600">Providing clear, honest insights and maintaining the highest standards of integrity.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">Empowerment</h3>
                <p className="text-slate-600">Democratizing access to sophisticated investment tools and knowledge for all investors.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default About;

