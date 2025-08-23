import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package, Users, DollarSign, TrendingUp } from "lucide-react"

const Dashboard = () => {
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

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
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

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks and shortcuts.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid gap-2">
              <div className="p-3 border rounded-lg hover:bg-accent cursor-pointer">
                <p className="font-medium">Add New Item</p>
                <p className="text-sm text-muted-foreground">Add clothing to inventory</p>
              </div>
              <div className="p-3 border rounded-lg hover:bg-accent cursor-pointer">
                <p className="font-medium">View Analytics</p>
                <p className="text-sm text-muted-foreground">Check store performance</p>
              </div>
              <div className="p-3 border rounded-lg hover:bg-accent cursor-pointer">
                <p className="font-medium">Manage Users</p>
                <p className="text-sm text-muted-foreground">User management tools</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Dashboard