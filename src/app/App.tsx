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

type Page = 'catalog' | 'dashboard' | 'roadmap' | 'topic-detail' | 'profile';

function ProtectedRoute({ children }: { children: React.ReactElement }) {
  const userId = localStorage.getItem('user_id');

  if (!userId) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function AppLayout() {
  return (
    <div className="min-h-screen bg-background">
      <AppNavbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Routes>
          <Route path="/" element={<RoadmapCatalogPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/roadmaps/:roadmapId" element={<RoadmapDetailPage />} />
          <Route path="/courses/:courseId" element={<CourseDetailPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
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
