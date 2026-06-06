// ============================================
// App.jsx
// Root component — React Router configuration
// All routes and layout wrapper defined here
// ============================================

import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
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
  // Pages that should NOT show the navbar
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
      <AppLayout>
        <Routes>
          {/* Default redirect to login */}
          <Route path="/" element={<LoginPage />} />

          {/* Main app routes */}
          <Route path="/dashboard"          element={<DashboardPage />} />
          <Route path="/focus"              element={<FocusSessionPage />} />
          <Route path="/tasks"              element={<TasksPage />} />
          <Route path="/progress"           element={<ProgressPage />} />
          <Route path="/ai-recommendations" element={<AIRecommendationsPage />} />
          <Route path="/success"            element={<SuccessPage />} />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
};

export default App;
