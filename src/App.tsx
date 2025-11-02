import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import MobileNumberScreen from './components/auth/MobileNumberScreen'
import OTPScreen from './components/auth/OTPScreen'
import RestaurantList from './components/restaurants/RestaurantList'
import RestaurantDetail from './components/restaurants/RestaurantDetail'
import { getAuthToken } from './services/auth'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [mobileNumber, setMobileNumber] = useState('')

  useEffect(() => {
    const token = getAuthToken()
    const auth = localStorage.getItem('isAuthenticated')
    if (auth === 'true' && token) {
      setIsAuthenticated(true)
    }
  }, [])

  const handleMobileSubmit = (mobile: string) => {
    setMobileNumber(mobile)
  }

  const handleOTPVerify = () => {
    setIsAuthenticated(true)
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/restaurants" replace />
            ) : (
              <MobileNumberScreen onSubmit={handleMobileSubmit} />
            )
          }
        />
        <Route
          path="/otp"
          element={
            mobileNumber ? (
              <OTPScreen onVerify={handleOTPVerify} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/restaurants"
          element={
            isAuthenticated ? (
              <RestaurantList />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/restaurant/:id"
          element={
            isAuthenticated ? (
              <RestaurantDetail />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Routes>
    </Router>
  )
}

export default App

