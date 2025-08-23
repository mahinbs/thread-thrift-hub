import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Package, Users, DollarSign, TrendingUp, ShoppingBag, Calendar, BarChart3 } from "lucide-react"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts"
import { supabase } from "@/integrations/supabase/client"

const Dashboard = () => {
  const { toast } = useToast()
  
  // Sample data for charts
  const salesData = [
    { name: 'Mon', sales: 12, orders: 8 },
    { name: 'Tue', sales: 19, orders: 12 },
    { name: 'Wed', sales: 15, orders: 10 },
    { name: 'Thu', sales: 25, orders: 16 },
    { name: 'Fri', sales: 22, orders: 14 },
    { name: 'Sat', sales: 30, orders: 18 },
    { name: 'Sun', sales: 20, orders: 13 }
  ]

  const stats = [
    {
      title: "Total Items",
      value: "1,234",
      description: "↗︎ 20.1% from last month",
      icon: Package,
      trend: "up"
    },
    {
      title: "Total Users", 
      value: "573",
      description: "↗︎ 180.1% from last month",
      icon: Users,
      trend: "up"
    },
    {
      title: "Revenue",
      value: "$12,234", 
      description: "↗︎ 19% from last month",
      icon: DollarSign,
      trend: "up"
    },
    {
      title: "Growth Rate",
      value: "24%",
      description: "↗︎ 4% from last month", 
      icon: TrendingUp,
      trend: "up"
    }
  ]

  const quickActions = [
    {
      title: "Add New Item",
      description: "Add clothing to inventory",
      href: "/admin/add-item",
      icon: Package
    },
    {
      title: "View Orders",
      description: "Check pending orders",
      href: "/admin/orders", 
      icon: ShoppingBag
    },
    {
      title: "Analytics",
      description: "View detailed analytics",
      href: "/admin/analytics",
      icon: BarChart3
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome to the Drape admin dashboard. Here's what's happening with your store.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
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
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Charts and Activity */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
            <CardDescription>Daily sales for this week</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>
              You have 3 new orders this week.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-center">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Order #{1000 + item}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Vintage Denim Jacket - Size M
                    </p>
                  </div>
                  <div className="ml-auto">
                    <Badge variant="outline">Pending</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common tasks and shortcuts.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {quickActions.map((action, index) => {
              const Icon = action.icon
              return (
                <div key={index} className="p-4 border rounded-lg hover:bg-accent cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <Icon className="h-8 w-8 text-primary group-hover:text-primary-foreground" />
                    <div>
                      <p className="font-medium">{action.title}</p>
                      <p className="text-sm text-muted-foreground">{action.description}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Dashboard