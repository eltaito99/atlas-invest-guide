import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Chatbot } from "@/components/Chatbot";
import {
  ArrowRight,
  LineChart,
  BarChart,
  PieChart,
  TrendingUp,
  TrendingDown,
  ChevronsUpDown,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Sparkline } from "@/components/Sparkline";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

const Index = () => {
  const [data, setData] = useState([
    {
      date: "2023-01-01",
      revenue: 50000,
      profit: 15000,
      expenses: 35000,
      visitors: 150,
    },
    {
      date: "2023-01-08",
      revenue: 55000,
      profit: 16500,
      expenses: 38500,
      visitors: 165,
    },
    {
      date: "2023-01-15",
      revenue: 62000,
      profit: 18600,
      expenses: 43400,
      visitors: 186,
    },
    {
      date: "2023-01-22",
      revenue: 58000,
      profit: 17400,
      expenses: 40600,
      visitors: 174,
    },
    {
      date: "2023-01-29",
      revenue: 70000,
      profit: 21000,
      expenses: 49000,
      visitors: 210,
    },
  ]);

  const [transactions, setTransactions] = useState([
    {
      id: "728ed52f",
      date: "2023-09-21",
      description: "Withdrawal",
      amount: "$79,00",
      status: "pending",
      type: "withdrawal",
    },
    {
      id: "d144bb63",
      date: "2023-09-21",
      description: "Deposit",
      amount: "$235,00",
      status: "success",
      type: "deposit",
    },
    {
      id: "b9b49314",
      date: "2023-09-20",
      description: "Withdrawal",
      amount: "$150,00",
      status: "success",
      type: "withdrawal",
    },
    {
      id: "2b66cb98",
      date: "2023-09-20",
      description: "Withdrawal",
      amount: "$95,00",
      status: "pending",
      type: "withdrawal",
    },
    {
      id: "7e5a4942",
      date: "2023-09-19",
      description: "Deposit",
      amount: "$125,00",
      status: "success",
      type: "deposit",
    },
    {
      id: "c19c9c1f",
      date: "2023-09-18",
      description: "Deposit",
      amount: "$450,00",
      status: "success",
      type: "deposit",
    },
    {
      id: "494b634f",
      date: "2023-09-17",
      description: "Withdrawal",
      amount: "$250,00",
      status: "success",
      type: "withdrawal",
    },
  ]);

  const [sortConfig, setSortConfig] = useState({
    key: "date",
    direction: "ascending",
  });

  const sortedTransactions = [...transactions].sort((a, b) => {
    const key = sortConfig.key;
    const direction = sortConfig.direction;

    if (a[key] < b[key]) {
      return direction === "ascending" ? -1 : 1;
    }
    if (a[key] > b[key]) {
      return direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const totalRevenue = data.reduce((acc, item) => acc + item.revenue, 0);
  const totalProfit = data.reduce((acc, item) => acc + item.profit, 0);
  const totalVisitors = data.reduce((acc, item) => acc + item.visitors, 0);

  return (
    <>
      <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
            <p className="text-muted-foreground">
              Track overall performance.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/portfolio" className="text-slate-600 hover:text-slate-800 transition-colors">Portfolio</Link>
            <Link to="/forecaster" className="text-slate-600 hover:text-slate-800 transition-colors">Forecaster</Link>
            <Link to="/news" className="text-slate-600 hover:text-slate-800 transition-colors">News</Link>
            <Link to="/alerts" className="text-slate-600 hover:text-slate-800 transition-colors">Alerts</Link>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <LineChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalRevenue}</div>
              <p className="text-sm font-medium text-muted-foreground">
                +20.1% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalProfit}</div>
              <p className="text-sm font-medium text-muted-foreground">
                +19% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
              <PieChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalVisitors}</div>
              <p className="text-sm font-medium text-muted-foreground">
                +180% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Stock Performance
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+12.24%</div>
              <p className="text-sm font-medium text-muted-foreground">
                +19% from last month
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Revenue</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <Sparkline data={data} />
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>
                Latest transactions in your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead
                      onClick={() => requestSort("date")}
                      className="cursor-pointer"
                    >
                      Date
                      <ChevronsUpDown />
                    </TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead
                      onClick={() => requestSort("amount")}
                      className="text-right cursor-pointer"
                    >
                      Amount
                      <ChevronsUpDown />
                    </TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">
                        {transaction.date}
                      </TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell className="text-right">
                        {transaction.amount}
                      </TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                            transaction.status === "success"
                              ? "bg-green-500 text-white"
                              : "bg-yellow-500 text-white"
                          )}
                        >
                          {transaction.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
      <Chatbot />
    </>
  );
};

export default Index;
