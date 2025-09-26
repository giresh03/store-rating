import React from 'react';
import { useQuery } from 'react-query';
import { useAuth } from '@/contexts/AuthContext';
import { getMyStores } from '@/services/stores';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import StarRating from '@/components/ui/StarRating';
import { Store, Star, Users, TrendingUp, MapPin } from 'lucide-react';

const StoreOwnerDashboard: React.FC = () => {
  const { user } = useAuth();
  
  const { data: storesData, isLoading, error } = useQuery(
    'my-stores',
    getMyStores
  );

  const stores = storesData?.data?.stores || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const totalRatings = stores.reduce((sum, store) => sum + (store.totalRatings || 0), 0);
  const averageRating = stores.length > 0 
    ? stores.reduce((sum, store) => sum + store.avgRating, 0) / stores.length
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-600">Manage your stores and view customer feedback</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-500">
                <Store className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">My Stores</p>
                <p className="text-2xl font-bold text-gray-900">{stores.length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-green-500">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Ratings</p>
                <p className="text-2xl font-bold text-gray-900">{totalRatings}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-yellow-500">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Average Rating</p>
                <p className="text-2xl font-bold text-gray-900">{averageRating.toFixed(1)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* My Stores */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-medium text-gray-900">My Stores</h2>
        </div>
        <div className="card-body">
          {error ? (
            <div className="text-center py-8 text-red-600">
              <p>Failed to load your stores</p>
            </div>
          ) : stores.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Store className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">No stores found</p>
              <p>Contact your administrator to add stores to your account</p>
            </div>
          ) : (
            <div className="space-y-6">
              {stores.map((store) => (
                <div
                  key={store.id}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {store.name}
                      </h3>
                      <div className="flex items-center text-gray-600 mb-3">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span className="text-sm">{store.address}</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <StarRating rating={store.avgRating} />
                        <span className="text-sm text-gray-600">
                          ({store.totalRatings || 0} {(store.totalRatings || 0) === 1 ? 'rating' : 'ratings'})
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Recent Ratings */}
                  {store.ratings && store.ratings.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <h4 className="text-sm font-medium text-gray-900 mb-3">
                        Recent Customer Ratings
                      </h4>
                      <div className="space-y-3">
                        {store.ratings.slice(0, 3).map((rating) => (
                          <div
                            key={rating.id}
                            className="flex items-center justify-between text-sm"
                          >
                            <div className="flex items-center space-x-3">
                              <span className="font-medium text-gray-900">
                                {rating.user?.name}
                              </span>
                              <StarRating rating={rating.ratingValue} size="sm" />
                            </div>
                            <span className="text-gray-500">
                              {new Date(rating.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        ))}
                        {store.ratings.length > 3 && (
                          <p className="text-xs text-gray-500 pt-2">
                            +{store.ratings.length - 3} more ratings
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StoreOwnerDashboard;
