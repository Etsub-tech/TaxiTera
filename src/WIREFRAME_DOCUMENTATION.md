# TaxiTera - Complete Wireframe Documentation

## Design System Overview

**Color Palette:**
- Background (Routing Pages): #1a252f (dark blue-gray)
- Background (Landing): gray-900, gray-800 (alternating sections)
- Primary Blue: blue-600, blue-700
- Border Accent: blue-500/30, blue-400/40
- Text: white, gray-200, gray-300, gray-400

**Typography:**
- Hero Heading: text-6xl
- Section Headings: text-4xl, text-5xl
- Page Titles: text-3xl
- Card Titles: text-2xl, text-xl
- Body Text: text-lg, text-xl
- Small Text: text-sm

**Common UI Patterns:**
- Glassmorphism: backdrop-blur with bg-white/10 or bg-gray-900/90
- Border Styling: border border-blue-500/30 or border-blue-300/40
- Smooth Transitions: transition-all duration-300
- Hover Effects: hover:bg-blue-700, hover:scale-105
- Icons: lucide-react library (w-5 h-5 to w-12 h-12)

---

## Page 1: Landing Page (HomePage.tsx)

**Route:** `/`

### Navigation Layout
**Header (Fixed):**
- Position: Fixed top, full-width with backdrop blur
- Left: TaxiTera logo (h-12)
- Right: Login and Register buttons
- Styling: Semi-transparent white background with white/20 border-bottom
- Z-index: z-50

### Content Hierarchy (Top to Bottom)

#### 1. Hero Section
**Layout:**
- Full viewport height (h-screen)
- Background: Hero image with dark gradient overlay (rgba(0,0,0,0.6))
- Background attachment: Fixed (parallax effect)
- Centered content

**UI Elements:**
- Main Heading: "Find Your Taxi Terminal" (text-6xl, white)
- Subtitle: "Navigate Addis Ababa's minibus taxi network with ease" (text-2xl, gray-200)
- CTA Button: "Get Started" → Links to /guest-search
  - Styling: Blue-600 background, white text, hover scale effect
  - Size: px-12 py-4, text-xl

#### 2. Problem Section 1 - Confusing Routes (Staggered Left)
**Layout:**
- Background: gray-800
- Max-width: 6xl, padded left (md:ml-12)
- Flex row on desktop, column on mobile
- Scroll trigger: Fade in + slide animations

**UI Elements (Left to Right):**
- Image (md:w-1/2):
  - Night city street photo
  - Height: h-96, shadow-2xl
  - Slide animation from left (x: -50 to 0)
  
- Text Content (md:w-1/2):
  - Icon: Navigation icon (w-12 h-12, blue-500)
  - Heading: "Confused About Routes?" (text-4xl)
  - Description: Text explaining route confusion problem (text-xl, gray-300)

#### 3. Problem Section 2 - Can't Find Terminals (Staggered Right)
**Layout:**
- Background: gray-900
- Max-width: 6xl, padded right (md:mr-12, md:ml-auto)
- Flex row-reverse on desktop
- Scroll trigger: Fade in + slide animations

**UI Elements (Right to Left):**
- Image (md:w-1/2):
  - Taxi terminal photo
  - Height: h-96, shadow-2xl
  - Slide animation from right (x: 50 to 0)
  
- Text Content (md:w-1/2):
  - Icon: MapPin icon (w-12 h-12, blue-500)
  - Heading: "Can't Find the Right Terminal?" (text-4xl)
  - Description: Text explaining terminal location problem (text-xl, gray-300)

#### 4. Problem Section 3 - Long Wait Times (Staggered Left Lower)
**Layout:**
- Background: gray-800
- Max-width: 6xl, more padding left (md:ml-24)
- Flex row on desktop
- Scroll trigger: Fade in + slide animations

**UI Elements (Left to Right):**
- Image (md:w-1/2):
  - Traffic/queue photo
  - Height: h-96, shadow-2xl
  - Slide animation from left (x: -50 to 0)
  
- Text Content (md:w-1/2):
  - Icon: Clock icon (w-12 h-12, blue-500)
  - Heading: "Tired of Long Wait Times?" (text-4xl)
  - Description: Text explaining wait time problem (text-xl, gray-300)

#### 5. How It Works Section
**Layout:**
- Background: gray-900
- Max-width: 7xl
- Grid: 4 columns on desktop (grid md:grid-cols-4)
- Scroll trigger: Staggered fade-in animations (delay: 0.1s increments)

**UI Elements (4 Cards):**

