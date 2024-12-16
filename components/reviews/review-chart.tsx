'use client'

import type { ReviewsWithUser } from '@/lib/infer-types'
import { getReviewAverage } from '@/lib/review-average'
import { useMemo } from 'react'
import { Card, CardDescription, CardTitle } from '../ui/card'
import { Progress } from '../ui/progress'
import Stars from './stars'

export default function ReviewChart({ reviews }: { reviews: ReviewsWithUser[] }) {
  const ratingByStar = useMemo(() => {
    const ratingVal = Array.from({ length: 5 }, () => 0)
    const totalReviews = reviews.length
    reviews.forEach((review) => {
      const starIdx = review.rating - 1
      if (starIdx >= 0 && starIdx < 5) {
        ratingVal[starIdx] += 1
      }
    })
    return ratingVal.map((val, idx) => {
      return { star: idx + 1, count: val, percentage: (val / totalReviews) * 100 }
    })
  }, [reviews])
  const totalRating = getReviewAverage(reviews.map(review => review.rating))
  return (
    <Card className="flex flex-col gap-6 rounded-md p-8">
      <div className="flex flex-col gap-2">
        <CardTitle>Product Rating</CardTitle>
        <Stars size={18} rating={totalRating} totalReviews={reviews.length} />
        <CardDescription>
          {totalRating.toFixed(1)}
          {' '}
          stars
        </CardDescription>
      </div>
      {ratingByStar.map(({ star, percentage }) => (
        <div key={star} className="flex items-center justify-between gap-2">
          <span>
            {star}
            {' '}
            stars
            {' '}
          </span>
          {/* <span>{count} reviews</span> */}
          {/* <span>({percentage.toFixed(1)}%)</span> */}
          <Progress value={percentage} />
        </div>
      ))}
    </Card>
  )
}
