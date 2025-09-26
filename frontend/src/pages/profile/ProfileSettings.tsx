import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/contexts/AuthContext';
import { UpdatePasswordRequest } from '@/types';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { User, Lock, Eye, EyeOff } from 'lucide-react';

const ProfileSettings: React.FC = () => {
  const { user, updatePassword } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdatePasswordRequest>();

  const onSubmit = async (data: UpdatePasswordRequest) => {
    try {
      setIsLoading(true);
      await updatePassword(data);
      reset();
    } catch (error) {
      // Error is handled by the auth context
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-gray-600">Manage your account information and security</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Information */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-medium text-gray-900">Profile Information</h2>
          </div>
          <div className="card-body space-y-4">
            <div>
              <label className="form-label">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="form-input pl-10 bg-gray-50"
                  value={user.name}
                  disabled
                />
              </div>
            </div>

            <div>
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input bg-gray-50"
                value={user.email}
                disabled
              />
            </div>

            <div>
              <label className="form-label">Role</label>
              <input
                type="text"
                className="form-input bg-gray-50"
                value={user.role.replace('_', ' ')}
                disabled
              />
            </div>

            <div>
              <label className="form-label">Address</label>
              <textarea
                className="form-input bg-gray-50 min-h-[80px] resize-none"
                value={user.address}
                disabled
              />
            </div>

            <div className="text-sm text-gray-500">
              <p>Contact your administrator to update your profile information.</p>
            </div>
          </div>
        </div>

        {/* Password Change */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-medium text-gray-900">Change Password</h2>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label htmlFor="currentPassword" className="form-label">
                  Current Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...register('currentPassword', {
                      required: 'Current password is required',
                    })}
                    type={showCurrentPassword ? 'text' : 'password'}
                    className="form-input pl-10 pr-10"
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.currentPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.currentPassword.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="newPassword" className="form-label">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...register('newPassword', {
                      required: 'New password is required',
                      minLength: {
                        value: 8,
                        message: 'Password must be at least 8 characters long',
                      },
                      maxLength: {
                        value: 16,
                        message: 'Password must not exceed 16 characters',
                      },
                      pattern: {
                        value: /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/,
                        message: 'Password must contain at least one uppercase letter and one special character',
                      },
                    })}
                    type={showNewPassword ? 'text' : 'password'}
                    className="form-input pl-10 pr-10"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.newPassword.message}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Password must be 8-16 characters with at least one uppercase letter and one special character
                </p>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary w-full"
                >
                  {isLoading ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    'Update Password'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
