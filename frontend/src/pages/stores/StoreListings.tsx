import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { useSearchParams, Link } from 'react-router-dom';
import { getAllStores } from '@/services/stores';
import { createOrUpdateRating } from '@/services/ratings';
import { StoreFilters } from '@/types';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import StarRating from '@/components/ui/StarRating';
import Modal from '@/components/ui/Modal';
import { Search, MapPin, Filter, Star } from 'lucide-react';
import toast from 'react-hot-toast';

const StoreListings: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<StoreFilters>({
    name: searchParams.get('name') || '',
    address: searchParams.get('address') || '',
    sortBy: searchParams.get('sortBy') || 'name',
    sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'asc',
    page: parseInt(searchParams.get('page') || '1'),
    limit: 12,
  });
  
  const [showFilters, setShowFilters] = useState(false);
  const [ratingModal, setRatingModal] = useState<{ isOpen: boolean; storeId: string; currentRating?: number }>({
    isOpen: false,
    storeId: '',
  });
  const [selectedRating, setSelectedRating] = useState(0);

  const { data, isLoading, error, refetch } = useQuery(
    ['stores', filters],
    () => getAllStores(filters),
    {
      keepPreviousData: true,
      staleTime: 30000, // 30 seconds
      cacheTime: 300000, // 5 minutes
    }
  );

  const stores = data?.data?.stores || [];
  const pagination = data?.data?.pagination;

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== '') {
        params.set(key, value.toString());
      }
    });
    setSearchParams(params);
  }, [filters, setSearchParams]);

  const handleFilterChange = (key: keyof StoreFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1, // Reset to first page when filters change
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handleRateStore = (storeId: string, currentRating?: number) => {
    setRatingModal({
      isOpen: true,
      storeId,
      currentRating,
    });
    setSelectedRating(currentRating || 0);
  };

  const submitRating = async () => {
    if (selectedRating === 0) {
      toast.error('Please select a rating');
      return;
    }

    try {
      await createOrUpdateRating({
        storeId: ratingModal.storeId,
        ratingValue: selectedRating,
      });
      
      toast.success('Rating submitted successfully!');
      setRatingModal({ isOpen: false, storeId: '' });
      refetch();
    } catch (error) {
      toast.error('Failed to submit rating');
    }
  };

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
        <p className="text-red-600">Failed to load stores</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Store Listings</h1>
          <p className="text-gray-600">Discover and rate amazing stores</p>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="btn-secondary flex items-center"
        >
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </button>
      </div>

      {/* Quick Search Bar */}
      <div className="card">
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Quick Search by Name</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  className="form-input pl-10"
                  placeholder="Search stores by name..."
                  value={filters.name || ''}
                  onChange={(e) => handleFilterChange('name', e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="form-label">Quick Search by Address</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  className="form-input pl-10"
                  placeholder="Search stores by address..."
                  value={filters.address || ''}
                  onChange={(e) => handleFilterChange('address', e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="card">
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="form-label">Store Name</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    className="form-input pl-10"
                    placeholder="Search by name..."
                    value={filters.name || ''}
                    onChange={(e) => handleFilterChange('name', e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <label className="form-label">Address</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    className="form-input pl-10"
                    placeholder="Search by address..."
                    value={filters.address || ''}
                    onChange={(e) => handleFilterChange('address', e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <label className="form-label">Sort By</label>
                <select
                  className="form-input"
                  value={filters.sortBy || 'name'}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                >
                  <option value="name">Name</option>
                  <option value="avgRating">Rating</option>
                  <option value="createdAt">Date Added</option>
                </select>
              </div>
              
              <div>
                <label className="form-label">Order</label>
                <select
                  className="form-input"
                  value={filters.sortOrder || 'asc'}
                  onChange={(e) => handleFilterChange('sortOrder', e.target.value as 'asc' | 'desc')}
                >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {stores.length === 0 ? (
        <div className="text-center py-12">
          <Search className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-lg font-medium text-gray-900 mb-2">No stores found</p>
          <p className="text-gray-600">Try adjusting your search filters</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stores.map((store) => (
              <div key={store.id} className="card hover:shadow-lg transition-shadow">
                <div className="card-body">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {store.name}
                  </h3>
                  
                  <div className="flex items-start text-gray-600 mb-3">
                    <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{store.address}</span>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <StarRating rating={store.avgRating} size="sm" />
                      <span className="text-xs text-gray-500">
                        ({store.totalRatings || 0})
                      </span>
                    </div>
                    
                    {store.userRating && (
                      <div className="text-xs text-primary-600 font-medium">
                        You rated: {store.userRating}/5
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Link
                      to={`/stores/${store.id}`}
                      className="btn-secondary flex-1 text-center"
                    >
                      View Details
                    </Link>
                    
                    <button
                      onClick={() => handleRateStore(store.id, store.userRating || undefined)}
                      className="btn-primary flex items-center"
                    >
                      <Star className="w-4 h-4 mr-1" />
                      {store.userRating ? 'Update' : 'Rate'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="btn-secondary disabled:opacity-50"
              >
                Previous
              </button>
              
              <span className="text-sm text-gray-600">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="btn-secondary disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Rating Modal */}
      <Modal
        isOpen={ratingModal.isOpen}
        onClose={() => setRatingModal({ isOpen: false, storeId: '' })}
        title={ratingModal.currentRating ? 'Update Your Rating' : 'Rate This Store'}
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            {ratingModal.currentRating 
              ? 'Update your rating for this store:'
              : 'How would you rate this store?'
            }
          </p>
          
          <div className="flex justify-center">
            <StarRating
              rating={selectedRating}
              interactive
              onRatingChange={setSelectedRating}
              size="lg"
            />
          </div>
          
          <div className="flex space-x-3 pt-4">
            <button
              onClick={() => setRatingModal({ isOpen: false, storeId: '' })}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              onClick={submitRating}
              className="btn-primary flex-1"
            >
              Submit Rating
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default StoreListings;
