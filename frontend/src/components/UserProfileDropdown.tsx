import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, 
  Settings, 
  LogOut, 
  ChevronDown,
  Palette,
  Key
} from 'lucide-react';
import { Button } from './ui/button';
import Notifications from './Notifications';

interface UserProfileDropdownProps {
  user: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
  };
  onLogout: () => void;
}

const UserProfileDropdown = ({ user, onLogout }: UserProfileDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    onLogout();
    navigate('/');
    setIsOpen(false);
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  const getRoleColor = (role: string) => {
    const colors = {
      admin: 'bg-gradient-to-r from-red-400 to-pink-500 text-white',
      manager: 'bg-gradient-to-r from-purple-400 to-indigo-500 text-white',
      tester: 'bg-gradient-to-r from-green-400 to-emerald-500 text-white',
      developer: 'bg-gradient-to-r from-cyan-400 to-blue-500 text-white'
    };
    return colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notifications */}
      <div className="flex items-center space-x-3">
        <Notifications />
        
        {/* Profile Dropdown Trigger */}
        <Button
          variant="ghost"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          {/* Avatar */}
          {user.profile_image ? (
            <img
              src={user.profile_image}
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover animate-float"
            />
          ) : (
            <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center text-white text-sm font-medium animate-float">
              {getInitials(user.first_name, user.last_name)}
            </div>
          )}
          
          {/* User Info */}
          <div className="hidden md:block text-left">
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {user.first_name} {user.last_name}
            </div>
            <div className={`text-xs px-2 py-0.5 rounded-full inline-block ${getRoleColor(user.role)}`}>
              {user.role.replace('_', ' ').toUpperCase()}
            </div>
          </div>
          
          <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </Button>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden animate-scaleIn">
          {/* Header */}
          <div className="px-4 py-3 bg-gradient-primary border-b border-white/20">
            <div className="flex items-center space-x-3">
              {user.profile_image ? (
                <img
                  src={user.profile_image}
                  alt="Profile"
                  className="w-12 h-12 rounded-full object-cover animate-bounce-custom"
                />
              ) : (
                <div className="w-12 h-12 bg-gradient-secondary rounded-full flex items-center justify-center text-white font-medium animate-bounce-custom">
                  {getInitials(user.first_name, user.last_name)}
                </div>
              )}
              <div>
                <div className="font-medium text-gray-900 dark:text-white">
                  {user.first_name} {user.last_name}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {user.email}
                </div>
                <div className={`text-xs px-2 py-1 rounded-full inline-block mt-1 ${getRoleColor(user.role)}`}>
                  {user.role.replace('_', ' ').toUpperCase()}
                </div>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            {/* Profile */}
            <Link
              to="/settings"
              state={{ activeTab: 'profile' }}
              onClick={() => setIsOpen(false)}
              className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-purple-50 hover:to-cyan-50 dark:hover:from-purple-900/20 dark:hover:to-cyan-900/20 transition-all duration-300 hover:translate-x-2 hover:scale-105 card-hover"
            >
              <User className="w-4 h-4 mr-3 text-gray-500" />
              <div>
                <div className="font-medium">Profile</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Manage your profile information</div>
              </div>
            </Link>

            {/* Security */}
            <Link
              to="/settings"
              state={{ activeTab: 'security' }}
              onClick={() => setIsOpen(false)}
              className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-purple-50 hover:to-cyan-50 dark:hover:from-purple-900/20 dark:hover:to-cyan-900/20 transition-all duration-300 hover:translate-x-2 hover:scale-105 card-hover"
            >
              <Key className="w-4 h-4 mr-3 text-gray-500" />
              <div>
                <div className="font-medium">Security</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Change password & security settings</div>
              </div>
            </Link>

            {/* Appearance */}
            <Link
              to="/settings"
              state={{ activeTab: 'appearance' }}
              onClick={() => setIsOpen(false)}
              className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-purple-50 hover:to-cyan-50 dark:hover:from-purple-900/20 dark:hover:to-cyan-900/20 transition-all duration-300 hover:translate-x-2 hover:scale-105 card-hover"
            >
              <Palette className="w-4 h-4 mr-3 text-gray-500" />
              <div>
                <div className="font-medium">Appearance</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Theme and display preferences</div>
              </div>
            </Link>

            {/* System Settings */}
            <Link
              to="/settings"
              state={{ activeTab: 'system' }}
              onClick={() => setIsOpen(false)}
              className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-purple-50 hover:to-cyan-50 dark:hover:from-purple-900/20 dark:hover:to-cyan-900/20 transition-all duration-300 hover:translate-x-2 hover:scale-105 card-hover"
            >
              <Settings className="w-4 h-4 mr-3 text-gray-500" />
              <div>
                <div className="font-medium">System Settings</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">System preferences and data</div>
              </div>
            </Link>

            {/* Divider */}
            <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 dark:hover:from-red-900/20 dark:hover:to-pink-900/20 transition-all duration-300 hover:translate-x-2 hover:scale-105 animate-wiggle"
            >
              <LogOut className="w-4 h-4 mr-3" />
              <div>
                <div className="font-medium">Sign Out</div>
                <div className="text-xs text-red-500 dark:text-red-400">Sign out of your account</div>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileDropdown;