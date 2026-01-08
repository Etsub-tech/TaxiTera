import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Lock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import nightTaxiRoadImage from 'figma:asset/4d5bb451231e240c7d8e991bfdfd55b0d2686a01.png';

interface SecurityQuestion {
  questionId: number;
  text: string;
}


export default function ResetPasswordPage() {
  const [step, setStep] = useState<'username' | 'questions' | 'success'>('username');
  const [username, setUsername] = useState('');
  const [securityQuestions, setSecurityQuestions] = useState<SecurityQuestion[]>([]);
  const [answer1, setAnswer1] = useState('');
  const [answer2, setAnswer2] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Step 1: Get security questions
  const handleUsernameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(
        'https://taxitera-fv1x.onrender.com/api/auth/forgot-password',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username })
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setSecurityQuestions(data.questions); // ✔ correct
      setStep('questions');
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };



  // Step 2: Verify answers and reset password
  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        'https://taxitera-fv1x.onrender.com/api/auth/reset-password',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username,
            answers: [
              { questionId: securityQuestions[0].questionId, answer: answer1 },
              { questionId: securityQuestions[1].questionId, answer: answer2 }
            ],
            newPassword
          })
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setStep('success');
      toast.success('Password reset successful!');
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };



  const handleBackToLogin = () => {
    navigate('/login');
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6 py-12"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${nightTaxiRoadImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="bg-gray-900/90 backdrop-blur-lg border border-blue-500/30 p-8 w-full max-w-md relative">
        <Link to="/login" className="absolute top-4 right-4 text-white hover:text-blue-400 transition-colors">
          <X className="w-6 h-6" />
        </Link>

        <div className="flex items-center justify-center mb-6">
          <Lock className="w-12 h-12 text-blue-400" />
        </div>

        <h2 className="text-3xl text-white mb-2 text-center">Reset Password</h2>
        <p className="text-gray-400 text-center mb-8">
          {step === 'username' && 'Enter your username to begin password recovery'}
          {step === 'questions' && 'Answer your security questions'}
          {step === 'success' && 'Your password has been reset'}
        </p>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/40 rounded flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        {/* Step 1: Username */}
        {step === 'username' && (
          <form onSubmit={handleUsernameSubmit} className="space-y-6">
            <div>
              <label className="block text-white mb-2">Username *</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800/70 border border-blue-500/40 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="Enter your username"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Loading...' : 'Continue'}
            </button>
          </form>
        )}

        {/* Step 2: Security Questions & New Password */}
        {step === 'questions' && (
          <form onSubmit={handleResetSubmit} className="space-y-6">
            <div className="bg-blue-500/10 border border-blue-500/30 rounded p-4 mb-6">
              <p className="text-blue-300 text-sm">
                <strong>Username:</strong> {username}
              </p>
            </div>

            <div>
              <label className="block text-white mb-2">Security Question 1 *</label>
              <div className="mb-3 p-3 bg-gray-800/50 border border-blue-500/20 rounded">
                <p className="text-blue-300 text-sm">
                  {securityQuestions[0]?.text}
                </p>

              </div>
              <input
                type="text"
                value={answer1}
                onChange={(e) => setAnswer1(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800/70 border border-blue-500/40 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="Your answer"
                required
              />
            </div>

            <div>
              <label className="block text-white mb-2">Security Question 2 *</label>
              <div className="mb-3 p-3 bg-gray-800/50 border border-blue-500/20 rounded">
                <p className="text-blue-300 text-sm">
                  {securityQuestions[1]?.text}
                </p>

              </div>
              <input
                type="text"
                value={answer2}
                onChange={(e) => setAnswer2(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800/70 border border-blue-500/40 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="Your answer"
                required
              />
            </div>

            <div className="border-t border-blue-500/30 pt-6">
              <label className="block text-white mb-2">New Password *</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800/70 border border-blue-500/40 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="Enter new password (min. 8 characters)"
                required
                minLength={8}
              />
              <p className="text-gray-400 text-sm mt-1">Minimum 8 characters</p>
            </div>

            <div>
              <label className="block text-white mb-2">Confirm New Password *</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800/70 border border-blue-500/40 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="Confirm new password"
                required
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setStep('username');
                  setAnswer1('');
                  setAnswer2('');
                  setNewPassword('');
                  setConfirmPassword('');
                  setError('');
                }}
                className="flex-1 py-3 bg-gray-700 text-white hover:bg-gray-600 transition-all duration-300"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </div>
          </form>
        )}

        {/* Step 3: Success */}
        {step === 'success' && (
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-12 h-12 text-green-400" />
              </div>
            </div>
            <h3 className="text-2xl text-white mb-3">Password Reset Successfully!</h3>
            <p className="text-gray-400 mb-4">Your password has been updated. You can now log in with your new password.</p>
            <button
              onClick={handleBackToLogin}
              className="w-full py-3 bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
            >
              Back to Login
            </button>
          </div>
        )}

        {step !== 'success' && (
          <p className="text-white text-center mt-6">
            Remember your password?{' '}
            <Link to="/login" className="text-blue-400 hover:text-blue-300 underline">
              Login
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
