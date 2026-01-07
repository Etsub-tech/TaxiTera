import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  MapPin,
  Clock,
  DollarSign,
  Moon,
  Sun,
  User,
  History as HistoryIcon,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import logoImage from 'figma:asset/5915e0617cff13c3e21f224b1e9a79ae0981b769.png';

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
    if (!route) navigate(-1);
  }, [route, navigate]);

  if (!route) return null;

  const handleLogout = () => {
    logout();
    setProfileMenuOpen(false);
    navigate('/');
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-[#1a252f]' : 'bg-gray-50'}`}>
      {/* HEADER */}
      <header className={`${isDarkMode ? 'bg-gray-900/90' : 'bg-white'} border-b`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/">
            <img src={logoImage} alt="TaxiTera Logo" className="h-12" />
          </Link>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-blue-600" />
              )}
            </button>

            {user && !isGuest ? (
              <div className="relative">
                <button
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded"
                >
                  <User className="w-5 h-5" />
                  {user.username}
                  <ChevronDown className="w-4 h-4" />
                </button>

                {profileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded shadow">
                    <Link
                      to="/profile"
                      className="block px-6 py-3 hover:bg-gray-100"
                    >
                      View Profile
                    </Link>
                    <Link
                      to="/history"
                      className="block px-6 py-3 hover:bg-gray-100"
                    >
                      View History
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-6 py-3 hover:bg-gray-100"
                    >
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <h1 className={`text-3xl mb-6 ${isDarkMode ? 'text-white' : 'text-black'}`}>
          {route.type}: {from} → {to}
        </h1>

        {/* 🔥 GOOGLE MAP ADDED HERE */}
        <div className="w-full h-96 rounded-lg overflow-hidden border mb-8">
          <iframe
            title="Addis Ababa Map"
            width="100%"
            height="100%"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src="https://www.google.com/maps?q=Addis+Ababa,Ethiopia&z=13&output=embed"
          />
        </div>

        {/* ROUTE DETAILS */}
        <div className={`rounded-lg p-8 ${isDarkMode ? 'bg-white/10' : 'bg-white'}`}>
          <h2 className={`text-2xl mb-6 ${isDarkMode ? 'text-white' : 'text-black'}`}>
            Route Details
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded bg-gray-50">
              <Clock className="text-green-500 mb-2" />
              <p className="text-xl">Duration</p>
              <p className="text-2xl">{route.duration}</p>
            </div>

            <div className="p-6 rounded bg-gray-50">
              <MapPin className="text-blue-500 mb-2" />
              <p className="text-xl">Distance</p>
              <p className="text-2xl">{route.distance}</p>
            </div>

            {user && !isGuest && (
              <div className="p-6 rounded bg-gray-50">
                <DollarSign className="text-yellow-500 mb-2" />
                <p className="text-xl">Estimated Cost</p>
                <p className="text-2xl">{route.estimatedMoney}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
