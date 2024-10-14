'use client'
import { useState } from 'react'
import Image from 'next/image'

import axios from 'axios'

import { Button } from '@/components/ui/button'

import { ImageIcon, PlusCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { Course } from '@prisma/client'
import { FileUpload } from '@/components/file-upload'

interface ImageFormProps {
  initialData: Course
  courseId: string
}

const ImageForm = ({ initialData, courseId }: ImageFormProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const router = useRouter()

  const toggleEdit = () => setIsEditing((current) => !current)

  const onSubmit = async (values: { imageUrl: string }) => {
    try {
      await axios.patch(`/api/courses/${courseId}`, values)
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
        Course image
        <Button onClick={toggleEdit} variant={'ghost'}>
          {isEditing && <>Cancel</>}
          {!isEditing && !initialData.imageUrl && (
            <>
              <PlusCircle className='size-4 mr-2' />
              Add an image
            </>
          )}

          {!isEditing && initialData.imageUrl && (
            <>
              <PlusCircle className='size-4 mr-2' />
              Edit image
            </>
          )}
        </Button>
      </div>
      {!isEditing ? (
        !initialData.imageUrl ? (
          <div className='flex items-center justify-center h-60 bg-slate-200 rounded-md'>
            <ImageIcon className='size-10 text-slate-500' />
          </div>
        ) : (
          <div className='relative aspect-video mt-2'>
            <Image
              alt='Upload'
              fill
              className='object-cover rounded-md'
              src={initialData.imageUrl}
            />
          </div>
        )
      ) : (
        <div>
          <FileUpload
            endpoint='courseImage'
            onChange={(url) => {
              if (url) {
                onSubmit({ imageUrl: url })
              }
            }}
          />
          <div className='text-xs text-muted-foreground mt-4'>
            16:9 aspect ratio recommended
          </div>
        </div>
      )}
    </div>
  )
}

export default ImageForm
