import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { Plus, Edit, Trash2, MoreHorizontal, Tag, TrendingUp } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const mockCategories = [
  {
    id: "1",
    name: "Men's Shirts",
    slug: "mens-shirts",
    description: "Casual and formal shirts for men",
    parent: null,
    itemCount: 45,
    isActive: true,
    createdAt: "2024-01-15"
  },
  {
    id: "2", 
    name: "Women's Dresses",
    slug: "womens-dresses",
    description: "Elegant dresses for all occasions",
    parent: null,
    itemCount: 32,
    isActive: true,
    createdAt: "2024-01-14"
  },
  {
    id: "3",
    name: "Casual Shirts",
    slug: "casual-shirts", 
    description: "Relaxed fit shirts for everyday wear",
    parent: "Men's Shirts",
    itemCount: 25,
    isActive: true,
    createdAt: "2024-01-13"
  },
  {
    id: "4",
    name: "Formal Shirts",
    slug: "formal-shirts",
    description: "Professional shirts for office wear", 
    parent: "Men's Shirts",
    itemCount: 20,
    isActive: true,
    createdAt: "2024-01-12"
  },
  {
    id: "5",
    name: "Accessories",
    slug: "accessories",
    description: "Bags, belts, and other accessories",
    parent: null,
    itemCount: 18,
    isActive: false,
    createdAt: "2024-01-11"
  }
]

const Categories = () => {
  const [categories, setCategories] = useState(mockCategories)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    parent: ""
  })
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingCategory) {
      // Update existing category
      setCategories(prev => prev.map(cat => 
        cat.id === editingCategory.id 
          ? { ...cat, ...formData, itemCount: cat.itemCount }
          : cat
      ))
      toast({
        title: "Category Updated",
        description: "Category has been updated successfully.",
      })
    } else {
      // Create new category
      const newCategory = {
        id: Date.now().toString(),
        ...formData,
        itemCount: 0,
        isActive: true,
        createdAt: new Date().toISOString().split('T')[0]
      }
      setCategories(prev => [...prev, newCategory])
      toast({
        title: "Category Created",
        description: "New category has been created successfully.",
      })
    }
    
    resetForm()
  }

  const resetForm = () => {
    setFormData({ name: "", slug: "", description: "", parent: "" })
    setEditingCategory(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description,
      parent: category.parent || ""
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (categoryId: string) => {
    setCategories(prev => prev.filter(cat => cat.id !== categoryId))
    toast({
      title: "Category Deleted",
      description: "Category has been deleted successfully.",
    })
  }

  const toggleStatus = (categoryId: string) => {
    setCategories(prev => prev.map(cat => 
      cat.id === categoryId 
        ? { ...cat, isActive: !cat.isActive }
        : cat
    ))
    toast({
      title: "Status Updated",
      description: "Category status has been updated.",
    })
  }

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  }

  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: generateSlug(name)
    }))
  }

  const stats = {
    total: categories.length,
    active: categories.filter(cat => cat.isActive).length,
    inactive: categories.filter(cat => !cat.isActive).length,
    totalItems: categories.reduce((sum, cat) => sum + cat.itemCount, 0)
  }

  const parentCategories = categories.filter(cat => !cat.parent)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Category Management</h1>
          <p className="text-muted-foreground">Organize your products with categories and subcategories</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? "Edit Category" : "Add New Category"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Category Name</Label>
                <Input
                  id="name"
                  placeholder="e.g. Men's Shirts"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug</Label>
                <Input
                  id="slug"
                  placeholder="mens-shirts"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="parent">Parent Category (Optional)</Label>
                <select
                  id="parent"
                  value={formData.parent}
                  onChange={(e) => setFormData(prev => ({ ...prev, parent: e.target.value }))}
                  className="w-full p-2 border border-border rounded-md bg-background"
                >
                  <option value="">No Parent (Top Level)</option>
                  {parentCategories.map(cat => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe this category..."
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">
                  {editingCategory ? "Update Category" : "Create Category"}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Total Categories</span>
            </div>
            <p className="text-2xl font-bold">{stats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-green-500 rounded-full" />
              <span className="text-sm text-muted-foreground">Active</span>
            </div>
            <p className="text-2xl font-bold text-green-600">{stats.active}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-gray-500 rounded-full" />
              <span className="text-sm text-muted-foreground">Inactive</span>
            </div>
            <p className="text-2xl font-bold text-gray-600">{stats.inactive}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Total Items</span>
            </div>
            <p className="text-2xl font-bold">{stats.totalItems}</p>
          </CardContent>
        </Card>
      </div>

      {/* Categories Table */}
      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Parent</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{category.name}</div>
                        <div className="text-sm text-muted-foreground">/{category.slug}</div>
                        {category.description && (
                          <div className="text-sm text-muted-foreground mt-1">{category.description}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {category.parent ? (
                        <Badge variant="outline">{category.parent}</Badge>
                      ) : (
                        <span className="text-muted-foreground">Top Level</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{category.itemCount} items</Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleStatus(category.id)}
                      >
                        {category.isActive ? (
                          <Badge variant="secondary" className="bg-green-100 text-green-800">Active</Badge>
                        ) : (
                          <Badge variant="outline" className="bg-gray-100 text-gray-800">Inactive</Badge>
                        )}
                      </Button>
                    </TableCell>
                    <TableCell>{category.createdAt}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(category)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDelete(category.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Categories