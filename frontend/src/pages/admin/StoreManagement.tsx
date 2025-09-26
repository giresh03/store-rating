import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { useSearchParams } from 'react-router-dom';
import { getAllStores, createStore, deleteStore } from '@/services/stores';
import { getAllUsers } from '@/services/users';
import { StoreFilters, CreateStoreRequest, UserRole } from '@/types';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Modal from '@/components/ui/Modal';
import { useForm } from 'react-hook-form';
import { Search, Filter, Plus, Edit, Trash2, Store, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

const StoreManagement: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<StoreFilters>({
    name: searchParams.get('name') || '',
    address: searchParams.get('address') || '',
    sortBy: searchParams.get('sortBy') || 'createdAt',
    sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc',
    page: parseInt(searchParams.get('page') || '1'),
    limit: 10,
  });
  
  const [showFilters, setShowFilters] = useState(false);
  const [createModal, setCreateModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const { data, isLoading, error, refetch } = useQuery(
    ['admin-stores', filters],
    () => getAllStores(filters),
    {
      keepPreviousData: true,
    }
  );

  // Get store owners for the dropdown
  const { data: usersData, isLoading: isLoadingOwners, error: ownersError } = useQuery(
    'store-owners',
    () => getAllUsers({ role: UserRole.STORE_OWNER, limit: 100 }),
    {
      staleTime: 300000, // 5 minutes
    }
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateStoreRequest>();

  const stores = data?.data?.stores || [];
  const pagination = data?.data?.pagination;
  const storeOwners = usersData?.data?.users || [];

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
      page: 1,
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handleCreateStore = async (data: CreateStoreRequest) => {
    try {
      setIsCreating(true);
      await createStore(data);
      toast.success('Store created successfully!');
      setCreateModal(false);
      reset();
      refetch();
    } catch (error) {
      toast.error('Failed to create store');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteStore = async (storeId: string, storeName: string) => {
    if (window.confirm(`Are you sure you want to delete store "${storeName}"?`)) {
      try {
        await deleteStore(storeId);
        toast.success('Store deleted successfully!');
        refetch();
      } catch (error) {
        toast.error('Failed to delete store');
      }
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
          <h1 className="text-2xl font-bold text-gray-900">Store Management</h1>
          <p className="text-gray-600">Manage all platform stores</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-secondary flex items-center"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </button>
          <button
            onClick={() => setCreateModal(true)}
            className="btn-primary flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Store
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="card">
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="form-label">Store Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Search by name..."
                  value={filters.name || ''}
                  onChange={(e) => handleFilterChange('name', e.target.value)}
                />
              </div>
              
              <div>
                <label className="form-label">Address</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Search by address..."
                  value={filters.address || ''}
                  onChange={(e) => handleFilterChange('address', e.target.value)}
                />
              </div>
              
              <div>
                <label className="form-label">Sort By</label>
                <select
                  className="form-input"
                  value={filters.sortBy || 'createdAt'}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                >
                  <option value="name">Name</option>
                  <option value="address">Address</option>
                  <option value="avgRating">Rating</option>
                  <option value="createdAt">Date Created</option>
                </select>
              </div>
              
              <div>
                <label className="form-label">Order</label>
                <select
                  className="form-input"
                  value={filters.sortOrder || 'desc'}
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

      {/* Stores Table */}
      <div className="card">
        <div className="card-body p-0">
          <div className="overflow-x-auto">
            <table className="table">
              <thead className="table-header">
                <tr>
                  <th className="table-header-cell">Store</th>
                  <th className="table-header-cell">Address</th>
                  <th className="table-header-cell">Owner</th>
                  <th className="table-header-cell">Rating</th>
                  <th className="table-header-cell">Total Ratings</th>
                  <th className="table-header-cell">Actions</th>
                </tr>
              </thead>
              <tbody className="table-body">
                {stores.map((store) => (
                  <tr key={store.id}>
                    <td className="table-cell">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                          <Store className="w-4 h-4 text-primary-600" />
                        </div>
                        <span className="font-medium">{store.name}</span>
                      </div>
                    </td>
                    <td className="table-cell">
                      <span className="text-sm text-gray-600 max-w-xs truncate block">
                        {store.address}
                      </span>
                    </td>
                    <td className="table-cell">
                      {store.owner ? (
                        <div>
                          <div className="font-medium">{store.owner.name}</div>
                          <div className="text-sm text-gray-500">{store.owner.email}</div>
                        </div>
                      ) : (
                        <span className="text-gray-400">No owner</span>
                      )}
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center">
                        <span className="font-medium">{store.avgRating.toFixed(1)}</span>
                        <span className="text-yellow-400 ml-1">★</span>
                      </div>
                    </td>
                    <td className="table-cell">
                      {store.totalRatings || 0}
                    </td>
                    <td className="table-cell">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleDeleteStore(store.id, store.name)}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Delete store"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                {pagination.total} results
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="btn-secondary disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className="btn-secondary disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Store Modal */}
      <Modal
        isOpen={createModal}
        onClose={() => setCreateModal(false)}
        title="Create New Store"
        size="lg"
      >
        <form onSubmit={handleSubmit(handleCreateStore)} className="space-y-4">
          <div>
            <label className="form-label">Store Name</label>
            <input
              {...register('name', {
                required: 'Store name is required',
                minLength: { value: 1, message: 'Store name cannot be empty' },
                maxLength: { value: 100, message: 'Store name must not exceed 100 characters' },
              })}
              className="form-input"
              placeholder="Enter store name"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
          </div>

          <div>
            <label className="form-label">Address</label>
            <textarea
              {...register('address', {
                required: 'Address is required',
                maxLength: { value: 400, message: 'Address must not exceed 400 characters' },
              })}
              className="form-input min-h-[80px] resize-none"
              placeholder="Enter store address"
            />
            {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>}
          </div>

          <div>
            <label className="form-label">Store Owner</label>
            <select
              {...register('ownerId', { required: 'Store owner is required' })}
              className="form-input"
              disabled={isLoadingOwners}
            >
              <option value="">
                {isLoadingOwners ? 'Loading store owners...' : 'Select store owner'}
              </option>
              {storeOwners.map((owner) => (
                <option key={owner.id} value={owner.id}>
                  {owner.name} ({owner.email})
                </option>
              ))}
              {!isLoadingOwners && storeOwners.length === 0 && (
                <option value="" disabled>No store owners found</option>
              )}
            </select>
            {errors.ownerId && <p className="mt-1 text-sm text-red-600">{errors.ownerId.message}</p>}
            {ownersError && <p className="mt-1 text-sm text-red-600">Failed to load store owners</p>}
            {!isLoadingOwners && storeOwners.length === 0 && (
              <p className="mt-1 text-sm text-yellow-600">
                No store owners available. Create users with "Store Owner" role first.
              </p>
            )}
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setCreateModal(false)}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating}
              className="btn-primary flex-1"
            >
              {isCreating ? <LoadingSpinner size="sm" /> : 'Create Store'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default StoreManagement;