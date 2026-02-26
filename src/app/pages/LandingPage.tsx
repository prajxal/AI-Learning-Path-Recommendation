import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, BookOpen, Target, TrendingUp, CheckCircle, Search, Layout, Play, Activity } from 'lucide-react';
import { getToken } from '../../services/auth';

export function LandingPage() {
  const navigate = useNavigate();
  const token = getToken(); // or localStorage.getItem("access_token")

  useEffect(() => {
    if (token) {
      navigate('/dashboard');
    }
  }, [token, navigate]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      {/* SECTION 1 — Navbar */}
      <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                <Layout className="w-5 h-5 text-accent-foreground" />
              </div>
              <span className="text-xl font-bold tracking-tight">LearnPathAI</span>
            </div>

            <div className="hidden md:flex items-center gap-6">
              <button onClick={() => scrollToSection('features')} className="text-sm font-medium hover:text-accent transition-colors">Features</button>
              <button onClick={() => scrollToSection('how-it-works')} className="text-sm font-medium hover:text-accent transition-colors">How It Works</button>
              <button onClick={() => scrollToSection('roadmaps')} className="text-sm font-medium hover:text-accent transition-colors">Roadmaps</button>
            </div>

            <div className="flex items-center gap-3">
              {token ? (
                <Link to="/dashboard" className="text-sm font-medium bg-accent text-accent-foreground px-4 py-2 rounded-md hover:bg-accent/90 transition-colors">
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/signin" className="text-sm font-medium hover:text-accent transition-colors px-3 py-2 hidden sm:block">
                    Sign In
                  </Link>
                  <Link to="/signup" className="text-sm font-medium bg-accent text-accent-foreground px-4 py-2 rounded-md hover:bg-accent/90 transition-colors">
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* SECTION 2 — Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-600 text-white py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 border border-white/20 rounded-full backdrop-blur-sm">
                <Sparkles className="w-4 h-4 text-blue-200" />
                <span className="text-sm font-medium text-blue-50">Introducing Next-Gen Learning</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
                AI-Powered Personalized Engineering Learning Paths
              </h1>
              <p className="text-lg sm:text-xl text-blue-50 max-w-2xl">
                Master engineering skills faster with adaptive roadmaps, curated resources, and intelligent progress tracking — tailored specifically to your skill level.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/signup" className="flex items-center justify-center gap-2 bg-white text-indigo-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-50 transition-colors shadow-lg">
                  Get Started Free
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link to="/roadmaps" className="flex items-center justify-center gap-2 bg-white/10 border border-white/30 text-white px-6 py-3 rounded-lg font-bold hover:bg-white/20 transition-colors backdrop-blur-sm">
                  Explore Roadmaps
                </Link>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-md lg:max-w-full">
              {/* Dashboard Preview Mockup */}
              <div className="aspect-[4/3] rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-4 overflow-hidden transform md:-rotate-2 hover:rotate-0 transition-transform duration-500">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="space-y-4">
                  <div className="h-8 bg-slate-800 rounded w-1/3"></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-24 bg-indigo-500/20 border border-indigo-500/30 rounded-lg p-3">
                      <div className="h-4 bg-indigo-500/50 w-1/2 rounded mb-2"></div>
                      <div className="h-2 bg-slate-700 w-full rounded mt-4">
                        <div className="h-2 bg-indigo-400 w-3/4 rounded"></div>
                      </div>
                    </div>
                    <div className="h-24 bg-slate-800 rounded-lg p-3 border border-slate-700">
                      <div className="h-4 bg-slate-600 w-2/3 rounded mb-2"></div>
                      <div className="h-2 bg-slate-700 w-full rounded mt-4">
                        <div className="h-2 bg-green-400 w-1/4 rounded"></div>
                      </div>
                    </div>
                  </div>
                  <div className="h-32 bg-slate-800 rounded-lg border border-slate-700 p-4">
                    <div className="h-4 bg-slate-600 w-1/4 rounded mb-4"></div>
                    <div className="flex gap-2">
                      <div className="w-10 h-10 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
                        <Play className="w-4 h-4 text-blue-400" />
                      </div>
                      <div className="flex-1 space-y-2 py-1">
                        <div className="h-3 bg-slate-600 rounded w-3/4"></div>
                        <div className="h-3 bg-slate-600 rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3 — Problem Section */}
      <div className="py-24 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold">Learning engineering skills is overwhelming</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center mb-6">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Too many resources, no clear path</h3>
              <p className="text-muted-foreground">Endless tutorials and documentation make it impossible to know where to start or what to learn next.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-xl flex items-center justify-center mb-6">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">No personalized guidance</h3>
              <p className="text-muted-foreground">Generic courses don't adapt to your prior knowledge, forcing you to re-learn basics or skip advanced topics.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-gray-100 text-gray-600 rounded-xl flex items-center justify-center mb-6">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">No progress tracking or feedback</h3>
              <p className="text-muted-foreground">Without a clear way to visualize progress, it's easy to lose motivation and give up halfway through.</p>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 4 — Solution Section */}
      <div id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Learn smarter with AI-guided learning paths</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Our intelligent platform creates the perfect curriculum for your unique journey.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col space-y-4 p-6 rounded-2xl hover:bg-gray-50 transition-colors">
              <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">Adaptive Learning Paths</h3>
              <p className="text-muted-foreground">
                Automatically adjusts difficulty based on your progress. Focus on what you need to learn, skip what you already know.
              </p>
            </div>
            <div className="flex flex-col space-y-4 p-6 rounded-2xl hover:bg-gray-50 transition-colors">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">Curated Resources</h3>
              <p className="text-muted-foreground">
                Hand-picked, high-quality videos and documentation from trusted sources, perfectly aligned with each topic.
              </p>
            </div>
            <div className="flex flex-col space-y-4 p-6 rounded-2xl hover:bg-gray-50 transition-colors">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">Progress Tracking</h3>
              <p className="text-muted-foreground">
                Track your learning journey and skill growth visually. Stay motivated with continuous feedback and mastery levels.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 5 — Product Preview Section */}
      <div className="py-24 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="flex items-center gap-2 px-6 py-4 border-b bg-gray-50/50">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
              <div className="ml-4 text-sm font-medium text-gray-400 flex-1 text-center">app.learnpathai.com/dashboard</div>
            </div>
            <div className="p-8 bg-gray-50">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar Mock */}
                <div className="hidden lg:flex flex-col gap-4">
                  <div className="h-8 w-8 bg-indigo-600 rounded-lg mb-8"></div>
                  <div className="h-10 bg-indigo-100 rounded-md w-full"></div>
                  <div className="h-10 bg-white border rounded-md w-full"></div>
                  <div className="h-10 bg-white border rounded-md w-full"></div>
                </div>
                {/* Main Content Mock */}
                <div className="lg:col-span-3 space-y-8">
                  <div className="flex justify-between items-center">
                    <div className="h-8 bg-gray-300 rounded w-1/3"></div>
                    <div className="h-10 bg-indigo-600 rounded w-32"></div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-xl border shadow-sm flex flex-col">
                      <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
                      <div className="h-4 bg-gray-100 rounded w-full mb-2"></div>
                      <div className="h-4 bg-gray-100 rounded w-2/3 mb-6"></div>
                      <div className="mt-auto">
                        <div className="flex justify-between text-sm mb-2 text-gray-500">
                          <span>Progress</span>
                          <span>75%</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full w-full overflow-hidden">
                          <div className="h-full bg-indigo-500 w-3/4"></div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl border shadow-sm flex flex-col">
                      <div className="h-6 bg-gray-200 rounded w-2/3 mb-4"></div>
                      <div className="h-4 bg-gray-100 rounded w-full mb-2"></div>
                      <div className="h-4 bg-gray-100 rounded w-3/4 mb-6"></div>
                      <div className="mt-auto">
                        <div className="flex justify-between text-sm mb-2 text-gray-500">
                          <span>Progress</span>
                          <span>30%</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full w-full overflow-hidden">
                          <div className="h-full bg-blue-500 w-1/3"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 6 — How It Works Section */}
      <div id="how-it-works" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">How it works</h2>
            <p className="text-xl text-muted-foreground">Your journey to mastery in 3 simple steps</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-gray-200"></div>

            <div className="relative flex flex-col items-center text-center z-10">
              <div className="w-24 h-24 bg-white border-4 border-indigo-50 shadow-lg rounded-full flex items-center justify-center mb-6">
                <Target className="w-10 h-10 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">1. Choose a roadmap</h3>
              <p className="text-muted-foreground">Select your target engineering discipline and let AI assess your current skill level.</p>
            </div>

            <div className="relative flex flex-col items-center text-center z-10">
              <div className="w-24 h-24 bg-white border-4 border-blue-50 shadow-lg rounded-full flex items-center justify-center mb-6">
                <BookOpen className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">2. Learn from curated resources</h3>
              <p className="text-muted-foreground">Dive into the right materials at the right time, perfectly matched to your progression.</p>
            </div>

            <div className="relative flex flex-col items-center text-center z-10">
              <div className="w-24 h-24 bg-white border-4 border-purple-50 shadow-lg rounded-full flex items-center justify-center mb-6">
                <TrendingUp className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">3. Track progress and improve</h3>
              <p className="text-muted-foreground">Monitor your proficiency, pass assessments, and visually see your engineering skills grow.</p>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 7 — Roadmaps Section */}
      <div id="roadmaps" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Explore our roadmaps</h2>
            <p className="text-xl text-muted-foreground">Comprehensive technical paths for modern engineers</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {['Backend', 'AI Engineering', 'Full Stack', 'DevOps', 'Cloud', 'Computer Science'].map((category) => (
              <Link
                key={category}
                to="/signup"
                className="group p-8 bg-white border rounded-2xl shadow-sm hover:border-indigo-500 hover:shadow-md transition-all flex items-center justify-between"
              >
                <span className="text-lg font-semibold group-hover:text-indigo-600 transition-colors">{category}</span>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 transition-colors transform group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 8 — Call to Action Section */}
      <div className="py-32 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-indigo-50/50"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-8">Start learning smarter today</h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Join thousands of developers who are mastering new skills with personalized, AI-driven learning paths.
          </p>
          <Link to="/signup" className="inline-flex items-center justify-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-indigo-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
            Create Free Account
            <ArrowRight className="w-6 h-6" />
          </Link>
        </div>
      </div>

      {/* SECTION 9 — Footer */}
      <footer className="py-12 bg-slate-900 text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col text-center md:text-left">
            <span className="text-2xl font-bold text-white mb-2 tracking-tight">LearnPathAI</span>
            <span className="text-sm">Engineering Learning Platform</span>
          </div>
          <div className="flex gap-8">
            <Link to="/signin" className="hover:text-white transition-colors">Sign In</Link>
            <Link to="/signup" className="hover:text-white transition-colors font-medium text-white">Sign Up</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
