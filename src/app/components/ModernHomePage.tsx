import React from 'react';
import { GraduationCap, Zap, TrendingUp, Users, ArrowRight, Star } from 'lucide-react';

export function ModernHomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 blur-3xl" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full">
                  <Zap className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-600">AI-Powered Learning</span>
                </div>
                
                <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
                  Master Your 
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> Engineering Skills</span>
                </h1>
                
                <p className="text-xl text-slate-600 leading-relaxed">
                  Personalized learning paths, AI-driven recommendations, and real-time progress tracking to accelerate your career growth.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
                  Start Learning <ArrowRight className="w-5 h-5" />
                </button>
                <button className="px-8 py-4 bg-white text-slate-900 border-2 border-slate-200 rounded-lg font-semibold hover:border-slate-300 hover:bg-slate-50 transition-all">
                  Explore Roadmaps
                </button>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-slate-200">
                <div>
                  <p className="text-2xl font-bold text-slate-900">500+</p>
                  <p className="text-sm text-slate-600">Courses</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">50k+</p>
                  <p className="text-sm text-slate-600">Learners</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">95%</p>
                  <p className="text-sm text-slate-600">Satisfaction</p>
                </div>
              </div>
            </div>
            
            {/* Right - Visual Element */}
            <div className="relative h-96 lg:h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-3xl opacity-10" />
              <div className="absolute inset-4 bg-gradient-to-t from-blue-500/20 to-transparent rounded-3xl backdrop-blur-sm border border-white/20" />
              
              <div className="relative h-full flex flex-col items-center justify-center space-y-8 p-8">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <GraduationCap className="w-10 h-10 text-white" />
                </div>
                <div className="space-y-4 text-center">
                  <h3 className="text-xl font-bold text-slate-900">Adaptive Learning</h3>
                  <p className="text-slate-600 max-w-xs">Paths that evolve with your progress</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Why Choose Adaptive Learning?</h2>
            <p className="text-lg text-slate-600">Everything you need to accelerate your engineering career</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 hover:border-blue-400 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">AI-Powered</h3>
              <p className="text-slate-600">Smart algorithms that personalize your learning journey based on your pace and style.</p>
            </div>
            
            {/* Feature 2 */}
            <div className="group p-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200 hover:border-green-400 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Track Progress</h3>
              <p className="text-slate-600">Real-time analytics and insights to monitor your skill development and growth.</p>
            </div>
            
            {/* Feature 3 */}
            <div className="group p-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-200 hover:border-purple-400 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Community</h3>
              <p className="text-slate-600">Connect with thousands of engineers, share knowledge, and grow together.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Roadmaps Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Popular Learning Paths</h2>
            <p className="text-lg text-slate-600">Start your journey with industry-leading roadmaps</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Full Stack Web Dev', duration: '6 months', level: 'Intermediate' },
              { title: 'Cloud Engineering', duration: '4 months', level: 'Advanced' },
              { title: 'Data Science', duration: '5 months', level: 'Intermediate' },
            ].map((roadmap, idx) => (
              <div key={idx} className="group p-8 bg-white rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-xl transition-all cursor-pointer">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{roadmap.title}</h3>
                <p className="text-slate-600 mb-4">Master essential skills and best practices</p>
                <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                  <div>
                    <p className="text-sm text-slate-600">{roadmap.duration}</p>
                    <p className="text-xs text-slate-500">{roadmap.level}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-blue-600 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Transform Your Career?</h2>
          <p className="text-xl text-blue-100 mb-8">Join thousands of engineers already learning with AI-powered personalization.</p>
          <button className="px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl">
            Get Started Free
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <span className="font-semibold text-white">Adaptive Learning</span>
              </div>
              <p className="text-sm text-slate-400">Personalized engineering education</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Features</a></li>
                <li><a href="#" className="hover:text-white transition">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition">Roadmaps</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">About</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms</a></li>
                <li><a href="#" className="hover:text-white transition">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-sm text-slate-400">
            <p>&copy; 2026 Adaptive Learning System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
