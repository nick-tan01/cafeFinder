# Cafe Finder App Requirements

## Authentication & User Management (`app/(auth)/` directory)
- Sign In Page (`app/(auth)/sign-in.tsx`)
  - Email and password login
  - "Remember me" functionality
  - Social media login options (Google, Apple)
  - Forgot password link
  - Link to create new account
  - Error handling for invalid credentials
  - Loading states during authentication

- Sign Up Page (`app/(auth)/sign-up.tsx`)
  - Email and password registration
  - Name and basic profile information
  - Terms of service acceptance
  - Email verification process
  - Password strength requirements
  - Duplicate email checking
  - Form validation

- Password Recovery (functionality in `app/(auth)/sign-in.tsx`)
  - Email-based password reset
  - Security questions option
  - Reset link expiration
  - New password requirements
  - Confirmation of password change
  - Email notifications for security

## Customer-Facing Features

### Explore Tab (Home) (`app/(tabs)/index.tsx`)
- Toggle between List and Map views
- Location-based cafe discovery
- Each cafe card shows:
  - Cafe name and photo
  - Current open/closed status
  - Distance from user
  - Average rating (out of 5 stars)
  - Number of reviews
  - Quick view of popular items
- Map features:
  - Cafe location pins
  - User's current location
  - Distance radius filter
  - Interactive pin markers
  - Quick preview of cafe details

### Search Tab (`app/(tabs)/search.tsx`)
- Search bar with instant results
- Filter options:
  - Distance range
  - Price range
  - Rating minimum
  - Open now
  - Cuisine type
  - Special features (WiFi, outdoor seating)
- Sort options:
  - Distance
  - Rating
  - Price
  - Popularity
- Recent searches history
- Popular searches suggestions
- Save search preferences

### Orders Tab (`app/(tabs)/orders.tsx`)
- Current orders section:
  - Real-time order status
  - Estimated pickup/delivery time
  - Order details and items
  - Contact cafe option
- Order history:
  - Past orders list
  - Reorder functionality
  - Receipt access
  - Rating/review option
- Order tracking:
  - Status updates
  - Preparation stages
  - Ready for pickup notification
  - Delivery tracking (if applicable)

### Profile Tab (`app/(tabs)/profile.tsx`)
- Personal Information:
  - Profile picture
  - Name and contact details
  - Saved addresses
  - Payment methods
- Preferences:
  - Favorite cafes
  - Dietary restrictions
  - Notification settings
  - Language preference
- Account Settings:
  - Change password
  - Email preferences
  - Privacy settings
  - Delete account option
- Rewards/Loyalty:
  - Points balance
  - Rewards history
  - Available perks
  - Achievement badges

## Cafe Details & Ordering

### Cafe Details Page (`app/cafe/[id].tsx`)
- Hero section with cafe images
- Basic Information:
  - Operating hours
  - Contact information
  - Location with map
  - Delivery/pickup options
- Menu Categories:
  - Item photos
  - Prices
  - Descriptions
  - Customization options
- Reviews & Ratings:
  - Overall rating
  - Rating breakdown
  - Recent reviews
  - Photo reviews
- Additional Features:
  - Save as favorite
  - Share cafe
  - Report issues
  - Special offers/promotions

### Reviews Section (`app/cafe/[id]/reviews.tsx`)
- Ratings display
- Review listing
- Review submission
- Photo reviews

### Checkout Process (`app/checkout.tsx`)
- Cart Management:
  - Item quantity adjustment
  - Special instructions
  - Remove items
  - Save for later
- Order Options:
  - Pickup/delivery selection
  - Schedule for later
  - Estimated time display
- Payment Processing:
  - Multiple payment methods
  - Apply rewards/points
  - Add tip
  - Split payment option
- Order Review:
  - Item summary
  - Price breakdown
  - Delivery/pickup details
  - Terms acceptance

### Order Confirmation (`app/order-confirmation.tsx`)
- Confirmation number
- Order summary
- Pickup/delivery instructions
- Estimated time
- Track order button
- Add to calendar option
- Share order details
- Receipt/invoice access

### Order Details (`app/order/[id].tsx`)
- Order status
- Item details
- Tracking information
- Contact options

## Cafe Admin Features (`app/(cafe-admin)/` directory)

### Admin Dashboard (`app/(cafe-admin)/dashboard.tsx`)
- Overview Statistics:
  - Today's sales
  - Active orders
  - Popular items
  - Customer feedback score
- Quick Actions:
  - Accept/reject orders
  - Update menu availability
  - Respond to reviews
  - Update store status
- Performance Metrics:
  - Peak hours
  - Average order value
  - Customer satisfaction
  - Inventory alerts

### Menu Management (`app/(cafe-admin)/menu.tsx`)
- Item Management:
  - Add/edit/delete items
  - Set prices and options
  - Upload photos
  - Category organization
- Inventory Control:
  - Stock tracking
  - Low stock alerts
  - Availability toggling
- Special Offers:
  - Create promotions
  - Happy hour settings
  - Combo deals
  - Limited time items

### Order Management (`app/(cafe-admin)/orders.tsx`)
- Order Queue:
  - New orders alert
  - Preparation timeline
  - Status updates
  - Customer notifications
- Order Details:
  - Customer information
  - Special instructions
  - Payment status
  - Modification history
- Order History:
  - Search and filter
  - Export reports
  - Customer patterns
  - Popular combinations

### Analytics Dashboard (`app/(cafe-admin)/analytics.tsx`)
- Sales Analytics:
  - Daily/weekly/monthly reports
  - Revenue breakdown
  - Payment method analysis
  - Refund tracking
- Customer Insights:
  - Customer demographics
  - Order patterns
  - Loyalty program stats
  - Customer retention
- Menu Performance:
  - Best/worst sellers
  - Price point analysis
  - Category performance
  - Seasonal trends

### Reviews Management (`app/(cafe-admin)/reviews.tsx`)
- Review Monitoring:
  - New review alerts
  - Rating trends
  - Response templates
  - Flag inappropriate content
- Response Management:
  - Quick replies
  - Customer service tracking
  - Issue resolution
  - Follow-up system

### Settings & Configuration (`app/(cafe-admin)/settings.tsx`)
- Store Profile:
  - Basic information
  - Photos and branding
  - Location settings
  - Operating hours
- Staff Management:
  - Employee accounts
  - Role permissions
  - Activity logs
  - Schedule management
- System Settings:
  - Notification preferences
  - Integration settings
  - Backup options
  - Security controls

### Admin Authentication (`app/(cafe-admin)/login.tsx`)
- Login form
- Access control
- Security settings

### Layout Files (Navigation & Structure)
- Main App Layout (`app/_layout.tsx`)
- Tab Navigation Layout (`app/(tabs)/_layout.tsx`)
- Admin Layout (`app/(cafe-admin)/_layout.tsx`)
- Auth Layout (`app/(auth)/_layout.tsx`)

## Development Notes
- Built with React Native and Expo
- Uses Expo Router for navigation
- Supports iOS and Android platforms
- Development server runs on `exp://192.168.1.173:8081`
- Web version available at `http://localhost:8081` 