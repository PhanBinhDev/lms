'use client'

import { useConfettiStore } from '@/app/hooks/use-confetti-store'
import { Button } from '@/components/ui/button'
import axios from 'axios'
import { CheckCircle, XCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import toast from 'react-hot-toast'

interface CourseProgressButtonProps {
  chapterId: string
  courseId: string
  isCompleted?: boolean
  nextChapterId?: string
}

export const CourseProgressButton = ({
  chapterId,
  courseId,
  isCompleted,
  nextChapterId
}: CourseProgressButtonProps) => {
  const router = useRouter()
  const confetti = useConfettiStore()
  const Icon = isCompleted ? XCircle : CheckCircle
  const [isLoading, setIsLoading] = useState(false)

  const onClick = async () => {
    try {
      setIsLoading(true)

      await axios.put(
        `/api/courses/${courseId}/chapters/${chapterId}/progress`,
        {
          isCompleted: !isCompleted
        }
      )

      if (!isCompleted && !nextChapterId) {
        confetti.onOpen()
      }

      if (!isCompleted && nextChapterId) {
        router.push(`/courses/${courseId}/chapters/${nextChapterId}`)
      }

      toast.success('Progress updated')
      router.refresh()
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <Button
      onClick={onClick}
      variant={isCompleted ? 'outline' : 'success'}
      className='w-full lg:w-auto'>
      {isCompleted ? 'Not completed' : 'Mark as complete'}
      <Icon className='size-4 ml-2' />
    </Button>
  )
}
