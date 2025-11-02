import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { registerUser } from '../../services/auth'

interface MobileNumberScreenProps {
  onSubmit: (mobile: string) => void
}

export default function MobileNumberScreen({ onSubmit }: MobileNumberScreenProps) {
  const [mobileNumber, setMobileNumber] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!mobileNumber.trim()) return

    setLoading(true)
    setError('')

    try {
      const cleanPhone = mobileNumber.replace(/\s+|-|^\+91/g, '')

      if (cleanPhone.length < 10) {
        setError('Please enter a valid 10-digit mobile number')
        setLoading(false)
        return
      }

      await registerUser(cleanPhone, '+91')

      localStorage.setItem('pendingPhone', cleanPhone)
      onSubmit(cleanPhone)
      navigate('/otp')
    } catch (err: any) {
      setError(err.message || 'Failed to send verification code. Please try again.')
      console.error('Registration error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Enter Your Mobile Number
        </h1>
        <p className="text-gray-500 mb-8">
          We will send you the 4 digit verification code
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-gray-600 font-medium">+91</span>
              <input
                type="tel"
                placeholder="Enter your mobile number"
                value={mobileNumber}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '')
                  if (value.length <= 10) {
                    setMobileNumber(value)
                    setError('')
                  }
                }}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                required
                maxLength={10}
              />
            </div>
            {error && (
              <p className="text-red-500 text-sm mt-1">{error}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Sending...' : 'Send Code'}
          </button>
        </form>
      </div>
    </div>
  )
}

