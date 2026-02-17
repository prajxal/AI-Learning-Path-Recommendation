import React, { useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import { AppNavbar } from './components/AppNavbar';
import { AppSidebar } from './components/AppSidebar';
import { CourseCatalogPage } from './pages/CourseCatalogPage';
import { DashboardPage } from './pages/DashboardPage';
import { RoadmapPage } from './pages/RoadmapPage';
import { TopicDetailPage } from './pages/TopicDetailPage';
import { ProfilePage } from './pages/ProfilePage';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { RoadmapTopic } from './components/RoadmapContainer';
import { Course } from './data/courses';
import { generateRoadmapForCourse } from './data/roadmapData';
import { useRecommendation } from './hooks/useRecommendation';

type Page = 'catalog' | 'dashboard' | 'roadmap' | 'topic-detail' | 'profile';

function ProtectedRoute({ children }: { children: React.ReactElement }) {
  const userId = localStorage.getItem('user_id');

  if (!userId) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function MainAppShell() {
  const userId = localStorage.getItem('user_id') as string;
  const { recommendation, loading, error } = useRecommendation(userId);
  const [currentPage, setCurrentPage] = useState<Page>('catalog');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [topics, setTopics] = useState<RoadmapTopic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<RoadmapTopic | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleCourseSelect = (course: Course) => {
    setSelectedCourse(course);
    const roadmap = generateRoadmapForCourse(course.id);
    setTopics(roadmap);
    setCurrentPage('dashboard');
  };

  const handleTopicClick = (topic: RoadmapTopic) => {
    if (topic.status !== 'locked') {
      setSelectedTopic(topic);
      setCurrentPage('topic-detail');
    }
  };

  const handleMarkComplete = () => {
    if (!selectedTopic) return;

    setTopics((prevTopics) => {
      const updatedTopics = prevTopics.map((topic) => {
        if (topic.id === selectedTopic.id) {
          return { ...topic, status: 'completed' as const };
        }
        return topic;
      });

      // Unlock next topic
      const currentIndex = updatedTopics.findIndex(t => t.id === selectedTopic.id);
      if (currentIndex !== -1 && currentIndex < updatedTopics.length - 1) {
        const nextTopic = updatedTopics[currentIndex + 1];
        if (nextTopic.status === 'locked') {
          updatedTopics[currentIndex + 1] = { ...nextTopic, status: 'unlocked' };
        }
      }

      return updatedTopics;
    });

    setCurrentPage('dashboard');
    setSelectedTopic(null);
  };

  const handleNavigate = (page: string) => {
    if (page === 'dashboard' && !selectedCourse) {
      setCurrentPage('catalog');
    } else {
      setCurrentPage(page as Page);
    }
  };

  const handleBackToCatalog = () => {
    setCurrentPage('catalog');
    setSelectedCourse(null);
    setTopics([]);
    setSelectedTopic(null);
  };

  const showSidebar = currentPage !== 'catalog';

  const backendRecommendationTest = (
    <div className="mb-6 rounded-lg border bg-card p-4">
      <h2 className="text-lg font-medium">Backend Recommendation Test:</h2>
      <pre className="mt-2 overflow-x-auto text-sm text-muted-foreground">
        {loading
          ? 'Loading recommendation...'
          : error
            ? error
            : JSON.stringify(recommendation, null, 2)}
      </pre>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {currentPage === 'catalog' ? (
        <>
          <AppNavbar />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
            {backendRecommendationTest}
          </div>
          <CourseCatalogPage onCourseSelect={handleCourseSelect} />
        </>
      ) : (
        <div className="flex h-screen overflow-hidden">
          <AppSidebar
            currentPage={currentPage === 'topic-detail' ? 'roadmap' : currentPage}
            onNavigate={handleNavigate}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
          <div className="flex-1 flex flex-col overflow-hidden">
            <AppNavbar 
              onMenuClick={() => setSidebarOpen(true)}
              showMenuButton
            />
            <main className="flex-1 overflow-y-auto">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {backendRecommendationTest}
                {/* Breadcrumb */}
                {selectedCourse && (
                  <div className="mb-6">
                    <button
                      onClick={handleBackToCatalog}
                      className="text-sm text-accent hover:underline"
                    >
                      ← Back to Course Catalog
                    </button>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-2xl">{selectedCourse.icon}</span>
                      <div>
                        <h2 className="text-sm text-muted-foreground">{selectedCourse.category}</h2>
                        <h1 className="font-medium">{selectedCourse.title}</h1>
                      </div>
                    </div>
                  </div>
                )}

                {currentPage === 'dashboard' && selectedCourse && (
                  <DashboardPage
                    learningGoal={selectedCourse.title}
                    topics={topics}
                    onTopicClick={handleTopicClick}
                  />
                )}
                {currentPage === 'roadmap' && selectedCourse && (
                  <RoadmapPage
                    learningGoal={selectedCourse.title}
                    topics={topics}
                    onTopicClick={handleTopicClick}
                  />
                )}
                {currentPage === 'topic-detail' && selectedTopic && (
                  <TopicDetailPage
                    topic={selectedTopic}
                    onBack={() => setCurrentPage('roadmap')}
                    onMarkComplete={handleMarkComplete}
                  />
                )}
                {currentPage === 'profile' && selectedCourse && (
                  <ProfilePage
                    learningGoal={selectedCourse.title}
                    topics={topics}
                  />
                )}
              </div>
            </main>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainAppShell />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
