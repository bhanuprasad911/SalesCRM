import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

import HeaderComponent from './components/HeaderComponent.jsx';
import FooterComponent from './components/FooterComponent.jsx';
import LoginPage from './pages/LoginPage.jsx';
import HomePage from './pages/HomePage.jsx';
import LeadsPage from './pages/LeadsPage.jsx';
import SchedulePage from './pages/SchedulePage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import style from './styles/App.module.css';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';

import useExecuteLogoutOnUserLeave from './hooks/useExecuteLogoutOnLeave.js';
import { useAuth } from './context/AuthContext';

const Layout = ({ children }) => {
  const location = useLocation();
  const isLogin = location.pathname === '/login';
  return (
    <div className={style.main}>
      <Toaster />
      <div className={style.innerMain}>
        <HeaderComponent />
        <div className={style.body}>{children}</div>
        {!isLogin && <FooterComponent />}
      </div>
    </div>
  );
};

const LayoutWrapper = () => {
  const { logoutUser} = useAuth(); // ✅ get logout function from context
  useExecuteLogoutOnUserLeave(logoutUser); // ✅ use the hook
  // console.log(user)

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <HomePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/leads"
          element={
            <PrivateRoute>
              <LeadsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/schedule"
          element={
            <PrivateRoute>
              <SchedulePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />
      </Routes>
    </Layout>
  );
};

const App = () => {
  return (
    <Router basename="/employee">
      <AuthProvider>
        <LayoutWrapper />
      </AuthProvider>
    </Router>
  );
};

export default App;
