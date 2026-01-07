import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { X } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import nightTaxiRoadImage from 'figma:asset/4d5bb451231e240c7d8e991bfdfd55b0d2686a01.png';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(username, password)) {
      toast.success('Login successful!');
      setTimeout(() => navigate('/welcome'), 1000);
    } else {
      toast.error('Invalid username or password');
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center px-6"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${nightTaxiRoadImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="bg-gray-900/90 backdrop-blur-lg border border-blue-500/30 p-8 w-full max-w-md relative">
        <Link to="/" className="absolute top-4 right-4 text-white hover:text-blue-400 transition-colors">
          <X className="w-6 h-6" />
        </Link>
        
        <h2 className="text-3xl text-white mb-8 text-center">Login to TaxiTera</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-white mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800/70 border border-blue-500/40 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="Enter your username"
              required
            />
          </div>
          
          <div>
            <label className="block text-white mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800/70 border border-blue-500/40 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="Enter your password"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
          >
            Login
          </button>
        </form>
        
        <p className="text-white text-center mt-6">
          If you don't have an account,{' '}
          <Link to="/register" className="text-blue-400 hover:text-blue-300 underline">
            sign up
          </Link>
        </p>
      </div>
    </div>
  );
}