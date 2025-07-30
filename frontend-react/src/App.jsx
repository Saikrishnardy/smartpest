import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import HomePage from './pages/HomePage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import DescriptionPage from './pages/DescriptionPage';
import FeedbackPage from './pages/FeedbackPage';
import AdminDashboard from './pages/AdminDashboard';
import ManageFeedbackPage from './pages/ManageFeedbackPage';
import ManagePesticidesPage from './pages/ManagePesticidesPage';
import PestDetectPage from './pages/PestDetectPage';
import PestReportsPage from './pages/PestReportsPage';
import PestResultPage from './pages/PestResultPage';
import UserManagementPage from './pages/UserManagementPage';
import AuthPage from './pages/AuthPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/description" element={<DescriptionPage />} />
        <Route path="/feedback" element={<FeedbackPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/manage-feedback" element={<ManageFeedbackPage />} />
        <Route path="/manage-pesticides" element={<ManagePesticidesPage />} />
        <Route path="/pest-detect" element={<PestDetectPage />} />
        <Route path="/pest-reports" element={<PestReportsPage />} />
        <Route path="/pest-result" element={<PestResultPage />} />
        <Route path="/user-management" element={<UserManagementPage />} />
        <Route path="/auth" element={<AuthPage />} />
      </Routes>
    </Router>
  );
}

export default App;