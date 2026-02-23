import React, { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { login } from "../../services/auth";
import { AlertCircle, Mail, Lock, Zap, ArrowRight, Sparkles } from "lucide-react";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Submitting login for:", email);

    setError(null);
    setLoading(true);

    try {
      const data = await login(email, password);
      console.log("Response:", data);
      window.location.href = "/dashboard";
    } catch (err: any) {
      const errorMsg = err.message || "Login failed";
      console.error("Login error:", errorMsg);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-blue-100 to-cyan-100 relative overflow-hidden flex items-center justify-center px-4">
      {/* Soft animated gradient orbs - all blue tones */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-white/40 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl animate-pulse animation-delay-2000" />
      <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-cyan-200/20 rounded-full blur-2xl" />
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/50 rounded-full backdrop-blur-sm border border-white/40"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${6 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Top brand section with glow */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-400/50 to-cyan-300/40 backdrop-blur-xl border-2 border-white/60 shadow-2xl mb-6 transform hover:scale-110 transition-transform hover:shadow-blue-300/50">
            <Sparkles className="w-10 h-10 text-blue-700 animate-pulse" />
          </div>
          <h1 className="text-4xl font-bold text-blue-900 mb-2 drop-shadow-lg">
            Adaptive Learning
          </h1>
          <p className="text-blue-700/80 text-sm font-semibold drop-shadow">Integrated Analytics Pipeline</p>
        </div>

        {/* Glassmorphic login card with glow */}
        <div className="rounded-3xl bg-white/30 backdrop-blur-2xl border-2 border-white/50 shadow-2xl p-8 space-y-6 relative overflow-hidden group">
          {/* Animated glow background */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-blue-200/10 group-hover:from-white/25 transition-all duration-500" />
          
          {/* Content */}
          <div className="relative z-20">
            {/* Header */}
            <div>
              <h2 className="text-2xl font-bold text-blue-900 mb-2 drop-shadow">Welcome Back</h2>
              <p className="text-blue-700/70 text-sm">Step into your learning adventure</p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Email Input */}
              <div className="group/input">
                <label htmlFor="login-email" className="block text-sm font-semibold text-blue-800 mb-3 drop-shadow">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-500/70 group-focus-within/input:text-blue-600 transition-colors" />
                  <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/40 backdrop-blur-sm border-2 border-white/50 text-blue-900 placeholder-blue-600/50 focus:outline-none focus:ring-2 focus:ring-blue-400/80 focus:border-white/70 transition-all hover:bg-white/50 focus:bg-white/60"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="group/input">
                <label htmlFor="login-password" className="block text-sm font-semibold text-blue-800 mb-3 drop-shadow">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-500/70 group-focus-within/input:text-blue-600 transition-colors" />
                  <input
                    id="login-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/40 backdrop-blur-sm border-2 border-white/50 text-blue-900 placeholder-blue-600/50 focus:outline-none focus:ring-2 focus:ring-blue-400/80 focus:border-white/70 transition-all hover:bg-white/50 focus:bg-white/60"
                    required
                  />
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="flex gap-3 p-3 bg-red-400/40 backdrop-blur-sm border-2 border-red-300/60 rounded-xl">
                  <AlertCircle className="w-5 h-5 text-red-700 flex-shrink-0 mt-0.5 drop-shadow" />
                  <p className="text-sm text-red-800 drop-shadow font-semibold">{error}</p>
                </div>
              )}

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white font-semibold disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-blue-400/50 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 relative overflow-hidden group/btn"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span className="text-white drop-shadow">Logging in...</span>
                  </>
                ) : (
                  <>
                    <span className="text-white drop-shadow font-bold">Sign In</span>
                    <ArrowRight className="w-4 h-4 text-white drop-shadow" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-blue-300/50 to-transparent" />
              <span className="text-xs text-blue-600/60 font-semibold">or</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-blue-300/50 to-transparent" />
            </div>

            {/* Sign Up Link */}
            <p className="text-center text-sm text-blue-700">
              Don't have an account?{" "}
              <Link to="/signup" className="font-bold text-blue-600 hover:text-blue-700 transition-colors drop-shadow underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>

        {/* Bottom decorative card - also blue transparent */}
        <div className="mt-6 p-4 rounded-2xl bg-white/30 backdrop-blur-xl border-2 border-white/50 text-center shadow-lg">
          <p className="text-xs text-blue-800 drop-shadow font-semibold">✨ Experience the Future of Learning ✨</p>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
            opacity: 0.6;
          }
          25% {
            transform: translateY(-20px) translateX(10px);
            opacity: 0.8;
          }
          50% {
            transform: translateY(-40px) translateX(-10px);
            opacity: 0.6;
          }
          75% {
            transform: translateY(-20px) translateX(-20px);
            opacity: 0.7;
          }
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
}
