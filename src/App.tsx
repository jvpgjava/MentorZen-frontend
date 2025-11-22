import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from '@/store/authStore';
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
import EssayEditor from '@/components/EssayEditor';
import FeedbackViewer from '@/components/FeedbackViewer';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const App: React.FC = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <Router>
      <div className="App">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#fff',
              color: '#1f2937',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
              padding: '16px',
              fontSize: '14px',
              fontWeight: '500',
              minWidth: '320px',
            },
            success: {
              iconTheme: {
                primary: '#10B981',
                secondary: '#fff',
              },
              style: {
                borderLeft: '4px solid #10B981',
              },
            },
            error: {
              iconTheme: {
                primary: '#EF4444',
                secondary: '#fff',
              },
              style: {
                borderLeft: '4px solid #EF4444',
              },
            },
            loading: {
              iconTheme: {
                primary: '#f97316',
                secondary: '#fff',
              },
            },
          }}
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
            <Route path="essays/:id" element={<EssayEditor />} />
            <Route path="essays/:id/edit" element={<EssayEditor />} />
            <Route path="essays/:id/feedback" element={<FeedbackViewer />} />
            <Route path="feedbacks" element={<Feedbacks />} />
          </Route>

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

