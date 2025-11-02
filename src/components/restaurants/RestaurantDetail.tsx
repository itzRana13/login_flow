import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getRestaurantById, Restaurant } from '../../services/api'

export default function RestaurantDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [loading, setLoading] = useState(true)
  const [logoPosition, setLogoPosition] = useState({ x: 50, y: 50 }) // Percentage position
  const [isDragging, setIsDragging] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const fetchRestaurant = async () => {
      if (!id) return
      try {
        const data = await getRestaurantById(id)
        setRestaurant(data)
      } catch (error) {
        console.error('Error fetching restaurant:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRestaurant()
  }, [id])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 100
      const y = ((e.clientY - rect.top) / rect.height) * 100

      // Keep logo within bounds
      const constrainedX = Math.max(10, Math.min(90, x))
      const constrainedY = Math.max(10, Math.min(90, y))

      setLogoPosition({ x: constrainedX, y: constrainedY })
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging])

  const handleLogoMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleTouchStart = () => {
    if (!containerRef.current) return
    setIsDragging(true)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !containerRef.current) return
    const touch = e.touches[0]
    const rect = containerRef.current.getBoundingClientRect()
    const x = ((touch.clientX - rect.left) / rect.width) * 100
    const y = ((touch.clientY - rect.top) / rect.height) * 100

    const constrainedX = Math.max(10, Math.min(90, x))
    const constrainedY = Math.max(10, Math.min(90, y))

    setLogoPosition({ x: constrainedX, y: constrainedY })
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
  }

  const drawImageWithLogo = useCallback(() => {
    if (!canvasRef.current || !restaurant || !logoRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Load restaurant image
    const img = new Image()
    img.crossOrigin = 'anonymous'
    
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height

      // Draw restaurant image
      ctx.drawImage(img, 0, 0)

      // Load and draw logo
      const logo = logoRef.current
      if (logo) {
        const logoImg = new Image()
        logoImg.crossOrigin = 'anonymous'
        
        logoImg.onload = () => {
          const logoSize = Math.min(canvas.width, canvas.height) * 0.2
          const logoX = (logoPosition.x / 100) * canvas.width - logoSize / 2
          const logoY = (logoPosition.y / 100) * canvas.height - logoSize / 2

          ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize)
        }

        logoImg.onerror = () => {
          console.error('Failed to load logo')
        }

        logoImg.src = logo.src || '/fastor-logo.svg'
      }
    }

    img.onerror = () => {
      console.error('Failed to load restaurant image')
    }

    img.src = restaurant.logo || restaurant.image || 'https://via.placeholder.com/800x600?text=Restaurant'
  }, [restaurant, logoPosition])

  useEffect(() => {
    if (restaurant && logoRef.current) {
      // Small delay to ensure logo element is rendered
      const timer = setTimeout(() => {
        drawImageWithLogo()
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [restaurant, logoPosition, drawImageWithLogo])

  const handleShare = async () => {
    if (!canvasRef.current) return

    canvasRef.current.toBlob(async (blob) => {
      if (!blob) return

      const file = new File([blob], 'restaurant-with-logo.png', { type: 'image/png' })

      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            title: `${restaurant?.name} - Fastor`,
            text: `Check out ${restaurant?.name} on Fastor!`,
            files: [file]
          })
        } catch (error: any) {
          if (error.name !== 'AbortError') {
            console.error('Error sharing:', error)
          }
          // Fallback: download image
          downloadImage()
        }
      } else {
        // Fallback: download image
        downloadImage()
      }
    }, 'image/png')
  }

  const downloadImage = () => {
    if (!canvasRef.current) return
    const link = document.createElement('a')
    link.download = `${restaurant?.name || 'restaurant'}-with-logo.png`
    link.href = canvasRef.current.toDataURL('image/png')
    link.click()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-600">Loading restaurant details...</div>
      </div>
    )
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-600">Restaurant not found</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-gray-900">Restaurant Details</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Image with Superimposed Logo */}
        <div className="mb-6">
          <div
            ref={containerRef}
            className="relative w-full rounded-t-2xl overflow-hidden bg-gray-200"
            style={{ aspectRatio: '4/3' }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <img
              src={restaurant.logo || restaurant.image || 'https://via.placeholder.com/800x600?text=Restaurant'}
              alt={restaurant.name}
              className="w-full h-full object-cover"
              loading="eager"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                console.log('Image failed to load:', target.src, 'Restaurant:', restaurant.name)
                if (target.src !== 'https://via.placeholder.com/800x600?text=Restaurant') {
                  target.src = 'https://via.placeholder.com/800x600?text=Restaurant'
                }
              }}
              onLoad={() => {
                console.log('Detail image loaded:', restaurant.logo || restaurant.image)
              }}
            />
            
            {/* Draggable Logo Overlay */}
            <div
              className="absolute cursor-move touch-none select-none"
              style={{
                left: `${logoPosition.x}%`,
                top: `${logoPosition.y}%`,
                transform: 'translate(-50%, -50%)',
                zIndex: 10
              }}
              onMouseDown={handleLogoMouseDown}
            >
              <img
                ref={logoRef}
                src="/fastor-logo.svg"
                alt="Fastor Logo"
                className="w-20 h-20 sm:w-24 sm:h-24 drop-shadow-lg"
                style={{ pointerEvents: 'none', userSelect: 'none' }}
                onError={(e) => {
                  // Fallback if logo doesn't exist - create a text logo
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                  const parent = target.parentElement
                  if (parent && !parent.querySelector('.logo-fallback')) {
                    const fallback = document.createElement('div')
                    fallback.className = 'logo-fallback bg-primary text-white px-4 py-2 rounded-lg font-bold text-lg'
                    fallback.textContent = 'FASTOR'
                    parent.appendChild(fallback)
                  }
                }}
              />
            </div>
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center gap-2 mt-4">
            {[1, 2, 3, 4].map((dot, index) => (
              <div
                key={dot}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === 0 ? 'bg-primary' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Restaurant Info Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{restaurant.name}</h2>
              <p className="text-gray-600 mb-2">
                {restaurant.location || restaurant.address || 'Address not available'}
              </p>
              {(restaurant.rating || (restaurant.offers && restaurant.offers > 0)) && (
                <div className="flex items-center gap-4 flex-wrap">
                  {restaurant.rating && restaurant.rating > 0 && (
                    <span className="text-primary font-semibold flex items-center gap-1">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {restaurant.rating}
                    </span>
                  )}
                  {restaurant.offers && restaurant.offers > 0 && (
                    <span className="text-primary font-semibold flex items-center gap-1">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      {restaurant.offers} Offers Trending
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {restaurant.description && (
            <p className="text-gray-700 leading-relaxed mb-6">{restaurant.description}</p>
          )}

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Share Image
          </button>
        </div>

        {/* Hidden Canvas for Image Generation */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  )
}
