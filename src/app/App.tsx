import React, { useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppNavbar } from './components/AppNavbar';
import { AppSidebar } from './components/AppSidebar';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import CourseDetailPage from './pages/CourseDetailPage';
import RoadmapCatalogPage from './pages/RoadmapCatalogPage';
import RoadmapDetailPage from './pages/RoadmapDetailPage';
import DashboardPage from './pages/DashboardPage';
import ResourceViewerPage from './pages/ResourceViewerPage';
import MyProgressPage from './pages/MyProgressPage';

type Page = 'catalog' | 'dashboard' | 'roadmap' | 'topic-detail' | 'profile' | 'progress';

function ProtectedRoute({ children }: { children: React.ReactElement }) {
  const token = localStorage.getItem('access_token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

import { useLocation } from 'react-router-dom';

function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  let currentPage = 'roadmap';
  if (location.pathname.startsWith('/dashboard')) currentPage = 'dashboard';
  else if (location.pathname.startsWith('/profile')) currentPage = 'profile';
  else if (location.pathname.startsWith('/progress')) currentPage = 'progress';

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AppSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        currentPage={currentPage}
      />

      <div className="flex flex-col flex-1 overflow-hidden">
        <AppNavbar onMenuClick={() => setIsSidebarOpen(true)} showMenuButton={true} />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
            <Routes>
              <Route path="/" element={<RoadmapCatalogPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/progress" element={<MyProgressPage />} />
              <Route path="/roadmaps/:roadmapId" element={<RoadmapDetailPage />} />
              <Route path="/courses/:courseId" element={<CourseDetailPage />} />
              <Route path="/course/:courseId/resource/:resourceId" element={<ResourceViewerPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
