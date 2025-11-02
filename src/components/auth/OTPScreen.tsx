import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginUser, registerUser } from '../../services/auth'

interface OTPScreenProps {
  onVerify: () => void
}

export default function OTPScreen({ onVerify }: OTPScreenProps) {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [timer, setTimer] = useState(60)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const navigate = useNavigate()
  const [phoneNumber, setPhoneNumber] = useState('')

  useEffect(() => {
    const pendingPhone = localStorage.getItem('pendingPhone')
    if (pendingPhone) {
      setPhoneNumber(pendingPhone)
    } else {
      navigate('/')
    }
  }, [navigate])

  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [timer])

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').slice(0, 6).split('')
    const newOtp = [...otp]
    pastedData.forEach((digit, index) => {
      if (index < 6) {
        newOtp[index] = digit
      }
    })
    setOtp(newOtp)
    inputRefs.current[5]?.focus()
  }

  const handleVerify = async () => {
    const otpString = otp.join('')

    if (otpString.length !== 6) {
      setError('Please enter the complete 6-digit OTP')
      return
    }

    if (!phoneNumber) {
      setError('Phone number not found. Please start over.')
      navigate('/')
      return
    }

    setLoading(true)
    setError('')

    try {
      await loginUser(phoneNumber, otpString, '+91')
      onVerify()
      navigate('/restaurants')
    } catch (err: any) {
      setError(err.message || 'Invalid OTP. Please try again.')
      console.error('Login error:', err)
      setOtp(['', '', '', '', '', ''])
      inputRefs.current[0]?.focus()
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (timer > 0) return

    setLoading(true)
    setError('')

    try {
      if (!phoneNumber) {
        navigate('/')
        return
      }

      await registerUser(phoneNumber, '+91')
      setTimer(60)
      setOtp(['', '', '', '', '', ''])
      inputRefs.current[0]?.focus()
    } catch (err: any) {
      setError(err.message || 'Failed to resend code. Please try again.')
      console.error('Resend error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          OTP Verification
        </h1>
        <p className="text-gray-500 mb-8">
          Enter the verification code we just sent on your Mobile Number.
        </p>

        <div className="flex justify-between gap-2 mb-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className="w-12 h-12 text-center text-lg font-semibold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          ))}
        </div>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}

        <button
          onClick={handleVerify}
          disabled={loading || otp.join('').length !== 6}
          className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Verifying...' : 'Verify'}
        </button>

        <div className="text-center text-gray-600">
          Didn't receive code?{' '}
          <button
            onClick={handleResend}
            disabled={timer > 0 || loading}
            className={`font-semibold ${timer > 0 || loading ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:underline'
              }`}
          >
            {timer > 0 ? `Resend (${timer}s)` : 'Resend'}
          </button>
        </div>
      </div>
    </div>
  )
}

