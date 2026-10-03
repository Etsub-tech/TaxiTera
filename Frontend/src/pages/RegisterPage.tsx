// src/pages/RegisterPage.tsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { X, ChevronDown, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import nightTaxiRoadImage from "figma:asset/4d5bb451231e240c7d8e991bfdfd55b0d2686a01.png";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedQuestion1, setSelectedQuestion1] = useState("");
  const [answer1, setAnswer1] = useState("");
  const [selectedQuestion2, setSelectedQuestion2] = useState("");
  const [answer2, setAnswer2] = useState("");
  const [securityQuestions, setSecurityQuestions] = useState<
    { id: number; question: string }[]
  >([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/auth/security-questions",
        );
        const data = await res.json();
        setSecurityQuestions(
          data.map((q: any) => ({ id: q.id, question: q.text })),
        );
      } catch {
        toast.error("Failed to load security questions");
      }
    };
    fetchQuestions();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (!selectedQuestion1 || !selectedQuestion2) {
      toast.error("Please select two security questions");
      return;
    }
    if (selectedQuestion1 === selectedQuestion2) {
      toast.error("Please select two different security questions");
      return;
    }
    if (!answer1.trim() || !answer2.trim()) {
      toast.error("Please provide answers to both security questions");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          password,
          securityQuestions: [
            { questionId: Number(selectedQuestion1), answer: answer1.trim() },
            { questionId: Number(selectedQuestion2), answer: answer2.trim() },
          ],
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Account created successfully! Please log in.");
        // Redirect to login after short delay so toast is visible
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        toast.error(
          data.message || "Registration failed (username may already exist)",
        );
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const availableQuestionsFor2 = securityQuestions.filter(
    (q) => q.id.toString() !== selectedQuestion1,
  );

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6 py-12"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${nightTaxiRoadImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="bg-gray-900/90 backdrop-blur-lg border border-blue-500/30 p-8 w-full max-w-md relative rounded-lg shadow-xl">
        <Link
          to="/"
          className="absolute top-4 right-4 text-white hover:text-blue-400 transition-colors"
        >
          <X className="w-6 h-6" />
        </Link>

        <h2 className="text-3xl text-white mb-8 text-center">Create Account</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-white mb-2">Username *</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800/70 border border-blue-500/40 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors rounded"
              placeholder="Choose a unique username"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-white mb-2">Password *</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800/70 border border-blue-500/40 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors rounded"
              placeholder="Choose a password (min. 8 characters)"
              required
              disabled={loading}
            />
            <p className="text-gray-400 text-sm mt-1">Minimum 8 characters</p>
          </div>

          <div>
            <label className="block text-white mb-2">Confirm Password *</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800/70 border border-blue-500/40 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors rounded"
              placeholder="Confirm your password"
              required
              disabled={loading}
            />
          </div>

          <div className="border-t border-blue-500/30 pt-6">
            <div className="flex items-start gap-2 mb-4">
              <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <p className="text-blue-300 text-sm">
                You must choose two security questions. These will be used to
                reset your password if you forget it.
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-white mb-2">
                Security Question 1 *
              </label>
              <div className="relative">
                <select
                  value={selectedQuestion1}
                  onChange={(e) => setSelectedQuestion1(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800/70 border border-blue-500/40 text-white focus:outline-none focus:border-blue-500 transition-colors appearance-none cursor-pointer rounded"
                  required
                  disabled={loading}
                >
                  <option value="">Select a question</option>
                  {securityQuestions.map((q) => (
                    <option
                      key={q.id}
                      value={q.id}
                      disabled={q.id.toString() === selectedQuestion2}
                    >
                      {q.question}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {selectedQuestion1 && (
              <div className="mb-4">
                <label className="block text-white mb-2">
                  Answer to Question 1 *
                </label>
                <input
                  type="text"
                  value={answer1}
                  onChange={(e) => setAnswer1(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800/70 border border-blue-500/40 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors rounded"
                  placeholder="Your answer"
                  required
                  disabled={loading}
                />
              </div>
            )}

            <div className="mb-4">
              <label className="block text-white mb-2">
                Security Question 2 *
              </label>
              <div className="relative">
                <select
                  value={selectedQuestion2}
                  onChange={(e) => setSelectedQuestion2(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800/70 border border-blue-500/40 text-white focus:outline-none focus:border-blue-500 transition-colors appearance-none cursor-pointer rounded"
                  required
                  disabled={!selectedQuestion1 || loading}
                >
                  <option value="">Select a question</option>
                  {availableQuestionsFor2.map((q) => (
                    <option key={q.id} value={q.id}>
                      {q.question}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {selectedQuestion2 && (
              <div className="mb-4">
                <label className="block text-white mb-2">
                  Answer to Question 2 *
                </label>
                <input
                  type="text"
                  value={answer2}
                  onChange={(e) => setAnswer2(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800/70 border border-blue-500/40 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors rounded"
                  placeholder="Your answer"
                  required
                  disabled={loading}
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 rounded"
            disabled={loading}
          >
            {loading ? "Registering..." : "Sign Up"}
          </button>
        </form>

        <p className="text-white text-center mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-400 hover:text-blue-300 underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
