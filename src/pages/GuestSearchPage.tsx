import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Search, TrendingUp, MapPin, ArrowRight, ChevronDown, Moon, Sun } from 'lucide-react';
import logoImage from 'figma:asset/5915e0617cff13c3e21f224b1e9a79ae0981b769.png';

const POPULAR_ROUTES = [
  { from: 'Mercato', to: 'Bole', popularity: 'Very Popular' },
  { from: 'Piassa', to: 'Megenagna', popularity: 'Popular' },
  { from: 'Legehar', to: 'CMC', popularity: 'Very Popular' },
  { from: 'Meskel Square', to: 'Mexico', popularity: 'Popular' },
  { from: 'Autobus Tera', to: 'Mercato', popularity: 'Very Popular' },
];




export default function GuestSearchPage() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [fromSuggestions, setFromSuggestions] = useState<string[]>([]);
  const [toSuggestions, setToSuggestions] = useState<string[]>([]);
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // Fetch suggestions from API



  const fetchSuggestions = async (query: string, type: 'from' | 'to') => {
    if (!query) return;
    try {
      const response = await fetch(`https://your-api.com/terminals?query=${encodeURIComponent(query)}`);
      const data: string[] = await response.json(); // assuming array of terminal names
      if (type === 'from') setFromSuggestions(data);
      else setToSuggestions(data);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (from && to) {
      navigate('/search-results', { state: { from, to, isGuest: true } });
    }
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
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full ${isDarkMode ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-800/10 hover:bg-gray-800/20'} transition-all duration-300`}
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-blue-600" />}
            </button>
            <Link to="/login">
              <button className={`px-6 py-2 bg-transparent border-2 ${isDarkMode ? 'border-white text-white hover:bg-white hover:text-blue-900' : 'border-black text-black hover:bg-black hover:text-white'} rounded transition-all duration-300`}>
                Login
              </button>
            </Link>
            <Link to="/register">
              <button className={`px-6 py-2 ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-700 hover:bg-blue-800'} text-white rounded transition-all duration-300`}>
                Register
              </button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <h1 className={`text-3xl mb-6 ${isDarkMode ? 'text-white' : 'text-black'}`}>Welcome to TaxiTera</h1>

        {/* Search Section */}
        <div className={`${isDarkMode ? 'bg-white/10 border-blue-300/40' : 'bg-white border-gray-200'} backdrop-blur-xl border rounded-lg shadow-2xl mb-6 overflow-hidden`}>
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
            <div className="flex items-center gap-3">
              <Search className="w-6 h-6 text-white" />
              <h2 className="text-white text-xl">Search Routes</h2>
            </div>
          </div>

          <form onSubmit={handleSearch} className="p-8">
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {/* From Input */}
              <div className="relative">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-5 h-5 text-blue-400" />
                  <label className="text-white">From (Origin)</label>
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
                  <label className="text-white">To (Destination)</label>
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
                    className={`px-4 py-1.5 rounded-full text-sm ${
                      route.popularity === 'Very Popular'
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
