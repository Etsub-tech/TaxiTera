import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import WelcomePage from './pages/WelcomePage';
import DashboardPage from './pages/DashboardPage';
import GuestSearchPage from './pages/GuestSearchPage';
import SearchResultsPage from './pages/SearchResultsPage';
import MapPage from './pages/MapPage';
import ProfilePage from './pages/ProfilePage';
import HistoryPage from './pages/HistoryPage';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Toaster position="top-center" richColors />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/welcome" element={<WelcomePage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/guest-search" element={<GuestSearchPage />} />
            <Route path="/search-results" element={<SearchResultsPage />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}