import { useState, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { 
  LayoutDashboard, 
  Package, 
  Plus, 
  Settings, 
  LogOut, 
  Menu,
  X,
  Zap,
  Activity,
  Brain,
  Database
} from "lucide-react"

interface AdminLayoutProps {
  children: React.ReactNode
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("userEmail")
    navigate("/login")
  }

  const navigationItems = [
    {
      name: "Neural Hub",
      href: "/admin/dashboard",
      icon: Brain,
      current: location.pathname === "/admin/dashboard",
      description: "AI-powered analytics"
    },
    {
      name: "Data Forge",
      href: "/admin/add-item",
      icon: Plus,
      current: location.pathname === "/admin/add-item",
      description: "Create new entries"
    },
    {
      name: "Quantum Store",
      href: "/admin/inventory",
      icon: Database,
      current: location.pathname === "/admin/inventory",
      description: "Inventory matrix"
    },
    {
      name: "System Core",
      href: "/admin/settings",
      icon: Settings,
      current: location.pathname === "/admin/settings",
      description: "Core configuration"
    }
  ]

  const userEmail = localStorage.getItem("userEmail")

  return (
    <div className="min-h-screen bg-background neural-bg">
      {/* Cyberpunk scan lines overlay */}
      <div className="fixed inset-0 scan-lines pointer-events-none opacity-30" />
      
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Futuristic Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-80 bg-sidebar/95 backdrop-blur-xl border-r border-primary/20 
        transform transition-all duration-500 ease-out lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        shadow-neon
      `}>
        <div className="flex h-full flex-col relative">
          {/* Animated background pattern */}
          <div className="absolute inset-0 bg-gradient-neural opacity-20" />
          
          {/* Logo Header */}
          <div className="relative flex items-center justify-between h-20 px-6 border-b border-primary/20">
            <Link to="/" className="flex items-center gap-3 text-xl font-bold text-primary hover-cyber group">
              <div className="relative">
                <Zap className="h-8 w-8 animate-pulse-cyber" />
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl group-hover:bg-primary/40 transition-all duration-300" />
              </div>
              <div className="flex flex-col">
                <span className="glow-text">EcoStore</span>
                <span className="text-xs text-muted-foreground">Neural Admin</span>
              </div>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden hover:bg-primary/10 hover:text-primary border border-primary/20"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* System Status */}
          <div className="relative px-6 py-4 border-b border-primary/10">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-accent animate-pulse" />
                <span className="text-muted-foreground">System Status</span>
              </div>
              <span className="text-accent font-mono">ONLINE</span>
            </div>
            <div className="mt-2 text-xs text-muted-foreground font-mono">
              {currentTime.toLocaleTimeString()}
            </div>
          </div>

          {/* Navigation */}
          <nav className="relative px-4 py-6 space-y-2 flex-1">
            {navigationItems.map((item, index) => (
              <Link
                key={item.name}
                to={item.href}
                className={`
                  group relative flex flex-col gap-1 px-4 py-4 rounded-xl transition-all duration-300
                  ${item.current 
                    ? 'bg-primary/20 text-primary border border-primary/30 shadow-neon' 
                    : 'text-muted-foreground hover:bg-primary/10 hover:text-primary border border-transparent hover:border-primary/20'
                  }
                  hover-cyber
                `}
                onClick={() => setSidebarOpen(false)}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <item.icon className={`h-5 w-5 ${item.current ? 'animate-pulse-cyber' : ''}`} />
                    {item.current && (
                      <div className="absolute inset-0 bg-primary/30 rounded-full blur-lg" />
                    )}
                  </div>
                  <span className="font-semibold">{item.name}</span>
                </div>
                <span className="text-xs ml-8 opacity-70">{item.description}</span>
                
                {/* Data stream animation for active item */}
                {item.current && (
                  <div className="absolute inset-0 data-stream rounded-xl opacity-30" />
                )}
              </Link>
            ))}
          </nav>

          {/* User Profile & Logout */}
          <div className="relative border-t border-primary/20 p-6">
            <div className="neural-card rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-cyber flex items-center justify-center">
                  <span className="text-sm font-bold text-primary-foreground">
                    {userEmail?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{userEmail}</p>
                  <p className="text-xs text-accent">Neural Administrator</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full bg-destructive/10 border-destructive/30 text-destructive hover:bg-destructive/20 hover:border-destructive/50"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Disconnect
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="lg:pl-80 min-h-screen">
        {/* Mobile menu button - positioned absolutely */}
        <Button
          variant="outline"
          size="sm"
          className="lg:hidden fixed top-6 right-6 z-10 cyber-card hover-cyber"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="h-4 w-4" />
        </Button>

        {/* Page content */}
        <main className="px-8 py-8 relative">
          <div className="relative z-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default AdminLayout