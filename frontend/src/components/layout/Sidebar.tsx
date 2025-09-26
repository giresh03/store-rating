import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';
import { 
  LayoutDashboard, 
  Users, 
  Store, 
  Star, 
  Settings,
  ShoppingBag
} from 'lucide-react';
import clsx from 'clsx';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: UserRole[];
}

const navigation: NavigationItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    roles: [UserRole.SYSTEM_ADMIN, UserRole.NORMAL_USER, UserRole.STORE_OWNER],
  },
  {
    name: 'User Management',
    href: '/admin/users',
    icon: Users,
    roles: [UserRole.SYSTEM_ADMIN],
  },
  {
    name: 'Store Management',
    href: '/admin/stores',
    icon: Store,
    roles: [UserRole.SYSTEM_ADMIN],
  },
  {
    name: 'Store Listings',
    href: '/stores',
    icon: ShoppingBag,
    roles: [UserRole.NORMAL_USER, UserRole.SYSTEM_ADMIN],
  },
  {
    name: 'Profile Settings',
    href: '/profile',
    icon: Settings,
    roles: [UserRole.SYSTEM_ADMIN, UserRole.NORMAL_USER, UserRole.STORE_OWNER],
  },
];

const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const filteredNavigation = navigation.filter(item => 
    item.roles.includes(user.role)
  );

  return (
    <aside className="w-64 bg-white shadow-sm border-r border-gray-200 min-h-screen">
      <nav className="mt-8 px-4 space-y-2">
        {filteredNavigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={clsx(
                'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                isActive
                  ? 'bg-primary-100 text-primary-700 border-r-2 border-primary-600'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              )}
            >
              <item.icon
                className={clsx(
                  'mr-3 h-5 w-5 flex-shrink-0',
                  isActive ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-600'
                )}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
