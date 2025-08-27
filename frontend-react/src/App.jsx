import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // Import AuthProvider
import HomePage from './pages/HomePage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import DescriptionPage from './pages/DescriptionPage';
import FeedbackPage from './pages/FeedbackPage';
import AdminDashboard from './pages/AdminDashboard';
import ManageFeedbackPage from './pages/ManageFeedbackPage';
import ManagePestsAndPesticidesPage from './pages/ManagePestsAndPesticidesPage'; // Renamed from ManagePesticidesPage
import PestDetectPage from './pages/PestDetectPage';
import PestReportsPage from './pages/PestReportsPage';
import PestResultPage from './pages/PestResultPage';
import UserManagementPage from './pages/UserManagementPage';
import AuthPage from './pages/AuthPage';
import ProtectedRoute from './components/ProtectedRoute'; // Import ProtectedRoute
import LoginPage from './pages/LoginPage'; // Import LoginPage
import SignupPage from './pages/SignupPage'; // Import SignupPage

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/description" element={<DescriptionPage />} />
          <Route path="/feedback" element={<FeedbackPage />} />
          <Route path="/login" element={<LoginPage />} /> {/* Specific Login Route */}
          <Route path="/signup" element={<SignupPage />} /> {/* Specific Signup Route */}
          <Route path="/auth" element={<AuthPage />} /> {/* Keep AuthPage if it serves a specific auth purpose, otherwise it might be redundant */}

          {/* Protected Routes */}
          <Route 
            path="/pest-detect"
            element={
              <ProtectedRoute>
                <PestDetectPage />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/pest-reports"
            element={
              <ProtectedRoute>
                <PestReportsPage />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/pest-result"
            element={
              <ProtectedRoute>
                <PestResultPage />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/admin"
            element={
              <ProtectedRoute adminOnly={true}> {/* Added adminOnly prop */}
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/user-management"
            element={
              <ProtectedRoute adminOnly={true}> {/* Added adminOnly prop */}
                <UserManagementPage />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/manage-feedback"
            element={
              <ProtectedRoute adminOnly={true}> {/* Added adminOnly prop */}
                <ManageFeedbackPage />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/manage-pesticides"
            element={
              <ProtectedRoute adminOnly={true}>
                <ManagePestsAndPesticidesPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;