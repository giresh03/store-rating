import React from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getMyRatings } from '@/services/ratings';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import StarRating from '@/components/ui/StarRating';
import { Store, Star, Search, MapPin } from 'lucide-react';

const NormalUserDashboard: React.FC = () => {
  const { user } = useAuth();
  
  const { data: ratingsData, isLoading, error } = useQuery(
    'my-ratings',
    getMyRatings
  );

  const ratings = ratingsData?.data?.ratings || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const quickActions = [
    {
      name: 'Browse Stores',
      description: 'Discover and rate stores',
      icon: Store,
      link: '/stores',
      color: 'bg-primary-600 hover:bg-primary-700',
    },
    {
      name: 'Search Stores',
      description: 'Find stores by name or location',
      icon: Search,
      link: '/stores?search=true',
      color: 'bg-green-600 hover:bg-green-700',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-600">Discover and rate amazing stores</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {quickActions.map((action) => (
          <Link
            key={action.name}
            to={action.link}
            className={`p-6 rounded-lg text-white transition-colors ${action.color}`}
          >
            <div className="flex items-center">
              <action.icon className="w-8 h-8" />
              <div className="ml-4">
                <h3 className="text-lg font-medium">{action.name}</h3>
                <p className="text-sm opacity-90">{action.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* My Ratings */}
      <div className="card">
        <div className="card-header flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">My Recent Ratings</h2>
          <Link
            to="/stores"
            className="text-sm text-primary-600 hover:text-primary-900 font-medium"
          >
            Rate more stores →
          </Link>
        </div>
        <div className="card-body">
          {error ? (
            <div className="text-center py-8 text-red-600">
              <p>Failed to load your ratings</p>
            </div>
          ) : ratings.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Star className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">No ratings yet</p>
              <p className="mb-4">Start rating stores to see them here</p>
              <Link
                to="/stores"
                className="btn-primary"
              >
                Browse Stores
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {ratings.slice(0, 5).map((rating) => (
                <div
                  key={rating.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">
                      {rating.store?.name}
                    </h3>
                    <div className="flex items-center mt-1 text-sm text-gray-500">
                      <MapPin className="w-4 h-4 mr-1" />
                      {rating.store?.address}
                    </div>
                    <div className="mt-2">
                      <StarRating rating={rating.ratingValue} size="sm" />
                    </div>
                  </div>
                  <div className="ml-4 text-sm text-gray-500">
                    {new Date(rating.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
              
              {ratings.length > 5 && (
                <div className="text-center pt-4">
                  <Link
                    to="/stores"
                    className="text-primary-600 hover:text-primary-900 font-medium"
                  >
                    View all my ratings
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="card-body text-center">
            <div className="text-2xl font-bold text-primary-600">{ratings.length}</div>
            <div className="text-sm text-gray-600">Stores Rated</div>
          </div>
        </div>
        <div className="card">
          <div className="card-body text-center">
            <div className="text-2xl font-bold text-green-600">
              {ratings.length > 0 
                ? (ratings.reduce((sum, r) => sum + r.ratingValue, 0) / ratings.length).toFixed(1)
                : '0.0'
              }
            </div>
            <div className="text-sm text-gray-600">Average Rating Given</div>
          </div>
        </div>
        <div className="card">
          <div className="card-body text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {ratings.filter(r => r.ratingValue === 5).length}
            </div>
            <div className="text-sm text-gray-600">5-Star Ratings</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NormalUserDashboard;
