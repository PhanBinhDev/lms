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
      chapterId: string
    }
  }
) {
  try {
    const { userId } = auth()
    const { courseId, chapterId } = params
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const courseOwner = await db.course.findUnique({
      where: { id: courseId, userId }
    })

    if (!courseOwner) {
      return new NextResponse('Forbidden - This course do not belong to you', {
        status: 403
      })
    }

    const unpublishedChapter = await db.chapter.update({
      where: { id: chapterId, courseId },
      data: {
        isPublished: false
      }
    })

    const publishedChaptersInCourse = await db.chapter.findMany({
      where: {
        courseId,
        isPublished: true
      }
    })

    if (!publishedChaptersInCourse.length) {
      await db.course.update({
        where: { id: courseId },
        data: {
          isPublished: false
        }
      })
    }

    return NextResponse.json(unpublishedChapter)
  } catch (error) {
    console.error('[COURSE_CHAPTER_ID_UNPUBLISH]::', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
