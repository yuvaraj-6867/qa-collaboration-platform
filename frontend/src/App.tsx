import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './pages/ThemeContext';
import { SnackbarProvider } from './components/SnackbarProvider';
import Navigation from './components/Navigation';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Projects from './pages/projects';
import TestCases from './pages/TestCases';
import Automation from './pages/Automation';
import Tickets from './pages/Tickets';
import Documents from './pages/Documents';
import Analytics from './pages/analytics';
import Users from './pages/Users';
import Settings from './pages/Settings';
import AcceptInvitation from './pages/AcceptInvitation';
import AllNotifications from './pages/AllNotifications';
import './utils/authDebug';
import './App.css';

function App() {
  const isAuthenticated = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const handleLogin = (_token: string, _user: any) => {
    window.location.href = '/dashboard';
  };

  return (
    <ThemeProvider>
      <SnackbarProvider>
        <Router>
          <div className="min-h-screen bg-background">
            {isAuthenticated && <Navigation user={user} onLogout={handleLogout} />}
            <div className={isAuthenticated ? "pt-16" : ""}>
              <Routes>
              <Route path="/login" element={!isAuthenticated ? <Login onLogin={handleLogin} /> : <Navigate to="/dashboard" />} />
              <Route path="/accept-invitation" element={<AcceptInvitation />} />
              <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
              <Route path="/test-cases" element={isAuthenticated ? <TestCases /> : <Navigate to="/login" />} />
              <Route path="/automation" element={isAuthenticated ? <Automation /> : <Navigate to="/login" />} />
              <Route path="/tickets" element={isAuthenticated ? <Tickets /> : <Navigate to="/login" />} />
              <Route path="/documents" element={isAuthenticated ? <Documents /> : <Navigate to="/login" />} />
              <Route path="/analytics" element={isAuthenticated ? <Analytics /> : <Navigate to="/login" />} />
              <Route path="/projects" element={isAuthenticated ? <Projects /> : <Navigate to="/login" />} />
              <Route path="/users" element={isAuthenticated ? <Users /> : <Navigate to="/login" />} />
              <Route path="/settings" element={isAuthenticated ? <Settings /> : <Navigate to="/login" />} />
              <Route path="/notifications" element={isAuthenticated ? <AllNotifications /> : <Navigate to="/login" />} />
                <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
              </Routes>
            </div>
          </div>
        </Router>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;