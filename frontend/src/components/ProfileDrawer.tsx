import React, { useState, useEffect } from 'react';
import { X, User, Shield, Palette, Key, Sun, Moon, Monitor, Camera } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useGlobalSnackbar } from './SnackbarProvider';

interface ProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: 'profile' | 'security' | 'appearance';
  onLogout?: () => void;
}

const ProfileDrawer: React.FC<ProfileDrawerProps> = ({ isOpen, onClose, activeTab, onLogout }) => {
  const [currentTab, setCurrentTab] = useState(activeTab);
  const [theme, setTheme] = useState('light');
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });
  const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
  const [profileImage, setProfileImage] = useState(currentUser.profile_image || '');
  const { showSuccess, showError } = useGlobalSnackbar();

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showError('Image size should be less than 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setProfileImage(imageUrl);
        
        const updatedUser = { ...currentUser, profile_image: imageUrl };
        setCurrentUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        window.dispatchEvent(new CustomEvent('userUpdated', { detail: updatedUser }));
        showSuccess('Profile image updated successfully!');
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    setCurrentTab(activeTab);
  }, [activeTab]);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
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

  if (!isOpen) return null;

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette }
  ];

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-96 bg-white dark:bg-gray-800 shadow-xl z-50 flex flex-col">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {currentTab === 'profile' && 'Profile'}
              {currentTab === 'security' && 'Security'}
              {currentTab === 'appearance' && 'Appearance'}
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg mb-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setCurrentTab(tab.id as any)}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors flex-1 justify-center ${
                    currentTab === tab.id
                      ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {currentTab === 'profile' && (
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">Profile Information</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Your personal information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    {profileImage ? (
                      <img
                        src={profileImage}
                        alt="Profile"
                        className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-lg font-bold border-2 border-gray-200 dark:border-gray-600">
                        {getInitials(currentUser.first_name, currentUser.last_name)}
                      </div>
                    )}
                    <input
                      type="file"
                      id="profile-image-drawer"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <Button
                      size="sm"
                      className="absolute -bottom-1 -right-1 rounded-full w-6 h-6 p-0 bg-blue-600 hover:bg-blue-700"
                      onClick={() => document.getElementById('profile-image-drawer')?.click()}
                    >
                      <Camera className="h-3 w-3" />
                    </Button>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {currentUser.first_name} {currentUser.last_name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{currentUser.email}</p>
                  </div>
                </div>
                
                <div>
                  <Label className="text-gray-900 dark:text-white">First Name</Label>
                  <Input
                    value={currentUser.first_name || ''}
                    className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    readOnly
                  />
                </div>
                <div>
                  <Label className="text-gray-900 dark:text-white">Last Name</Label>
                  <Input
                    value={currentUser.last_name || ''}
                    className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    readOnly
                  />
                </div>
                <div>
                  <Label className="text-gray-900 dark:text-white">Email</Label>
                  <Input
                    value={currentUser.email || ''}
                    className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    readOnly
                  />
                </div>
                <div>
                  <Label className="text-gray-900 dark:text-white">Role</Label>
                  <Input
                    value={currentUser.role || ''}
                    className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    readOnly
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {currentTab === 'security' && (
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">Security Settings</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Manage your account security
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div>
                    <Label className="text-gray-900 dark:text-white">Current Password</Label>
                    <Input 
                      type="password" 
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                      className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <Label className="text-gray-900 dark:text-white">New Password</Label>
                    <Input 
                      type="password" 
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                      className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <Label className="text-gray-900 dark:text-white">Confirm Password</Label>
                    <Input 
                      type="password" 
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
                  
                  <Button 
                    type="submit" 
                    disabled={passwordLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Key className="h-4 w-4 mr-2" />
                    {passwordLoading ? 'Updating...' : 'Change Password'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {currentTab === 'appearance' && (
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">Appearance</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Customize your workspace theme
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Label className="text-gray-900 dark:text-white">Theme</Label>
                  <div className="space-y-3">
                    <button
                      onClick={() => handleThemeChange('light')}
                      className={`w-full p-3 rounded-lg border-2 transition-all flex items-center space-x-3 ${
                        theme === 'light' 
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <Sun className="h-5 w-5 text-yellow-500" />
                      <div className="text-left">
                        <div className="font-medium text-gray-900 dark:text-white">Light</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Clean and bright</div>
                      </div>
                    </button>
                    
                    <button
                      onClick={() => handleThemeChange('dark')}
                      className={`w-full p-3 rounded-lg border-2 transition-all flex items-center space-x-3 ${
                        theme === 'dark' 
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <Moon className="h-5 w-5 text-blue-400" />
                      <div className="text-left">
                        <div className="font-medium text-gray-900 dark:text-white">Dark</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Easy on the eyes</div>
                      </div>
                    </button>
                    
                    <button
                      onClick={() => handleThemeChange('system')}
                      className={`w-full p-3 rounded-lg border-2 transition-all flex items-center space-x-3 ${
                        theme === 'system' 
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <Monitor className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                      <div className="text-left">
                        <div className="font-medium text-gray-900 dark:text-white">System</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Match device</div>
                      </div>
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        {onLogout && (
          <div className="p-6 mt-auto border-t border-gray-200 dark:border-gray-700">
            <button 
              onClick={onLogout}
              className="w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors font-medium"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default ProfileDrawer;