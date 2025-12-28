import './index.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import Auth from './pages/Auth'
import MainLayout from './layouts/MainLayout'
import HomeDashboard from './pages/HomeDashboard'
import Products from './pages/Products'
import CategoryListing from './pages/CategoryListing'
import ProductDetails from './pages/ProductDetails'
import WeeklyCart from './pages/WeeklyCart'
import RequestConfirmation from './pages/RequestConfirmation'
import MyRequests from './pages/MyRequests'
import Profile from './pages/Profile'
import NotFound from './pages/NotFound'
import Farmers from './pages/Farmers'
import FarmerDetails from './pages/FarmerDetails'

// Protected route component for cart and checkout pages
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return user ? children : <Navigate to="/auth" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
            {/* Auth route */}
            <Route path="/auth" element={<Auth />} />

            {/* Main app routes - accessible without login */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<HomeDashboard />} />
              <Route path="products/:categoryName" element={<Products />} />
              <Route path="category/:categoryId" element={<CategoryListing />} />
              <Route path="product/:productId" element={<ProductDetails />} />
              <Route path="farmers" element={<Farmers />} />
              <Route path="farmer/:farmerId" element={<FarmerDetails />} />
              
              {/* Protected routes - require login */}
              <Route path="cart" element={
                <ProtectedRoute>
                  <WeeklyCart />
                </ProtectedRoute>
              } />
              <Route path="request-confirmation" element={
                <ProtectedRoute>
                  <RequestConfirmation />
                </ProtectedRoute>
              } />
              <Route path="requests" element={
                <ProtectedRoute>
                  <MyRequests />
                </ProtectedRoute>
              } />
              <Route path="profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
            </Route>

            {/* Redirect old /app routes to new structure */}
            <Route path="/app/*" element={<Navigate to="/" replace />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
