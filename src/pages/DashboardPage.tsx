import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  Search,
  Clock,
  TrendingUp,
  Home,
  MapPin,
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  Moon,
  Sun,
  User,
  History as HistoryIcon,
  LogOut
} from 'lucide-react';
import logoImage from 'figma:asset/5915e0617cff13c3e21f224b1e9a79ae0981b769.png';

const POPULAR_ROUTES = [
  { from: 'Mercato', to: 'Bole', popularity: 'Very Popular' },
  { from: 'Piassa', to: 'Megenagna', popularity: 'Popular' },
  { from: 'Meskel Square', to: 'Mexico', popularity: 'Popular' },
  { from: 'Autobus Tera', to: 'Mercato', popularity: 'Very Popular' },
];

export default function DashboardPage() {
  const { user, searchHistory, addSearchHistory, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [fromSuggestions, setFromSuggestions] = useState<string[]>([]);
  const [toSuggestions, setToSuggestions] = useState<string[]>([]);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Fetch suggestions from API
  const fetchSuggestions = async (query: string, type: 'from' | 'to') => {
    if (!query) return;

    try {
      const res = await fetch('https://taxitera-fv1x.onrender.com/api/terminals');
      if (!res.ok) throw new Error('Failed to fetch terminals');
      const data: { name: string }[] = await res.json();

      // Filter terminals containing query text
      const suggestions = data
        .map(t => t.name)
        .filter(name => name.toLowerCase().includes(query.toLowerCase()));

      if (type === 'from') setFromSuggestions(suggestions);
      else setToSuggestions(suggestions);

    } catch (err) {
      console.error('Error fetching terminals:', err);
    }
  };



  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!from || !to) return;

    setLoading(true);

    try {
      // Optional: get user coordinates
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      const res = await fetch('https://taxitera-fv1x.onrender.com/api/terminals/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ latitude, longitude, destination: to }),
      });

      if (!res.ok) throw new Error('Failed to search terminals');

      const terminals = await res.json(); // Array of terminals
      console.log('Search results:', terminals);

      // Navigate to map or search results page with data
      navigate('/map', { state: { from, to, terminals } });

    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  const handleLogout = () => {
    logout();
    setProfileMenuOpen(false);
    navigate('/');
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
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full ${isDarkMode ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-800/10 hover:bg-gray-800/20'} transition-all duration-300`}
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-blue-600" />}
            </button>

            {/* Profile Menu */}
            <div className="relative">
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className={`flex items-center gap-2 px-4 py-2 rounded ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-700 hover:bg-blue-800'} text-white transition-all duration-300`}
              >
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <User className="w-5 h-5" />
                </div>
                <span>{user?.username}</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {profileMenuOpen && (
                <div className={`absolute right-0 mt-2 w-56 ${isDarkMode ? 'bg-gray-900/95' : 'bg-white'} backdrop-blur-lg border ${isDarkMode ? 'border-blue-500/40' : 'border-gray-200'} rounded overflow-hidden shadow-xl z-50`}>
                  <Link
                    to="/profile"
                    onClick={() => setProfileMenuOpen(false)}
                    className={`w-full px-6 py-3 ${isDarkMode ? 'text-white hover:bg-blue-600/50' : 'text-black hover:bg-gray-100'} transition-colors flex items-center gap-3`}
                  >
                    <User className="w-5 h-5" />
                    View Profile
                  </Link>
                  <Link
                    to="/history"
                    onClick={() => setProfileMenuOpen(false)}
                    className={`w-full px-6 py-3 ${isDarkMode ? 'text-white hover:bg-blue-600/50' : 'text-black hover:bg-gray-100'} transition-colors flex items-center gap-3`}
                  >
                    <HistoryIcon className="w-5 h-5" />
                    View Past Histories
                  </Link>
                  <button
                    onClick={handleLogout}
                    className={`w-full px-6 py-3 ${isDarkMode ? 'text-white hover:bg-blue-600/50' : 'text-black hover:bg-gray-100'} transition-colors flex items-center gap-3`}
                  >
                    <LogOut className="w-5 h-5" />
                    Log Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <h1 className={`text-3xl mb-6 ${isDarkMode ? 'text-white' : 'text-black'}`}>
          Welcome, {user?.username}!
        </h1>

        {/* Search Section */}
        <div className={`${isDarkMode ? 'bg-white/10 border-blue-300/40' : 'bg-white border-gray-200'} backdrop-blur-xl border rounded-lg shadow-2xl mb-6 overflow-hidden`}>
          {/* Blue Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
            <div className="flex items-center gap-3">
              <Search className="w-6 h-6 text-white" />
              <h2 className="text-white text-xl">Search Routes</h2>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSearch} className="p-8">
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {/* From Input */}
              <div className="relative">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-5 h-5 text-blue-400" />
                  <label className="text-white1">From (Origin)</label>
                </div>
                <input
                  type="text"
                  value={from}
                  onChange={(e) => {
                    setFrom(e.target.value);
                    fetchSuggestions(e.target.value, 'from');
                  }}
                  className="w-full px-4 py-3 bg-gray-800/70 border border-blue-400/40 rounded text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="Select starting location"
                  required
                />
                {fromSuggestions.length > 0 && (
                  <ul className="absolute z-10 w-full bg-white dark:bg-gray-800 rounded shadow-lg mt-1 max-h-48 overflow-y-auto">
                    {fromSuggestions.map((s, i) => (
                      <li
                        key={i}
                        className="px-4 py-2 cursor-pointer hover:bg-blue-500 hover:text-white"
                        onClick={() => {
                          setFrom(s);
                          setFromSuggestions([]);
                        }}
                      >
                        {s}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* To Input */}
              <div className="relative">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-5 h-5 text-blue-400" />
                  <label className="text-white1">To (Destination)</label>
                </div>
                <input
                  type="text"
                  value={to}
                  onChange={(e) => {
                    setTo(e.target.value);
                    fetchSuggestions(e.target.value, 'to');
                  }}
                  className="w-full px-4 py-3 bg-gray-800/70 border border-blue-400/40 rounded text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="Select destination"
                  required
                />
                {toSuggestions.length > 0 && (
                  <ul className="absolute z-10 w-full bg-white dark:bg-gray-800 rounded shadow-lg mt-1 max-h-48 overflow-y-auto">
                    {toSuggestions.map((s, i) => (
                      <li
                        key={i}
                        className="px-4 py-2 cursor-pointer hover:bg-blue-500 hover:text-white"
                        onClick={() => {
                          setTo(s);
                          setToSuggestions([]);
                        }}
                      >
                        {s}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg"
            >
              <Search className="w-5 h-5" />
              Find Routes
            </button>
          </form>
        </div>

        {/* Search History */}
        {searchHistory.length > 0 && (
          <div className={`${isDarkMode ? 'bg-white/10 border-blue-300/40' : 'bg-white border-gray-200'} backdrop-blur-xl border rounded-lg p-8 mb-6`}>
            <div className="flex items-center gap-2 mb-6">
              <Clock className={`w-6 h-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              <h2 className={`text-2xl ${isDarkMode ? 'text-white' : 'text-black'}`}>Recent Searches</h2>
            </div>
            <div className="space-y-3">
              {searchHistory.map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setFrom(item.from);
                    setTo(item.to);
                  }}
                  className={`w-full ${isDarkMode ? 'bg-gray-800/60 hover:bg-gray-800/80 border-blue-400/30' : 'bg-gray-50 hover:bg-gray-100 border-gray-200'} border rounded p-4 text-left transition-colors group`}
                >
                  <div className="flex items-center justify-between">
                    <div className={`flex items-center gap-3 ${isDarkMode ? 'text-white' : 'text-black'}`}>
                      <span className={isDarkMode ? 'text-blue-300' : 'text-blue-700'}>{item.from}</span>
                      <ArrowRight className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      <span className={isDarkMode ? 'text-blue-300' : 'text-blue-700'}>{item.to}</span>
                    </div>
                    <Search className={`w-4 h-4 ${isDarkMode ? 'text-gray-400 group-hover:text-blue-400' : 'text-gray-500 group-hover:text-blue-600'} transition-colors`} />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Popular Routes */}
        <div className={`${isDarkMode ? 'bg-white/10 border-blue-300/40' : 'bg-white border-gray-200'} backdrop-blur-xl border rounded-lg p-8`}>
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className={`w-6 h-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            <h2 className={`text-2xl ${isDarkMode ? 'text-white' : 'text-black'}`}>Popular Routes</h2>
          </div>
          <div className="space-y-3">
            {POPULAR_ROUTES.map((route, index) => (
              <div
                key={index}
                className={`${isDarkMode ? 'bg-gray-800/60 border-blue-400/30 hover:bg-gray-800/80' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'} border rounded p-5 transition-colors cursor-pointer group`}
                onClick={() => {
                  setFrom(route.from);
                  setTo(route.to);
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={isDarkMode ? 'text-white' : 'text-black'}>{route.from}</span>
                    <ArrowRight className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                    <span className={isDarkMode ? 'text-white' : 'text-black'}>{route.to}</span>
                  </div>
                  <span
                    className={`px-4 py-1.5 rounded-full text-sm ${route.popularity === 'Very Popular'
                        ? 'bg-blue-600 text-white'
                        : isDarkMode
                          ? 'bg-blue-400/30 text-blue-200 border border-blue-400/50'
                          : 'bg-blue-100 text-blue-700 border border-blue-300'
                      }`}
                  >
                    {route.popularity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
