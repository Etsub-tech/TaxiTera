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
  lat?: number;
  lng?: number;
}

interface Terminal {
  name: string;
  location?: {
    coordinates: [number, number]; // [lng, lat]
  };
  routes?: string[];
  price?: number;
}

interface SearchData {
  userLocation: { lat: number; lng: number };
  terminals: Terminal[];
  destination: string;
  fromName?: string;
}

export default function SearchResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, addSearchHistory } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [routes, setRoutes] = useState<RouteOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchData, setSearchData] = useState<SearchData | null>(null);
  const [fetchTrigger, setFetchTrigger] = useState(0);

  // Read from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('searchData');
      if (stored) {
        const parsed: SearchData = JSON.parse(stored);
        setSearchData(parsed);
      } else {
        // Fallback to navigation state for backward compatibility
        const navState = location.state || {};
        if (navState.from && navState.to) {
          // Convert old format to new format if needed
          setSearchData({
            userLocation: navState.fromCoords || { lat: 0, lng: 0 },
            terminals: navState.results || [],
            destination: navState.to,
            fromName: navState.from
          });
        } else {
          setError('No search data found. Please search again.');
        }
      }
    } catch (err) {
      console.error('Failed to read search data:', err);
      setError('Failed to load search data. Please search again.');
    }
  }, [location.state]);

  // Process terminals from localStorage into routes
  useEffect(() => {
    if (!searchData || !searchData.terminals || searchData.terminals.length === 0) {
      setRoutes([]);
      return;
    }

    setLoading(true);
    try {
      const getTerminalName = (t: Terminal) => {
        if (!t) return 'Unknown Terminal';
        return t.name || 'Unknown Terminal';
      };

      const toLatLng = (coordsArr: [number, number]) => ({ 
        lat: Number(coordsArr[1]), 
        lon: Number(coordsArr[0]) 
      });

      const haversineKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const toRad = (v: number) => (v * Math.PI) / 180;
        const R = 6371; // km
        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) + 
                  Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
                  Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
      };

      const terminals = searchData.terminals;
      const userLat = searchData.userLocation.lat;
      const userLon = searchData.userLocation.lng;

      // Sort by distance
      const terminalsWithDist = terminals.map((t, idx) => {
        const loc = t.location && Array.isArray(t.location.coordinates) 
          ? toLatLng(t.location.coordinates) 
          : { lat: 0, lon: 0 };
        const dist = haversineKm(userLat, userLon, loc.lat, loc.lon);
        return { t, dist, idx, loc };
      }).sort((a, b) => a.dist - b.dist);

      const generated: RouteOption[] = [];

      if (terminalsWithDist.length > 0) {
        const first = terminalsWithDist[0];
        generated.push({
          id: 1,
          type: 'Best Route',
          optionNumber: 1,
          terminal: getTerminalName(first.t),
          stops: Array.isArray(first.t.routes) ? first.t.routes : [],
          duration: `${Math.max(5, Math.round(first.dist * 3))}-${Math.max(6, Math.round(first.dist * 4))} min`,
          distance: `${first.dist.toFixed(1)} km`,
          estimatedMoney: first.t.price ? `${first.t.price} ETB` : '—',
          lat: first.loc.lat,
          lng: first.loc.lon,
        });
      }

      if (terminalsWithDist.length > 0) {
        const nearest = terminalsWithDist[0];
        generated.push({
          id: 2,
          type: 'Nearest Terminal',
          optionNumber: 2,
          terminal: getTerminalName(nearest.t),
          stops: Array.isArray(nearest.t.routes) ? nearest.t.routes : [],
          duration: `${Math.max(5, Math.round(nearest.dist * 3))}-${Math.max(6, Math.round(nearest.dist * 4))} min`,
          distance: `${nearest.dist.toFixed(1)} km`,
          estimatedMoney: nearest.t.price ? `${nearest.t.price} ETB` : '—',
          lat: nearest.loc.lat,
          lng: nearest.loc.lon,
        });
      }

      if (terminalsWithDist.length > 1) {
        const second = terminalsWithDist[1];
        generated.push({
          id: 3,
          type: 'Fastest Route',
          optionNumber: 3,
          terminal: getTerminalName(second.t),
          stops: Array.isArray(second.t.routes) ? second.t.routes : [],
          duration: `${Math.max(5, Math.round(second.dist * 2))}-${Math.max(6, Math.round(second.dist * 3))} min`,
          distance: `${second.dist.toFixed(1)} km`,
          estimatedMoney: second.t.price ? `${second.t.price} ETB` : '—',
          lat: second.loc.lat,
          lng: second.loc.lon,
        });
      }

      setRoutes(generated);
    } catch (err: any) {
      setError(err.message || String(err));
      console.error('Error processing terminals:', err);
    } finally {
      setLoading(false);
    }
  }, [searchData]);
  

  const handleLogout = () => {
    logout();
    setProfileMenuOpen(false);
    navigate('/');
  };

  const handleRouteClick = async (route: RouteOption) => {
    if (!searchData) {
      console.error('No search data available');
      return;
    }

    // Save history if user is logged in
    if (user) {
      try {
        const token = localStorage.getItem('token');
        await fetch('https://taxitera-fv1x.onrender.com/api/history', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ 
            from: searchData.fromName || 'Current Location', 
            to: searchData.destination,
            price: route.estimatedMoney 
          }),
        });
        try { 
          addSearchHistory(searchData.fromName || 'Current Location', searchData.destination); 
        } catch (e) {
          console.error('Failed to add search history', e);
        }
      } catch (e) {
        console.error('Failed to save history', e);
      }
    }

    // Save map data to localStorage
    try {
      const mapData = {
        userLocation: searchData.userLocation,
        terminalLocation: { lat: route.lat || 0, lng: route.lng || 0 },
        destination: searchData.destination,
        route: route,
        fromName: searchData.fromName || 'Current Location'
      };
      localStorage.setItem('mapData', JSON.stringify(mapData));
    } catch (e) {
      console.error('Failed to save map data to localStorage', e);
    }

    navigate('/map');
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
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

            {user ? (
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
        {user && (
          <p className={`mb-4 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Welcome, {localStorage.getItem('username') || user.username}</p>
        )}
        {searchData && (
          <div className={`flex items-center gap-3 mb-6 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            <MapPin className={`w-6 h-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            <span className="text-xl">{searchData.fromName || 'Current Location'}</span>
            <ArrowRight className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            <span className="text-xl">{searchData.destination}</span>
          </div>
        )}

        {loading && <p className={isDarkMode ? 'text-white' : 'text-gray-800'}>Loading routes...</p>}
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {/* debugInfo UI removed now that the flow is stable */}

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
                {searchData && (
                  <div className={`flex items-center justify-between mb-6 ${isDarkMode ? 'bg-gray-800/40' : 'bg-gray-50'} rounded-lg p-4`}>
                    <div>
                      <p className={`text-sm mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>From</p>
                      <p className={isDarkMode ? 'text-white' : 'text-gray-900'}>{searchData.fromName || 'Current Location'}</p>
                    </div>
                    <ArrowRight className={`w-6 h-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                    <div className="text-right">
                      <p className={`text-sm mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>To</p>
                      <p className={isDarkMode ? 'text-white' : 'text-gray-900'}>{searchData.destination}</p>
                    </div>
                  </div>
                )}

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

                <div className={`grid ${user ? 'grid-cols-3' : 'grid-cols-2'} gap-4 mb-6`}>
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
                  {user && (
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
