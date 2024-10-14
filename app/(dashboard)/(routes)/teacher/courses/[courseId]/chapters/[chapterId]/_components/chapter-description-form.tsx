'use client'
import { useState } from 'react'

import * as z from 'zod'
import axios from 'axios'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'

import { Pencil } from 'lucide-react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Chapter } from '@prisma/client'
import { Editer } from '@/components/editer'
import { Preview } from '@/components/preview'

interface ChapterDescriptionFormProps {
  initialData: Chapter
  courseId: string
  chapterId: string
}

const formSchema = z.object({
  description: z.string().min(1)
})

const ChapterDescriptionForm = ({
  initialData,
  courseId,
  chapterId
}: ChapterDescriptionFormProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const router = useRouter()

  const toggleEdit = () => setIsEditing((current) => !current)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: initialData.description || ''
    }
  })

  const { isSubmitting, isValid } = form.formState

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(
        `/api/courses/${courseId}/chapters/${chapterId}`,
        values
      )
      toast.success('Chpater updated!')
      toggleEdit()
      router.refresh()
    } catch (error) {
      toast.error('Something went wrong!')
    }
  }
  return (
    <div className='mt-6 border bg-slate-100 rounded-md p-4'>
      <div className='font-medium flex items-center justify-between'>
        Chapter description
        <Button onClick={toggleEdit} variant={'ghost'}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className='size-4 mr-2' />
              Edit description
            </>
          )}
        </Button>
      </div>
      {!isEditing ? (
        <div
          className={cn(
            'text-sm mt-2',
            !initialData.description && 'text-slate-500 italic'
          )}>
          {initialData.description ? (
            <Preview value={initialData.description} />
          ) : (
            'No description'
          )}
        </div>
      ) : (
        <Form {...form}>
          <form className='space-y-2' onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Editer {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex items-center gap-x-2 mt-2'>
              <Button
                type='submit'
                variant='default'
                disabled={!isValid || isSubmitting}>
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  )
}

export default ChapterDescriptionForm
