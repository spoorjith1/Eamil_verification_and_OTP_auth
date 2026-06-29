import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import axiosInstance from '../axiosInstance'
import { AuthContext } from '../AuthProvider'
import { useNavigate } from 'react-router-dom'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { setIsLoggedIn } = useContext(AuthContext)

  const handleLogin = async (e)=> {
    e.preventDefault();
    if (!email) {
      setError('Please Enter email')
      setTimeout(()=> {setError('')}, 3000 )
      return
    }
    if (!password) {
      setError('Please Enter password')
      setTimeout(()=> {setError('')}, 3000 )
      return
    }
    setLoading(true)
    const userData = {email, password}
    try {
      const response = await axiosInstance.post('/token/', userData)
      localStorage.setItem('accessToken', response.data.access)
      localStorage.setItem('refreshToken', response.data.refresh)
      setIsLoggedIn(true)
      setError('')
      navigate('/home')
    }
    catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error[0]);
      }
      else {
        setError('InValid Email or Password')
      }
      setPassword('')
    }
    finally {
      setLoading(false)
    }
  }

  return (
    <>
    <div className='page-container sign-page'>
      <div className='sign-container'>
        <h2 className='sign-title'>Login</h2>
        <form className='sign-form' onSubmit={handleLogin}>
          <div className='input-box'>
            <label className='input-labels'>Email</label>
            <input className='input-fields' type='email' value={email} onChange={(e)=> setEmail(e.target.value)} />
          </div>
          <div className='input-box'>
            <label className='input-labels'>Password</label>
            <input className='input-fields' type='password' value={password} onChange={(e)=> setPassword(e.target.value)} />
          </div>
          {error && (
            <div>
              <p className='error-msg'>{error}</p>
                {error === 'Please verify your email first' && (<Link to='/email-verification' state={{ email }} className='verify-link'>Verify Email</Link>)}
            </div>
          )}
          {loading ? (
            <button type='submit' className='sign-btn' disabled>Logging in...</button>
            ) : (
            <button type='submit' className='sign-btn'>Login</button>
          )}
        </form>
        <p className='sign-alter'>New ? <Link to='/register' className='sign-alter-link'>Register</Link></p>
      </div>
    </div>
    </>
  )
}

export default Login