Each card contains:
- Icon Circle:
  - Blue-600 background, w-20 h-20, rounded-full
  - White icon centered (w-10 h-10)
  
- Card 1: Sign Up or Continue
  - Icon: UserPlus
  - Text: "Create an account to save your preferences or continue as a guest"
  
- Card 2: Enter Location
  - Icon: MapPin
  - Text: "Select your origin and destination from our comprehensive list"
  
- Card 3: View Routes
  - Icon: Map
  - Text: "See the best, nearest, and fastest routes to your destination"
  
- Card 4: Travel Safe
  - Icon: Shield
  - Text: "Get detailed route information and travel with confidence"

#### 6. Call to Action & Footer Section
**Layout:**
- Background: blue-950
- Centered content, max-width: 4xl
- Scroll trigger: Fade in + slide up animation

**UI Elements:**
- Heading: "Ready to Navigate Addis Ababa?" (text-5xl, white)
- Subheading: "Join thousands of commuters who trust TaxiTera..." (text-2xl, gray-300)
- CTA Button: "Get Started" → Links to /guest-search
  - Larger size: px-16 py-5
  
- Footer:
  - Border-top (blue-800)
  - Copyright text: "© 2025 TaxiTera. All rights reserved." (gray-400)

---

## Page 2: Login Page (LoginPage.tsx)

**Route:** `/login`

### Navigation Layout
**Header/Navigation:**
- No fixed header
- X button (absolute positioned top-right):
  - Icon: X icon (w-6 h-6)
  - Color: White, hover blue-400
  - Links to: /

### Content Hierarchy

#### Background
- Full-screen night taxi road image
- Dark gradient overlay: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5))
- Background-attachment: fixed (parallax)

#### Login Form Card (Centered)
**Container:**
- Max-width: md (max-w-md)
- Background: gray-900/90 with backdrop-blur-lg
- Border: blue-500/30
- Padding: p-8
- Position: Relative (for X button positioning)

**UI Elements (Top to Bottom):**

1. **X Close Button:**
   - Position: Absolute top-4 right-4
   - Links to homepage

2. **Heading:**
   - Text: "Login to TaxiTera"
   - Size: text-3xl
   - Alignment: Centered
   - Margin-bottom: mb-8

3. **Form (space-y-6):**

   **Username Field:**
   - Label: "Username" (white, mb-2)
   - Input:
     - Type: text
     - Full width (w-full)
     - Padding: px-4 py-3
     - Background: gray-800/70
     - Border: blue-500/40
     - Text: white
     - Placeholder: "Enter your username"
     - Focus state: blue-500 border
     - Required field

   **Password Field:**
   - Label: "Password" (white, mb-2)
   - Input:
     - Type: password
     - Full width (w-full)
     - Padding: px-4 py-3
     - Background: gray-800/70
     - Border: blue-500/40
     - Text: white
     - Placeholder: "Enter your password"
     - Focus state: blue-500 border
     - Required field

   **Submit Button:**
   - Text: "Login"
   - Full width (w-full)
   - Padding: py-3
   - Background: blue-600
   - Hover: blue-700 + scale-105
   - Transition: duration-300

4. **Sign Up Link:**
   - Text: "If you don't have an account, sign up"
   - Alignment: Centered
   - Link styling: blue-400 hover blue-300, underlined
   - Margin-top: mt-6
   - Links to: /register

**Functionality:**
- Form validation (required fields)
- Toast notifications on submit (success/error)
- Redirects to /dashboard on success
- Mock authentication via AuthContext

---

## Page 3: Register Page (RegisterPage.tsx)

**Route:** `/register`

### Navigation Layout
**Header/Navigation:**
- No fixed header
- X button (absolute positioned top-right):
  - Icon: X icon (w-6 h-6)
  - Color: White, hover blue-400
  - Links to: /

### Content Hierarchy

#### Background
- Full-screen night taxi road image (same as login)
- Dark gradient overlay: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5))
- Background-attachment: fixed (parallax)

#### Register Form Card (Centered)
**Container:**
- Max-width: md (max-w-md)
- Background: gray-900/90 with backdrop-blur-lg
- Border: blue-500/30
- Padding: p-8
- Position: Relative (for X button positioning)

**UI Elements (Top to Bottom):**

1. **X Close Button:**
   - Position: Absolute top-4 right-4
   - Links to homepage

2. **Heading:**
   - Text: "Create Account"
   - Size: text-3xl
   - Alignment: Centered
   - Margin-bottom: mb-8

