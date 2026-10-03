import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { User, Mail, Calendar, ArrowLeft } from "lucide-react";
import logoImage from "figma:asset/5915e0617cff13c3e21f224b1e9a79ae0981b769.png";

export default function ProfilePage() {
  const { user } = useAuth();
  const { isDarkMode } = useTheme();

  return (
    <div
      className={`min-h-screen ${isDarkMode ? "bg-gray-800" : "bg-gray-50"}`}
    >
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1
          className={`text-4xl mb-8 ${isDarkMode ? "text-white" : "text-gray-900"}`}
        >
          My Profile
        </h1>

        <div
          className={`${isDarkMode ? "bg-white/10 border-blue-300/40" : "bg-white border-gray-200"} backdrop-blur-xl border rounded-lg p-8`}
        >
          {/* Profile Avatar */}
          <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-600/30">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
              <User className="w-12 h-12 text-white" />
            </div>
            <div>
              <h2
                className={`text-3xl mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}
              >
                {user?.username}
              </h2>
              <p
                className={`${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
              >
                TaxiTera Member
              </p>
            </div>
          </div>

          {/* Profile Information */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <User
                  className={`w-5 h-5 ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}
                />
                <label
                  className={`${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                >
                  Username
                </label>
              </div>
              <p
                className={`text-xl ml-8 ${isDarkMode ? "text-white" : "text-gray-900"}`}
              >
                {user?.username}
              </p>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-2">
                <Calendar
                  className={`w-5 h-5 ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}
                />
                <label
                  className={`${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                >
                  Member Since
                </label>
              </div>
              <p
                className={`text-xl ml-8 ${isDarkMode ? "text-white" : "text-gray-900"}`}
              >
                December 2025
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
