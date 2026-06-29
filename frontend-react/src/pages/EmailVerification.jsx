import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import axiosInstance from '../axiosInstance'
import { useNavigate } from 'react-router-dom'

function EmailVerification() {
  const location = useLocation()
  const [email, setEmail] = useState(location.state?.email || '')
  const [otp, setOtp] = useState('')
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [resendLoading, setResendloading] = useState(false)
  const [verifyLoading, setVerifyLoading] = useState(false)
  const navigate = useNavigate()

  const handleVerification = async (e)=> {
    e.preventDefault();
    setError('')
    setSuccess('')

    if (!email) {
      setError('Please enter Email')
      setTimeout(()=> {setError('')}, 3000)
      return
    }
    if (!otp) {
      setError('Please enter OTP')
      setTimeout(()=> {setError('')}, 3000)
      return
    }
    setVerifyLoading(true)
    try {
      await axiosInstance.post('/verify-email/', {email, otp})
      setSuccess('Email verified successfully')
      setOtp('')
      setTimeout(()=> {navigate('/login')}, 1500)
    }
    catch (error) {
      if (error.response?.data?.error) {
        setError(error.response.data.error)
      } else {
        setError('Verification failed')
      }
      setTimeout(() => {setError('')}, 3000)
    }
    finally {
      setVerifyLoading(false)
    }
  }

  const handleResend = async (e)=> {
    e.preventDefault();
    setError('')
    setSuccess('')

    if (!email ) {
      setError('Please enter Email')
      setTimeout(()=> {setError('')}, 3000)
      return
    }
    setResendloading(true)
    try {
      await axiosInstance.post('/resend-otp/', {email})
      setOtp('')
      setSuccess('OTP sent successfully')
      setTimeout(()=> {setSuccess('')}, 3000)
    }
    catch(error) {
      if (error.response?.data?.error) {
          setError(error.response.data.error)
      } else {
          setError('Failed to send OTP. try again')
      }
      setTimeout(()=> {setError('')}, 3000)
    }
    finally {
      setResendloading(false)
    }
  }
  return (
    <div className='page-container sign-page'>
      <div className='sign-container'>
        <h2 className='sign-title'>Email Verification</h2>
        <form onSubmit={handleVerification} className='sign-form'>
          <div className='input-box'>
            <label className='input-labels'>Email</label>
            <input type='email' value={email} onChange={(e)=> setEmail(e.target.value)} disabled={verifyLoading || resendLoading} className='input-fields' />
          </div>
          <div className='input-box'>
            <label className='input-labels'>OTP</label>
            <input type='text' value={otp} onChange={(e)=> setOtp(e.target.value)} disabled={verifyLoading} className='input-fields' />
          </div>
          {error && (
            <p className='error-msg'>{error}</p>
          )}
          {verifyLoading ? (
            <button type='submit' className='verify-btn' disabled>Verifying...</button>
          ) : (
            <button type='submit' className='verify-btn'>Verify</button>
          )}
          {success && (
            <p className='success-msg'>{success}</p>
          )}
        </form>
        <div className='resend-otp-box'>
        {resendLoading ? (
          <button disabled className='resend-btn'>Resending OTP...</button>
        ) : (
          <button onClick={handleResend} className='resend-btn'>Resend OTP &#8635;</button>
        )}
        </div>
      </div>
    </div>
  )
}

export default EmailVerification
