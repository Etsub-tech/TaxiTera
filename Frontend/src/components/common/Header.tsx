import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Moon, Sun, User, History, LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import logoImage from "figma:asset/5915e0617cff13c3e21f224b1e9a79ae0981b769.png";

export default function Header() {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setProfileMenuOpen(false);
    navigate("/");
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 ${isDarkMode ? "bg-white/10" : "bg-gray-900/10"} backdrop-blur-md border-b ${isDarkMode ? "border-white/20" : "border-gray-800/20"}`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img
            src={logoImage}
            alt="TaxiTera Logo"
            className="h-12 w-auto cursor-pointer"
          />
        </Link>

        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full ${isDarkMode ? "bg-white/10 hover:bg-white/20" : "bg-gray-800/10 hover:bg-gray-800/20"} transition-all duration-300`}
            aria-label="Toggle theme"
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5 text-yellow-400" />
            ) : (
              <Moon className="w-5 h-5 text-blue-600" />
            )}
          </button>

          {user ? (
            // Profile Menu for logged-in users
            <div className="relative">
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className={`flex items-center gap-2 px-4 py-2 rounded ${isDarkMode ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-700 hover:bg-blue-800"} text-white transition-all duration-300`}
              >
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <User className="w-5 h-5" />
                </div>
                <span>{user.username}</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {profileMenuOpen && (
                <div
                  className={`absolute right-0 mt-2 w-56 ${isDarkMode ? "bg-gray-900/95" : "bg-white"} backdrop-blur-lg border ${isDarkMode ? "border-blue-500/40" : "border-gray-200"} rounded overflow-hidden shadow-xl`}
                >
                  <Link
                    to="/profile"
                    onClick={() => setProfileMenuOpen(false)}
                    className={`w-full px-6 py-3 ${isDarkMode ? "text-white hover:bg-blue-600/50" : "text-black hover:bg-gray-100"} transition-colors flex items-center gap-3`}
                  >
                    <User className="w-5 h-5" />
                    View Profile
                  </Link>
                  <Link
                    to="/history"
                    onClick={() => setProfileMenuOpen(false)}
                    className={`w-full px-6 py-3 ${isDarkMode ? "text-white hover:bg-blue-600/50" : "text-black hover:bg-gray-100"} transition-colors flex items-center gap-3`}
                  >
                    <History className="w-5 h-5" />
                    View Past Histories
                  </Link>
                  <button
                    onClick={handleLogout}
                    className={`w-full px-6 py-3 ${isDarkMode ? "text-white hover:bg-blue-600/50" : "text-black hover:bg-gray-100"} transition-colors flex items-center gap-3`}
                  >
                    <LogOut className="w-5 h-5" />
                    Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            // Login/Register buttons for non-logged-in users
            <div className="flex gap-4">
              <Link to="/login">
                <button
                  className={`px-6 py-2 bg-transparent border-2 ${isDarkMode ? "border-white text-white hover:bg-white hover:text-blue-900" : "border-black text-black hover:bg-black hover:text-white"} transition-all duration-300`}
                >
                  Login
                </button>
              </Link>
              <Link to="/register">
                <button
                  className={`px-6 py-2 ${isDarkMode ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-700 hover:bg-blue-800"} text-white transition-all duration-300`}
                >
                  Register
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
