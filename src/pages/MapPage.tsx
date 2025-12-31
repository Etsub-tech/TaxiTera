import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ArrowLeft, MapPin, Clock, Navigation, Home, DollarSign, Moon, Sun, User, History as HistoryIcon, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import logoImage from 'figma:asset/5915e0617cff13c3e21f224b1e9a79ae0981b769.png';
import nightCityImage from 'figma:asset/58c67f3f9932306943fe70dfc6bd854a2e4bb197.png';
import mapViewImage from 'figma:asset/63e0f80eaefa2ed7ec519bdb19d7996093cca11d.png';

export default function MapPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  
  const { route, from, to, isGuest } = location.state || { 
    route: null, 
    from: 'Origin', 
    to: 'Destination',
    isGuest: false 
  };

  useEffect(() => {
    if (!route) {
      navigate(-1);
    }
  }, [route, navigate]);

  if (!route) {
    return null;
  }

  const handleLogout = () => {
    logout();
    setProfileMenuOpen(false);
    navigate('/');
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-[#1a252f]' : 'bg-gray-50'}`}>
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
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-blue-600" />
              )}
            </button>

            {user && !isGuest ? (
              // Profile Menu for logged-in users
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
                    <Link
                      to="/profile"
                      onClick={() => setProfileMenuOpen(false)}
                      className={`w-full px-6 py-3 ${isDarkMode ? 'text-white hover:bg-blue-600/50' : 'text-gray-800 hover:bg-gray-100'} transition-colors flex items-center gap-3`}
                    >
                      <User className="w-5 h-5" />
                      View Profile
                    </Link>
                    <Link
                      to="/history"
                      onClick={() => setProfileMenuOpen(false)}
                      className={`w-full px-6 py-3 ${isDarkMode ? 'text-white hover:bg-blue-600/50' : 'text-gray-800 hover:bg-gray-100'} transition-colors flex items-center gap-3`}
                    >
                      <HistoryIcon className="w-5 h-5" />
                      View Past Histories
                    </Link>
                    <button
                      onClick={handleLogout}
                      className={`w-full px-6 py-3 ${isDarkMode ? 'text-white hover:bg-blue-600/50' : 'text-gray-800 hover:bg-gray-100'} transition-colors flex items-center gap-3`}
                    >
                      <LogOut className="w-5 h-5" />
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // Login/Register for guests
              <div className="flex gap-4">
                <Link to="/login">
                  <button className={`px-6 py-2 bg-transparent border-2 ${isDarkMode ? 'border-white text-white hover:bg-white hover:text-blue-900' : 'border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white'} transition-all duration-300`}>
                    Login
                  </button>
                </Link>
                <Link to="/register">
                  <button className={`px-6 py-2 ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-700 hover:bg-blue-800'} text-white transition-all duration-300`}>
                    Register
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">

        <h1 className={`text-3xl mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          {route.type}: {from} to {to}
        </h1>

        {/* Map Display */}
        <div className={`${isDarkMode ? 'bg-white/10 border-blue-300/40' : 'bg-white border-gray-200'} backdrop-blur-xl border rounded-lg mb-6 h-96 relative overflow-hidden`}>
          <img 
            src={mapViewImage} 
            alt="Map view of Addis Ababa route" 
            className="w-full h-full object-cover rounded-lg"
          />
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            <div className={`text-center ${isDarkMode ? 'bg-gray-900/90' : 'bg-white/90'} backdrop-blur-md px-6 py-4 border ${isDarkMode ? 'border-blue-400/50' : 'border-blue-500'} rounded`}>
              <p className={`text-xl ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Route: {from} to {to}</p>
            </div>
          </div>
        </div>

        {/* Route Details */}
        <div className={`${isDarkMode ? 'bg-white/10 border-blue-300/40' : 'bg-white border-gray-200'} backdrop-blur-xl border rounded-lg p-8`}>
          <h2 className={`text-3xl mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Route Details</h2>
          
          <div className={`grid ${user && !isGuest ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-6 mb-8`}>
            <div className={`${isDarkMode ? 'bg-gray-800/60 border-blue-400/30' : 'bg-gray-50 border-gray-200'} border rounded-lg p-6`}>
              <div className="flex items-center gap-3 mb-3">
                <Clock className="w-6 h-6 text-green-400" />
                <h3 className={`text-xl ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Duration</h3>
              </div>
              <p className="text-3xl text-green-300">{route.duration || route.estimatedTime}</p>
            </div>

            <div className={`${isDarkMode ? 'bg-gray-800/60 border-blue-400/30' : 'bg-gray-50 border-gray-200'} border rounded-lg p-6`}>
              <div className="flex items-center gap-3 mb-3">
                <MapPin className="w-6 h-6 text-blue-400" />
                <h3 className={`text-xl ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Distance</h3>
              </div>
              <p className="text-3xl text-blue-300">{route.distance}</p>
            </div>

            {user && !isGuest && (
              <div className={`${isDarkMode ? 'bg-gray-800/60 border-blue-400/30' : 'bg-gray-50 border-gray-200'} border rounded-lg p-6`}>
                <div className="flex items-center gap-3 mb-3">
                  <DollarSign className="w-6 h-6 text-yellow-400" />
                  <h3 className={`text-xl ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Estimated Money</h3>
                </div>
                <p className="text-3xl text-yellow-300">{route.estimatedMoney || 'N/A'}</p>
              </div>
            )}
          </div>

          {/* Terminal Information */}
          <div className={`${isDarkMode ? 'bg-gray-800/60 border-blue-400/30' : 'bg-gray-50 border-gray-200'} border rounded-lg p-6`}>
            <h3 className={`text-2xl mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Route Information</h3>
            
            {/* Main Terminal */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Terminal</span>
              </div>
              <p className={`text-xl ml-7 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{route.terminal}</p>
            </div>

            {/* Stops along the way */}
            {route.stops && route.stops.length > 0 && (
              <div>
                <p className={`mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Stops along the way:</p>
                <div className="space-y-3">
                  {route.stops.map((stop: string, index: number) => (
                    <div key={index} className="flex items-start gap-4 ml-7">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                          {index + 1}
                        </div>
                        {index < route.stops.length - 1 && (
                          <div className="w-1 h-8 bg-blue-500/30"></div>
                        )}
                      </div>
                      <div className="flex-1 pb-2">
                        <p className={`text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{stop}</p>
                      </div>
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