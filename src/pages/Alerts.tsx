
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Bell, TrendingUp, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Navigation } from "@/components/Navigation";

interface Alert {
  id: string;
  title: string;
  description: string;
  type: 'opportunity' | 'warning' | 'info';
  priority: 'high' | 'medium' | 'low';
  timestamp: string;
  symbol?: string;
  isRead: boolean;
  actionRequired: boolean;
}

const Alerts = () => {
  const { toast } = useToast();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [alertSettings, setAlertSettings] = useState({
    priceAlerts: true,
    newsAlerts: true,
    portfolioAlerts: true,
    marketAlerts: false
  });

  useEffect(() => {
    // Simulate fetching alerts data
    const mockAlerts: Alert[] = [
      {
        id: "1",
        title: "AAPL Approaching Target Price",
        description: "Apple Inc. (AAPL) is approaching your target buy price of $170. Current price: $172.50. Consider adding to your position.",
        type: "opportunity",
        priority: "high",
        timestamp: "5 minutes ago",
        symbol: "AAPL",
        isRead: false,
        actionRequired: true
      },
      {
        id: "2",
        title: "Portfolio Rebalancing Recommended",
        description: "Your portfolio allocation has shifted significantly. Consider rebalancing to maintain your target allocation.",
        type: "info",
        priority: "medium",
        timestamp: "2 hours ago",
        isRead: false,
        actionRequired: true
      },
      {
        id: "3",
        title: "Earnings Report Alert",
        description: "Microsoft (MSFT) will report earnings after market close today. Historical volatility suggests potential 5-8% price movement.",
        type: "info",
        priority: "medium",
        timestamp: "4 hours ago",
        symbol: "MSFT",
        isRead: true,
        actionRequired: false
      },
      {
        id: "4",
        title: "Market Volatility Warning",
        description: "Increased market volatility detected. Consider reviewing your risk tolerance and position sizes.",
        type: "warning",
        priority: "high",
        timestamp: "1 day ago",
        isRead: true,
        actionRequired: false
      },
      {
        id: "5",
        title: "Dividend Payment Notification",
        description: "You'll receive dividend payments totaling $245.67 from your holdings on March 15th.",
        type: "info",
        priority: "low",
        timestamp: "2 days ago",
        isRead: true,
        actionRequired: false
      }
    ];

    setAlerts(mockAlerts);
  }, []);

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'opportunity': return <TrendingUp className="w-5 h-5 text-green-600" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      default: return <Bell className="w-5 h-5 text-blue-600" />;
    }
  };

  const getAlertColor = (type: string, priority: string) => {
    if (priority === 'high') {
      return type === 'opportunity' ? 'border-l-green-500' : 
             type === 'warning' ? 'border-l-yellow-500' : 'border-l-red-500';
    }
    return 'border-l-slate-300';
  };

  const getPriorityBadge = (priority: string) => {
    const colors = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    };
    return colors[priority as keyof typeof colors] || colors.low;
  };

  const markAsRead = (alertId: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === alertId ? { ...alert, isRead: true } : alert
    ));
  };

  const handleSettingChange = (setting: string, value: boolean) => {
    setAlertSettings(prev => ({ ...prev, [setting]: value }));
    toast({
      title: "Settings Updated",
      description: `${setting.replace(/([A-Z])/g, ' $1').toLowerCase()} ${value ? 'enabled' : 'disabled'}`
    });
  };

  const unreadCount = alerts.filter(alert => !alert.isRead).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation />

      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 mb-2">Smart Alerts</h1>
              <p className="text-slate-600">Personalized notifications and investment opportunities</p>
            </div>
            {unreadCount > 0 && (
              <Badge className="bg-red-500 text-white">
                {unreadCount} unread
              </Badge>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Alerts List */}
          <div className="lg:col-span-2 space-y-4">
            {alerts.map((alert) => (
              <Card 
                key={alert.id} 
                className={`border-l-4 ${getAlertColor(alert.type, alert.priority)} ${
                  !alert.isRead ? 'bg-blue-50/30' : ''
                } hover:shadow-lg transition-shadow duration-300`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      {getAlertIcon(alert.type)}
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <CardTitle className="text-lg">{alert.title}</CardTitle>
                          {!alert.isRead && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getPriorityBadge(alert.priority)}>
                            {alert.priority.toUpperCase()}
                          </Badge>
                          {alert.symbol && (
                            <Badge variant="outline">{alert.symbol}</Badge>
                          )}
                          <span className="text-sm text-slate-500 flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {alert.timestamp}
                          </span>
                        </div>
                      </div>
                    </div>
                    {!alert.isRead && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => markAsRead(alert.id)}
                      >
                        <CheckCircle className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-700 mb-4">
                    {alert.description}
                  </CardDescription>
                  {alert.actionRequired && (
                    <div className="flex space-x-2">
                      <Button size="sm" className="bg-gradient-to-r from-blue-600 to-green-600">
                        Take Action
                      </Button>
                      <Button variant="outline" size="sm">
                        Dismiss
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Alert Settings */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="w-5 h-5" />
                  <span>Alert Settings</span>
                </CardTitle>
                <CardDescription>
                  Customize your notification preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="price-alerts" className="text-sm font-medium">
                    Price Alerts
                  </Label>
                  <Switch
                    id="price-alerts"
                    checked={alertSettings.priceAlerts}
                    onCheckedChange={(checked) => handleSettingChange('priceAlerts', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="news-alerts" className="text-sm font-medium">
                    News Alerts
                  </Label>
                  <Switch
                    id="news-alerts"
                    checked={alertSettings.newsAlerts}
                    onCheckedChange={(checked) => handleSettingChange('newsAlerts', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="portfolio-alerts" className="text-sm font-medium">
                    Portfolio Alerts
                  </Label>
                  <Switch
                    id="portfolio-alerts"
                    checked={alertSettings.portfolioAlerts}
                    onCheckedChange={(checked) => handleSettingChange('portfolioAlerts', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="market-alerts" className="text-sm font-medium">
                    Market Alerts
                  </Label>
                  <Switch
                    id="market-alerts"
                    checked={alertSettings.marketAlerts}
                    onCheckedChange={(checked) => handleSettingChange('marketAlerts', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Set Price Alert
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Bell className="w-4 h-4 mr-2" />
                  Create Custom Alert
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark All as Read
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Alerts;