3. **Form (space-y-6):**

   **Username Field:**
   - Label: "Username" (white, mb-2)
   - Input:
     - Type: text
     - Full width (w-full)
     - Padding: px-4 py-3
     - Background: gray-800/70
     - Border: blue-500/40
     - Text: white
     - Placeholder: "Choose a unique username"
     - Focus state: blue-500 border
     - Required field

   **Password Field:**
   - Label: "Password" (white, mb-2)
   - Input:
     - Type: password
     - Full width (w-full)
     - Padding: px-4 py-3
     - Background: gray-800/70
     - Border: blue-500/40
     - Text: white
     - Placeholder: "Choose a password"
     - Focus state: blue-500 border
     - Required field

   **Confirm Password Field:**
   - Label: "Confirm Password" (white, mb-2)
   - Input:
     - Type: password
     - Full width (w-full)
     - Padding: px-4 py-3
     - Background: gray-800/70
     - Border: blue-500/40
     - Text: white
     - Placeholder: "Confirm your password"
     - Focus state: blue-500 border
     - Required field

   **Submit Button:**
   - Text: "Sign Up"
   - Full width (w-full)
   - Padding: py-3
   - Background: blue-600
   - Hover: blue-700 + scale-105
   - Transition: duration-300

4. **Login Link:**
   - Text: "If you already have an account, login"
   - Alignment: Centered
   - Link styling: blue-400 hover blue-300, underlined
   - Margin-top: mt-6
   - Links to: /login

**Functionality:**
- Form validation (required fields + password match check)
- Toast notifications on submit (success/error)
- Redirects to /login on success
- Mock registration via AuthContext

---

## Page 4: Dashboard Page (DashboardPage.tsx)

**Route:** `/dashboard`
**Access:** Authenticated users only

### Navigation Layout
**Header:**
- Background: gray-900/90 with backdrop-blur-md
- Border-bottom: blue-500/30
- Max-width: 7xl, full-width

**Left Side:**
- TaxiTera logo (h-12)

**Right Side:**
- "Back to Home" link:
  - Icon: Home (w-5 h-5)
  - Text: "Back to Home"
  - Hover: blue-300
  - Links to: /

### Content Hierarchy

#### Page Container
- Background: #1a252f (dark blue-gray)
- Max-width: 6xl
- Padding: px-6 py-8

#### 1. Welcome Message
**UI Elements:**
- Text: "Welcome, {username}!"
- Size: text-3xl
- Color: white
- Margin-bottom: mb-6

#### 2. Search Routes Card
**Container:**
- Background: white/10 with backdrop-blur-xl
- Border: blue-300/40
- Rounded corners: rounded-lg
- Shadow: shadow-2xl
- Overflow: hidden

**Blue Header Bar:**
- Background: gradient from blue-600 to blue-700
- Padding: px-6 py-4
- Contents:
  - Search icon (w-6 h-6, white)
  - Heading: "Search Routes" (text-xl, white)

**Form Section (p-8):**

Grid Layout: 2 columns on desktop (grid md:grid-cols-2)

**From Input (Left Column):**
- Label with icon:
  - MapPin icon (w-5 h-5, blue-400)
  - Text: "From (Origin)" (white)
  - Margin-bottom: mb-3
- Input field:
  - Relative positioning for dropdown icon
  - Full width
  - Padding: px-4 py-3
  - Background: gray-800/70
  - Border: blue-400/40
  - Text: white
  - Placeholder: "Select starting location"
  - ChevronDown icon (absolute right, gray-400)
  - Required

**To Input (Right Column):**
- Label with icon:
  - MapPin icon (w-5 h-5, blue-400)
  - Text: "To (Destination)" (white)
  - Margin-bottom: mb-3
- Input field:
  - Relative positioning for dropdown icon
  - Full width
  - Padding: px-4 py-3
  - Background: gray-800/70
  - Border: blue-400/40
  - Text: white
  - Placeholder: "Select destination"
  - ChevronDown icon (absolute right, gray-400)
  - Required

**Find Routes Button:**
- Full width (w-full)
- Padding: py-4
- Background: Gradient from blue-500 to blue-600
- Text: white
- Rounded corners
- Hover: Gradient from blue-600 to blue-700
- Icon: Search (w-5 h-5)
- Text: "Find Routes"
- Flexbox: items centered with gap-2
- Shadow: shadow-lg

#### 3. Recent Searches Section (Conditional - if searchHistory exists)
**Container:**
- Background: white/10 with backdrop-blur-xl
- Border: blue-300/40
- Rounded corners: rounded-lg
- Padding: p-8
- Margin: mb-6

