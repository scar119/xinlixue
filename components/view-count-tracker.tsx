'use client'

import { useState, useEffect } from 'react'
import { BookOpen } from 'lucide-react'

interface ViewCountTrackerProps {
  articleId: string
  initialCount: number
}

export function ViewCountTracker({ articleId, initialCount }: ViewCountTrackerProps) {
  const [viewCount, setViewCount] = useState(initialCount)
  const [hasTracked, setHasTracked] = useState(false)

  useEffect(() => {
    // 只在首次加载时增加一次阅读次数
    if (!hasTracked) {
      const trackView = async () => {
        try {
          const response = await fetch('/api/theories/view-count', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ articleId }),
          })

          const data = await response.json()

          if (data.success) {
            setViewCount(data.viewCount)
          }
        } catch (error) {
          console.error('Failed to track view:', error)
        }
      }

      trackView()
      setHasTracked(true)
    }
  }, [articleId, hasTracked])

  return (
    <div className="flex items-center gap-2">
      <BookOpen className="w-4 h-4" />
      <span>{viewCount} 次阅读</span>
    </div>
  )
}
