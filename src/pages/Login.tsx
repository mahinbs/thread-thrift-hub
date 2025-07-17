import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Leaf } from "lucide-react"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [name, setName] = useState("")
  const [isLogin, setIsLogin] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (!isLogin && password !== confirmPassword) {
      setError("Passwords don't match")
      setIsLoading(false)
      return
    }

    // TODO: Replace with actual Supabase authentication
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (isLogin) {
        // Simulated login - accept any valid email format
        if (email && password) {
          localStorage.setItem("isAuthenticated", "true")
          localStorage.setItem("userEmail", email)
          localStorage.setItem("userName", name || email.split('@')[0])
          navigate("/")
        } else {
          setError("Please enter valid credentials")
        }
      } else {
        // Simulated signup
        if (name && email && password) {
          localStorage.setItem("isAuthenticated", "true")
          localStorage.setItem("userEmail", email)
          localStorage.setItem("userName", name)
          navigate("/")
        } else {
          setError("Please fill in all fields")
        }
      }
    } catch (err) {
      setError(isLogin ? "Login failed. Please try again." : "Signup failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-earth flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-2xl font-bold text-primary">
            <Leaf className="h-8 w-8" />
            EcoStore
          </Link>
          <p className="text-muted-foreground mt-2">Join our sustainable fashion community</p>
        </div>

        <Card className="shadow-card border-border">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              {isLogin ? "Customer Login" : "Create Account"}
            </CardTitle>
            <CardDescription className="text-center">
              {isLogin 
                ? "Sign in to your account to continue shopping"
                : "Join EcoStore and start your sustainable fashion journey"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required={!isLogin}
                    disabled={isLoading}
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required={!isLogin}
                    disabled={isLoading}
                  />
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isLogin ? "Signing in..." : "Creating account..."}
                  </>
                ) : (
                  isLogin ? "Sign In" : "Create Account"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center space-y-4">
              <Button
                variant="ghost"
                onClick={() => {
                  setIsLogin(!isLogin)
                  setError("")
                  setName("")
                  setConfirmPassword("")
                }}
                className="text-sm text-primary hover:underline"
              >
                {isLogin 
                  ? "Don't have an account? Sign up" 
                  : "Already have an account? Sign in"
                }
              </Button>
              
              <div>
                <Link
                  to="/"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  ← Back to Store
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Login