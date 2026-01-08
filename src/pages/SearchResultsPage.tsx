import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
  ArrowLeft, ArrowRight, MapPin, Clock, Navigation, Home, Star, DollarSign, 
  User, History as HistoryIcon, LogOut, ChevronDown, Moon, Sun 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import logoImage from 'figma:asset/5915e0617cff13c3e21f224b1e9a79ae0981b769.png';

interface RouteOption {
  id: number;
  type: 'Best Route' | 'Nearest Terminal' | 'Fastest Route';
  optionNumber: number;
  terminal: string;
  stops: string[];
  duration: string;
  distance: string;
  estimatedMoney: string;
}

export default function SearchResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [routes, setRoutes] = useState<RouteOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [debugInfo, setDebugInfo] = useState<{
    payload?: any;
    requestUrl?: string;
    responseStatus?: string;
    responseBody?: any;
    geolocationError?: string;
    geocodeError?: string;
  } | null>(null);

  const { from, to, isGuest } = location.state || { from: '', to: '', isGuest: false };
  const [resolvedFrom, setResolvedFrom] = useState<{ latitude: number; longitude: number; name?: string } | null>(
    typeof from === 'object' && from && 'latitude' in from && 'longitude' in from ? { latitude: from.latitude, longitude: from.longitude, name: (from as any).name } : null
  );

  // Fetch routes from backend
  useEffect(() => {
    if (!from || !to) return;

    const geocodePlace = async (place: string) => {
      try {
        const key = (import.meta as any).env.VITE_GOOGLE_GEOCODE_API_KEY;
        if (!key) {
          const msg = 'Google Geocode API key not configured';
          setDebugInfo((d) => ({ ...(d || {}), geocodeError: msg }));
          throw new Error(msg);
        }
        const res = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(place)}&key=${key}`
        );
        const d = await res.json().catch(() => null);
        if (!res.ok) {
          const bodyText = d ? JSON.stringify(d) : await res.text().catch(() => '');
          const msg = `Geocode HTTP ${res.status} ${res.statusText} ${bodyText}`;
          setDebugInfo((cur) => ({ ...(cur || {}), geocodeError: msg }));
          throw new Error(msg);
        }
        if (!d || d.status !== 'OK' || !d.results || d.results.length === 0) {
          const msg = `No geocoding results: ${d ? JSON.stringify(d) : 'empty response'}`;
          setDebugInfo((cur) => ({ ...(cur || {}), geocodeError: msg }));
          throw new Error(msg);
        }
        const loc = d.results[0].geometry.location;
        return { latitude: loc.lat, longitude: loc.lng };
      } catch (e: any) {
        console.error('Geocode error:', e.message || e);
        return null;
      }
    };

    const resolveFromAndFetch = async () => {
      setLoading(true);
      setError('');
      try {
        let coords = resolvedFrom;

        // If resolvedFrom not set, try to resolve
        if (!coords) {
          // If `from` is an object with coords use it
          if (typeof from === 'object' && (from as any).latitude && (from as any).longitude) {
            coords = { latitude: (from as any).latitude, longitude: (from as any).longitude, name: (from as any).name };
          } else {
            // Try browser geolocation first (this will trigger browser permission prompt)
            if (navigator.geolocation) {
              try {
                coords = await new Promise((resolve, reject) => {
                  navigator.geolocation.getCurrentPosition(
                    (pos) => resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
                    (err) => reject(err),
                    { enableHighAccuracy: true, timeout: 10000 }
                  );
                });
              } catch (e: any) {
                const geolMsg = e && e.message ? e.message : 'Geolocation failed or denied';
                setDebugInfo((cur) => ({ ...(cur || {}), geolocationError: geolMsg }));
                coords = null as any;
              }
            }

            // If still no coords and user typed a `from` string, try Google Geocoding (requires VITE_GOOGLE_GEOCODE_API_KEY)
            if (!coords && typeof from === 'string') {
              const g = await geocodePlace(from);
              if (g) coords = { latitude: g.latitude, longitude: g.longitude, name: from };
            }
          }
        }

        if (!coords) throw new Error('Could not determine origin coordinates. Allow location access or set VITE_GOOGLE_GEOCODE_API_KEY for place-name lookup.');

        setResolvedFrom(coords as any);

        // Send request to backend
        const requestUrl = 'https://taxitera-fv1x.onrender.com/api/terminals/search';
        const payload = { latitude: coords.latitude, longitude: coords.longitude, destination: typeof to === 'string' ? to : (to as any).name };
        setDebugInfo((cur) => ({ ...(cur || {}), payload, requestUrl }));

        const res = await fetch(requestUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const bodyText = await res.text().catch(() => '');
        setDebugInfo((cur) => ({ ...(cur || {}), responseStatus: `${res.status} ${res.statusText}`, responseBody: bodyText }));

        if (!res.ok) {
          throw new Error(`Failed to fetch routes: ${res.status} ${res.statusText} ${bodyText}`);
        }

        // parse JSON from the bodyText we already captured
        const data: RouteOption[] = bodyText ? JSON.parse(bodyText) : [];
        setRoutes(data);
      } catch (err: any) {
        setError(err.message || String(err));
        console.error('SearchResults error details:', debugInfo, err);
      } finally {
        setLoading(false);
      }
    };

    resolveFromAndFetch();
  }, [from, to]);

  const handleLogout = () => {
    logout();
    setProfileMenuOpen(false);
    navigate('/');
  };

  const handleRouteClick = (route: RouteOption) => {
    navigate('/map', { state: { route, from: resolvedFrom ?? from, to, isGuest } });
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-[#1a252f]' : 'bg-gray-50'}`}>
      {/* Header */}
      <header className={`${isDarkMode ? 'bg-gray-900/90' : 'bg-white'} backdrop-blur-md border-b ${isDarkMode ? 'border-blue-500/30' : 'border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/">
            <img src={logoImage} alt="TaxiTera Logo" className="h-12 w-auto cursor-pointer" />
          </Link>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full ${isDarkMode ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-800/10 hover:bg-gray-800/20'} transition-all duration-300`}
            >
              {isDarkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-blue-600" />}
            </button>

            {user && !isGuest ? (
              <div className="relative">
                <button
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className={`flex items-center gap-2 px-4 py-2 rounded ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-700 hover:bg-blue-800'} text-white transition-all duration-300`}
                >
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                    <User className="w-5 h-5" />
                  </div>
                  <span>{user.username}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {profileMenuOpen && (
                  <div className={`absolute right-0 mt-2 w-56 ${isDarkMode ? 'bg-gray-900/95' : 'bg-white'} backdrop-blur-lg border ${isDarkMode ? 'border-blue-500/40' : 'border-gray-200'} rounded overflow-hidden shadow-xl z-50`}>
                    <Link to="/profile" onClick={() => setProfileMenuOpen(false)} className={`w-full px-6 py-3 ${isDarkMode ? 'text-white hover:bg-blue-600/50' : 'text-gray-800 hover:bg-gray-100'} flex items-center gap-3 transition-colors`}>
                      <User className="w-5 h-5" /> View Profile
                    </Link>
                    <Link to="/history" onClick={() => setProfileMenuOpen(false)} className={`w-full px-6 py-3 ${isDarkMode ? 'text-white hover:bg-blue-600/50' : 'text-gray-800 hover:bg-gray-100'} flex items-center gap-3 transition-colors`}>
                      <HistoryIcon className="w-5 h-5" /> View Past Histories
                    </Link>
                    <button onClick={handleLogout} className={`w-full px-6 py-3 ${isDarkMode ? 'text-white hover:bg-blue-600/50' : 'text-gray-800 hover:bg-gray-100'} flex items-center gap-3 transition-colors`}>
                      <LogOut className="w-5 h-5" /> Log Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex gap-4">
                <Link to="/login"><button className={`px-6 py-2 border-2 ${isDarkMode ? 'border-white text-white hover:bg-white hover:text-blue-900' : 'border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white'} transition-all duration-300`}>Login</button></Link>
                <Link to="/register"><button className={`px-6 py-2 ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-700 hover:bg-blue-800'} text-white transition-all duration-300`}>Register</button></Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <h1 className={`text-3xl mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Available Routes</h1>
        <div className={`flex items-center gap-3 mb-6 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
          <MapPin className={`w-6 h-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
          <span className="text-xl">{from}</span>
          <ArrowRight className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
          <span className="text-xl">{to}</span>
        </div>

        {loading && <p className={isDarkMode ? 'text-white' : 'text-gray-800'}>Loading routes...</p>}
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {debugInfo && (
          <div className="mt-4 p-3 bg-gray-50/90 rounded border">
            <h4 className="text-sm font-medium mb-2">Debug info</h4>
            <pre className="text-xs overflow-auto max-h-48">{JSON.stringify(debugInfo, null, 2)}</pre>
          </div>
        )}

        <div className="space-y-6">
          {routes.map((route) => (
            <div key={route.id} className={`${isDarkMode ? 'bg-white/10 border-blue-400' : 'bg-white border-blue-500'} backdrop-blur-xl border-l-4 rounded-lg overflow-hidden hover:${isDarkMode ? 'bg-white/15' : 'shadow-lg'} transition-all`}>
              <div className={`${isDarkMode ? 'bg-gradient-to-r from-gray-800/80 to-gray-900/80' : 'bg-gradient-to-r from-gray-100 to-gray-200'} px-6 py-4 flex items-center justify-between`}>
                <div className="flex items-center gap-3">
                  {route.type === 'Best Route' && <Star className="w-5 h-5 text-yellow-400" />}
                  {route.type === 'Nearest Terminal' && <Navigation className="w-5 h-5 text-green-400" />}
                  {route.type === 'Fastest Route' && <Clock className="w-5 h-5 text-blue-400" />}
                  <h3 className={`text-xl ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{route.type}</h3>
                </div>
                <span className="px-4 py-1.5 bg-blue-600 text-white rounded-full text-sm">
                  Option {route.optionNumber}
                </span>
              </div>

              <div className="p-6">
                <div className={`flex items-center justify-between mb-6 ${isDarkMode ? 'bg-gray-800/40' : 'bg-gray-50'} rounded-lg p-4`}>
                  <div>
                    <p className={`text-sm mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>From</p>
                    <p className={isDarkMode ? 'text-white' : 'text-gray-900'}>{from}</p>
                  </div>
                  <ArrowRight className={`w-6 h-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                  <div className="text-right">
                    <p className={`text-sm mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>To</p>
                    <p className={isDarkMode ? 'text-white' : 'text-gray-900'}>{to}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Terminal</span>
                  </div>
                  <p className={`text-lg ml-7 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{route.terminal}</p>
                </div>

                {route.stops.length > 0 && (
                  <div className="mb-6">
                    <p className={`text-sm mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Stops along the way:</p>
                    <div className="flex gap-3 ml-7">
                      {route.stops.map((stop, index) => (
                        <span key={index} className={`px-4 py-1.5 ${isDarkMode ? 'bg-gray-700/50 text-gray-200 border-gray-600/50' : 'bg-gray-100 text-gray-700 border-gray-300'} rounded-full text-sm border`}>
                          {stop}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className={`grid ${user && !isGuest ? 'grid-cols-3' : 'grid-cols-2'} gap-4 mb-6`}>
                  <div className={`${isDarkMode ? 'bg-gray-800/40' : 'bg-gray-50'} rounded-lg p-4`}>
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className={`w-4 h-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                      <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Duration</span>
                    </div>
                    <p className={isDarkMode ? 'text-white' : 'text-gray-900'}>{route.duration}</p>
                  </div>
                  <div className={`${isDarkMode ? 'bg-gray-800/40' : 'bg-gray-50'} rounded-lg p-4`}>
                    <div className="flex items-center gap-2 mb-2">
                      <Navigation className={`w-4 h-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                      <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Distance</span>
                    </div>
                    <p className={isDarkMode ? 'text-white' : 'text-gray-900'}>{route.distance}</p>
                  </div>
                  {user && !isGuest && (
                    <div className={`${isDarkMode ? 'bg-gray-800/40' : 'bg-gray-50'} rounded-lg p-4`}>
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className={`w-4 h-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Estimated Money</span>
                      </div>
                      <p className={isDarkMode ? 'text-white' : 'text-gray-900'}>{route.estimatedMoney}</p>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleRouteClick(route)}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded hover:from-blue-700 hover:to-blue-800 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  View on Map
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
