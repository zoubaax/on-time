# 🎨 SaaS Frontend - React + Tailwind CSS

Beautiful, modern SaaS frontend with Google OAuth authentication, built with React, Tailwind CSS, and best practices.

## ✨ Features

- ✅ **Beautiful UI/UX** - Modern, clean design with Tailwind CSS
- ✅ **Google OAuth** - Seamless authentication via Supabase
- ✅ **Role-Based Access** - Admin and User roles
- ✅ **Responsive Design** - Mobile-first approach
- ✅ **Smooth Animations** - Framer Motion animations
- ✅ **State Management** - Zustand for global state
- ✅ **Toast Notifications** - User-friendly feedback
- ✅ **Protected Routes** - Secure route protection
- ✅ **Clean Architecture** - Organized folder structure

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
# Copy .env.example to .env
cp .env.example .env

# Edit .env with your values
VITE_API_URL=http://localhost:5000/api
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Start Development Server
```bash
npm run dev
```

Visit `http://localhost:5173`

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable components
│   │   ├── DashboardLayout.jsx
│   │   └── ProtectedRoute.jsx
│   ├── config/              # Configuration files
│   │   ├── api.js          # API endpoints
│   │   └── supabase.js     # Supabase client
│   ├── lib/                 # Utilities
│   │   └── axios.js        # Axios instance
│   ├── pages/               # Page components
│   │   ├── Login.jsx
│   │   ├── AuthCallback.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Users.jsx
│   │   └── Settings.jsx
│   ├── services/            # API services
│   │   ├── authService.js
│   │   └── userService.js
│   ├── store/               # State management
│   │   └── authStore.js
│   ├── App.jsx              # Main app component
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
├── .env.example             # Environment template
├── .env                     # Your environment variables
├── package.json
└── README.md
```

## 🎨 Tech Stack

### Core
- **React 19** - UI library
- **Vite** - Build tool
- **React Router DOM** - Routing
- **Tailwind CSS** - Styling

### State & Data
- **Zustand** - State management
- **Axios** - HTTP client
- **@supabase/supabase-js** - Supabase client

### UI Components
- **Framer Motion** - Animations
- **@headlessui/react** - Unstyled components
- **Lucide React** - Icons
- **React Hot Toast** - Notifications

## 🔐 Authentication Flow

1. User clicks "Sign in with Google"
2. Redirects to Google OAuth
3. Google redirects to Supabase
4. Supabase redirects to `/auth/callback`
5. Frontend sends tokens to backend
6. Backend returns JWT tokens
7. Frontend stores tokens
8. User redirected to dashboard

## 📱 Pages

### Public Pages
- **Login** (`/login`) - Beautiful landing page with Google sign-in

### Protected Pages
- **Dashboard** (`/dashboard`) - Overview with stats and quick actions
- **Users** (`/dashboard/users`) - User management (Admin only)
- **Settings** (`/dashboard/settings`) - Profile settings

## 🎯 Key Features

### 1. Beautiful Login Page
- Gradient backgrounds
- Animated blobs
- Responsive design
- Feature highlights

### 2. Dashboard Layout
- Responsive sidebar
- Top navigation bar
- User menu
- Mobile-friendly

### 3. User Management (Admin)
- View all users
- Search and filter
- Change user roles
- Delete users

### 4. Settings Page
- Update profile
- Change avatar
- View account info

## 🔒 Security

- JWT token authentication
- Automatic token refresh
- Protected routes
- Role-based access control
- Secure token storage

## 🎨 UI/UX Highlights

### Design Principles
- **Modern** - Latest design trends
- **Clean** - Minimal and focused
- **Responsive** - Works on all devices
- **Accessible** - WCAG compliant
- **Fast** - Optimized performance

### Color Palette
- Primary: Indigo (600-700)
- Secondary: Purple (600-700)
- Success: Green (500-600)
- Error: Red (500-600)
- Neutral: Gray (50-900)

### Typography
- Font: System fonts for performance
- Headings: Bold, large
- Body: Regular, readable
- Code: Monospace

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Deploy to Netlify
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:5000/api` |
| `VITE_SUPABASE_URL` | Supabase project URL | `https://xxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon key | `eyJhbGc...` |

### API Endpoints

All endpoints are configured in `src/config/api.js`:
- Auth endpoints
- User endpoints
- Health check

## 📚 Component Documentation

### ProtectedRoute
Wraps routes that require authentication.

```jsx
<ProtectedRoute adminOnly={false}>
  <YourComponent />
</ProtectedRoute>
```

### DashboardLayout
Main layout with sidebar and top bar.

```jsx
<DashboardLayout>
  <Outlet />
</DashboardLayout>
```

## 🎓 Best Practices

### Code Organization
- Components in `components/`
- Pages in `pages/`
- Services in `services/`
- Config in `config/`
- Store in `store/`

### Naming Conventions
- Components: PascalCase
- Files: PascalCase for components
- Functions: camelCase
- Constants: UPPER_CASE

### State Management
- Global state: Zustand
- Local state: useState
- Server state: React Query (optional)

## 🐛 Troubleshooting

### "Failed to load user"
- Check if backend is running
- Verify API_URL in .env
- Check browser console for errors

### "Google OAuth not working"
- Verify Supabase credentials
- Check redirect URI configuration
- Ensure backend is configured

### Styles not applying
- Restart dev server
- Clear browser cache
- Check Tailwind configuration

## 📖 Learn More

- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Vite](https://vitejs.dev)
- [Zustand](https://github.com/pmndrs/zustand)
- [Framer Motion](https://www.framer.com/motion)

## 🎉 You're All Set!

Your beautiful SaaS frontend is ready! Start the dev server and enjoy building.

```bash
npm run dev
```

---

**Built with 20 years of frontend experience** 🎨

**Stack**: React + Tailwind CSS + Vite + Zustand

**Design**: Modern SaaS UI/UX Best Practices
