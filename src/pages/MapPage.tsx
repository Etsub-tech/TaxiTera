import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ArrowLeft, MapPin, Clock, Navigation, DollarSign, Moon, Sun, User, History as HistoryIcon, LogOut, ChevronDown, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { toast } from 'sonner';
import logoImage from 'figma:asset/5915e0617cff13c3e21f224b1e9a79ae0981b769.png';

interface RouteOption {
  id: number;
  type: string;
  terminal: string;
  lat: number;
  lng: number;
  stops: string[];
  duration: string;
  distance: string;
  estimatedMoney: string;
}

export default function MapPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [locationPermission, setLocationPermission] = useState<'pending' | 'granted' | 'denied'>('pending');
  const [route, setRoute] = useState<RouteOption | null>(null);

  const { route: passedRoute, isGuest } = location.state || {};

  // Fetch route info from backend
  useEffect(() => {
    if (!passedRoute) {
      navigate(-1);
      return;
    }
    const fetchRoute = async () => {
      try {
        const res = await fetch(`https://your-backend.com/api/routes/${passedRoute.id}`);
        if (!res.ok) throw new Error('Failed to fetch route info');
        const data: RouteOption = await res.json();
        setRoute(data);
      } catch (err: any) {
        toast.error(err.message);
      }
    };
    fetchRoute();
  }, [passedRoute, navigate]);

  // Request user location
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      setLocationPermission('denied');
      toast.error('Geolocation is not supported');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
        setLocationPermission('granted');
        toast.success(`Location accessed: ${position.coords.latitude}, ${position.coords.longitude}`);
      },
      (err) => {
        setLocationPermission('denied');
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setLocationError('Location access denied');
            toast.error('Location access denied');
            break;
          case err.POSITION_UNAVAILABLE:
            setLocationError('Location unavailable');
            toast.error('Location unavailable');
            break;
          case err.TIMEOUT:
            setLocationError('Location request timed out');
            toast.error('Location request timed out');
            break;
          default:
            setLocationError('Unknown location error');
            toast.error('Unknown location error');
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  const handleLogout = () => {
    logout();
    setProfileMenuOpen(false);
    navigate('/');
  };

  if (!route) return null;

  // Google Maps URL with directions
  const mapSrc = userLocation
    ? `https://www.google.com/maps/embed/v1/directions?key=YOUR_GOOGLE_MAPS_API_KEY&origin=${userLocation.lat},${userLocation.lng}&destination=${route.lat},${route.lng}&mode=driving`
    : `https://www.google.com/maps?q=${route.lat},${route.lng}&z=15&output=embed`;

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-[#1a252f]' : 'bg-gray-50'}`}>
      {/* Header */}
      <header className={`${isDarkMode ? 'bg-gray-900/90' : 'bg-white'} backdrop-blur-md border-b ${isDarkMode ? 'border-blue-500/30' : 'border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/"><img src={logoImage} alt="TaxiTera Logo" className="h-12 w-auto cursor-pointer" /></Link>
          <div className="flex items-center gap-4">
            <button onClick={toggleTheme} className={`p-2 rounded-full ${isDarkMode ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-800/10 hover:bg-gray-800/20'}`}>
              {isDarkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-blue-600" />}
            </button>
            {user && !isGuest ? (
              <div className="relative">
                <button onClick={() => setProfileMenuOpen(!profileMenuOpen)} className={`flex items-center gap-2 px-4 py-2 rounded ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-700 hover:bg-blue-800'} text-white`}>
                  <User className="w-5 h-5" /><span>{user.username}</span><ChevronDown className="w-4 h-4" />
                </button>
                {profileMenuOpen && (
                  <div className={`absolute right-0 mt-2 w-56 ${isDarkMode ? 'bg-gray-900/95' : 'bg-white'} border rounded shadow-xl`}>
                    <Link to="/profile" onClick={() => setProfileMenuOpen(false)} className="flex items-center gap-3 px-6 py-3">View Profile</Link>
                    <Link to="/history" onClick={() => setProfileMenuOpen(false)} className="flex items-center gap-3 px-6 py-3">History</Link>
                    <button onClick={handleLogout} className="flex items-center gap-3 px-6 py-3">Log Out</button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex gap-4">
                <Link to="/login"><button className="px-6 py-2 border-2">Login</button></Link>
                <Link to="/register"><button className="px-6 py-2 bg-blue-700 text-white">Register</button></Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <h1 className={`text-3xl mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{route.type}: {route.terminal}</h1>

        {/* Map */}
        <div className="w-full h-96 rounded-lg overflow-hidden border mb-8">
          <iframe
            title="Map Directions"
            width="100%"
            height="100%"
            src={mapSrc}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        {/* Route Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div className="p-6 rounded-lg bg-gray-50">{/* Duration */}<Clock />{route.duration}</div>
          <div className="p-6 rounded-lg bg-gray-50">{/* Distance */}<MapPin />{route.distance}</div>
          {user && !isGuest && <div className="p-6 rounded-lg bg-gray-50">{/* Money */}<DollarSign />{route.estimatedMoney}</div>}
        </div>
      </div>
    </div>
  );
}
