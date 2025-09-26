import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';
import { LogOut, User, Settings } from 'lucide-react';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case UserRole.SYSTEM_ADMIN:
        return 'bg-red-100 text-red-800';
      case UserRole.STORE_OWNER:
        return 'bg-blue-100 text-blue-800';
      case UserRole.NORMAL_USER:
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleDisplayName = (role: UserRole) => {
    switch (role) {
      case UserRole.SYSTEM_ADMIN:
        return 'Admin';
      case UserRole.STORE_OWNER:
        return 'Store Owner';
      case UserRole.NORMAL_USER:
        return 'User';
      default:
        return role;
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Store Rating Platform</span>
            </Link>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {user && (
              <>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-700">{user.name}</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                    {getRoleDisplayName(user.role)}
                  </span>
                </div>

                <Menu as="div" className="relative inline-block text-left">
                  <div>
                    <Menu.Button className="flex items-center p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md">
                      <User className="w-5 h-5" />
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div className="px-1 py-1">
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to="/profile"
                              className={`${
                                active ? 'bg-gray-100' : ''
                              } group flex rounded-md items-center w-full px-2 py-2 text-sm text-gray-700`}
                            >
                              <Settings className="w-4 h-4 mr-2" />
                              Profile Settings
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={handleLogout}
                              className={`${
                                active ? 'bg-gray-100' : ''
                              } group flex rounded-md items-center w-full px-2 py-2 text-sm text-gray-700`}
                            >
                              <LogOut className="w-4 h-4 mr-2" />
                              Logout
                            </button>
                          )}
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
