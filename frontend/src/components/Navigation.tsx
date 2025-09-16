import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { BarChart3, FileText, Ticket, Bot, File, TrendingUp, Users, Settings } from 'lucide-react';
import Notifications from './Notifications';
import logo from '../logo/logo.png';

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



  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <>
      {/* Top Header */}
      <div className="fixed top-0 left-64 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-end px-6 z-40">
        <div className="flex items-center space-x-3">
          <Notifications />
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
              AU
            </div>
            <span className="text-sm font-medium text-gray-900">
              Admin User
            </span>
          </div>
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

      {/* Left Sidebar */}
      <div className="fixed top-0 left-0 w-64 h-full bg-white border-r border-gray-200 z-50">
        {/* Logo */}
        <div className="flex items-center px-6 py-5">
          <img src={logo} alt="QA Platform" className="h-30 w-auto mr-3" />        </div>
        {/* Navigation Links */}
        <nav className="mt-2">
          {/* Overview Section */}
          <div className="px-6 py-2">
            <h3 className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Overview</h3>
          </div>
          <Link
            to="/dashboard"
            className={`flex items-center px-6 py-2.5 text-sm font-medium transition-colors ${location.pathname === '/dashboard'
                ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                : 'text-blue-600 hover:bg-blue-50 hover:text-blue-700'
              }`}
          >
            <BarChart3 className="h-5 w-5 mr-3 text-blue-600" />
            Dashboard
          </Link>

          {/* Testing Section */}
          <div className="px-6 py-2 mt-4">
            <h3 className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Testing</h3>
          </div>
          <Link
            to="/test-cases"
            className={`flex items-center px-6 py-2.5 text-sm font-medium transition-colors ${location.pathname === '/test-cases'
                ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`}
          >
            <FileText className="h-5 w-5 mr-3 text-blue-600" />
            Test Cases
          </Link>
          {currentUser.role !== 'developer' && (
            <Link
              to="/automation"
              className={`flex items-center px-6 py-2.5 text-sm font-medium transition-colors ${location.pathname === '/automation'
                  ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
            >
              <Bot className="h-5 w-5 mr-3 text-blue-600" />
              Automation
            </Link>
          )}

          {/* Management Section */}
          <div className="px-6 py-2 mt-4">
            <h3 className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Management</h3>
          </div>
          <Link
            to="/tickets"
            className={`flex items-center px-6 py-2.5 text-sm font-medium transition-colors ${location.pathname === '/tickets'
                ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`}
          >
            <Ticket className="h-5 w-5 mr-3 text-blue-600" />
            Tickets
          </Link>
          <Link
            to="/projects"
            className={`flex items-center px-6 py-2.5 text-sm font-medium transition-colors ${location.pathname === '/projects'
                ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`}
          >
            <TrendingUp className="h-5 w-5 mr-3 text-blue-600" />
            Projects
          </Link>
          <Link
            to="/documents"
            className={`flex items-center px-6 py-2.5 text-sm font-medium transition-colors ${location.pathname === '/documents'
                ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                : 'text-blue-600 hover:bg-blue-50 hover:text-blue-700'
              }`}
          >
            <File className="h-5 w-5 mr-3 text-blue-600" />
            Documents
          </Link>

          {/* Analytics & Admin Section */}
          <div className="px-6 py-2 mt-4">
            <h3 className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Analytics & Admin</h3>
          </div>
          <Link
            to="/analytics"
            className={`flex items-center px-6 py-2.5 text-sm font-medium transition-colors ${location.pathname === '/analytics'
                ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                : 'text-blue-600 hover:bg-blue-50 hover:text-blue-700'
              }`}
          >
            <TrendingUp className="h-5 w-5 mr-3 text-blue-600" />
            Analytics
          </Link>
          <Link
            to="/users"
            className={`flex items-center px-6 py-2.5 text-sm font-medium transition-colors ${location.pathname === '/users'
                ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`}
          >
            <Users className="h-5 w-5 mr-3 text-blue-600" />
            Users
          </Link>
          <Link
            to="/settings"
            className={`flex items-center px-6 py-2.5 text-sm font-medium transition-colors ${location.pathname === '/settings'
                ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`}
          >
            <Settings className="h-5 w-5 mr-3 text-blue-600" />
            Settings
          </Link>
        </nav>
      </div>
    </>
  );
}
export default Navigation;
