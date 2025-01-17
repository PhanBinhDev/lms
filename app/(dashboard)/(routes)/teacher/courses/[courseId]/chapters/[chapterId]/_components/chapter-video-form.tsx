'use client'

import * as z from 'zod'

import { useState } from 'react'

import axios from 'axios'
import MuxPlayer from '@mux/mux-player-react'

import { Button } from '@/components/ui/button'

import { PlusCircle, VideoIcon } from 'lucide-react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { Chapter, MuxData } from '@prisma/client'
import { FileUpload } from '@/components/file-upload'

interface ChapterVideoFormProps {
  initialData: Chapter & {
    muxData?: MuxData | null
  }
  courseId: string
  chapterId: string
}

const formSchema = z.object({
  videoUrl: z.string().min(1, {
    message: 'Video URL is required'
  })
})

const ChapterVideoForm = ({
  initialData,
  courseId,
  chapterId
}: ChapterVideoFormProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const router = useRouter()

  const toggleEdit = () => setIsEditing((current) => !current)

  const onSubmit = async (values: { videoUrl: string }) => {
    try {
      await axios.patch(
        `/api/courses/${courseId}/chapters/${chapterId}`,
        values
      )
      toast.success('Course updated!')
      toggleEdit()
      router.refresh()
    } catch (error) {
      toast.error('Something went wrong!')
    }
  }
  return (
    <div className='mt-6 border bg-slate-100 rounded-md p-4'>
      <div className='font-medium flex items-center justify-between'>
        Course video
        <Button onClick={toggleEdit} variant={'ghost'}>
          {isEditing && <>Cancel</>}
          {!isEditing && !initialData.videoUrl && (
            <>
              <PlusCircle className='size-4 mr-2' />
              Add a video
            </>
          )}

          {!isEditing && initialData.videoUrl && (
            <>
              <PlusCircle className='size-4 mr-2' />
              Edit video
            </>
          )}
        </Button>
      </div>
      {!isEditing ? (
        !initialData.videoUrl ? (
          <div className='flex items-center justify-center h-60 bg-slate-200 rounded-md'>
            <VideoIcon className='size-10 text-slate-500' />
          </div>
        ) : (
          <div className='relative aspect-video mt-2'>
            <MuxPlayer
              accentColor='#0369a1'
              playbackId={initialData?.muxData?.playbackId || ''}
            />
          </div>
        )
      ) : (
        <div>
          <FileUpload
            endpoint='chapterVideo'
            onChange={(url) => {
              if (url) {
                onSubmit({ videoUrl: url })
              }
            }}
          />
          <div className='text-xs text-muted-foreground mt-4'>
            Upload this chapter&apos;s video
          </div>
        </div>
      )}
      {initialData.videoUrl && !isEditing && (
        <div className='text-xs text-slate-500'>
          Video can take a few minute to process. Refresh the page if video does
          not appear
        </div>
      )}
    </div>
  )
}

export default ChapterVideoForm
