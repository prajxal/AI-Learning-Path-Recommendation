import React from 'react';
import { GraduationCap, Menu } from 'lucide-react';

interface AppNavbarProps {
  onMenuClick?: () => void;
  showMenuButton?: boolean;
}

export function AppNavbar({ onMenuClick, showMenuButton = false }: AppNavbarProps) {
  return (
    <nav className="border-b border-slate-200 bg-gradient-to-r from-white via-blue-50/50 to-white sticky top-0 z-40 backdrop-blur-sm shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            {showMenuButton && (
              <button
                onClick={onMenuClick}
                className="lg:hidden text-slate-700 hover:text-blue-600 transition-colors hover:bg-blue-100/50 p-2 rounded-lg"
              >
                <Menu className="w-6 h-6" />
              </button>
            )}
            <div className="flex items-center gap-3 ml-2 group cursor-pointer">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-all transform group-hover:scale-105">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="font-bold text-sm bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">Adaptive Learning</span>
                <span className="text-xs text-slate-500 font-medium">Integrated Analytics Pipeline</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-600 hidden sm:block px-4 py-2 bg-slate-100/60 rounded-lg border border-slate-200/60">
              🚀 Engineering Learning Platform
            </span>
            <button className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium text-sm hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg transform hover:scale-105">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
