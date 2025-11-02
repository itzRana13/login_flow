import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { BiSolidOffer, BiSolidWallet } from 'react-icons/bi'
import { getRestaurants, Restaurant } from '../../services/api'

export default function RestaurantList() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setError('')
        const data = await getRestaurants()
        setRestaurants(data)
      } catch (err: any) {
        console.error('Error fetching restaurants:', err)
        setError(err.message || 'Failed to load restaurants')

        if (err.message?.includes('Authentication') || err.message?.includes('401')) {
          setTimeout(() => {
            localStorage.removeItem('authToken')
            localStorage.removeItem('isAuthenticated')
            navigate('/')
          }, 2000)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchRestaurants()
  }, [navigate])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-600">Loading restaurants...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          {error.includes('Authentication') && (
            <p className="text-sm text-gray-500 mb-4">Redirecting to login...</p>
          )}
          <button
            onClick={() => {
              localStorage.removeItem('authToken')
              localStorage.removeItem('isAuthenticated')
              navigate('/')
            }}
            className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  if (restaurants.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">No Restaurants Found</h2>
          <p className="text-gray-600">There are no restaurants available at the moment.</p>
        </div>
      </div>
    )
  }

  const cardColors = [
    'bg-pink-50',
    'bg-blue-50',
    'bg-amber-50',
    'bg-purple-50',
  ]

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div>
                <div className="flex items-center gap-1">
                  <p className="text-sm text-gray-500">Pre Order From</p>
                  <svg className="w-3 h-3 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-900">Connaught Place</h2>
              </div>
            </div>
          </div>


        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        <div className="bg-gray-100 rounded-xl p-5 flex items-center justify-between">
          <div>
            <h3 className="text-3xl font-semibold text-gray-400 mb-1">Karan</h3>
            <p className="text-black text-lg">Let's explore this evening</p>
          </div>
          <div className="flex gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center mb-1">
                <BiSolidOffer className="text-white text-2xl" />
              </div>
              <span className="text-xs text-gray-600">Offers</span>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center mb-1">
                <BiSolidWallet className="text-white text-2xl" />
              </div>
              <span className="text-xs text-gray-600">Wallet</span>
            </div>
          </div>
        </div>
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold" style={{ color: 'black' }}>Your taste</h2>
            <button className="text-gray-400 flex items-center gap-1 hover:text-gray-600 text-sm">
              see all
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {restaurants.slice(0, 3).map((restaurant, index) => (
              <div
                key={restaurant.id}
                className="flex-shrink-0 w-64 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(`/restaurant/${restaurant.id}`)}
              >
                <div className="h-48 bg-gray-200 relative">
                  <img
                    src={restaurant.image || restaurant.logo}
                    alt={restaurant.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      if (target.src !== 'https://via.placeholder.com/300x200?text=Restaurant') {
                        target.src = 'https://via.placeholder.com/300x200?text=Restaurant'
                      }
                    }}
                  />
                </div>
                <div className={`p-4 ${cardColors[index] || 'bg-white'}`}>
                  <h3 className="font-bold text-lg mb-1" style={{ color: '#2D7A7A' }}>{restaurant.name}</h3>
                  <p className="text-sm text-gray-500">{restaurant.location || 'Connaught Place, New Delhi'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6 rounded-xl overflow-hidden shadow-lg relative h-56">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23654321' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundColor: '#8B4513'
            }}
          ></div>
          <div className="relative h-full flex items-center justify-between p-6 sm:p-8">
            <div className="text-white">
              <h3 className="text-2xl sm:text-3xl font-bold mb-4 leading-tight">VEGGIE FRIENDLY<br />EATERIES</h3>
              <button className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors shadow-md">
                TRY NOW
              </button>
            </div>
            <div className="hidden sm:block w-48 h-48 relative">
              <img
                src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=400&fit=crop"
                alt="Healthy meal"
                className="w-full h-full object-cover rounded-lg shadow-lg"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400?text=Healthy+Meal'
                }}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-2 mb-6">
          {[1, 2, 3, 4, 5].map((dot, index) => (
            <div
              key={dot}
              className={`w-2 h-2 rounded-full transition-colors ${index === 0 ? 'bg-blue-600' : 'bg-gray-300'
                }`}
            />
          ))}
        </div>

        {restaurants.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Ones</h2>
            <div className="space-y-4">
              {restaurants.map((restaurant) => (
                <div
                  key={restaurant.id}
                  onClick={() => navigate(`/restaurant/${restaurant.id}`)}
                  className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <div className="flex flex-col sm:flex-row">
                    <div className="w-full sm:w-32 h-48 sm:h-32 flex-shrink-0">
                      <img
                        src={restaurant.image || restaurant.logo}
                        alt={restaurant.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          if (target.src !== 'https://via.placeholder.com/300x200?text=Restaurant') {
                            target.src = 'https://via.placeholder.com/300x200?text=Restaurant'
                          }
                        }}
                      />
                    </div>
                    <div className="flex-1 p-4 flex flex-col sm:flex-row sm:justify-between">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{restaurant.name}</h3>
                        {restaurant.cuisine && (
                          <p className="text-sm text-gray-500 mb-1">{restaurant.cuisine}</p>
                        )}
                        <p className="text-sm text-gray-500 mb-2">
                          {restaurant.location || 'Address not available'}
                        </p>
                        <div className="flex items-center gap-4 flex-wrap mb-2">
                          <span className="text-primary font-semibold flex items-center gap-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            {restaurant.rating && restaurant.rating > 0 ? restaurant.rating : '4.5'}
                          </span>
                          {restaurant.offers && restaurant.offers > 0 && (
                            <span className="text-primary font-semibold flex items-center gap-1">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              {restaurant.offers} Offers trending
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="mt-4 sm:mt-0 sm:text-right">
                        <p className="text-xl font-bold text-gray-900">
                          {restaurant.costForTwo && restaurant.costForTwo > 0 ? `₹${restaurant.costForTwo}` : '$200'}
                        </p>
                        <p className="text-sm text-gray-500">Cost for two</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

