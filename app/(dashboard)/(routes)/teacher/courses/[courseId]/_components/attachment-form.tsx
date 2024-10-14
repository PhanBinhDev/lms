'use client'
import { useState } from 'react'
import Image from 'next/image'

import axios from 'axios'

import { Button } from '@/components/ui/button'

import { File, ImageIcon, Loader2, PlusCircle, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { Attachment, Course } from '@prisma/client'
import { FileUpload } from '@/components/file-upload'
import * as z from 'zod'

interface AttachmentFormProps {
  initialData: Course & { attachments: Attachment[] }
  courseId: string
}

const formSchema = z.object({
  url: z.string().min(1)
})

const AttachmentForm = ({ initialData, courseId }: AttachmentFormProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [deleteingId, setDeleteingId] = useState<string | null>(null)
  const router = useRouter()

  const toggleEdit = () => setIsEditing((current) => !current)

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/courses/${courseId}/attachments`, values)
      toast.success('Course updated!')
      toggleEdit()
      router.refresh()
    } catch (error) {
      toast.error('Something went wrong!')
    }
  }

  const onDelete = async (id: string) => {
    try {
      setDeleteingId(id)
      await axios.delete(`/api/courses/${courseId}/attachments/${id}`)
      toast.success('Attacment deleted!')
      router.refresh()
    } catch (error) {
      toast.error('Something went wrong!')
    } finally {
      setDeleteingId(null)
    }
  }
  return (
    <div className='mt-6 border bg-slate-100 rounded-md p-4'>
      <div className='font-medium flex items-center justify-between'>
        Course attachments
        <Button onClick={toggleEdit} variant={'ghost'}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <PlusCircle className='size-4 mr-2' />
              Add a file
            </>
          )}
        </Button>
      </div>
      {!isEditing ? (
        <>
          {initialData.attachments.length === 0 ? (
            <p className='text-slate-500 italic text-sm mt-2'>
              No attachments yet
            </p>
          ) : (
            <div className='space-y-2'>
              {initialData.attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className='flex items-center p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md'>
                  <File className='size-4 mr-2 flex-shrink-0' />
                  <p className='text-xs line-clamp-1'>{attachment.url}</p>

                  <Button
                    className='ml-auto'
                    size={'sm'}
                    disabled={deleteingId === attachment.id}
                    onClick={() => onDelete(attachment.id)}
                    variant={'ghost'}>
                    {deleteingId === attachment.id ? (
                      <Loader2 className='size-4 animate-spin' />
                    ) : (
                      <X className='size-4' />
                    )}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <div>
          <FileUpload
            endpoint='courseAttachment'
            onChange={(url) => {
              if (url) {
                onSubmit({ url })
              }
            }}
          />
          <div className='text-xs text-muted-foreground mt-4'>
            Add anything your students might need to complete the course
          </div>
        </div>
      )}
    </div>
  )
}

export default AttachmentForm
