import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts"
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  ShoppingBag, 
  DollarSign, 
  Eye,
  Calendar,
  Download
} from "lucide-react"

const salesData = [
  { name: 'Jan', sales: 4000, orders: 24 },
  { name: 'Feb', sales: 3000, orders: 18 },
  { name: 'Mar', sales: 5000, orders: 32 },
  { name: 'Apr', sales: 4500, orders: 28 },
  { name: 'May', sales: 6000, orders: 35 },
  { name: 'Jun', sales: 5500, orders: 31 },
  { name: 'Jul', sales: 7000, orders: 42 }
]

const categoryData = [
  { name: 'Shirts', value: 35, color: '#8884d8' },
  { name: 'Dresses', value: 25, color: '#82ca9d' },
  { name: 'Jackets', value: 20, color: '#ffc658' },
  { name: 'Accessories', value: 15, color: '#ff7300' },
  { name: 'Others', value: 5, color: '#0088fe' }
]

const topProducts = [
  { name: 'Vintage Denim Jacket', sales: 45, revenue: 58500 },
  { name: 'Cotton T-Shirt', sales: 38, revenue: 22800 },
  { name: 'Floral Summer Dress', sales: 32, revenue: 28800 },
  { name: 'Leather Handbag', sales: 28, revenue: 112000 },
  { name: 'Casual Jeans', sales: 25, revenue: 37500 }
]

const Analytics = () => {
  const [dateRange, setDateRange] = useState("30d")

  const stats = [
    {
      title: "Total Revenue",
      value: "₹2,45,680",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      description: "vs last month"
    },
    {
      title: "Total Orders", 
      value: "1,234",
      change: "+8.2%",
      trend: "up",
      icon: ShoppingBag,
      description: "vs last month"
    },
    {
      title: "Total Customers",
      value: "856",
      change: "+15.3%", 
      trend: "up",
      icon: Users,
      description: "vs last month"
    },
    {
      title: "Page Views",
      value: "12,543",
      change: "-2.4%",
      trend: "down", 
      icon: Eye,
      description: "vs last month"
    }
  ]

  const exportData = () => {
    // In a real app, this would generate and download a report
    console.log("Exporting analytics data...")
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Analytics & Insights</h1>
          <p className="text-muted-foreground">Track your store performance and customer behavior</p>
        </div>
        <div className="flex gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px]">
              <Calendar className="h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="12m">Last 12 months</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={exportData}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          const isPositive = stat.trend === "up"
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  {isPositive ? (
                    <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                  )}
                  <span className={isPositive ? "text-green-600" : "text-red-600"}>
                    {stat.change}
                  </span>
                  <span className="ml-1">{stat.description}</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Sales Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Orders by Month</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="orders" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Sales by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {categoryData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-muted-foreground">
                    {item.name}: {item.value}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {product.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {product.sales} sales
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      ₹{product.revenue.toLocaleString()}
                    </p>
                    <Badge variant="outline" className="text-xs">
                      #{index + 1}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-2 w-2 bg-green-500 rounded-full" />
              <div className="space-y-1">
                <p className="text-sm font-medium">New order received</p>
                <p className="text-sm text-muted-foreground">Order #1234 - ₹2,499</p>
              </div>
              <div className="ml-auto text-sm text-muted-foreground">2m ago</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-2 w-2 bg-blue-500 rounded-full" />
              <div className="space-y-1">
                <p className="text-sm font-medium">Product view spike</p>
                <p className="text-sm text-muted-foreground">Vintage Denim Jacket - 45 views in 1 hour</p>
              </div>
              <div className="ml-auto text-sm text-muted-foreground">15m ago</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-2 w-2 bg-purple-500 rounded-full" />
              <div className="space-y-1">
                <p className="text-sm font-medium">New customer registered</p>
                <p className="text-sm text-muted-foreground">sarah@example.com joined</p>
              </div>
              <div className="ml-auto text-sm text-muted-foreground">1h ago</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-2 w-2 bg-yellow-500 rounded-full" />
              <div className="space-y-1">
                <p className="text-sm font-medium">Inventory alert</p>
                <p className="text-sm text-muted-foreground">Cotton T-Shirt - Low stock (2 remaining)</p>
              </div>
              <div className="ml-auto text-sm text-muted-foreground">2h ago</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Analytics