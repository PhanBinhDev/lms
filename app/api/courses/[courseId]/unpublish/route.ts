import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

export async function PATCH(
  req: Request,
  {
    params
  }: {
    params: {
      courseId: string
    }
  }
) {
  try {
    const { userId } = auth()
    const { courseId } = params
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const course = await db.course.findUnique({
      where: { id: courseId, userId }
    })

    if (!course) {
      return new NextResponse('Course not found', {
        status: 404
      })
    }

    const unpublishedChapter = await db.course.update({
      where: {
        id: courseId
      },
      data: {
        isPublished: false
      }
    })

    return NextResponse.json(unpublishedChapter)
  } catch (error) {
    console.error('[COURSE_CHAPTER_ID_UNPUBLISH]::', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