**Section Header:**
- Flexbox with items-center, gap-2
- Clock icon (w-6 h-6, blue-400)
- Heading: "Recent Searches" (text-2xl, white)
- Margin-bottom: mb-6

**Search History Items (space-y-3):**
Each item is a clickable button:
- Full width
- Background: gray-800/60, hover gray-800/80
- Border: blue-400/30
- Rounded corners
- Padding: p-4
- Layout: Flexbox space-between

**Item Contents:**
- Left side (flex items-center gap-3):
  - Origin name (text-blue-300)
  - ArrowRight icon (w-4 h-4, gray-400)
  - Destination name (text-blue-300)
- Right side:
  - Search icon (w-4 h-4, gray-400, hover blue-400)

**Functionality:**
- Clicking fills form inputs with saved search

#### 4. Popular Routes Section
**Container:**
- Background: white/10 with backdrop-blur-xl
- Border: blue-300/40
- Rounded corners: rounded-lg
- Padding: p-8

**Section Header:**
- Flexbox with items-center, gap-2
- TrendingUp icon (w-6 h-6, blue-400)
- Heading: "Popular Routes" (text-2xl, white)
- Margin-bottom: mb-6

**Route Items (space-y-3):**
Each item is clickable (5 items total):
- Background: gray-800/60, hover gray-800/80
- Border: blue-400/30
- Rounded corners
- Padding: p-5
- Cursor: pointer
- Layout: Flexbox space-between

**Item Contents:**
- Left side (flex items-center gap-3):
  - Origin name (white)
  - ArrowRight icon (w-5 h-5, blue-400)
  - Destination name (white)
- Right side:
  - Popularity badge:
    - "Very Popular": blue-600 background, white text, rounded-full
    - "Popular": blue-400/30 background, blue-200 text, border
    - Padding: px-4 py-1.5
    - Text size: text-sm

**Pre-populated Routes:**
1. Mercato → Bole (Very Popular)
2. Piassa → Megenagna (Popular)
3. Legehar → CMC (Very Popular)
4. Meskel Square → Mexico (Popular)
5. Autobus Tera → Mercato (Very Popular)

**Functionality:**
- Clicking fills form inputs with route locations

---

## Page 5: Guest Search Page (GuestSearchPage.tsx)

**Route:** `/guest-search`
**Access:** Public (no authentication required)

### Navigation Layout
**Header:**
- Background: gray-900/90 with backdrop-blur-md
- Border-bottom: blue-500/30
- Max-width: 7xl, full-width

**Left Side:**
- TaxiTera logo (h-12)

**Right Side (flex items-center gap-4):**
- "Back to Home" link:
  - Icon: Home (w-5 h-5)
  - Text: "Back to Home"
  - Hover: blue-300
  - Links to: /
  
- Login button:
  - Transparent background
  - Border: 2px white
  - Text: white
  - Hover: white background + blue-900 text
  - Padding: px-6 py-2
  - Rounded
  - Links to: /login
  
- Register button:
  - Background: blue-600
  - Text: white
  - Hover: blue-700
  - Padding: px-6 py-2
  - Rounded
  - Links to: /register

### Content Hierarchy

#### Page Container
- Background: #1a252f (dark blue-gray)
- Max-width: 6xl
- Padding: px-6 py-8

#### 1. Welcome Message
**UI Elements:**
- Text: "Welcome to TaxiTera"
- Size: text-3xl
- Color: white
- Margin-bottom: mb-6

#### 2. Search Routes Card
**Container:**
- Background: white/10 with backdrop-blur-xl
- Border: blue-300/40
- Rounded corners: rounded-lg
- Shadow: shadow-2xl
- Overflow: hidden

**Blue Header Bar:**
- Background: gradient from blue-600 to blue-700
- Padding: px-6 py-4
- Contents:
  - Search icon (w-6 h-6, white)
  - Heading: "Search Routes" (text-xl, white)

**Form Section (p-8):**

Grid Layout: 2 columns on desktop (grid md:grid-cols-2)

**From Input (Left Column):**
- Label with icon:
  - MapPin icon (w-5 h-5, blue-400)
  - Text: "From (Origin)" (white)
  - Margin-bottom: mb-3
- Input field:
  - Relative positioning for dropdown icon
  - Full width
  - Padding: px-4 py-3
  - Background: gray-800/70
  - Border: blue-400/40
  - Text: white
  - Placeholder: "Select starting location"
  - ChevronDown icon (absolute right, gray-400)
  - Required

