import React, { useState, useEffect } from 'react'
import Logout from '../components/Logout'
import axiosInstance from '../axiosInstance'
import { useNavigate } from 'react-router-dom'

function Home() {
  const [userData, setUserData] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const fetchUserData = async ()=> {
    try {
      const response = await axiosInstance.get('/profile/me/')
      setUserData(response.data)
    }
    catch (error) {
      setError('Failed to Load user data')
    }
  }

  useEffect(()=> {
    fetchUserData();
  }, [])

  return (
    <div className='page-container page'>
      <div className='content'>
        {error && <div className='home-load-error'>{error}</div>}

        <div className='home-top'>
          <h2 className='home-title'>User's Profile</h2>
          <Logout />
        </div>

        <div className='user-details-container'>
          <div className='user-details-box'>
            <p className='user-details'>Username : <span className='user-details-span'>{userData.username}</span></p>
            <p className='user-details'>Email : <span className='user-details-span'>{userData.email}</span></p>
          </div>
        </div>

        <div className='password-page-link-box' onClick={()=> navigate('/change-password')}>
          <p className='password-link-text'>Change password using OTP</p>
        </div>

      </div>
    </div>
  )
}

export default Home
