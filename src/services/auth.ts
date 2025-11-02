const API_BASE_URL = 'https://staging.fastor.ai/v1'

export interface RegisterResponse {
  success?: boolean
  message?: string
  data?: any
}

export interface LoginResponse {
  success?: boolean
  message?: string
  data?: {
    token?: string
    access_token?: string
    [key: string]: any
  }
  token?: string
  access_token?: string
}

export const registerUser = async (
  phone: string,
  dialCode: string = '+91'
): Promise<RegisterResponse> => {
  try {
    const formData = new URLSearchParams()
    formData.append('phone', phone)
    formData.append('dial_code', dialCode)
    formData.append('', '')

    const response = await fetch(`${API_BASE_URL}/pwa/user/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    })

    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.message || 'Registration failed')
    }

    return data
  } catch (error) {
    console.error('Registration error:', error)
    throw error
  }
}

export const loginUser = async (
  phone: string,
  otp: string,
  dialCode: string = '+91'
): Promise<LoginResponse> => {
  try {
    const formData = new URLSearchParams()
    formData.append('phone', phone)
    formData.append('otp', otp)
    formData.append('dial_code', dialCode)
    formData.append('', '')

    const response = await fetch(`${API_BASE_URL}/pwa/user/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    })

    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.message || 'Login failed')
    }

    // Extract token from response
    const token = data.data?.token || data.data?.access_token || data.token || data.access_token
    
    if (token) {
      localStorage.setItem('authToken', token)
      localStorage.setItem('isAuthenticated', 'true')
    }

    return { ...data, token }
  } catch (error) {
    console.error('Login error:', error)
    throw error
  }
}

export const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken')
}

export const logout = (): void => {
  localStorage.removeItem('authToken')
  localStorage.removeItem('isAuthenticated')
}

