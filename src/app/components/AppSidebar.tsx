import React from 'react';
import { Home, Map, User, GraduationCap, X, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../services/auth';

interface AppSidebarProps {
  currentPage: string;
  isOpen?: boolean;
  onClose?: () => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/dashboard' },
  { id: 'roadmap', label: 'Learning Path', icon: Map, path: '/' },
  { id: 'progress', label: 'My Progress', icon: User, path: '/progress' },
];

export function AppSidebar({ currentPage, isOpen = true, onClose }: AppSidebarProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static top-0 left-0 h-full bg-sidebar border-r border-sidebar-border z-50 flex-shrink-0
          transition-transform duration-200 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          w-[240px]
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header - Mobile Only */}
          <div className="h-16 border-b border-sidebar-border flex items-center justify-between px-4 lg:hidden">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-[6px] flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="font-medium">LearnPath AI</span>
            </div>
            <button
              onClick={onClose}
              className="text-sidebar-foreground hover:text-accent transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Desktop Header */}
          <div className="hidden lg:block h-16 border-b border-sidebar-border px-4">
            <div className="h-full flex items-center">
              <span className="text-sm font-medium text-muted-foreground">NAVIGATION</span>
            </div>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 p-3 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    navigate(item.path);
                    onClose?.();
                  }}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-[6px] transition-all
                    ${isActive
                      ? 'bg-accent text-accent-foreground font-medium shadow-sm'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-sidebar-border space-y-4">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors font-medium border border-red-100"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
            <div className="text-xs text-muted-foreground text-center">
              <p>© 2026 LearnPath AI</p>
              <p className="mt-1">Engineering Education</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
