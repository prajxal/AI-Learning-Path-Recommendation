import React from 'react';
import { Target, BookOpen, TrendingUp, Layout } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AuthLayoutProps {
    children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">

            {/* Left Marketing Section - Hidden on mobile, 55% width on desktop */}
            <div className="hidden md:flex flex-col justify-between w-[55%] bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-600 p-12 text-white relative overflow-hidden">
                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 -m-16 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -m-32 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl"></div>

                <div className="relative z-10 flex flex-col h-full">
                    {/* Brand/Logo */}
                    <div className="flex items-center gap-3 mb-16">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
                            <Layout className="w-6 h-6 text-indigo-600" />
                        </div>
                        <Link to="/" className="text-2xl font-bold tracking-tight">LearnPathAI</Link>
                    </div>

                    {/* Marketing Copy */}
                    <div className="flex-1 flex flex-col justify-center max-w-lg">
                        <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight mb-6">
                            Master Engineering Skills Faster
                        </h1>
                        <p className="text-lg text-blue-100 mb-10 leading-relaxed">
                            AI-powered adaptive roadmaps, curated resources, and progress tracking tailored to your level.
                        </p>

                        {/* Feature Bullets */}
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 backdrop-blur-sm border border-white/20">
                                    <Target className="w-5 h-5 text-blue-200" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg text-white">Adaptive Learning Paths</h3>
                                    <p className="text-blue-100/80 text-sm">Dynamic curriculums that adjust to your existing knowledge.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 backdrop-blur-sm border border-white/20">
                                    <BookOpen className="w-5 h-5 text-blue-200" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg text-white">Curated Resources</h3>
                                    <p className="text-blue-100/80 text-sm">High-quality handpicked materials from roadmap.sh.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 backdrop-blur-sm border border-white/20">
                                    <TrendingUp className="w-5 h-5 text-blue-200" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg text-white">Track Progress</h3>
                                    <p className="text-blue-100/80 text-sm">Visualize your skill growth and mastery over time.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8">
                        <p className="text-sm text-blue-200/60 font-medium">© {new Date().getFullYear()} LearnPathAI. All rights reserved.</p>
                    </div>
                </div>
            </div>

            {/* Right Form Section - 100% on mobile, 45% on desktop */}
            <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-8 relative">
                {/* Mobile Header (only visible on small screens) */}
                <div className="absolute top-8 left-6 md:hidden flex items-center gap-2">
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                        <Layout className="w-5 h-5 text-white" />
                    </div>
                    <Link to="/" className="text-xl font-bold tracking-tight text-slate-900">LearnPathAI</Link>
                </div>

                <div className="w-full max-w-md mx-auto">
                    {/* Form Container */}
                    <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-100 p-8 sm:p-10">
                        {children}
                    </div>
                </div>
            </div>

        </div>
    );
}
