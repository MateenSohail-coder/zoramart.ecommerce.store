'use client';
import * as React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

export const RatingStars = React.forwardRef(({ rating, maxRating = 5, onRatingChange, size, className, ...props }, ref) => {
  const [hoveredStar, setHoveredStar] = React.useState(0);
  const isInteractive = typeof onRatingChange === 'function';

  const displayRating = isInteractive && hoveredStar > 0 ? hoveredStar : rating;
  const filledStars = Math.floor(displayRating);
  const fractionalPart = displayRating - filledStars;
  const emptyStars = maxRating - filledStars - (fractionalPart > 0 ? 1 : 0);
  const starSize = size || (isInteractive ? 'size-6' : 'size-4');

  const handleClick = (starIndex) => {
    if (isInteractive) {
      onRatingChange(starIndex);
    }
  };

  return (
    <div
      className={cn('flex items-center gap-2', className)}
      ref={ref}
      {...props}
    >
      <div className={cn('flex items-center', isInteractive && 'gap-0.5')}>
        {[...Array(filledStars)].map((_, index) => {
          const starValue = index + 1;
          return (
            <button
              key={`filled-${index}`}
              type="button"
              disabled={!isInteractive}
              onClick={() => handleClick(starValue)}
              onMouseEnter={() => isInteractive && setHoveredStar(starValue)}
              onMouseLeave={() => isInteractive && setHoveredStar(0)}
              className={cn(
                'text-amber-400 transition-colors',
                isInteractive && 'cursor-pointer p-0.5 hover:scale-110 active:scale-90',
                !isInteractive && 'pointer-events-none',
              )}
            >
              <svg
                className={starSize}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.54-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.05 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
              </svg>
            </button>
          );
        })}
        {fractionalPart > 0 && (
          <svg className={cn(starSize, 'text-amber-400')} fill="currentColor" viewBox="0 0 20 20">
            <defs>
              <linearGradient id={`half-${rating}`}>
                <stop offset={`${fractionalPart * 100}%`} stopColor="currentColor" />
                <stop offset={`${fractionalPart * 100}%`} stopColor="rgb(209 213 219)" />
              </linearGradient>
            </defs>
            <path
              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.54-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.05 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z"
              fill={`url(#half-${rating})`}
            />
          </svg>
        )}
        {[...Array(emptyStars)].map((_, index) => {
          const starValue = filledStars + (fractionalPart > 0 ? 1 : 0) + index + 1;
          return (
            <button
              key={`empty-${index}`}
              type="button"
              disabled={!isInteractive}
              onClick={() => handleClick(starValue)}
              onMouseEnter={() => isInteractive && setHoveredStar(starValue)}
              onMouseLeave={() => isInteractive && setHoveredStar(0)}
              className={cn(
                'text-gray-300 transition-colors',
                isInteractive && 'cursor-pointer p-0.5 hover:scale-110 active:scale-90 hover:text-amber-300',
                !isInteractive && 'pointer-events-none',
              )}
            >
              <svg
                className={starSize}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.54-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.05 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
              </svg>
            </button>
          );
        })}
      </div>
      {!isInteractive && <p className="sr-only">{rating}</p>}
    </div>
  );
});
RatingStars.displayName = 'RatingStars';
