import React, { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from './AuthProvider'

const PrivateRoute = ({ children }) => {
  const { isLoggedIn } = useContext(AuthContext)

  if (isLoggedIn === null) {
    return <h3>Loading...</h3>
  }

  return isLoggedIn
    ? children
    : <Navigate to="/login" />
}

export default PrivateRoute