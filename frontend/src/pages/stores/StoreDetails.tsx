import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { getStoreById } from '@/services/stores';
import { getStoreRatings, createOrUpdateRating } from '@/services/ratings';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import StarRating from '@/components/ui/StarRating';
import Modal from '@/components/ui/Modal';
import { MapPin, Star, User, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

const StoreDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [ratingModal, setRatingModal] = useState<{ isOpen: boolean; currentRating?: number }>({
    isOpen: false,
  });
  const [selectedRating, setSelectedRating] = useState(0);

  const { data: storeData, isLoading: storeLoading, error: storeError, refetch: refetchStore } = useQuery(
    ['store', id],
    () => getStoreById(id!),
    {
      enabled: !!id,
    }
  );

  const { data: ratingsData, isLoading: ratingsLoading, refetch: refetchRatings } = useQuery(
    ['store-ratings', id],
    () => getStoreRatings(id!),
    {
      enabled: !!id,
    }
  );

  const store = storeData?.data?.store;
  const ratings = ratingsData?.data?.ratings || [];

  const handleRateStore = (currentRating?: number) => {
    setRatingModal({
      isOpen: true,
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
        storeId: id!,
        ratingValue: selectedRating,
      });
      
      toast.success('Rating submitted successfully!');
      setRatingModal({ isOpen: false });
      refetchStore();
      refetchRatings();
    } catch (error) {
      toast.error('Failed to submit rating');
    }
  };

  if (storeLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (storeError || !store) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Store not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Store Header */}
      <div className="card">
        <div className="card-body">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {store.name}
              </h1>
              
              <div className="flex items-start text-gray-600 mb-4">
                <MapPin className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                <span>{store.address}</span>
              </div>
              
              <div className="flex items-center space-x-4 mb-4">
                <StarRating rating={store.avgRating} />
                <span className="text-sm text-gray-600">
                  ({store.totalRatings || 0} {(store.totalRatings || 0) === 1 ? 'rating' : 'ratings'})
                </span>
              </div>

              {store.userRating && (
                <div className="text-sm text-primary-600 font-medium mb-4">
                  Your rating: {store.userRating}/5
                </div>
              )}
            </div>
            
            <button
              onClick={() => handleRateStore(store.userRating || undefined)}
              className="btn-primary flex items-center ml-4"
            >
              <Star className="w-4 h-4 mr-2" />
              {store.userRating ? 'Update Rating' : 'Rate Store'}
            </button>
          </div>
          
          {store.owner && (
            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Store Owner:</span> {store.owner.name}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Ratings Section */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-medium text-gray-900">Customer Ratings</h2>
        </div>
        <div className="card-body">
          {ratingsLoading ? (
            <div className="flex items-center justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : ratings.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Star className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">No ratings yet</p>
              <p>Be the first to rate this store!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {ratings.map((rating) => (
                <div
                  key={rating.id}
                  className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg"
                >
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-primary-600" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">
                        {rating.user?.name}
                      </h4>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(rating.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <StarRating rating={rating.ratingValue} size="sm" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Rating Modal */}
      <Modal
        isOpen={ratingModal.isOpen}
        onClose={() => setRatingModal({ isOpen: false })}
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
              onClick={() => setRatingModal({ isOpen: false })}
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

export default StoreDetails;
