import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './pages/ThemeContext';
import { hasPageAccess } from './utils/permissions';
import Navigation from './components/Navigation';
import Dashboard from './pages/Dashboard';
import TestCases from './pages/TestCases';
import Tickets from './pages/Tickets';
import Documents from './pages/Documents';
import Automation from './pages/Automation';
import Analytics from './pages/analytics';
import Users from './pages/Users';
import Settings from './pages/Settings';
import Login from './pages/Login';
import './App.css';

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
}

const ProtectedRoute = ({ children, requiredPage }: { children: React.ReactNode, requiredPage: string }) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  if (!hasPageAccess(user.role, requiredPage)) {
    return <div className="p-6 text-center text-red-600">Access Denied - You don't have permission to view this page</div>;
  }
  
  return <>{children}</>;
};

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (token: string, userData: User) => {
    setIsAuthenticated(true);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  if (isLoading) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <ThemeProvider>
      <Router>
        <div style={{ minHeight: '100vh' }}>
          <Navigation key={user?.id} user={user!} onLogout={handleLogout} />
          <main>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={
                <ProtectedRoute requiredPage="dashboard">
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/test-cases" element={
                <ProtectedRoute requiredPage="test-cases">
                  <TestCases />
                </ProtectedRoute>
              } />
              <Route path="/tickets" element={
                <ProtectedRoute requiredPage="tickets">
                  <Tickets />
                </ProtectedRoute>
              } />
              <Route path="/automation" element={
                <ProtectedRoute requiredPage="automation">
                  <Automation />
                </ProtectedRoute>
              } />
              <Route path="/documents" element={
                <ProtectedRoute requiredPage="documents">
                  <Documents />
                </ProtectedRoute>
              } />
              <Route path="/analytics" element={
                <ProtectedRoute requiredPage="analytics">
                  <Analytics />
                </ProtectedRoute>
              } />
              <Route path="/users" element={
                <ProtectedRoute requiredPage="users">
                  <Users />
                </ProtectedRoute>
              } />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