**To Input (Right Column):**
- Label with icon:
  - MapPin icon (w-5 h-5, blue-400)
  - Text: "To (Destination)" (white)
  - Margin-bottom: mb-3
- Input field:
  - Relative positioning for dropdown icon
  - Full width
  - Padding: px-4 py-3
  - Background: gray-800/70
  - Border: blue-400/40
  - Text: white
  - Placeholder: "Select destination"
  - ChevronDown icon (absolute right, gray-400)
  - Required

**Find Routes Button:**
- Full width (w-full)
- Padding: py-4
- Background: Gradient from blue-500 to blue-600
- Text: white
- Rounded corners
- Hover: Gradient from blue-600 to blue-700
- Icon: Search (w-5 h-5)
- Text: "Find Routes"
- Flexbox: items centered with gap-2
- Shadow: shadow-lg

#### 3. Popular Routes Section
**Container:**
- Background: white/10 with backdrop-blur-xl
- Border: blue-300/40
- Rounded corners: rounded-lg
- Padding: p-8

**Section Header:**
- Flexbox with items-center, gap-2
- TrendingUp icon (w-6 h-6, blue-400)
- Heading: "Popular Routes" (text-2xl, white)
- Margin-bottom: mb-6

**Route Items (space-y-3):**
Each item is clickable (5 items total):
- Background: gray-800/60, hover gray-800/80
- Border: blue-400/30
- Rounded corners
- Padding: p-5
- Cursor: pointer
- Layout: Flexbox space-between

**Item Contents:**
- Left side (flex items-center gap-3):
  - Origin name (white)
  - ArrowRight icon (w-5 h-5, blue-400)
  - Destination name (white)
- Right side:
  - Popularity badge:
    - "Very Popular": blue-600 background, white text, rounded-full
    - "Popular": blue-400/30 background, blue-200 text, border
    - Padding: px-4 py-1.5
    - Text size: text-sm

**Pre-populated Routes:**
1. Mercato → Bole (Very Popular)
2. Piassa → Megenagna (Popular)
3. Legehar → CMC (Very Popular)
4. Meskel Square → Mexico (Popular)
5. Autobus Tera → Mercato (Very Popular)

**Functionality:**
- Clicking fills form inputs with route locations

