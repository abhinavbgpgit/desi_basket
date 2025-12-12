import './index.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import LandingPage from './pages/landingPage/LandingPage.jsx'
import HowDesiBasketWorks from './pages/HowDesiBasketWorks'
import Auth from './pages/Auth'
import MainLayout from './layouts/MainLayout'
import HomeDashboard from './pages/HomeDashboard'
import CategoryListing from './pages/CategoryListing'
import ProductDetails from './pages/ProductDetails'
import WeeklyCart from './pages/WeeklyCart'
import RequestConfirmation from './pages/RequestConfirmation'
import MyRequests from './pages/MyRequests'
import Profile from './pages/Profile'
import NotFound from './pages/NotFound'
import Farmers from './pages/Farmers'
import FarmerDetails from './pages/FarmerDetails'

const PrivateRoute = ({ children }) => {
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
            <Route path="/" element={<LandingPage />} />
            <Route path="/how-desi-basket-works" element={<HowDesiBasketWorks />} />
            <Route path="/auth" element={<Auth />} />

            <Route path="/app" element={
              <PrivateRoute>
                <MainLayout />
              </PrivateRoute>
            }>
              <Route index element={<HomeDashboard />} />
              <Route path="category/:categoryId" element={<CategoryListing />} />
              <Route path="product/:productId" element={<ProductDetails />} />
              <Route path="cart" element={<WeeklyCart />} />
              <Route path="request-confirmation" element={<RequestConfirmation />} />
              <Route path="requests" element={<MyRequests />} />
              <Route path="profile" element={<Profile />} />
              <Route path="farmers" element={<Farmers />} />
              <Route path="farmer/:farmerId" element={<FarmerDetails />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
