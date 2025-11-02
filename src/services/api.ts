const API_BASE_URL = 'https://staging.fastor.ai/v1'

export interface Restaurant {
  id: string
  name: string
  location?: string
  address?: string
  city?: string
  cuisine?: string
  cuisine_type?: string
  rating?: number
  rating_value?: number
  image?: string
  image_url?: string
  banner_image?: string
  logo?: string
  offers?: number
  offers_count?: number
  costForTwo?: number
  cost_for_two?: number
  price_range?: number
  description?: string
  [key: string]: any
}

export interface RestaurantApiResponse {
  status?: string
  status_code?: number
  data?: {
    results?: any[]
    restaurants?: any[]
    meta?: {
      total_pages?: number
      total_count?: number
    }
  }
  results?: any[]
  restaurants?: any[]
  success?: boolean
  message?: string
  [key: string]: any
}

const transformRestaurant = (apiRestaurant: any): Restaurant => {
  const addressComplete = apiRestaurant.address_complete === 'null' || !apiRestaurant.address_complete 
    ? 'Address not available' 
    : apiRestaurant.address_complete

  const logoUrl = apiRestaurant.logo && apiRestaurant.logo !== 'null' && apiRestaurant.logo.trim() !== '' 
    ? apiRestaurant.logo 
    : null

  const imageUrl = logoUrl || 
    apiRestaurant.banner_image || 
    apiRestaurant.image_url || 
    apiRestaurant.image ||
    'https://via.placeholder.com/800x600?text=Restaurant'

  return {
    id: String(apiRestaurant.restaurant_id || apiRestaurant.id || ''),
    name: apiRestaurant.restaurant_name || apiRestaurant.name || 'Unknown Restaurant',
    location: addressComplete,
    address: addressComplete,
    image: imageUrl,
    logo: logoUrl || undefined,
    cuisine: apiRestaurant.cuisine_type || apiRestaurant.cuisine || apiRestaurant.category || '',
    rating: apiRestaurant.rating_value || apiRestaurant.rating || 0,
    offers: apiRestaurant.offers_count || apiRestaurant.offers || 0,
    costForTwo: apiRestaurant.cost_for_two || apiRestaurant.costForTwo || apiRestaurant.price_range || 0,
    description: apiRestaurant.description || apiRestaurant.about || '',
    ...apiRestaurant
  }
}

export const getRestaurants = async (cityId: number = 118): Promise<Restaurant[]> => {
  try {
    const token = localStorage.getItem('authToken')
    
    if (!token) {
      throw new Error('No authentication token found')
    }

    const url = new URL(`${API_BASE_URL}/m/restaurant`)
    url.searchParams.append('city_id', String(cityId))
    url.searchParams.append('null', 'null')
    url.searchParams.append('', 'null')

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('authToken')
        localStorage.removeItem('isAuthenticated')
        throw new Error('Authentication failed. Please login again.')
      }
      throw new Error(`Failed to fetch restaurants: ${response.statusText}`)
    }

    const data: RestaurantApiResponse = await response.json()
    
    let restaurants: any[] = []
    
    if (data.status === 'Success' && data.data?.results) {
      restaurants = data.data.results
    } else if (data.data?.results && Array.isArray(data.data.results)) {
      restaurants = data.data.results
    } else if (Array.isArray(data.data)) {
      restaurants = data.data
    } else if (Array.isArray(data)) {
      restaurants = data
    } else if (data.restaurants && Array.isArray(data.restaurants)) {
      restaurants = data.restaurants
    } else if (data.restaurant && Array.isArray(data.restaurant)) {
      restaurants = data.restaurant
    }

    if (restaurants.length === 0) {
      console.warn('No restaurants found in API response:', data)
    }

    const transformedRestaurants = restaurants.map(transformRestaurant)
    
    if (transformedRestaurants.length > 0) {
      console.log('First restaurant data:', {
        name: transformedRestaurants[0].name,
        logo: transformedRestaurants[0].logo,
        image: transformedRestaurants[0].image,
        original: restaurants[0]
      })
    }

    return transformedRestaurants
  } catch (error) {
    console.error('Error fetching restaurants:', error)
    throw error
  }
}

export const getRestaurantById = async (id: string): Promise<Restaurant | null> => {
  try {
    const restaurants = await getRestaurants()
    const restaurant = restaurants.find(r => r.id === id || String(r.id) === String(id))
    
    if (restaurant) {
      return restaurant
    }
    
    return null
  } catch (error) {
    console.error('Error fetching restaurant:', error)
    return null
  }
}
