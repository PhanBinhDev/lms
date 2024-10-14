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

import { Loader2, PlusCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Course, Chapter } from '@prisma/client'
import { Input } from '@/components/ui/input'
import { ChaptersList } from './chapters-list'

interface ChapterFormProps {
  initialData: Course & { chapters: Chapter[] }
  courseId: string
}

const formSchema = z.object({
  title: z.string().min(1)
})

const ChapterForm = ({ initialData, courseId }: ChapterFormProps) => {
  const [isCreating, setIsCreating] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const router = useRouter()

  const toggleCreating = () => setIsCreating((current) => !current)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: ''
    }
  })

  const { isSubmitting, isValid } = form.formState

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/courses/${courseId}/chapters`, values)
      toast.success('Course updated!')
      toggleCreating()
      router.refresh()
    } catch (error) {
      toast.error('Something went wrong!')
    }
  }

  const onReorder = async (updatedData: { id: string; position: number }[]) => {
    try {
      setIsUpdating(true)
      await axios.put(`/api/courses/${courseId}/chapters/reorder`, {
        list: updatedData
      })
      toast.success('Chapters reordered!')
      router.refresh()
    } catch (error) {
      toast.error('Something went wrong!')
    } finally {
      setIsUpdating(false)
    }
  }

  const onEdit = async (id: string) => {
    router.push(`/teacher/courses/${courseId}/chapters/${id}`)
  }
  return (
    <div className='mt-6 border bg-slate-100 rounded-md p-4 relative'>
      {isUpdating && (
        <div className='absolute h-full w-full top-0 right-0 bg-slate-500/20 rounded-md flex items-center justify-center'>
          <Loader2 className='animate-spin size-6 text-sky-700' />
        </div>
      )}
      <div className='font-medium flex items-center justify-between'>
        Course chapter
        <Button onClick={toggleCreating} variant={'ghost'}>
          {isCreating ? (
            <>Cancel</>
          ) : (
            <>
              <PlusCircle className='size-4 mr-2' />
              Add a chapter
            </>
          )}
        </Button>
      </div>
      {isCreating && (
        <Form {...form}>
          <form className='space-y-2' onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      {...field}
                      placeholder="e.g. 'Introduction to the course'"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type='submit'
              variant='default'
              disabled={!isValid || isSubmitting}>
              Create
            </Button>
          </form>
        </Form>
      )}

      {!isCreating && (
        <>
          <div
            className={cn(
              'text-sm mt-2',
              !initialData.chapters.length && 'text-slate-500 italic'
            )}>
            {!initialData.chapters.length && 'No chapters'}
            <ChaptersList
              onEdit={onEdit}
              onReorder={onReorder}
              items={initialData.chapters || []}
            />
          </div>
          <p className='text-xs text-muted-foreground mt-4'>
            Drag and drop to reorder the chapter
          </p>
        </>
      )}
    </div>
  )
}

export default ChapterForm
