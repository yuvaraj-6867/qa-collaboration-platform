import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Key, Sun, Moon, Monitor, X, Settings as LucideSettings, LogOut } from 'lucide-react'
import './index.css'
import Dashboard from './pages/Dashboard'
import TestCases from './pages/TestCases'
import Tickets from './pages/Tickets'
import Automation from './pages/Automation'
import Documents from './pages/Documents'
import Analytics from './pages/analytics'
import Users from './pages/Users'
import Settings from './pages/Settings'
import Login from './pages/Login'

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
}

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [activeDrawer, setActiveDrawer] = useState<string | null>(null);
  const [theme, setTheme] = useState('light');
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (newTheme: string) => {
    const root = document.documentElement;
    
    if (newTheme === 'dark') {
      root.classList.add('dark');
    } else if (newTheme === 'light') {
      root.classList.remove('dark');
    } else if (newTheme === 'system') {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (systemDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  };

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage({ type: '', text: '' });

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'New password and confirmation do not match' });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordMessage({ type: 'error', text: 'New password must be at least 6 characters long' });
      return;
    }

    setPasswordLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/v1/auth/change_password', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          current_password: passwordData.currentPassword,
          new_password: passwordData.newPassword,
          confirm_password: passwordData.confirmPassword
        })
      });

      const data = await response.json();

      if (response.ok) {
        setPasswordMessage({ type: 'success', text: 'Password updated successfully' });
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setPasswordMessage({ type: 'error', text: data.error || 'Failed to update password' });
      }
    } catch (err) {
      setPasswordMessage({ type: 'error', text: 'Network error occurred' });
    } finally {
      setPasswordLoading(false);
    }
  };

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

  const openDrawer = (drawer: string) => {
    setActiveDrawer(drawer);
  };

  const closeDrawer = () => {
    setActiveDrawer(null);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className={`${sidebarExpanded ? 'w-64' : 'w-16'} bg-white border-r border-gray-200 transition-all duration-300 ease-in-out`}>
        <div className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">QA</span>
            </div>
            {sidebarExpanded && (
              <div>
                <h1 className="text-lg font-bold text-gray-900">QA Platform</h1>
                <p className="text-xs text-gray-500">Quality Assurance</p>
              </div>
            )}
          </div>
          
          <button
            onClick={() => setSidebarExpanded(!sidebarExpanded)}
            className="mt-4 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600"
          >
            <span className="text-lg">☰</span>
          </button>
        </div>
        
        <nav className={`${sidebarExpanded ? 'px-4' : 'px-2'} space-y-2`}>
          <Link to="/" className={`flex items-center ${sidebarExpanded ? 'px-3 py-2' : 'w-10 h-10 justify-center'} rounded-lg transition-colors ${isActive('/') ? 'bg-green-100 text-green-600' : 'text-gray-600 hover:bg-gray-100'}`}>
            <span className="text-lg">📊</span>
            {sidebarExpanded && <span className="ml-3 text-sm font-medium">Dashboard</span>}
          </Link>
          
          <Link to="/test-cases" className={`flex items-center ${sidebarExpanded ? 'px-3 py-2' : 'w-10 h-10 justify-center'} rounded-lg transition-colors ${isActive('/test-cases') ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}>
            <span className="text-lg">📋</span>
            {sidebarExpanded && <span className="ml-3 text-sm font-medium">Test Cases</span>}
          </Link>

          {sidebarExpanded && (
            <div className="pt-4 pb-2">
              <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">QA Tools</p>
            </div>
          )}
          
          <Link to="/tickets" className={`flex items-center ${sidebarExpanded ? 'px-3 py-2' : 'w-10 h-10 justify-center'} rounded-lg transition-colors ${isActive('/tickets') ? 'bg-yellow-100 text-yellow-600' : 'text-gray-600 hover:bg-gray-100'}`}>
            <span className="text-lg">🎫</span>
            {sidebarExpanded && <span className="ml-3 text-sm font-medium">Tickets</span>}
          </Link>
          
          <Link to="/automation" className={`flex items-center ${sidebarExpanded ? 'px-3 py-2' : 'w-10 h-10 justify-center'} rounded-lg transition-colors ${isActive('/automation') ? 'bg-purple-100 text-purple-600' : 'text-gray-600 hover:bg-gray-100'}`}>
            <span className="text-lg">🤖</span>
            {sidebarExpanded && <span className="ml-3 text-sm font-medium">Automation</span>}
          </Link>
          
          <Link to="/documents" className={`flex items-center ${sidebarExpanded ? 'px-3 py-2' : 'w-10 h-10 justify-center'} rounded-lg transition-colors ${isActive('/documents') ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}>
            <span className="text-lg">📄</span>
            {sidebarExpanded && <span className="ml-3 text-sm font-medium">Documents</span>}
          </Link>

          {sidebarExpanded && (
            <div className="pt-4 pb-2">
              <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Reports</p>
            </div>
          )}
          
          <Link to="/analytics" className={`flex items-center ${sidebarExpanded ? 'px-3 py-2' : 'w-10 h-10 justify-center'} rounded-lg transition-colors ${isActive('/analytics') ? 'bg-pink-100 text-pink-600' : 'text-gray-600 hover:bg-gray-100'}`}>
            <span className="text-lg">📈</span>
            {sidebarExpanded && <span className="ml-3 text-sm font-medium">Analytics</span>}
          </Link>

          {sidebarExpanded && (
            <div className="pt-4 pb-2">
              <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Admin</p>
            </div>
          )}
          
          <Link to="/users" className={`flex items-center ${sidebarExpanded ? 'px-3 py-2' : 'w-10 h-10 justify-center'} rounded-lg transition-colors ${isActive('/users') ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}>
            <span className="text-lg">👥</span>
            {sidebarExpanded && <span className="ml-3 text-sm font-medium">Users</span>}
          </Link>
        </nav>
      </div>

      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-end px-6">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => openDrawer('appearance')}
              className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
              title="Appearance"
            >
              <LucideSettings className="h-5 w-5" />
            </button>
            
            <button 
              onClick={() => openDrawer('security')}
              className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
              title="Security"
            >
              <Key className="h-5 w-5" />
            </button>
            
            <button 
              onClick={() => openDrawer('profile')}
              // className="flex items-center space-x-3 text-gray-700 hover:text-gray-900"
            >
              <span className="text-sm font-medium">👤</span>
              {/* <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                {user?.first_name?.[0] || 'A'}
              </div> */}
            </button>
            
            <button 
              onClick={handleLogout}
              className="p-2 text-gray-500 hover:text-red-600 rounded-lg hover:bg-gray-100"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/test-cases" element={<TestCases />} />
            <Route path="/tickets" element={<Tickets />} />
            <Route path="/automation" element={<Automation />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/users" element={<Users />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>

      {/* Drawer Overlay */}
      {activeDrawer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={closeDrawer}>
          <div 
            className="fixed right-0 top-0 h-full w-96 bg-white shadow-lg transform transition-transform duration-300 ease-in-out"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 h-full overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">
                  {activeDrawer === 'profile' && '👤 Profile'}
                  {activeDrawer === 'security' && '🔒 Security'}
                  {activeDrawer === 'appearance' && '🎨 Appearance'}
                </h2>
                <button onClick={closeDrawer} className="text-gray-500 hover:text-gray-700">
                  <X className="h-5 w-5" />
                </button>
              </div>

              {activeDrawer === 'profile' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Your personal information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>First Name</Label>
                      <Input value={user?.first_name || ''} readOnly />
                    </div>
                    <div>
                      <Label>Last Name</Label>
                      <Input value={user?.last_name || ''} readOnly />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input value={user?.email || ''} readOnly />
                    </div>
                    <div>
                      <Label>Role</Label>
                      <Input value={user?.role || ''} readOnly />
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeDrawer === 'security' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>Manage your account security</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handlePasswordChange} className="space-y-4">
                      <div>
                        <Label>Current Password</Label>
                        <Input 
                          type="password" 
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label>New Password</Label>
                        <Input 
                          type="password" 
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label>Confirm New Password</Label>
                        <Input 
                          type="password" 
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                          required
                        />
                      </div>
                      
                      {passwordMessage.text && (
                        <div className={`text-sm ${
                          passwordMessage.type === 'error' ? 'text-red-500' : 'text-green-500'
                        }`}>
                          {passwordMessage.text}
                        </div>
                      )}
                      
                      <Button type="submit" disabled={passwordLoading} className="w-full">
                        <Key className="h-4 w-4 mr-2" />
                        {passwordLoading ? 'Updating...' : 'Change Password'}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              )}

              {activeDrawer === 'appearance' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Appearance Settings</CardTitle>
                    <CardDescription>Customize your workspace theme</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Label className="text-base font-medium">Theme</Label>
                      <div className="space-y-3">
                        <button
                          onClick={() => handleThemeChange('light')}
                          className={`w-full p-3 rounded-lg border-2 transition-all ${
                            theme === 'light' 
                              ? 'border-blue-500 bg-blue-50' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <Sun className="h-6 w-6 text-yellow-500" />
                            <div className="text-left">
                              <div className="font-medium">Light</div>
                              <div className="text-sm text-gray-500">Clean and bright</div>
                            </div>
                          </div>
                        </button>
                        
                        <button
                          onClick={() => handleThemeChange('dark')}
                          className={`w-full p-3 rounded-lg border-2 transition-all ${
                            theme === 'dark' 
                              ? 'border-blue-500 bg-blue-50' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <Moon className="h-6 w-6 text-blue-400" />
                            <div className="text-left">
                              <div className="font-medium">Dark</div>
                              <div className="text-sm text-gray-500">Easy on the eyes</div>
                            </div>
                          </div>
                        </button>
                        
                        <button
                          onClick={() => handleThemeChange('system')}
                          className={`w-full p-3 rounded-lg border-2 transition-all ${
                            theme === 'system' 
                              ? 'border-blue-500 bg-blue-50' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <Monitor className="h-6 w-6 text-gray-600" />
                            <div className="text-left">
                              <div className="font-medium">System</div>
                              <div className="text-sm text-gray-500">Match device</div>
                            </div>
                          </div>
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AppContent />
    </Router>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
