// ============================================
// App.jsx
// Root component — React Router + Auth configuration
// All routes, layout wrapper, and protected routes
// ============================================

import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import LoginPage              from './pages/LoginPage';
import DashboardPage          from './pages/DashboardPage';
import FocusSessionPage       from './pages/FocusSessionPage';
import TasksPage              from './pages/TasksPage';
import ProgressPage           from './pages/ProgressPage';
import AIRecommendationsPage  from './pages/AIRecommendationsPage';
import SuccessPage            from './pages/SuccessPage';

// Layout wrapper — shows Navbar on all pages except Login and Success
const AppLayout = ({ children }) => {
  const location = useLocation();
  const noNavbarRoutes = ['/', '/success'];
  const showNavbar = !noNavbarRoutes.includes(location.pathname);

  return (
    <>
      {showNavbar && <Navbar />}
      {children}
    </>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppLayout>
          <Routes>
            {/* Public route */}
            <Route path="/" element={<LoginPage />} />

            {/* Protected routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute><DashboardPage /></ProtectedRoute>
              }
            />
            <Route
              path="/focus"
              element={
                <ProtectedRoute><FocusSessionPage /></ProtectedRoute>
              }
            />
            <Route
              path="/tasks"
              element={
                <ProtectedRoute><TasksPage /></ProtectedRoute>
              }
            />
            <Route
              path="/progress"
              element={
                <ProtectedRoute><ProgressPage /></ProtectedRoute>
              }
            />
            <Route
              path="/ai-recommendations"
              element={
                <ProtectedRoute><AIRecommendationsPage /></ProtectedRoute>
              }
            />
            <Route
              path="/success"
              element={
                <ProtectedRoute><SuccessPage /></ProtectedRoute>
              }
            />

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppLayout>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
