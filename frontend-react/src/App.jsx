import React, { useContext } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import axiosInstance from './axiosInstance'
import AuthProvider, { AuthContext } from './AuthProvider'
import PrivateRoute from './PrivateRoute'
import './styles/global.css';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

function AppRoutes() {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <Routes>
      <Route path='/' element={isLoggedIn ? <Navigate to='/home' /> : <Navigate to='/login' />} />
      <Route path='/home' element={ <PrivateRoute><Home /></PrivateRoute>} />
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
