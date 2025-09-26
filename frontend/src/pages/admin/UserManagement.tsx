import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { useSearchParams } from 'react-router-dom';
import { getAllUsers, createUser, deleteUser } from '@/services/users';
import { UserFilters, CreateUserRequest, UserRole } from '@/types';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Modal from '@/components/ui/Modal';
import { useForm } from 'react-hook-form';
import { Search, Filter, Plus, Edit, Trash2, User } from 'lucide-react';
import toast from 'react-hot-toast';

const UserManagement: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<UserFilters>({
    name: searchParams.get('name') || '',
    email: searchParams.get('email') || '',
    address: searchParams.get('address') || '',
    role: (searchParams.get('role') as UserRole) || undefined,
    sortBy: searchParams.get('sortBy') || 'createdAt',
    sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc',
    page: parseInt(searchParams.get('page') || '1'),
    limit: 10,
  });
  
  const [showFilters, setShowFilters] = useState(false);
  const [createModal, setCreateModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const { data, isLoading, error, refetch } = useQuery(
    ['users', filters],
    () => getAllUsers(filters),
    {
      keepPreviousData: true,
      staleTime: 30000, // 30 seconds
      cacheTime: 300000, // 5 minutes
    }
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateUserRequest>();

  const users = data?.data?.users || [];
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

  const handleFilterChange = (key: keyof UserFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1,
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handleCreateUser = async (data: CreateUserRequest) => {
    try {
      setIsCreating(true);
      await createUser(data);
      toast.success('User created successfully!');
      setCreateModal(false);
      reset();
      refetch();
    } catch (error) {
      toast.error('Failed to create user');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (window.confirm(`Are you sure you want to delete user "${userName}"?`)) {
      try {
        await deleteUser(userId);
        toast.success('User deleted successfully!');
        refetch();
      } catch (error) {
        toast.error('Failed to delete user');
      }
    }
  };

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case UserRole.SYSTEM_ADMIN:
        return 'badge-danger';
      case UserRole.STORE_OWNER:
        return 'badge-primary';
      case UserRole.NORMAL_USER:
        return 'badge-success';
      default:
        return 'badge';
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
        <p className="text-red-600">Failed to load users</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">Manage all platform users</p>
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
            Add User
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="card">
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <label className="form-label">Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Search by name..."
                  value={filters.name || ''}
                  onChange={(e) => handleFilterChange('name', e.target.value)}
                />
              </div>
              
              <div>
                <label className="form-label">Email</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Search by email..."
                  value={filters.email || ''}
                  onChange={(e) => handleFilterChange('email', e.target.value)}
                />
              </div>
              
              <div>
                <label className="form-label">Role</label>
                <select
                  className="form-input"
                  value={filters.role || ''}
                  onChange={(e) => handleFilterChange('role', e.target.value || undefined)}
                >
                  <option value="">All Roles</option>
                  <option value={UserRole.SYSTEM_ADMIN}>Admin</option>
                  <option value={UserRole.STORE_OWNER}>Store Owner</option>
                  <option value={UserRole.NORMAL_USER}>Normal User</option>
                </select>
              </div>
              
              <div>
                <label className="form-label">Sort By</label>
                <select
                  className="form-input"
                  value={filters.sortBy || 'createdAt'}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                >
                  <option value="name">Name</option>
                  <option value="email">Email</option>
                  <option value="role">Role</option>
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

      {/* Users Table */}
      <div className="card">
        <div className="card-body p-0">
          <div className="overflow-x-auto">
            <table className="table">
              <thead className="table-header">
                <tr>
                  <th className="table-header-cell">User</th>
                  <th className="table-header-cell">Email</th>
                  <th className="table-header-cell">Role</th>
                  <th className="table-header-cell">Address</th>
                  <th className="table-header-cell">Created</th>
                  <th className="table-header-cell">Actions</th>
                </tr>
              </thead>
              <tbody className="table-body">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="table-cell">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                          <User className="w-4 h-4 text-primary-600" />
                        </div>
                        <span className="font-medium">{user.name}</span>
                      </div>
                    </td>
                    <td className="table-cell">{user.email}</td>
                    <td className="table-cell">
                      <span className={`badge ${getRoleBadgeColor(user.role)}`}>
                        {user.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="table-cell">
                      <span className="text-sm text-gray-600 max-w-xs truncate block">
                        {user.address}
                      </span>
                    </td>
                    <td className="table-cell">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="table-cell">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleDeleteUser(user.id, user.name)}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Delete user"
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

      {/* Create User Modal */}
      <Modal
        isOpen={createModal}
        onClose={() => setCreateModal(false)}
        title="Create New User"
        size="lg"
      >
        <form onSubmit={handleSubmit(handleCreateUser)} className="space-y-4">
          <div>
            <label className="form-label">Full Name</label>
            <input
              {...register('name', {
                required: 'Name is required',
                minLength: { value: 20, message: 'Name must be at least 20 characters' },
                maxLength: { value: 60, message: 'Name must not exceed 60 characters' },
              })}
              className="form-input"
              placeholder="Enter full name"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
          </div>

          <div>
            <label className="form-label">Email</label>
            <input
              {...register('email', {
                required: 'Email is required',
                pattern: { value: /^\S+@\S+$/i, message: 'Invalid email format' },
              })}
              type="email"
              className="form-input"
              placeholder="Enter email address"
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
          </div>

          <div>
            <label className="form-label">Password</label>
            <input
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 8, message: 'Password must be at least 8 characters' },
                maxLength: { value: 16, message: 'Password must not exceed 16 characters' },
                pattern: {
                  value: /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/,
                  message: 'Password must contain uppercase and special character',
                },
              })}
              type="password"
              className="form-input"
              placeholder="Enter password"
            />
            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
          </div>

          <div>
            <label className="form-label">Address</label>
            <textarea
              {...register('address', {
                required: 'Address is required',
                maxLength: { value: 400, message: 'Address must not exceed 400 characters' },
              })}
              className="form-input min-h-[80px] resize-none"
              placeholder="Enter address"
            />
            {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>}
          </div>

          <div>
            <label className="form-label">Role</label>
            <select
              {...register('role', { required: 'Role is required' })}
              className="form-input"
            >
              <option value="">Select role</option>
              <option value={UserRole.SYSTEM_ADMIN}>System Admin</option>
              <option value={UserRole.STORE_OWNER}>Store Owner</option>
              <option value={UserRole.NORMAL_USER}>Normal User</option>
            </select>
            {errors.role && <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>}
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
              {isCreating ? <LoadingSpinner size="sm" /> : 'Create User'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default UserManagement;
