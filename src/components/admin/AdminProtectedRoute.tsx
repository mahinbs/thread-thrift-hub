import { useEffect, useState } from "react"
import { Navigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { Loader2 } from "lucide-react"

interface AdminProtectedRouteProps {
  children: React.ReactNode
}

const AdminProtectedRoute = ({ children }: AdminProtectedRouteProps) => {
  const { user, loading, hasRole } = useAuth()
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
  const [checkingRole, setCheckingRole] = useState(true)

  useEffect(() => {
    const checkAdminRole = async () => {
      if (!user) {
        setIsAdmin(false)
        setCheckingRole(false)
        return
      }

      try {
        const adminRole = await hasRole('admin')
        setIsAdmin(adminRole)
        setCheckingRole(false)
      } catch (error) {
        setIsAdmin(false)
        setCheckingRole(false)
      }
    }

    if (!loading) {
      checkAdminRole()
    }
  }, [user, loading, hasRole])

  if (loading || checkingRole) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/auth" replace />
  }

  if (isAdmin === false) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

export default AdminProtectedRoute