import React from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { getDashboardStats } from '@/services/users';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Users, Store, Star, Plus, Settings } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { data: statsData, isLoading, error } = useQuery(
    'dashboard-stats',
    getDashboardStats
  );

  const stats = statsData?.data?.stats;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Failed to load dashboard statistics</p>
      </div>
    );
  }

  const statCards = [
    {
      name: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: Users,
      color: 'bg-blue-500',
      link: '/admin/users',
    },
    {
      name: 'Total Stores',
      value: stats?.totalStores || 0,
      icon: Store,
      color: 'bg-green-500',
      link: '/admin/stores',
    },
    {
      name: 'Total Ratings',
      value: stats?.totalRatings || 0,
      icon: Star,
      color: 'bg-yellow-500',
    },
  ];

  const quickActions = [
    {
      name: 'Add New User',
      description: 'Create a new user account',
      icon: Plus,
      link: '/admin/users?action=create',
      color: 'bg-primary-600 hover:bg-primary-700',
    },
    {
      name: 'Add New Store',
      description: 'Register a new store',
      icon: Plus,
      link: '/admin/stores?action=create',
      color: 'bg-green-600 hover:bg-green-700',
    },
    {
      name: 'Manage Users',
      description: 'View and manage all users',
      icon: Users,
      link: '/admin/users',
      color: 'bg-blue-600 hover:bg-blue-700',
    },
    {
      name: 'Manage Stores',
      description: 'View and manage all stores',
      icon: Store,
      link: '/admin/stores',
      color: 'bg-purple-600 hover:bg-purple-700',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">Manage users, stores, and monitor platform activity</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat) => (
          <div key={stat.name} className="card">
            <div className="card-body">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
              {stat.link && (
                <div className="mt-4">
                  <Link
                    to={stat.link}
                    className="text-sm text-primary-600 hover:text-primary-900 font-medium"
                  >
                    View details →
                  </Link>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickActions.map((action) => (
              <Link
                key={action.name}
                to={action.link}
                className={`p-4 rounded-lg text-white transition-colors ${action.color}`}
              >
                <div className="flex items-center">
                  <action.icon className="w-6 h-6" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium">{action.name}</h3>
                    <p className="text-xs opacity-90">{action.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity Section - Placeholder */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
        </div>
        <div className="card-body">
          <div className="text-center py-8 text-gray-500">
            <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Activity monitoring coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
