import React from 'react'
import { useEffect, useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import axiosInstance from '../axiosInstance'
import { useNavigate } from 'react-router-dom'

function Register() {
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [generalError, setGeneralError] = useState('')
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  const handleRegister = async (e)=> {
    e.preventDefault();
    if (!email || !username || !password) {
      setGeneralError('Please fill all fields')
      setTimeout(() => { setGeneralError('') }, 3000)
      return
    }

    setLoading(true)

    const userData = {email, username, password}

    try {
      const response = await axiosInstance.post('/register/', userData)
      setErrors({})
      setSuccess(true)
      navigate('/login')
    }
    catch (error) {
      setErrors(error.response.data)
    }
    finally {
      setLoading(false)
    }
  }

  return (
    <div className='page-container login-register-page'>
      <div className='sign-container'>
        <h2 className='sign-title'>Register</h2>
        <form onSubmit={handleRegister} className='form-box'>
          <div className='input-box'>
            <label className='input-labels'>Email : </label>
            <input type='email' value={email} onChange={(e)=> setEmail(e.target.value)} className='input-fields' />
            <small>{errors.email && <div className='sign-error'>{errors.email}</div>}</small>
          </div>
          <div className='input-box'>
            <label className='input-labels'>username : </label>
            <input type='text' value={username} onChange={(e)=> setUsername(e.target.value)} className='input-fields' />
            <small>{errors.username && <div className='sign-error'>{errors.username}</div>}</small>
          </div>
          <div className='input-box'>
            <label className='input-labels'>password : </label>
            <input type='password' value={password} onChange={(e)=> setPassword(e.target.value)} className='input-fields' />
            <small>{errors.password && <div className='sign-error'>{errors.password}</div>}</small>
            {generalError && (<div className='sign-error'>{generalError}</div>)}
          </div>
          {loading ?
          (<button type='submit' className='sign-btn' disabled>Registering...</button>)
          : 
          (<button type='submit' className='sign-btn'>Register</button>)
          }
        </form>
        <p className='sign-alter'>Already have an account? <Link to='/login' className='alter-link'>Login</Link></p>
      </div>
    </div>
  )
}

export default Register