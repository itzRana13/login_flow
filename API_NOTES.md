# API Integration Notes

## Endpoints Used

### 1. User Registration
- **URL**: `https://staging.fastor.ai/v1/pwa/user/register`
- **Method**: POST
- **Content-Type**: `application/x-www-form-urlencoded`
- **Body Parameters**:
  - `phone`: Mobile number (10 digits)
  - `dial_code`: Country code (default: `+91`)
  - `=`: Empty parameter (as per API spec)

### 2. User Login
- **URL**: `https://staging.fastor.ai/v1/pwa/user/login`
- **Method**: POST
- **Content-Type**: `application/x-www-form-urlencoded`
- **Body Parameters**:
  - `phone`: Mobile number
  - `otp`: 6-digit OTP code
  - `dial_code`: Country code (default: `+91`)
  - `=`: Empty parameter (as per API spec)
- **Response**: Contains `token` or `access_token` in response data

### 3. Get Restaurants
- **URL**: `https://staging.fastor.ai/v1/m/restaurant?city_id=118&null=null&=null`
- **Method**: GET
- **Headers**:
  - `Authorization`: `Bearer {token}`
- **Query Parameters**:
  - `city_id`: City ID (default: 118)
  - `null`: "null" (as per API spec)
  - `=`: "null" (as per API spec)

## Authentication Flow

1. User enters mobile number → Calls register API
2. User enters OTP → Calls login API → Receives token
3. Token stored in `localStorage` as `authToken`
4. All subsequent restaurant API calls include token in Authorization header
5. On 401 errors, token is cleared and user redirected to login

## Token Storage

- Token is stored in `localStorage` with key `authToken`
- On successful login, `isAuthenticated` is also set to `true`
- On logout or auth errors, both are cleared

## Error Handling

- Registration errors: Displayed on mobile number screen
- Login errors: Displayed on OTP screen
- API errors: Displayed with retry options
- 401 errors: Automatic logout and redirect to login

## Data Transformation

The restaurant API response is transformed to match the app's `Restaurant` interface, handling various possible field names:
- `id` or `restaurant_id` → `id`
- `name` or `restaurant_name` → `name`
- `banner_image` or `image_url` or `image` → `image`
- `rating_value` or `rating` → `rating`
- `offers_count` or `offers` → `offers`
- `cost_for_two` or `costForTwo` or `price_range` → `costForTwo`

