import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { 
  Upload, 
  Search, 
  Filter, 
  Grid3x3, 
  List, 
  MoreHorizontal, 
  Download, 
  Trash2, 
  Eye,
  Image as ImageIcon,
  File,
  Calendar
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const mockMedia = [
  {
    id: "1",
    name: "vintage-denim-jacket-1.jpg",
    type: "image",
    size: "245KB",
    dimensions: "800x800",
    url: "/placeholder.svg",
    uploadDate: "2024-01-20",
    usedIn: ["Vintage Denim Jacket"]
  },
  {
    id: "2", 
    name: "cotton-tshirt-white.jpg",
    type: "image",
    size: "180KB", 
    dimensions: "600x600",
    url: "/placeholder.svg",
    uploadDate: "2024-01-19",
    usedIn: ["Cotton T-Shirt"]
  },
  {
    id: "3",
    name: "summer-dress-floral.jpg", 
    type: "image",
    size: "320KB",
    dimensions: "900x1200",
    url: "/placeholder.svg",
    uploadDate: "2024-01-18",
    usedIn: ["Floral Summer Dress"]
  },
  {
    id: "4",
    name: "leather-handbag-brown.jpg",
    type: "image", 
    size: "415KB",
    dimensions: "1000x800",
    url: "/placeholder.svg",
    uploadDate: "2024-01-17",
    usedIn: ["Leather Handbag"]
  },
  {
    id: "5",
    name: "product-catalog-jan.pdf",
    type: "document",
    size: "2.5MB",
    dimensions: "A4",
    url: "/placeholder.svg",
    uploadDate: "2024-01-15",
    usedIn: ["Marketing"]
  }
]

const MediaLibrary = () => {
  const [media, setMedia] = useState(mockMedia)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const { toast } = useToast()

  const filteredMedia = media.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === "all" || item.type === filterType
    
    return matchesSearch && matchesType
  })

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setSelectedFiles(files)
  }

  const handleUpload = () => {
    if (selectedFiles.length === 0) return

    selectedFiles.forEach(file => {
      const newMedia = {
        id: Date.now().toString() + Math.random(),
        name: file.name,
        type: file.type.startsWith('image/') ? 'image' : 'document',
        size: formatFileSize(file.size),
        dimensions: file.type.startsWith('image/') ? "Unknown" : "Unknown",
        url: URL.createObjectURL(file),
        uploadDate: new Date().toISOString().split('T')[0],
        usedIn: []
      }
      setMedia(prev => [newMedia, ...prev])
    })

    toast({
      title: "Upload Complete",
      description: `${selectedFiles.length} file(s) uploaded successfully.`,
    })

    setSelectedFiles([])
    setIsUploadDialogOpen(false)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleDelete = (mediaId: string) => {
    setMedia(prev => prev.filter(item => item.id !== mediaId))
    toast({
      title: "File Deleted",
      description: "Media file has been deleted successfully.",
    })
  }

  const handleDownload = (mediaItem) => {
    // In a real app, this would trigger a download
    toast({
      title: "Download Started",
      description: `Downloading ${mediaItem.name}...`,
    })
  }

  const stats = {
    total: media.length,
    images: media.filter(item => item.type === "image").length,
    documents: media.filter(item => item.type === "document").length,
    totalSize: media.length * 0.3 // Rough estimate in MB
  }

  const getFileIcon = (type: string) => {
    return type === "image" ? ImageIcon : File
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Media Library</h1>
          <p className="text-muted-foreground">Manage your product images and documents</p>
        </div>
        <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Upload className="h-4 w-4 mr-2" />
              Upload Files
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload New Files</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-2">
                  Drag & drop files here, or click to select
                </p>
                <input
                  type="file"
                  multiple
                  accept="image/*,.pdf,.doc,.docx"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload">
                  <Button variant="outline" size="sm" asChild>
                    <span>Choose Files</span>
                  </Button>
                </label>
              </div>
              
              {selectedFiles.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Selected Files:</p>
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <span className="text-sm">{file.name}</span>
                      <Badge variant="outline">{formatFileSize(file.size)}</Badge>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <Button 
                  onClick={handleUpload} 
                  disabled={selectedFiles.length === 0}
                  className="flex-1"
                >
                  Upload {selectedFiles.length} File(s)
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsUploadDialogOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <File className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Total Files</span>
            </div>
            <p className="text-2xl font-bold">{stats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-blue-500" />
              <span className="text-sm text-muted-foreground">Images</span>
            </div>
            <p className="text-2xl font-bold text-blue-600">{stats.images}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <File className="h-4 w-4 text-purple-500" />
              <span className="text-sm text-muted-foreground">Documents</span>
            </div>
            <p className="text-2xl font-bold text-purple-600">{stats.documents}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Storage Used</span>
            </div>
            <p className="text-2xl font-bold">{stats.totalSize.toFixed(1)} MB</p>
          </CardContent>
        </Card>
      </div>

      {/* Media Library */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Media Files
            <div className="flex gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid3x3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full md:w-[150px]">
                <Filter className="h-4 w-4" />
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="image">Images</SelectItem>
                <SelectItem value="document">Documents</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredMedia.map((item) => {
                const FileIcon = getFileIcon(item.type)
                return (
                  <Card key={item.id} className="overflow-hidden">
                    <div className="aspect-square bg-muted flex items-center justify-center">
                      {item.type === "image" ? (
                        <img 
                          src={item.url} 
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <FileIcon className="h-12 w-12 text-muted-foreground" />
                      )}
                    </div>
                    <CardContent className="p-3">
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium truncate" title={item.name}>
                          {item.name}
                        </h3>
                        <div className="flex justify-between items-center text-xs text-muted-foreground">
                          <span>{item.size}</span>
                          <span>{item.uploadDate}</span>
                        </div>
                        {item.usedIn.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {item.usedIn.slice(0, 2).map((usage, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {usage}
                              </Badge>
                            ))}
                            {item.usedIn.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{item.usedIn.length - 2}
                              </Badge>
                            )}
                          </div>
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="w-full">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDownload(item)}>
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDelete(item.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredMedia.map((item) => {
                const FileIcon = getFileIcon(item.type)
                return (
                  <div key={item.id} className="flex items-center p-3 border rounded-lg hover:bg-accent">
                    <div className="flex items-center gap-3 flex-1">
                      <FileIcon className="h-8 w-8 text-muted-foreground" />
                      <div className="space-y-1">
                        <p className="font-medium">{item.name}</p>
                        <div className="flex gap-4 text-sm text-muted-foreground">
                          <span>{item.size}</span>
                          <span>{item.dimensions}</span>
                          <span>{item.uploadDate}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.usedIn.length > 0 && (
                        <Badge variant="outline">{item.usedIn.length} uses</Badge>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDownload(item)}>
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDelete(item.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default MediaLibrary