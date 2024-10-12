'use client'

import { useState } from 'react'
import axios from 'axios'

import { ConfirmModal } from '@/components/modals/confirm'
import { Button } from '@/components/ui/button'
import { Loader2, Trash } from 'lucide-react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

interface ChapterActionsProps {
  isPublished: boolean
  chapterId: string
  courseId: string
  disabled: boolean
}

export const ChapterActions = ({
  isPublished,
  chapterId,
  courseId,
  disabled
}: ChapterActionsProps) => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const onClick = async () => {
    try {
      setIsLoading(true)
      await axios.patch(
        `/api/courses/${courseId}/chapters/${chapterId}/${
          isPublished ? 'unpublish' : 'publish'
        }`
      )
      toast.success(isPublished ? 'Chapter unpublished!' : 'Chapter published!')
      if (!isPublished) {
        router.push(`/teacher/courses/${courseId}`)
      }
      router.refresh()
    } catch (error) {
      toast.error('Error updating')
      console.log('Error updating', error)
    } finally {
      setIsLoading(false)
    }
  }
  const onDelete = async () => {
    try {
      setIsLoading(true)
      await axios.delete(`/api/courses/${courseId}/chapters/${chapterId}`)
      toast.success('Chapter deleted!')
      router.push(`/teacher/courses/${courseId}`)
      router.refresh()
    } catch (error) {
      toast.error('Error deleting')
      console.log('Error deleting', error)
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <div className='flex items-center gap-x-2'>
      <Button
        variant={'outline'}
        size='sm'
        disabled={disabled || isLoading}
        onClick={onClick}>
        {isPublished ? 'Unpublish' : 'Publish'}
      </Button>
      <ConfirmModal onConfirm={onDelete}>
        <Button disabled={isLoading} size='sm' onClick={() => {}}>
          <Trash className='size-4' />
        </Button>
      </ConfirmModal>
    </div>
  )
}
