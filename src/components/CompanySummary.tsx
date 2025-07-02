
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building, MapPin, Users, TrendingUp } from "lucide-react";

interface CompanySummaryProps {
  symbol: string;
}

export const CompanySummary = ({ symbol }: CompanySummaryProps) => {
  // Mock data - in a real app, this would come from an API
  const companyData = {
    AAPL: {
      name: "Apple Inc.",
      price: 185.64,
      change: 2.34,
      changePercent: 1.28,
      sector: "Technology",
      industry: "Consumer Electronics",
      marketCap: "2.89T",
      employees: "164,000",
      headquarters: "Cupertino, CA",
      description: "Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide. The company serves consumers, and small and mid-sized businesses; and the education, enterprise, and government markets."
    }
  };

  const data = companyData[symbol as keyof typeof companyData] || companyData.AAPL;

  return (
    <Card className="h-fit">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">{symbol}</CardTitle>
          <Badge variant="outline" className="bg-green-50 text-green-700">
            {data.sector}
          </Badge>
        </div>
        <p className="text-sm text-gray-600">{data.name}</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Price */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl font-bold">${data.price}</span>
            <span className={`text-sm flex items-center gap-1 ${data.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              <TrendingUp className="h-3 w-3" />
              +{data.change} ({data.changePercent}%)
            </span>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Building className="h-4 w-4 text-gray-400" />
            <span className="text-gray-600">Market Cap:</span>
            <span className="font-medium">${data.marketCap}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-gray-400" />
            <span className="text-gray-600">Employees:</span>
            <span className="font-medium">{data.employees}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-gray-400" />
            <span className="text-gray-600">HQ:</span>
            <span className="font-medium">{data.headquarters}</span>
          </div>
        </div>

        {/* Description */}
        <div>
          <h4 className="font-medium mb-2">About</h4>
          <p className="text-sm text-gray-600 leading-relaxed">
            {data.description}
          </p>
        </div>

        {/* Industry */}
        <div>
          <h4 className="font-medium mb-2">Industry</h4>
          <Badge variant="secondary">{data.industry}</Badge>
        </div>
      </CardContent>
    </Card>
  );
};
