import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { LogOut, Menu, X, Bell } from 'lucide-react';

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
}

interface NavigationProps {
  user: User;
  onLogout: () => void;
}

const Navigation = ({ user, onLogout }: NavigationProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(user);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    }
    
    // Fetch current user permissions - will show in network tab
    fetchUserPermissions();
  }, [location.pathname]);

  const fetchUserPermissions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/v1/users/current', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const userData = await response.json();
      console.log('Current user permissions:', userData);
      setCurrentUser(userData);
    } catch (error) {
      console.error('Failed to fetch user permissions:', error);
    }
  };



  const allPages = [
    { name: 'Dashboard', path: '/dashboard', icon: '📊' },
    { name: 'Test Cases', path: '/test-cases', icon: '🧪' },
    { name: 'Tickets', path: '/tickets', icon: '🎫' },
    { name: 'Documents', path: '/documents', icon: '📄' },
    { name: 'Analytics', path: '/analytics', icon: '📈' },
    { name: 'Users', path: '/users', icon: '👥' },
    { name: 'Settings', path: '/settings', icon: '⚙️' }
  ];
  
  // Add automation only for non-developer roles
  if (currentUser.role !== 'developer') {
    allPages.splice(3, 0, { name: 'Automation', path: '/automation', icon: '🤖' });
  }


  
  const availablePages = allPages;
  


  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">QA Platform</h1>
            </div>
            
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              {availablePages.map((page) => (
                <Link
                  key={page.path}
                  to={page.path}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    location.pathname === page.path
                      ? 'border-blue-500 text-gray-900 dark:text-white'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-300 dark:hover:text-white'
                  }`}
                >
                  <span className="mr-2">{page.icon}</span>
                  {page.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex md:items-center md:space-x-4">
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">3</span>
              </Button>
              <Link
                to="/settings"
                state={{ activeTab: 'system' }}
                className="text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                ⚙️ System
              </Link>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {currentUser.first_name} {currentUser.last_name}
              </span>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                {currentUser.role.replace('_', ' ').toUpperCase()}
              </span>
            </div>
            
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="hidden md:flex items-center"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>

            <div className="md:hidden">
              <Button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                variant="ghost"
                size="sm"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {availablePages.map((page) => (
              <Link
                key={page.path}
                to={page.path}
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                  location.pathname === page.path
                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                    : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="mr-2">{page.icon}</span>
                {page.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