**Differences from Dashboard:**
- No "Recent Searches" section (guests don't have search history)
- Login/Register buttons in header instead of just "Back to Home"
- Generic welcome message instead of personalized greeting
- Passes `isGuest: true` flag when navigating to search results

---

## Page 6: Search Results Page (SearchResultsPage.tsx)

**Route:** `/search-results`
**State Required:** { from, to, isGuest }

### Navigation Layout
**Header:**
- Background: gray-900/90 with backdrop-blur-md
- Border-bottom: blue-500/30
- Max-width: 7xl, full-width

**Left Side:**
- TaxiTera logo (h-12)

**Right Side (flex items-center gap-4):**
- Back button:
  - Icon: ArrowLeft (w-5 h-5)
  - Text: "Back"
  - Hover: blue-300
  - Function: navigate(-1)
  
- Home link:
  - Icon: Home (w-5 h-5)
  - Text: "Home"
  - Hover: blue-300
  - Links to: /
  
- Menu button (hamburger):
  - Icon: Menu (w-6 h-6)
  - Padding: p-2
  - Hover: blue-300
  - Function: Toggles dropdown menu

**Menu Dropdown (when open):**
- Position: Absolute right-0 mt-2
- Width: w-56
- Background: gray-900/95 with backdrop-blur-lg
- Border: blue-500/40
- Rounded corners
- Z-index: z-50

**Menu Items:**
1. Settings button:
   - Settings icon (w-5 h-5)
   - Text: "Settings"
   - Hover: bg-blue-600/50
   - Padding: px-6 py-3

2. Help & Support button:
   - HelpCircle icon (w-5 h-5)
   - Text: "Help & Support"
   - Hover: bg-blue-600/50
   - Padding: px-6 py-3

3. Log Out button (only if not guest):
   - LogOut icon (w-5 h-5)
   - Text: "Log Out"
   - Hover: bg-blue-600/50
   - Padding: px-6 py-3
   - Function: Logs out and redirects to /

### Content Hierarchy

#### Page Container
- Background: #1a252f (dark blue-gray)
- Max-width: 6xl
- Padding: px-6 py-8

#### 1. Page Title
**UI Elements:**
- Text: "Available Routes"
- Size: text-3xl
- Color: white
- Margin-bottom: mb-6

#### 2. Route Info Header
**UI Elements (flex items-center gap-3):**
- MapPin icon (w-6 h-6, blue-400)
- Origin name (text-xl, gray-200)
- ArrowRight icon (w-5 h-5, blue-400)
- Destination name (text-xl, gray-200)
- Margin-bottom: mb-6

#### 3. Routes List (space-y-6)

**Three Route Cards** displayed vertically:

---

**Route Card 1: Best Route**

**Container:**
- Background: white/10 with backdrop-blur-xl
- Border-left: 4px blue-400
- Rounded corners: rounded-lg
- Overflow: hidden
- Hover: white/15 background

**Route Header:**
- Background: Gradient from gray-800/80 to gray-900/80
- Padding: px-6 py-4
- Flexbox: space-between

Left side:
- Star icon (w-5 h-5, yellow-400)
- Heading: "Best Route" (text-xl, white)

Right side:
- Badge: "Option 1"
  - Background: blue-600
  - Text: white
  - Rounded-full
  - Padding: px-4 py-1.5
  - Size: text-sm

**Route Details Section (p-6):**

**From/To Display:**
- Background: gray-800/40
- Rounded corners: rounded-lg
- Padding: p-4
- Layout: Flexbox space-between
- Margin-bottom: mb-6

Contents:
- Left: "From" label (gray-400, text-sm) + origin (white)
- Center: ArrowRight icon (w-6 h-6, blue-400)
- Right: "To" label (gray-400, text-sm) + destination (white, text-right)

**Terminal Info:**
- MapPin icon (w-5 h-5, blue-400)
- Label: "Terminal" (gray-400, text-sm)
- Terminal name (white, text-lg, ml-7)
- Margin-bottom: mb-6

**Stops Along the Way:**
- Label: "Stops along the way:" (gray-400, text-sm, mb-3)
- Pills container (flex gap-3, ml-7):
  - Each stop in a pill:
    - Background: gray-700/50
    - Text: gray-200
    - Rounded-full
    - Padding: px-4 py-1.5
    - Size: text-sm
    - Border: gray-600/50
- Example stops: "Piassa", "Kazanchis"
- Margin-bottom: mb-6

**Route Stats Grid (3 columns):**
Grid layout: grid-cols-3 gap-4, mb-6

Column 1 - Duration:
- Background: gray-800/40
- Rounded corners
- Padding: p-4
- Clock icon (w-4 h-4, blue-400)
- Label: "Duration" (gray-400, text-sm)
- Value: "25-30 min" (white)

Column 2 - Distance:
- Background: gray-800/40
- Rounded corners
- Padding: p-4
- Navigation icon (w-4 h-4, blue-400)
- Label: "Distance" (gray-400, text-sm)
- Value: "8.5 km" (white)

Column 3 - Frequency:
- Background: gray-800/40
- Rounded corners
- Padding: p-4
- Clock icon (w-4 h-4, blue-400)
- Label: "Frequency" (gray-400, text-sm)
- Value: "Every 5 min" (white)

**View on Map Button:**
- Full width (w-full)
- Padding: py-3
- Background: Gradient from blue-600 to blue-700
- Text: white
- Rounded corners
- Hover: Gradient from blue-700 to blue-800
- Flexbox: items centered gap-2
- Icon: ArrowRight (w-5 h-5)
- Text: "View on Map"
- Function: Navigates to /map with route data

---

**Route Card 2: Nearest Terminal**

Same structure as Card 1, with these differences:

**Route Header:**
- Icon: Navigation icon (w-5 h-5, green-400)
- Heading: "Nearest Terminal"
- Badge: "Option 2"

**Route Details:**
- Stops: "Central Hub", "Mexico"
- Duration: "20-25 min"
- Distance: "7.2 km"
- Frequency: "Every 8 min"

---

**Route Card 3: Fastest Route**

Same structure as Card 1, with these differences:

**Route Header:**
- Icon: Clock icon (w-5 h-5, blue-400)
- Heading: "Fastest Route"
- Badge: "Option 3"

**Route Details:**
- Terminal: "{from} Express Terminal"
- Stops: None (no stops section displayed)
- Duration: "15-20 min"
- Distance: "6.8 km"
- Frequency: "Every 10 min"

---

**Functionality:**
- All route data is dynamically generated based on from/to parameters
- Clicking any "View on Map" button navigates to /map with route details
- Menu dropdown can be toggled on/off
- Back button returns to previous page (Dashboard or Guest Search)

---

## Page 7: Map Page (MapPage.tsx)

**Route:** `/map`
**State Required:** { route, from, to, isGuest }

### Navigation Layout
**Header:**
- Background: gray-900/90 with backdrop-blur-md
- Border-bottom: blue-500/30
- Max-width: 7xl, full-width

**Left Side:**
- TaxiTera logo (h-12)

**Right Side (flex items-center gap-4):**
- Back button:
  - Icon: ArrowLeft (w-5 h-5)
  - Text: "Back"
  - Hover: blue-300
  - Function: navigate(-1)
  
- Home link:
  - Icon: Home (w-5 h-5)
  - Text: "Home"
  - Hover: blue-300
  - Links to: /

### Content Hierarchy

#### Page Container
- Background: #1a252f (dark blue-gray)
- Max-width: 6xl
- Padding: px-6 py-8

#### 1. Page Title
**UI Elements:**
- Text: "{route.type}: {from} to {to}"
- Example: "Best Route: Mercato to Bole"
- Size: text-3xl
- Color: white
- Margin-bottom: mb-6

#### 2. Map Display Card
**Container:**
- Background: white/10 with backdrop-blur-xl
- Border: blue-300/40
- Rounded corners: rounded-lg
- Height: h-96 (384px)
- Position: relative
- Overflow: hidden
- Margin-bottom: mb-6

**Map Image:**
- Full width and height
- Object-fit: cover
- Rounded corners: rounded-lg
- Background image: Map view of Addis Ababa

**Overlay:**
- Position: absolute inset-0
- Background: black/20
- Flexbox: items centered, justify centered

**Overlay Info Box:**
- Background: gray-900/90 with backdrop-blur-md
- Padding: px-6 py-4
- Border: blue-400/50
- Rounded corners
- Text: "Route: {from} to {to}" (white, text-xl)

#### 3. Route Details Card
**Container:**
- Background: white/10 with backdrop-blur-xl
- Border: blue-300/40
- Rounded corners: rounded-lg
- Padding: p-8

**Section Title:**
- Text: "Route Details"
- Size: text-3xl
- Color: white
- Margin-bottom: mb-6

**Stats Grid (3 columns):**
Grid layout: grid md:grid-cols-3 gap-6, mb-8

**Column 1 - Duration:**
- Background: gray-800/60
- Border: blue-400/30
- Rounded corners: rounded-lg
- Padding: p-6

Header:
- Clock icon (w-6 h-6, green-400)
- Heading: "Duration" (text-xl, white)
- Flexbox: items-center gap-3
- Margin-bottom: mb-3

Value:
- Size: text-3xl
- Color: green-300
- Example: "25-30 min"

**Column 2 - Distance:**
- Background: gray-800/60
- Border: blue-400/30
- Rounded corners: rounded-lg
- Padding: p-6

Header:
- MapPin icon (w-6 h-6, blue-400)
- Heading: "Distance" (text-xl, white)
- Flexbox: items-center gap-3
- Margin-bottom: mb-3

Value:
- Size: text-3xl
- Color: blue-300
- Example: "8.5 km"

**Column 3 - Frequency:**
- Background: gray-800/60
- Border: blue-400/30
- Rounded corners: rounded-lg
- Padding: p-6

Header:
- Navigation icon (w-6 h-6, yellow-400)
- Heading: "Frequency" (text-xl, white)
- Flexbox: items-center gap-3
- Margin-bottom: mb-3

Value:
- Size: text-3xl
- Color: yellow-300
- Example: "Every 5 min" or "N/A"

#### 4. Terminal Information Card
**Container:**
- Background: gray-800/60
- Border: blue-400/30
- Rounded corners: rounded-lg
- Padding: p-6

**Section Title:**
- Text: "Route Information"
- Size: text-2xl
- Color: white
- Margin-bottom: mb-4

**Main Terminal Info:**
- Icon: MapPin (w-5 h-5, blue-400)
- Label: "Terminal" (gray-400)
- Flexbox: items-center gap-2
- Margin-bottom: mb-2

Terminal Name:
- Size: text-xl
- Color: white
- Left margin: ml-7
- Example: "Mercato Terminal"
- Container margin-bottom: mb-6

**Stops Along the Way (Conditional - if stops exist):**

Label:
- Text: "Stops along the way:"
- Color: gray-400
- Margin-bottom: mb-3

**Stops List (space-y-3):**
Each stop displayed in a vertical timeline:

Stop Item:
- Flexbox: items-start gap-4
- Left margin: ml-7

Timeline Indicator (left side):
- Flexbox column: items-center
- Circle:
  - Size: w-8 h-8
  - Rounded-full
  - Background: blue-500
  - White text
  - Centered number (stop index + 1)
- Connector line (if not last stop):
  - Width: w-1
  - Height: h-8
  - Background: blue-500/30

Stop Name (right side):
- Text size: text-lg
- Color: white
- Padding-bottom: pb-2
- Example: "Piassa", "Kazanchis"

**Functionality:**
- Displays detailed information for selected route
- Shows visual map representation
- Lists all stops in order
- Back button returns to search results page
- If no route data provided, automatically redirects back

---

## Navigation Flow Summary

**User Journey - Authenticated User:**
1. Landing Page (/) → Login (/login) → Dashboard (/dashboard)
2. Dashboard → Search Results (/search-results) → Map (/map)
3. Any page → Back to Home (/)

**User Journey - Guest User:**
1. Landing Page (/) → Guest Search (/guest-search)
2. Guest Search → Search Results (/search-results) → Map (/map)
3. Any page → Back to Home (/)
4. Guest can access Login/Register from Guest Search page

**User Journey - New User:**
1. Landing Page (/) → Register (/register) → Login (/login) → Dashboard (/dashboard)

**Common Navigation Elements:**
- All routing pages have TaxiTera logo in header (links to home on landing page)
- Auth pages have X button → Home
- Search/Results/Map pages have Back button, Home link, and optional menu
- Consistent color scheme and styling across all pages

---

## Responsive Design Notes

**Mobile Breakpoints:**
- Hero text reduces in size
- Grid layouts stack vertically (grid becomes single column)
- Problem sections stack image above text
- How It Works section stacks 4 cards vertically
- Dashboard/Search page inputs stack vertically
- Popular routes remain full-width stacked
- Header navigation may collapse or wrap
- Map remains full-width with reduced height on small screens

**Desktop Optimizations:**
- Max-width containers (6xl, 7xl) center content
- Multi-column grids for forms and stats
- Side-by-side layouts for problem sections with staggered positioning
- Larger font sizes and spacing
- Fixed background images create parallax effect
- Smooth scroll animations trigger on viewport entry

---

## Interactive Elements Summary

**Buttons:**
- Get Started (Landing) → /guest-search
- Login/Register (Headers) → /login, /register
- Back buttons → navigate(-1)
- Home buttons → /
- Find Routes → /search-results with state
- View on Map → /map with route data
- Popular route cards → Fill form inputs
- Recent search items → Fill form inputs
- Menu dropdown toggle
- Log Out → Clears auth + redirect to /

**Forms:**
- Login form → Dashboard on success
- Register form → Login page on success
- Search forms → Search Results with from/to/isGuest state

**Animations:**
- Hero section: Fade in + slide up (duration: 0.8s)
- Problem sections: Fade in + slide from sides (duration: 0.8s, delay: 0.2s)
- How It Works cards: Staggered fade in (delay: 0.1s increments)
- CTA section: Fade in + slide up
- All scroll-triggered (whileInView with viewport: once: true)
- Button hover: Scale 105%, color transition
- Link hover: Color change to blue-300/blue-400

**State Management:**
- AuthContext: user, login, register, logout, searchHistory
- React Router state: from, to, isGuest, route data
- Toast notifications: Success/error messages
- Form validation: Required fields
- Conditional rendering: Recent searches, guest buttons, log out option

---

## Asset Requirements

**Images Used:**
1. Hero background: Night city/taxi scene
2. Problem section 1: Night city street
3. Problem section 2: Taxi terminal
4. Problem section 3: Traffic/queue scene
5. Auth pages background: Night taxi road
6. Map page: Map view of Addis Ababa
7. TaxiTera logo: PNG format (h-12 size)

**Icons Library:**
lucide-react icons used throughout:
- MapPin, Clock, Navigation, Map, Shield
- Home, Search, TrendingUp, UserPlus
- ArrowLeft, ArrowRight, ArrowDown, ChevronDown
- Menu, Settings, HelpCircle, LogOut
- Star, X

**Color Palette Reference:**
- Primary: blue-600 (#2563eb), blue-700 (#1d4ed8)
- Background: #1a252f, gray-900 (#111827), gray-800 (#1f2937)
- Accents: blue-400 (#60a5fa), blue-500 (#3b82f6)
- Text: white (#ffffff), gray-200 (#e5e7eb), gray-300 (#d1d5db), gray-400 (#9ca3af)
- Success: green-300 (#86efac), green-400 (#4ade80)
- Warning: yellow-300 (#fde047), yellow-400 (#facc15)
- Error: (not currently used, but toast system supports)
