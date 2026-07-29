'use client';

import { useState, useEffect } from 'react';
import { ReviewType } from '@/types';
import { Star, ThumbsUp } from 'lucide-react';

interface ReviewListProps {
  productId: string;
}

export function ReviewList({ productId }: ReviewListProps) {
  const [reviews, setReviews] = useState<ReviewType[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState('newest');

  useEffect(() => {
    fetch(`/api/reviews?productId=${productId}&sort=${sort}`)
      .then((res) => res.json())
      .then((data) => setReviews(data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [productId, sort]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-32 animate-pulse rounded-2xl bg-muted" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Customer Reviews ({reviews.length})</h3>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="h-9 rounded-xl border border-input bg-background px-3 text-sm outline-none"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="highest">Highest Rated</option>
          <option value="lowest">Lowest Rated</option>
        </select>
      </div>

      {reviews.length > 0 && (
        <div className="flex items-center gap-4 rounded-2xl bg-muted/30 p-5">
          <div className="text-center">
            <span className="text-4xl font-bold">{avgRating.toFixed(1)}</span>
            <div className="mt-1 flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-3.5 w-3.5 ${
                    i < Math.round(avgRating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-muted-foreground/20'
                  }`}
                />
              ))}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{reviews.length} reviews</p>
          </div>
        </div>
      )}

      {reviews.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-muted-foreground">No reviews yet. Be the first to review this product!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review._id} className="rounded-2xl border p-5 transition-colors hover:bg-accent/30">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 overflow-hidden rounded-full bg-muted">
                    {review.user?.image ? (
                      <img src={review.user.image} alt={review.user.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-sm font-medium text-muted-foreground">
                        {review.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{review.user?.name || 'Anonymous'}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(review.createdAt)}</p>
                  </div>
                </div>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3.5 w-3.5 ${
                        i < review.rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-muted-foreground/20'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="mt-3">
                <p className="mb-1 font-medium text-sm">{review.title}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{review.comment}</p>
              </div>
              <div className="mt-3 flex items-center gap-3">
                <button className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                  <ThumbsUp className="h-3.5 w-3.5" /> Helpful
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
