import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AdminLayout } from "@/layouts/AdminLayout";
import Index from "./pages/Index";
import Sell from "./pages/Sell";
import ScanClothes from "./pages/ScanClothes";
import Auth from "./pages/Auth";
import Dashboard from "./pages/admin/Dashboard";
import AddItem from "./pages/admin/AddItem";
import Inventory from "./pages/admin/Inventory";
import Orders from "./pages/admin/Orders";
import Categories from "./pages/admin/Categories";
import Analytics from "./pages/admin/Analytics";
import UserManagement from "./pages/admin/UserManagement";
import MediaLibrary from "./pages/admin/MediaLibrary";
import Settings from "./pages/admin/Settings";
import AdminProtectedRoute from "./components/admin/AdminProtectedRoute";
import Collections from "./pages/Collections";
import ProductDetail from "./pages/ProductDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/sell" element={<Sell />} />
            <Route path="/scan" element={<ScanClothes />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="/collections/:category" element={<Collections />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            
            {/* Admin Routes with Layout */}
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/admin/dashboard" element={
              <AdminProtectedRoute>
                <AdminLayout>
                  <Dashboard />
                </AdminLayout>
              </AdminProtectedRoute>
            } />
            <Route path="/admin/add-item" element={
              <AdminProtectedRoute>
                <AdminLayout>
                  <AddItem />
                </AdminLayout>
              </AdminProtectedRoute>
            } />
            <Route path="/admin/inventory" element={
              <AdminProtectedRoute>
                <AdminLayout>
                  <Inventory />
                </AdminLayout>
              </AdminProtectedRoute>
            } />
            <Route path="/admin/orders" element={
              <AdminProtectedRoute>
                <AdminLayout>
                  <Orders />
                </AdminLayout>
              </AdminProtectedRoute>
            } />
            <Route path="/admin/categories" element={
              <AdminProtectedRoute>
                <AdminLayout>
                  <Categories />
                </AdminLayout>
              </AdminProtectedRoute>
            } />
            <Route path="/admin/analytics" element={
              <AdminProtectedRoute>
                <AdminLayout>
                  <Analytics />
                </AdminLayout>
              </AdminProtectedRoute>
            } />
            <Route path="/admin/users" element={
              <AdminProtectedRoute>
                <AdminLayout>
                  <UserManagement />
                </AdminLayout>
              </AdminProtectedRoute>
            } />
            <Route path="/admin/media" element={
              <AdminProtectedRoute>
                <AdminLayout>
                  <MediaLibrary />
                </AdminLayout>
              </AdminProtectedRoute>
            } />
            <Route path="/admin/settings" element={
              <AdminProtectedRoute>
                <AdminLayout>
                  <Settings />
                </AdminLayout>
              </AdminProtectedRoute>
            } />
            
            {/* Backward compatibility routes */}
            <Route path="/login" element={<Auth />} />
            <Route path="/admin/login" element={<Auth />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
