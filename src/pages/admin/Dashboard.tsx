import { useState } from "react"
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
  Eye
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
    dateAdded: "2024-01-15"
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
    dateAdded: "2024-01-14"
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
    dateAdded: "2024-01-13"
  }
]

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [items] = useState(mockItems)

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const stats = {
    totalItems: items.length,
    availableItems: items.filter(item => item.status === "Available").length,
    soldItems: items.filter(item => item.status === "Sold").length,
    totalRevenue: items.filter(item => item.status === "Sold").reduce((sum, item) => sum + item.price, 0)
  }

  const getStatusBadge = (status: string) => {
    if (status === "Available") {
      return <Badge className="bg-primary text-primary-foreground">Available</Badge>
    }
    return <Badge variant="secondary">Sold</Badge>
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Items</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalItems}</div>
              <p className="text-xs text-muted-foreground">
                +2 from last week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.availableItems}</div>
              <p className="text-xs text-muted-foreground">
                Ready for sale
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sold Items</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.soldItems}</div>
              <p className="text-xs text-muted-foreground">
                This month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalRevenue}</div>
              <p className="text-xs text-muted-foreground">
                From sold items
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Inventory Management */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Inventory Management</CardTitle>
                <CardDescription>
                  Manage your used clothing items
                </CardDescription>
              </div>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Item
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Search and Filter */}
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </div>

            {/* Items Table */}
            <div className="rounded-md border">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Item</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Category</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Size</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Condition</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Price</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredItems.map((item) => (
                      <tr key={item.id} className="border-b">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-10 w-10 rounded-md object-cover bg-muted"
                            />
                            <div>
                              <div className="font-medium">{item.name}</div>
                              <div className="text-sm text-muted-foreground">{item.material}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">{item.category}</td>
                        <td className="p-4">{item.size}</td>
                        <td className="p-4">{item.condition}</td>
                        <td className="p-4 font-medium">${item.price}</td>
                        <td className="p-4">{getStatusBadge(item.status)}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
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