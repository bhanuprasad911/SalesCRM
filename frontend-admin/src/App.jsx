// App.jsx
import React from 'react';
import style from './styles/App.module.css';
import { Toaster } from 'react-hot-toast';
import {
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';

import SidebarComponent from './components/SidebarComponent.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Employees from './pages/Employees.jsx';
import Leads from './pages/Leads.jsx';
import Settings from './pages/Settings.jsx';
import SignUpPage from './pages/SignUpPage.jsx';

import { useAuth } from './context/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx'; // optional, if you've created one

function App() {
  const location = useLocation();
  const path = location.pathname;
  const { admin, loading } = useAuth();

  const showSidebar = path !== '/login';
  const select =
    path.charAt(1).toUpperCase() + path.slice(2).toLowerCase();

  if (loading) {
    return <div className={style.loader}>Loading...</div>;
  }

  return (
    <div className={style.main}>
      <Toaster />
      {showSidebar && <SidebarComponent path={path} />}

      <Routes>
        {/* Redirect to dashboard if logged in and accessing /login */}
        <Route
          path="/login"
          element={admin ? <Navigate to="/dashboard" /> : <SignUpPage />}
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            admin ? (
              <Dashboard select={select} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/employees"
          element={
            admin ? (
              <Employees select={select} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/leads"
          element={
            admin ? <Leads select={select} /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/settings"
          element={
            admin ? <Settings select={select} /> : <Navigate to="/login" />
          }
        />

        {/* Default redirect */}
        <Route
          path="/"
          element={
            admin ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;
