import React from 'react';
import { Star } from 'lucide-react';
import clsx from 'clsx';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  className?: string;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxRating = 5,
  size = 'md',
  interactive = false,
  onRatingChange,
  className,
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const handleStarClick = (newRating: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(newRating);
    }
  };

  return (
    <div className={clsx('flex items-center space-x-1', className)}>
      {Array.from({ length: maxRating }, (_, index) => {
        const starNumber = index + 1;
        const isFilled = starNumber <= rating;
        const isPartiallyFilled = starNumber === Math.ceil(rating) && rating % 1 !== 0;

        return (
          <button
            key={index}
            type="button"
            onClick={() => handleStarClick(starNumber)}
            disabled={!interactive}
            className={clsx(
              'relative',
              interactive && 'cursor-pointer hover:scale-110 transition-transform',
              !interactive && 'cursor-default'
            )}
          >
            <Star
              className={clsx(
                sizeClasses[size],
                isFilled
                  ? 'text-yellow-400 fill-current'
                  : 'text-gray-300'
              )}
            />
            {isPartiallyFilled && (
              <Star
                className={clsx(
                  'absolute top-0 left-0 text-yellow-400 fill-current',
                  sizeClasses[size]
                )}
                style={{
                  clipPath: `inset(0 ${100 - (rating % 1) * 100}% 0 0)`,
                }}
              />
            )}
          </button>
        );
      })}
      {!interactive && (
        <span className="ml-2 text-sm text-gray-600">
          {rating.toFixed(1)} / {maxRating}
        </span>
      )}
    </div>
  );
};

export default StarRating;
