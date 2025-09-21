import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BarChart3, FileText, Ticket, Bot, File, TrendingUp, Users } from 'lucide-react';
import Notifications from './Notifications';
import ProfileDrawer from './ProfileDrawer';
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
  const [showProfileDrawer, setShowProfileDrawer] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      const emailBasedRole = assignRoleByEmail(user.email || '');
      const updatedUser = { ...user, role: emailBasedRole };
      setCurrentUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  }, []);

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };



  // Email-based role assignment
  const assignRoleByEmail = (email: string) => {
    if (email.includes('admin@')) return 'admin';
    if (email.includes('manager@') || email.includes('lead@')) return 'manager';
    if (email.includes('tester@') || email.includes('qa@')) return 'tester';
    if (email.includes('dev@') || email.includes('developer@')) return 'developer';
    return 'tester'; // default
  };

  // Auto-assign role based on email on component mount
  useEffect(() => {
    if (currentUser.email) {
      const emailBasedRole = assignRoleByEmail(currentUser.email);
      if (emailBasedRole !== currentUser.role) {
        const updatedUser = { ...currentUser, role: emailBasedRole };
        setCurrentUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
    }
  }, []);

  // Role-based access control
  const hasAccess = (feature: string) => {
    const role = currentUser.role;
    const permissions = {
      developer: ['dashboard', 'tickets'],
      tester: ['dashboard', 'test-cases', 'automation', 'tickets', 'documents', 'analytics'],
      manager: ['dashboard', 'test-cases', 'automation', 'tickets', 'documents', 'analytics'],
      admin: ['dashboard', 'test-cases', 'automation', 'tickets', 'documents', 'analytics', 'users']
    };
    return permissions[role as keyof typeof permissions]?.includes(feature) || false;
  };

  return (
    <>
      <div className="fixed top-0 left-64 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-end px-6 z-40">
        <div className="flex items-center space-x-3">
          <Notifications />
          <button
            onClick={() => setShowProfileDrawer(true)}
            className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
              AU
            </div>
          </button>
        </div>
      </div>

      <div className="fixed top-0 left-0 w-64 h-full bg-white border-r border-gray-200 z-50">
        <div className="flex items-center px-6 py-5">
          <Link to="/dashboard" className="flex items-center">
            <img src={logo} alt="QA Platform" className="h-30 w-auto mr-3" />
          </Link>
        </div>
        <nav className="mt-2">
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
          {hasAccess('test-cases') && (
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
          )}
          {hasAccess('automation') && (
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
          {(hasAccess('tickets') || hasAccess('documents')) && (
            <div className="px-6 py-2 mt-4">
              <h3 className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Management</h3>
            </div>
          )}
          {hasAccess('tickets') && (
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
          )}
          {hasAccess('documents') && (
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
          )}

          {(hasAccess('analytics') || hasAccess('users')) && (
            <div className="px-6 py-2 mt-4">
              <h3 className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Analytics & Admin</h3>
            </div>
          )}
          {hasAccess('analytics') && (
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
          )}
          {hasAccess('users') && (
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
          )}

        </nav>
      </div>

      <ProfileDrawer
        isOpen={showProfileDrawer}
        onClose={() => setShowProfileDrawer(false)}
        activeTab='profile'
        onLogout={handleLogout}
      />
    </>
  );
}
export default Navigation;
