import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import AdminLayout from "@/components/admin/AdminLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Package, 
  DollarSign, 
  TrendingUp, 
  Users,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  Activity,
  Zap,
  Target,
  Cpu,
  BarChart3,
  Layers,
  Database,
  ArrowUp,
  ArrowDown,
  Brain
} from "lucide-react"

// Mock data for demonstration
const mockItems = [
  {
    id: 1,
    name: "Vintage Denim Jacket",
    category: "Jackets",
    size: "M",
    material: "Denim",
    condition: "Excellent",
    price: 45,
    status: "Available",
    image: "/placeholder.svg",
    dateAdded: "2024-01-15",
    views: 127
  },
  {
    id: 2,
    name: "Organic Cotton T-Shirt",
    category: "Tops",
    size: "L",
    material: "Organic Cotton",
    condition: "Good",
    price: 18,
    status: "Sold",
    image: "/placeholder.svg",
    dateAdded: "2024-01-14",
    views: 89
  },
  {
    id: 3,
    name: "Wool Sweater",
    category: "Sweaters",
    size: "S",
    material: "Wool",
    condition: "Very Good",
    price: 32,
    status: "Available",
    image: "/placeholder.svg",
    dateAdded: "2024-01-13",
    views: 156
  }
]

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [items, setItems] = useState(mockItems)
  const [showFilter, setShowFilter] = useState(false)
  const [realTimeData, setRealTimeData] = useState({
    activeUsers: 0,
    systemLoad: 0,
    dataProcessed: 0
  })
  const navigate = useNavigate()

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData({
        activeUsers: Math.floor(Math.random() * 50) + 10,
        systemLoad: Math.floor(Math.random() * 100),
        dataProcessed: Math.floor(Math.random() * 1000) + 500
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const stats = {
    totalItems: items.length,
    availableItems: items.filter(item => item.status === "Available").length,
    soldItems: items.filter(item => item.status === "Sold").length,
    totalRevenue: items.filter(item => item.status === "Sold").reduce((sum, item) => sum + item.price, 0),
    totalViews: items.reduce((sum, item) => sum + item.views, 0),
    conversionRate: ((items.filter(item => item.status === "Sold").length / items.length) * 100).toFixed(1)
  }

  const handleAddItem = () => {
    navigate("/admin/add-item")
  }

  const handleViewItem = (itemId: number) => {
    alert(`Viewing item ${itemId}`)
  }

  const handleEditItem = (itemId: number) => {
    navigate("/admin/inventory")
  }

  const handleDeleteItem = (itemId: number) => {
    if (confirm("Are you sure you want to delete this item?")) {
      setItems(items.filter(item => item.id !== itemId))
    }
  }

  const getStatusBadge = (status: string) => {
    if (status === "Available") {
      return <Badge className="bg-accent/20 text-accent border-accent/30 hover:bg-accent/30">Available</Badge>
    }
    return <Badge className="bg-secondary/20 text-secondary border-secondary/30">Sold</Badge>
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold glow-text">Neural Command Center</h1>
              <p className="text-muted-foreground mt-2">AI-powered inventory management system</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="neural-card px-4 py-2 rounded-lg">
                <div className="flex items-center gap-2">
                  <Brain className="h-4 w-4 text-accent animate-pulse" />
                  <span className="text-sm text-muted-foreground">Neural Status:</span>
                  <span className="text-accent font-mono">ACTIVE</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Real-time Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="cyber-card hover-cyber group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Quantum Inventory</CardTitle>
              <div className="relative">
                <Database className="h-5 w-5 text-primary" />
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg group-hover:bg-primary/40 transition-all duration-300" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary glow-text">{stats.totalItems}</div>
              <div className="flex items-center gap-1 text-xs text-accent mt-1">
                <ArrowUp className="h-3 w-3" />
                <span>+2 from neural scan</span>
              </div>
            </CardContent>
          </Card>

          <Card className="cyber-card hover-cyber group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Matrix</CardTitle>
              <div className="relative">
                <Layers className="h-5 w-5 text-accent" />
                <div className="absolute inset-0 bg-accent/20 rounded-full blur-lg group-hover:bg-accent/40 transition-all duration-300" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent glow-text">{stats.availableItems}</div>
              <div className="flex items-center gap-1 text-xs text-primary mt-1">
                <Activity className="h-3 w-3" />
                <span>Ready for deployment</span>
              </div>
            </CardContent>
          </Card>

          <Card className="cyber-card hover-cyber group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Neural Conversions</CardTitle>
              <div className="relative">
                <Target className="h-5 w-5 text-secondary" />
                <div className="absolute inset-0 bg-secondary/20 rounded-full blur-lg group-hover:bg-secondary/40 transition-all duration-300" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-secondary glow-text">{stats.soldItems}</div>
              <div className="flex items-center gap-1 text-xs text-accent mt-1">
                <TrendingUp className="h-3 w-3" />
                <span>{stats.conversionRate}% efficiency</span>
              </div>
            </CardContent>
          </Card>

          <Card className="cyber-card hover-cyber group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Quantum Revenue</CardTitle>
              <div className="relative">
                <Zap className="h-5 w-5 text-primary animate-pulse-cyber" />
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg group-hover:bg-primary/40 transition-all duration-300" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary glow-text">${stats.totalRevenue}</div>
              <div className="flex items-center gap-1 text-xs text-accent mt-1">
                <DollarSign className="h-3 w-3" />
                <span>From neural sales</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Real-time Monitoring */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="neural-card hover-neural">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Active Neural Links
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary animate-pulse-cyber">
                {realTimeData.activeUsers}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Connected entities</p>
            </CardContent>
          </Card>

          <Card className="neural-card hover-neural">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cpu className="h-5 w-5 text-accent" />
                System Load
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">
                {realTimeData.systemLoad}%
              </div>
              <div className="w-full bg-muted rounded-full h-2 mt-2">
                <div 
                  className="bg-gradient-cyber h-2 rounded-full transition-all duration-500"
                  style={{ width: `${realTimeData.systemLoad}%` }}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="neural-card hover-neural">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-secondary" />
                Data Processed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-secondary">
                {realTimeData.dataProcessed.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Operations/sec</p>
            </CardContent>
          </Card>
        </div>

        {/* Advanced Inventory Management */}
        <Card className="cyber-card border-primary/30">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Database className="h-6 w-6 text-primary" />
                  Quantum Inventory Matrix
                </CardTitle>
                <CardDescription className="mt-2">
                  Neural-enhanced item management system
                </CardDescription>
              </div>
              <Button 
                className="bg-gradient-cyber hover:bg-gradient-neon border-primary/30 hover-cyber gap-2"
                onClick={handleAddItem}
              >
                <Plus className="h-4 w-4" />
                Deploy New Item
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Enhanced Search and Filter */}
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-primary" />
                <Input
                  placeholder="Neural search protocols..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-input/50 border-primary/20 focus:border-primary/50 cyber-card"
                />
                <div className="absolute right-3 top-3">
                  <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                </div>
              </div>
              <Button 
                variant="outline" 
                className="gap-2 cyber-card hover-cyber border-primary/30"
                onClick={() => setShowFilter(!showFilter)}
              >
                <Filter className="h-4 w-4" />
                Quantum Filter
              </Button>
            </div>

            {/* Enhanced Items Table */}
            <div className="neural-card rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-primary/20 bg-gradient-neural">
                      <th className="h-14 px-6 text-left align-middle font-semibold text-primary">Neural Entity</th>
                      <th className="h-14 px-6 text-left align-middle font-semibold text-primary">Classification</th>
                      <th className="h-14 px-6 text-left align-middle font-semibold text-primary">Matrix Size</th>
                      <th className="h-14 px-6 text-left align-middle font-semibold text-primary">Condition</th>
                      <th className="h-14 px-6 text-left align-middle font-semibold text-primary">Quantum Value</th>
                      <th className="h-14 px-6 text-left align-middle font-semibold text-primary">Status</th>
                      <th className="h-14 px-6 text-left align-middle font-semibold text-primary">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredItems.map((item, index) => (
                      <tr 
                        key={item.id} 
                        className="border-b border-primary/10 hover:bg-primary/5 transition-all duration-300 group"
                      >
                        <td className="p-6">
                          <div className="flex items-center gap-4">
                            <div className="relative">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="h-12 w-12 rounded-lg object-cover bg-muted border border-primary/20"
                              />
                              <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full border-2 border-background" />
                            </div>
                            <div>
                              <div className="font-semibold text-foreground">{item.name}</div>
                              <div className="text-sm text-accent">{item.material} • {item.views} scans</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-6 text-muted-foreground">{item.category}</td>
                        <td className="p-6">
                          <Badge variant="outline" className="border-primary/30 text-primary">
                            {item.size}
                          </Badge>
                        </td>
                        <td className="p-6 text-muted-foreground">{item.condition}</td>
                        <td className="p-6 font-mono font-bold text-primary">${item.price}</td>
                        <td className="p-6">{getStatusBadge(item.status)}</td>
                        <td className="p-6">
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="hover:bg-primary/10 hover:text-primary border border-transparent hover:border-primary/20"
                              onClick={() => handleViewItem(item.id)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="hover:bg-accent/10 hover:text-accent border border-transparent hover:border-accent/20"
                              onClick={() => handleEditItem(item.id)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="hover:bg-destructive/10 hover:text-destructive border border-transparent hover:border-destructive/20"
                              onClick={() => handleDeleteItem(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

export default Dashboard