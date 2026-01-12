import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Products from './pages/Products';
import AddProduct from './pages/AddProduct';
import Orders from './pages/Orders';
import Saved from './pages/Saved';
import AddPrivateProduct from './pages/AddPrivateProduct';

import Reports from './pages/Reports';
import Categories from './pages/Categories';
import GiftBoxes from './pages/GiftBoxes';
import AddGiftBox from './pages/AddGiftBox';
import Reviews from './pages/Reviews';
import Settings from './pages/Settings';


function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<DashboardLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="users" element={<Users />} />
                <Route path="categories" element={<Categories />} />
                <Route path="products" element={<Products />} />
                <Route path="products/add" element={<AddProduct />} />
                <Route path="products/edit/:id" element={<AddProduct />} />
                <Route path="gift-boxes" element={<GiftBoxes />} />
                <Route path="gift-boxes/add" element={<AddGiftBox />} />
                <Route path="gift-boxes/edit/:id" element={<AddGiftBox />} />
                <Route path="orders" element={<Orders />} />
                <Route path="saved" element={<Saved />} />
                <Route path="saved/add" element={<AddPrivateProduct />} />

                <Route path="reviews" element={<Reviews />} />
                <Route path="reports" element={<Reports />} />
                <Route path="settings" element={<Settings />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}


export default App;
