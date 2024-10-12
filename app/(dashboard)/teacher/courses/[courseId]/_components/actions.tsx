'use client'

import { useState } from 'react'
import axios from 'axios'

import { ConfirmModal } from '@/components/modals/confirm'
import { Button } from '@/components/ui/button'
import { Loader2, Trash } from 'lucide-react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { useConfettiStore } from '@/app/hooks/use-confetti-store'

interface ActionsProps {
  isPublished: boolean
  courseId: string
  disabled: boolean
}

export const Actions = ({ isPublished, courseId, disabled }: ActionsProps) => {
  const router = useRouter()
  const confetti = useConfettiStore()
  const [isLoading, setIsLoading] = useState(false)

  const onClick = async () => {
    try {
      setIsLoading(true)
      await axios.patch(
        `/api/courses/${courseId}/${isPublished ? 'unpublish' : 'publish'}`
      )
      toast.success(isPublished ? 'Course unpublished!' : 'Course published!')
      if (!isPublished) {
        confetti.onOpen()
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
      await axios.delete(`/api/courses/${courseId}`)
      toast.success('Course deleted!')
      router.push(`/teacher/courses`)
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
