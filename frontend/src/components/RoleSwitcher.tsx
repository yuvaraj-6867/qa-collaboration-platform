import { useState, useEffect, useRef } from 'react';
import { Settings } from 'lucide-react';

interface RoleSwitcherProps {
  currentRole: string;
  onRoleChange: (role: string) => void;
}

const RoleSwitcher = ({ currentRole, onRoleChange }: RoleSwitcherProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const roles = [
    { value: 'developer', label: 'Developer', color: 'bg-blue-100 text-blue-800' },
    { value: 'tester', label: 'Tester', color: 'bg-green-100 text-green-800' },
    { value: 'manager', label: 'Manager', color: 'bg-purple-100 text-purple-800' },
    { value: 'admin', label: 'Admin', color: 'bg-red-100 text-red-800' }
  ];

  const currentRoleData = roles.find(role => role.value === currentRole);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
      >
        <Settings className="h-4 w-4" />
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${currentRoleData?.color}`}>
          {currentRoleData?.label}
        </span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-2">
            <div className="text-xs font-medium text-gray-500 mb-2">Switch Role (Testing)</div>
            {roles.map((role) => (
              <button
                key={role.value}
                onClick={() => {
                  onRoleChange(role.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-md text-sm hover:bg-gray-50 transition-colors ${
                  currentRole === role.value ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                }`}
              >
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mr-2 ${role.color}`}>
                  {role.label}
                </span>
                {role.value === 'developer' && 'Tickets only'}
                {role.value === 'tester' && 'Testing + automation'}
                {role.value === 'manager' && 'Management + analytics'}
                {role.value === 'admin' && 'Full access'}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleSwitcher;