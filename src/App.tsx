import React, { useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toast } from 'primereact/toast';
import { useAuthStore } from '@/store/authStore';
import { setToastRef } from '@/utils/toast';
import Layout from '@/components/Layout';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import Dashboard from '@/pages/Dashboard';
import Profile from '@/pages/Profile';
import About from '@/pages/About';
import AllEssays from '@/pages/AllEssays';
import NewEssay from '@/pages/NewEssay';
import Drafts from '@/pages/Drafts';
import Feedbacks from '@/pages/Feedbacks';
import AnalyzedEssays from '@/pages/AnalyzedEssays';
import EditEssay from '@/pages/EditEssay';
import EssayFeedback from '@/pages/EssayFeedback';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const App: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  const toastRef = useRef<Toast>(null);

  React.useEffect(() => {
    setToastRef(toastRef);
  }, []);

  return (
    <Router>
      <div className="App">
        <Toast 
          ref={toastRef} 
          position="top-right"
          className="mt-4"
        />

        <Routes>
          <Route
            path="/login"
            element={
              isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
            }
          />
          <Route
            path="/register"
            element={
              isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />
            }
          />
          <Route
            path="/forgot-password"
            element={
              isAuthenticated ? <Navigate to="/dashboard" replace /> : <ForgotPassword />
            }
          />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="about" element={<About />} />
            <Route path="essays" element={<AllEssays />} />
            <Route path="essays/new" element={<NewEssay />} />
            <Route path="essays/drafts" element={<Drafts />} />
            <Route path="essays/analyzed" element={<AnalyzedEssays />} />
            <Route path="essays/:id/edit" element={<EditEssay />} />
            <Route path="essays/:id/feedback" element={<EssayFeedback />} />
            <Route path="feedbacks" element={<Feedbacks />} />
          </Route>

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

