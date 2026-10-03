import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ArrowLeft, MapPin, Clock, Navigation, DollarSign, Moon, Sun, User, History as HistoryIcon, LogOut, ChevronDown, AlertCircle, MapPin as MapPinned } from 'lucide-react';
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

interface MapData {
  userLocation: { lat: number; lng: number };
  terminalLocation: { lat: number; lng: number };
  destination: string;
  route?: RouteOption;
  fromName?: string;
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
  const [mapData, setMapData] = useState<MapData | null>(null);
  const [route, setRoute] = useState<RouteOption | null>(null);

  // Read map data from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('mapData');
      if (stored) {
        const parsed: MapData = JSON.parse(stored);
        setMapData(parsed);
        if (parsed.route) {
          setRoute(parsed.route);
        }
        // Use stored user location
        if (parsed.userLocation) {
          setUserLocation(parsed.userLocation);
          setLocationPermission('granted');
        }
      } else {
        // Fallback to navigation state for backward compatibility
        const navState = location.state || {};
        if (navState.route) {
          setRoute(navState.route);
          if (navState.fromCoords) {
            setUserLocation({ lat: navState.fromCoords.latitude, lng: navState.fromCoords.longitude });
            setLocationPermission('granted');
          }
          // Create mapData from navState
          setMapData({
            userLocation: navState.fromCoords ? { lat: navState.fromCoords.latitude, lng: navState.fromCoords.longitude } : { lat: 0, lng: 0 },
            terminalLocation: navState.route.lat && navState.route.lng ? { lat: navState.route.lat, lng: navState.route.lng } : { lat: 0, lng: 0 },
            destination: navState.to || '',
            route: navState.route,
            fromName: navState.from
          });
        } else {
          // Try old localStorage key for backward compatibility
          const oldRoute = localStorage.getItem('lastRoute');
          if (oldRoute) {
            const parsed = JSON.parse(oldRoute);
            if (parsed.route) {
              setRoute(parsed.route);
              if (parsed.fromCoords) {
                setUserLocation({ lat: parsed.fromCoords.latitude, lng: parsed.fromCoords.longitude });
                setLocationPermission('granted');
              }
              setMapData({
                userLocation: parsed.fromCoords ? { lat: parsed.fromCoords.latitude, lng: parsed.fromCoords.longitude } : { lat: 0, lng: 0 },
                terminalLocation: parsed.route.lat && parsed.route.lng ? { lat: parsed.route.lat, lng: parsed.route.lng } : { lat: 0, lng: 0 },
                destination: parsed.to || '',
                route: parsed.route,
                fromName: parsed.from
              });
            }
          }
        }
      }
    } catch (e) {
      console.error('Failed to read map data from localStorage', e);
    }
  }, [location.state]);

  // Request user location only if not already set from localStorage
  useEffect(() => {
    if (!userLocation && locationPermission !== 'granted') {
      requestUserLocation();
    }
  }, []);

  const requestUserLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      setLocationPermission('denied');
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    setLocationPermission('pending');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        setLocationPermission('granted');
        setLocationError(null);
        // Update mapData with new location
        if (mapData) {
          const updated = { ...mapData, userLocation: { lat: latitude, lng: longitude } };
          setMapData(updated);
          localStorage.setItem('mapData', JSON.stringify(updated));
        }
      },
      (error) => {
        setLocationPermission('denied');
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError('Location access denied. Please enable location permissions in your browser.');
            toast.error('Location access denied');
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError('Location information unavailable');
            toast.error('Location information unavailable');
            break;
          case error.TIMEOUT:
            setLocationError('Location request timed out');
            toast.error('Location request timed out');
            break;
          default:
            setLocationError('An unknown error occurred while accessing location');
            toast.error('Failed to access location');
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const handleLogout = () => {
    logout();
    setProfileMenuOpen(false);
    navigate('/');
  };

  // Show friendly error message if no route data is available
  if (!route || !mapData) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
        {/* Header */}
        <header className={`${isDarkMode ? 'bg-gray-900/90' : 'bg-white'} backdrop-blur-md border-b ${isDarkMode ? 'border-blue-500/30' : 'border-gray-200'}`}>
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link to="/"><img src={logoImage} alt="TaxiTera Logo" className="h-12 w-auto cursor-pointer" /></Link>
            <div className="flex items-center gap-4">
              <button onClick={toggleTheme} className={`p-2 rounded-full ${isDarkMode ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-800/10 hover:bg-gray-800/20'}`}>
                {isDarkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-blue-600" />}
              </button>
              {user ? (
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
          <div className={`${isDarkMode ? 'bg-red-500/10 border-red-400/40' : 'bg-red-50 border-red-200'} border rounded-lg p-8 text-center`}>
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h1 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Missing map data
            </h1>
            <p className={`text-lg mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Please search for routes again to view map.
            </p>
            <div className="flex gap-4 justify-center">
              <Link 
                to={user ? "/dashboard" : "/guest-search"}
                className={`px-6 py-3 ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-700 hover:bg-blue-800'} text-white rounded transition-colors`}
              >
                Search for Routes
              </Link>
              <Link 
                to="/"
                className={`px-6 py-2 border-2 ${isDarkMode ? 'border-white text-white hover:bg-white hover:text-blue-900' : 'border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white'} rounded transition-colors`}
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Build iframe src
  const terminalLoc = mapData.terminalLocation;
  const userLoc = userLocation || mapData.userLocation;
  
  const mapSrc = userLoc && terminalLoc.lat && terminalLoc.lng
    ? `https://www.google.com/maps/embed/v1/directions?key=AIzaSyDfW7TSwgImAK2ZtpKAa45LKH1mufZqFOw&origin=${userLoc.lat},${userLoc.lng}&destination=${terminalLoc.lat},${terminalLoc.lng}&mode=driving`
    : terminalLoc.lat && terminalLoc.lng
      ? `https://www.google.com/maps/embed/v1/view?key=AIzaSyDfW7TSwgImAK2ZtpKAa45LKH1mufZqFOw&center=${terminalLoc.lat},${terminalLoc.lng}&zoom=15&maptype=roadmap`
      : `https://www.google.com/maps/embed/v1/place?key=AIzaSyDfW7TSwgImAK2ZtpKAa45LKH1mufZqFOw&q=${encodeURIComponent(route.terminal || mapData.destination || 'Addis Ababa')}&zoom=13`;

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
      {/* Header */}
      <header className={`${isDarkMode ? 'bg-gray-900/90' : 'bg-white'} backdrop-blur-md border-b ${isDarkMode ? 'border-blue-500/30' : 'border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/"><img src={logoImage} alt="TaxiTera Logo" className="h-12 w-auto cursor-pointer" /></Link>
          <div className="flex items-center gap-4">
            <button onClick={toggleTheme} className={`p-2 rounded-full ${isDarkMode ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-800/10 hover:bg-gray-800/20'}`}>
              {isDarkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-blue-600" />}
            </button>
            {user ? (
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
        <h1 className={`text-3xl mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          {route.type || 'Route'}: {mapData.fromName || 'Current Location'} → {mapData.destination}
        </h1>

        {/* Location Status Banners */}
        {locationPermission === 'pending' && (
          <div className={`mb-6 p-4 ${isDarkMode ? 'bg-blue-500/10 border-blue-400/40' : 'bg-blue-50 border-blue-200'} border rounded-lg flex items-center gap-3`}>
            <MapPinned className="w-5 h-5 text-blue-400 animate-pulse" />
            <p className={isDarkMode ? 'text-blue-300' : 'text-blue-700'}>Requesting location access...</p>
          </div>
        )}

        {locationPermission === 'granted' && userLoc && (
          <div className={`mb-6 p-4 ${isDarkMode ? 'bg-green-500/10 border-green-400/40' : 'bg-green-50 border-green-200'} border rounded-lg flex items-center gap-3`}>
            <MapPinned className="w-5 h-5 text-green-400" />
            <div>
              <p className={isDarkMode ? 'text-green-300' : 'text-green-700'}>Location access granted</p>
              <p className={`text-sm ${isDarkMode ? 'text-green-400/70' : 'text-green-600/70'}`}>Latitude: {userLoc.lat.toFixed(4)}, Longitude: {userLoc.lng.toFixed(4)}</p>
            </div>
          </div>
        )}

        {locationPermission === 'denied' && locationError && (
          <div className={`mb-6 p-4 ${isDarkMode ? 'bg-red-500/10 border-red-400/40' : 'bg-red-50 border-red-200'} border rounded-lg`}>
            <div className="flex items-start gap-3 mb-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className={`${isDarkMode ? 'text-red-300' : 'text-red-700'} mb-2`}>{locationError}</p>
                <button onClick={requestUserLocation} className={`px-4 py-2 ${isDarkMode ? 'bg-red-500/20 hover:bg-red-500/30' : 'bg-red-100 hover:bg-red-200'} ${isDarkMode ? 'text-red-300' : 'text-red-700'} rounded transition-colors text-sm flex items-center gap-2`}>
                  <MapPinned className="w-4 h-4" /> Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Embedded Map */}
        <div className="w-full h-96 rounded-lg overflow-hidden border mb-8">
          <iframe title="Addis Ababa Map" width="100%" height="100%" loading="lazy" allowFullScreen referrerPolicy="no-referrer-when-downgrade" src={mapSrc} />
        </div>

        {/* Route Details */}
        <div className={`${isDarkMode ? 'bg-white/10 border-blue-300/40' : 'bg-white border-gray-200'} backdrop-blur-xl border rounded-lg p-8`}>
          <h2 className={`text-3xl mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Route Details</h2>
          <div className={`grid ${user && !route?.isGuest ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-6 mb-8`}>
            <div className={`${isDarkMode ? 'bg-gray-800/60 border-blue-400/30' : 'bg-gray-50 border-gray-200'} border rounded-lg p-6`}> 
              <div className="flex items-center gap-3 mb-3"><Clock className="w-6 h-6 text-green-400" /><h3 className={`text-xl ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Duration</h3></div>
              <p className="text-3xl text-green-300">{route.duration || route.estimatedTime || '—'}</p>
            </div>
            <div className={`${isDarkMode ? 'bg-gray-800/60 border-blue-400/30' : 'bg-gray-50 border-gray-200'} border rounded-lg p-6`}> 
              <div className="flex items-center gap-3 mb-3"><MapPin className="w-6 h-6 text-blue-400" /><h3 className={`text-xl ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Distance</h3></div>
              <p className="text-3xl text-blue-300">{route.distance || '—'}</p>
            </div>
            {user && (
              <div className={`${isDarkMode ? 'bg-gray-800/60 border-blue-400/30' : 'bg-gray-50 border-gray-200'} border rounded-lg p-6`}>
                <div className="flex items-center gap-3 mb-3"><DollarSign className="w-6 h-6 text-yellow-400" /><h3 className={`text-xl ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Estimated Money</h3></div>
                <p className="text-3xl text-yellow-300">{route.estimatedMoney || 'N/A'}</p>
              </div>
            )}
          </div>

          {/* Terminal Information */}
          <div className={`${isDarkMode ? 'bg-gray-800/60 border-blue-400/30' : 'bg-gray-50 border-gray-200'} border rounded-lg p-6`}> 
            <h3 className={`text-2xl mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Route Information</h3>
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2"><MapPin className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} /><span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Terminal</span></div>
              <p className={`text-xl ml-7 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{route.terminal || mapData.destination}</p>
            </div>

            {/* Stops */}
            {route.stops && route.stops.length > 0 && (
              <div>
                <p className={`mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Stops along the way:</p>
                <div className="space-y-3">
                  {route.stops.map((stop: string, index: number) => (
                    <div key={index} className="flex items-start gap-4 ml-7">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">{index + 1}</div>
                        {index < route.stops.length - 1 && <div className="w-1 h-8 bg-blue-500/30"></div>}
                      </div>
                      <div className="flex-1 pb-2"><p className={`text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{stop}</p></div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
