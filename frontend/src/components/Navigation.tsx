import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { BarChart3, FileText, Ticket, Bot, File, TrendingUp, Users, Settings } from 'lucide-react';
import Notifications from './Notifications';

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
  const [currentUser, setCurrentUser] = useState(user);


  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    }
  }, []);

  const allPages = [
    { name: 'Dashboard', path: '/dashboard', icon: BarChart3 },
    { name: 'Test Cases', path: '/test-cases', icon: FileText },
    { name: 'Tickets', path: '/tickets', icon: Ticket },
    { name: 'Automation', path: '/automation', icon: Bot },
    { name: 'Documents', path: '/documents', icon: File },
    { name: 'Analytics', path: '/analytics', icon: TrendingUp },
    { name: 'Projects', path: '/projects', icon: TrendingUp },
    { name: 'Users', path: '/users', icon: Users },
    { name: 'Settings', path: '/settings', icon: Settings }
  ];

  const availablePages = currentUser.role === 'developer'
    ? allPages.filter(page => page.name !== 'Automation')
    : allPages;

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <div className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center px-6 z-50">
      {/* Logo */}
      <div className="flex items-center">
        <h1 className="text-xl font-bold text-gray-900">QA Platform</h1>
      </div>

      {/* Navigation Links */}
      <nav className="flex items-center space-x-6 ml-8">
        {availablePages.map((page) => {
          const Icon = page.icon;
          const isActive = location.pathname === page.path;
          
          return (
            <Link
              key={page.path}
              to={page.path}
              className={`flex items-center px-2 py-1 text-sm font-medium transition-colors ${
                isActive
                  ? 'text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="h-4 w-4 mr-1" />
              {page.name}
            </Link>
          );
        })}
      </nav>

      {/* Right Section */}
      <div className="flex items-center space-x-3 ml-auto">
        {/* Live Notifications */}
        <Notifications />

        {/* Profile */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
            AU
          </div>
          <span className="text-sm font-medium text-gray-900">
            Admin User
          </span>
        </div>

        {/* Sign Out */}
        <Button 
          onClick={handleLogout}
          variant="ghost" 
          size="sm" 
          className="text-red-600 hover:bg-red-50"
        >
          Sign Out
        </Button>
      </div>


    </div>
  );
}
export default Navigation;
