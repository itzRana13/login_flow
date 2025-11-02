# Fastor Restaurant Discovery App

A modern, responsive web application for discovering restaurants with PWA capabilities and image sharing features.

## Features

1. **Authentication Flow**
   - Mobile number input screen
   - OTP verification (use `123456` for testing)
   - Persistent login state

2. **Restaurant Discovery**
   - List of nearby restaurants with mock API
   - Responsive design matching the provided mobile UI
   - Sections: "Your taste", "Veggie Friendly Eateries", "Popular Ones"

3. **Restaurant Detail Page**
   - High-quality restaurant images
   - Fastor logo superimposition (centered by default)
   - **Bonus Feature**: Drag and reposition the logo anywhere on the image
   - Share functionality (PWA-enabled)

4. **Progressive Web App (PWA)**
   - Installable on devices
   - Share images via native sharing API
   - Offline capabilities (via service worker)

## Tech Stack

- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **React Router** for navigation
- **PWA Plugin** for progressive web app features

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Logo Setup

The app expects a Fastor logo at `/public/fastor-logo.svg` or `/public/fastor-logo.png`. A placeholder SVG logo is included. To use your own logo:

1. Replace `/public/fastor-logo.svg` with your logo file
2. Ensure it's optimized for web (SVG recommended for scalability)

## Testing the App

1. **Login Flow**:
   - Enter a 10-digit mobile number (e.g., `9818979450`)
   - Click "Send Code" - this calls the register API
   - Enter the OTP received via SMS
   - Click "Verify" - this calls the login API and stores the auth token

2. **Restaurant Discovery**:
   - After login, the app automatically fetches restaurants from the API
   - Browse the restaurant list
   - Click on any restaurant card to view details

3. **Logo Superimposition**:
   - On the restaurant detail page, drag the Fastor logo to reposition it
   - Click "Share Image" to share or download the image with the logo

## API Integration

The app is integrated with the Fastor staging APIs:

- **Register API**: `POST /v1/pwa/user/register`
- **Login API**: `POST /v1/pwa/user/login`
- **Restaurants API**: `GET /v1/m/restaurant?city_id=118`

The authentication token is automatically stored and used for restaurant API requests. The app handles:
- Token storage in localStorage
- Automatic token inclusion in API requests
- Error handling for expired/invalid tokens
- Automatic redirect to login on auth failures

## Responsive Design

The app is fully responsive and works on:
- Mobile devices (320px+)
- Tablets (768px+)
- Desktop (1024px+)
- Large screens (1920px+)

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Notes

- The OTP verification accepts `123456` as a valid code for testing
- Images are loaded from Unsplash (with fallback placeholders)
- The share functionality uses the Web Share API with download fallback

## License

This project is created for the Fastor.ai task assessment.

