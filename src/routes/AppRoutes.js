import React from 'react';
import { Route, Routes } from 'react-router-dom';
import DashboardPage from '../components/pages/DashboardPage';
import BudgetPage from '../components/pages/BudgetPage';
import InvestmentsPage from '../components/pages/InvestmentsPage';
import ProfilePage from '../components/pages/ProfilePage';
import LoginPage from '../components/pages/LoginPage';
import SignupPage from '../components/pages/SignupPage';
import ForgotPasswordPage from '../components/pages/ForgotPasswordPage';
import PrivateRoute from './PrivateRoute';
import LandingPage from '../components/pages/LandingPage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route element={<PrivateRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/budget" element={<BudgetPage />} />
        <Route path="/investments" element={<InvestmentsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
