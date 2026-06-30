import React, { useState } from 'react'
import axiosInstance from '../axiosInstance'
import { useNavigate } from 'react-router-dom'

function ChangePassword() {
  const [otp, setOtp] = useState('')
  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [otpError, setOtpError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState('')
  const [otpSuccess, setOtpSuccess] = useState('')
  const [otpLoading, setOtpLoading] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)
  const navigate = useNavigate()

  const handlePasswordChange = async (e)=> {
    e.preventDefault();
    setPasswordLoading(true)
    try {
      const inputData = {'otp': otp,'new_password': password}
      await axiosInstance.post('/change-password/', inputData)
      setPasswordSuccess('Password changed successfully')
      setPasswordError('')
      setOtpError('')
      setOtp('')
      setPassword('')
      setTimeout(()=> {navigate('/home')}, 1500)
    }
    catch (error) {
      if (error.response?.data?.error) {
        setPasswordError(error.response.data.error)
      }
      else {
        setPasswordError('Something went wrong')
      }
      setTimeout(()=> {setPasswordError('')}, 3000);
    }
    finally {
      setPasswordLoading(false)
    }
  }

  const handleSendOTP = async ()=> {
    setOtpLoading(true)
    try {
      await axiosInstance.post('/send-password-otp/')
      setOtpSuccess('OTP Sent successfully')
      setTimeout(()=> {setOtpSuccess('')}, 3000)
      setOtpError('')
      setPasswordError('')
    }
    catch (error) {
      if (error.response?.data?.error) {
        setOtpError(error.response.data.error)
      }
      else {
        setOtpError('Failed to send OTP')
      }
      setTimeout(()=> {setOtpError('')}, 3000)
    }
    finally {
      setOtpLoading(false)
    }
  }

  return (
    <div className='page-container page'>
      <div className='content'>
        <h2 className='change-title'>Change Password using OTP</h2>
        <div className='change-form-container'>
          <form className='change-form'>
            <div className='input-box'>
              <label className='input-labels'>OTP</label>
              <div className='pass-otp-box'>
                  <input className='otp-input' type='text' value={otp} onChange={(e)=> setOtp(e.target.value)} />
                  {otpLoading ? (
                    <button className='otp-btn' type='button' disabled>Sending OTP...</button>
                  ) : (
                    <button className='otp-btn' type='button' onClick={handleSendOTP}>Send OTP</button>
                  )}
                <br />
                {otpSuccess && <p className='change-success'>{otpSuccess}</p>}
              </div>
              {otpError && <p className='change-error'>{otpError}</p>}
            </div>
            <div className='input-box'>
              <label className='input-labels'>New Password</label>
              <input className='pass-input' type='password' value={password} onChange={(e)=> setPassword(e.target.value)} />
              {passwordError && <p className='change-error'>{passwordError}</p>}
            </div>
            {passwordSuccess && <p className='change-success'>{passwordSuccess}</p>}
            <div>
              {passwordLoading ? (
                <button type='button' className='change-pass-btn' disabled>Changing Password...</button>
              ) : (
                <button type='button' className='change-pass-btn' onClick={handlePasswordChange}>Change Password</button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ChangePassword
