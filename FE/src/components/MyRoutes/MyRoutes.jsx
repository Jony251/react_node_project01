import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import Home from '../Home/Home';
import GameHub from '../GameHub/GameHub';
import GameShell from '../GameShell/GameShell';
import Contact from '../Contact/Contact';
import GameManagement from '../GameManagement/GameManagement';
import Login from '../LogIn_Reg/Login';
import ProtectedRoute from '../common/ProtectedRoute/ProtectedRoute';
import { useAuth } from '../../context/AuthContext';

function MyRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      {isAuthenticated && <Header />}
      <Routes>
        <Route path="/" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
        <Route path="/games" element={
          <ProtectedRoute>
            <GameHub />
          </ProtectedRoute>
        } />
        <Route path="/play/:id" element={
          <ProtectedRoute>
            <GameShell />
          </ProtectedRoute>
        } />
        <Route path="/contact" element={
          <ProtectedRoute>
            <Contact />
          </ProtectedRoute>
        } />
        <Route path="/manage-games" element={
          <ProtectedRoute requireAdmin={true}>
            <GameManagement />
          </ProtectedRoute>
        } />
        <Route path="/login" element={
          <ProtectedRoute requireAuth={false}>
            <Login />
          </ProtectedRoute>
        } />
      </Routes>
      {isAuthenticated && <Footer />}
    </>
  );
}

export default MyRoutes;
