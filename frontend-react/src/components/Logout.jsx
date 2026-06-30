import React, { useContext } from 'react'
import { AuthContext } from '../AuthProvider'
import { useNavigate } from 'react-router-dom'

function Logout() {
  const {isLoggedIn, setIsLoggedIn} = useContext(AuthContext)
  const navigate = useNavigate()

  const handlelogout = ()=> {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')

    setIsLoggedIn(false)

    navigate('/login')
  }
  return (
    <div>
      <button onClick={handlelogout} className='logout-btn'>Logout</button>
    </div>
  )
}

export default Logout;