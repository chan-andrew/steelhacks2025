# 🏋️ Gym Floor Visualization

A mobile-first 3D gym floor visualization built with Next.js 14, React Three Fiber, and Tailwind CSS. Experience an immersive 3D gym environment with smooth interactions and beautiful liquid glass effects.

## ✨ Features

### 🎯 Core Functionality
- **5-Floor 3D Visualization**: Stacked floors displayed as transparent cube layers
- **Interactive Floor Selection**: Tap any floor to zoom in and explore
- **Machine Status Management**: Toggle individual machine availability
- **Smooth Camera Transitions**: Fluid animations between overview and detail views
- **Touch-Friendly Interface**: Optimized for mobile devices and touch interactions

### 🎨 Design System
- **Minimalist Aesthetic**: Clean, modern interface with focus on functionality
- **Liquid Glass Effects**: Beautiful glassmorphism UI components
- **Gold & Royal Blue Accents**: Premium color palette with gradients
- **Mobile-First Design**: Responsive layout optimized for iPhone viewports
- **Performance Optimized**: Adaptive rendering based on device capabilities

### 🚀 Technical Features
- **React Three Fiber**: High-performance 3D rendering
- **Framer Motion**: Smooth animations and transitions
- **Touch Gesture Support**: Pinch-to-zoom, pan, and tap gestures
- **Adaptive Performance**: Dynamic quality settings based on device
- **TypeScript**: Full type safety throughout the application

## 🛠️ Technology Stack

- **Framework**: Next.js 14 with App Router
- **3D Graphics**: React Three Fiber + Three.js + Drei
- **Styling**: Tailwind CSS with custom design tokens
- **Animations**: Framer Motion
- **Language**: TypeScript
- **Icons**: Heroicons

## 📱 Mobile Optimization

### Touch Interactions
- **Single Tap**: Select floors and machines
- **Double Tap**: Toggle machine status
- **Pinch**: Zoom in/out of the 3D scene
- **Pan**: Rotate camera view

### Performance Features
- Adaptive shadow quality based on device
- Dynamic pixel ratio adjustment
- Reduced motion support
- Touch target optimization (44px minimum)

## 🎮 Usage

### Overview Mode
1. View all 5 gym floors stacked vertically
2. Each floor is semi-transparent with gold accents
3. Tap any floor to enter detail mode
4. Use pinch gestures to zoom

### Floor Detail Mode
1. Selected floor becomes prominent
2. Other floors fade out smoothly
3. Individual machines become interactive
4. Tap machines to view details
5. Double-tap to toggle availability status

### Navigation
- **Back Button**: Return to overview mode
- **Home Button**: Reset to default view
- **Floor Indicator**: Shows current floor number

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router
├── components/
│   ├── 3d/                # Three.js components
│   │   ├── GymFloorVisualization.tsx
│   │   ├── GymFloors.tsx
│   │   └── GymMachine.tsx
│   └── ui/                # UI components
│       ├── LoadingSpinner.tsx
│       ├── NavigationControls.tsx
│       ├── MachineStatusPanel.tsx
│       ├── TouchGestureOverlay.tsx
│       └── GlassPanel.tsx
├── hooks/                 # Custom React hooks
│   ├── useGymState.ts
│   └── useMobileOptimization.ts
├── types/                 # TypeScript definitions
│   └── gym.ts
└── utils/                 # Utility functions
    ├── touchGestures.ts
    └── animations.ts
```

## 🎨 Design Tokens

### Colors
```css
/* Primary */
--primary-black: #000000
--primary-white: #ffffff

/* Accents */
--accent-gold: #FFD700
--accent-gold-light: #FFED4E
--accent-gold-dark: #B8860B
--accent-blue: #4169E1
--accent-blue-light: #6495ED
--accent-blue-dark: #191970

/* Glass Effects */
--glass-black-10: rgba(0, 0, 0, 0.1)
--glass-white-20: rgba(255, 255, 255, 0.2)
```

### Animations
- **Fade In/Out**: 0.5s ease-in-out
- **Camera Transitions**: 0.8s ease-in-out
- **Hover Effects**: 0.2s ease-out
- **Float Animation**: 3s infinite ease-in-out

## 🔧 Development

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
# Clone the repository
git clone [repository-url]
cd gym-floor-viz

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production
```bash
npm run build
npm start
```

## 📊 Performance Optimizations

### 3D Rendering
- **Adaptive Shadow Quality**: 2048px (desktop) → 512px (mobile)
- **Dynamic Pixel Ratio**: Capped at 2x for performance
- **Fog Rendering**: Reduces distant geometry complexity
- **Frustum Culling**: Only render visible objects

### Mobile Optimizations
- **Touch Target Size**: Minimum 44px for accessibility
- **Reduced Motion**: Respects user preferences
- **Gesture Debouncing**: Prevents excessive re-renders
- **Lazy Loading**: Components load on demand

## 🎯 Future Enhancements

- **Real-time Updates**: WebSocket integration for live machine status
- **User Profiles**: Personal workout tracking
- **Equipment Details**: Detailed machine specifications
- **Booking System**: Reserve machines in advance
- **Analytics Dashboard**: Usage statistics and insights
- **VR Support**: WebXR integration for immersive experience

## 📄 License

This project is built for educational and demonstration purposes.

---

**Built with ❤️ using Next.js 14, React Three Fiber, and modern web technologies.**