import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { X } from 'lucide-react';
import nightTaxiRoadImage from 'figma:asset/4d5bb451231e240c7d8e991bfdfd55b0d2686a01.png';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(
        'https://taxitera-fv1x.onrender.com/api/auth/login',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // ✅ Store token
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', username);

      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${nightTaxiRoadImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="bg-gray-900/90 p-8 w-full max-w-md relative rounded-lg">
        <Link to="/" className="absolute top-4 right-4 text-white">
          <X />
        </Link>

        <h2 className="text-3xl text-white mb-8 text-center">
          Login to TaxiTera
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="Username"
            className="w-full p-3 bg-gray-800 text-white rounded"
            required
          />

          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full p-3 bg-gray-800 text-white rounded"
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 py-3 rounded text-white"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="text-center mt-4">
          <Link to="/reset-password" className="text-blue-400 underline">
            Forgot Password?
          </Link>
        </div>
      </div>
    </div>
  );
}
