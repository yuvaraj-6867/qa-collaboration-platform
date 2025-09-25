import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useGlobalSnackbar } from '@/components/SnackbarProvider';
import { 
  User, 
  Bell, 
  Shield, 
  Database, 
  Palette,
  Key,
  Sun,
  Moon,
  Monitor
} from 'lucide-react';

const Switch: React.FC<{
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}> = ({ checked = false, onCheckedChange }) => (
  <button
    type="button"
    onClick={() => onCheckedChange?.(!checked)}
    className={`inline-flex h-6 w-11 items-center rounded-full transition-colors ${
      checked ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
    }`}
  >
    <span className={`block h-5 w-5 rounded-full bg-white shadow-lg transition-transform ${
      checked ? 'translate-x-5' : 'translate-x-0'
    }`} />
  </button>
);

const Settings: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('profile');
  const [theme, setTheme] = useState('light');
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    testResults: true
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const { showSuccess, showError } = useGlobalSnackbar();

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['profile', 'notifications', 'security', 'appearance', 'system'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

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

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'system', label: 'System', icon: Database }
  ];

  return (
    <div className="p-6 space-y-6 bg-white dark:bg-gray-900 min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
      </div>

      <div className="space-y-6">
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {activeTab === 'profile' && (
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">Profile Information</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Your personal information and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName" className="text-gray-900 dark:text-white">First Name</Label>
                  <Input
                    id="firstName"
                    value={currentUser.first_name || ''}
                    className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                    readOnly
                  />
                </div>
                <div>
                  <Label htmlFor="lastName" className="text-gray-900 dark:text-white">Last Name</Label>
                  <Input
                    id="lastName"
                    value={currentUser.last_name || ''}
                    className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                    readOnly
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="email" className="text-gray-900 dark:text-white">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={currentUser.email || ''}
                  className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                  readOnly
                />
              </div>
              <div>
                <Label htmlFor="role" className="text-gray-900 dark:text-white">Role</Label>
                <Input
                  id="role"
                  value={currentUser.role || ''}
                  className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                  readOnly
                />
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'notifications' && (
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">Notification Preferences</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Choose how you want to be notified about updates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-gray-900 dark:text-white">Email Notifications</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Receive notifications via email</p>
                </div>
                <Switch 
                  checked={notifications.email} 
                  onCheckedChange={(checked) => setNotifications({...notifications, email: checked})}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-gray-900 dark:text-white">Push Notifications</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Receive browser push notifications</p>
                </div>
                <Switch 
                  checked={notifications.push} 
                  onCheckedChange={(checked) => setNotifications({...notifications, push: checked})}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-gray-900 dark:text-white">Test Results</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Notify when test runs complete</p>
                </div>
                <Switch 
                  checked={notifications.testResults} 
                  onCheckedChange={(checked) => setNotifications({...notifications, testResults: checked})}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'security' && (
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">Security Settings</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Manage your account security and authentication
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handlePasswordChange}>
                <Label className="text-gray-900 dark:text-white">Change Password</Label>
                <div className="space-y-3 mt-2">
                  <Input 
                    type="password" 
                    placeholder="Current password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                    required
                    className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                  />
                  <Input 
                    type="password" 
                    placeholder="New password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                    required
                    className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                  />
                  <Input 
                    type="password" 
                    placeholder="Confirm new password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    required
                    className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                  />
                </div>
                
                {passwordMessage.text && (
                  <div className={`text-sm mt-2 ${
                    passwordMessage.type === 'error' ? 'text-red-500' : 'text-green-500'
                  }`}>
                    {passwordMessage.text}
                  </div>
                )}
                
                <Button 
                  type="submit" 
                  disabled={passwordLoading}
                  className="mt-3 bg-blue-600 hover:bg-blue-700 text-white" 
                  size="sm"
                >
                  <Key className="h-4 w-4 mr-2" />
                  {passwordLoading ? 'Updating...' : 'Change Password'}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {activeTab === 'appearance' && (
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">Appearance</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Customize the look and feel of your workspace
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-base font-medium text-gray-900 dark:text-white">Theme</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Choose your preferred theme</p>
                <div className="grid grid-cols-3 gap-4">
                  <button
                    onClick={() => handleThemeChange('light')}
                    className={`p-4 rounded-lg border-2 transition-all bg-white dark:bg-gray-800 ${
                      theme === 'light' 
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <Sun className="h-8 w-8 text-yellow-500" />
                      <span className="font-medium text-gray-900 dark:text-white">Light</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">Clean and bright</span>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => handleThemeChange('dark')}
                    className={`p-4 rounded-lg border-2 transition-all bg-white dark:bg-gray-800 ${
                      theme === 'dark' 
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <Moon className="h-8 w-8 text-blue-400" />
                      <span className="font-medium text-gray-900 dark:text-white">Dark</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">Easy on the eyes</span>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => handleThemeChange('system')}
                    className={`p-4 rounded-lg border-2 transition-all bg-white dark:bg-gray-800 ${
                      theme === 'system' 
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <Monitor className="h-8 w-8 text-gray-600 dark:text-gray-400" />
                      <span className="font-medium text-gray-900 dark:text-white">System</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">Match device</span>
                    </div>
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'system' && (
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">System Settings</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Configure system-wide preferences and debug authentication
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-gray-900 dark:text-white">Auto-save</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Automatically save changes</p>
                </div>
                <Switch checked={true} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-gray-900 dark:text-white">Debug Mode</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Enable debug logging</p>
                </div>
                <Switch checked={false} />
              </div>
              
              <div className="border-t pt-4">
                <Label className="text-gray-900 dark:text-white">Authentication Debug</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Tools to help diagnose authentication issues</p>
                <div className="space-x-2">
                  <Button
                    onClick={async () => {
                      try {
                        const response = await fetch('http://localhost:3001/api/v1/auth/debug/status', {
                          headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`,
                            'Content-Type': 'application/json'
                          }
                        });
                        const data = await response.json();
                        console.log('Auth Status:', data);
                        showSuccess(`Auth Status: ${data.authenticated ? 'Valid' : 'Invalid'}`);
                      } catch (err) {
                        console.error('Auth check failed:', err);
                        showError('Auth check failed - see console');
                      }
                    }}
                    variant="outline"
                    size="sm"
                  >
                    Check Auth Status
                  </Button>
                  <Button
                    onClick={async () => {
                      try {
                        const response = await fetch('http://localhost:3001/api/v1/auth/debug/test_token');
                        const data = await response.json();
                        if (data.token) {
                          localStorage.setItem('token', data.token);
                          localStorage.setItem('user', JSON.stringify(data.user));
                          showSuccess('Test token set! Please refresh the page.');
                        }
                      } catch (err) {
                        console.error('Failed to get test token:', err);
                        showError('Failed to get test token - see console');
                      }
                    }}
                    variant="outline"
                    size="sm"
                  >
                    Get Test Token
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Settings;