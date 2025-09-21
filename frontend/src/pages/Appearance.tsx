import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Sun, Moon, Monitor } from 'lucide-react';

const Appearance: React.FC = () => {
  const [theme, setTheme] = useState('light');

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

  return (
    <div className="p-6 space-y-6 bg-white dark:bg-gray-900 min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Appearance</h1>
      </div>

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
    </div>
  );
};

export default Appearance;