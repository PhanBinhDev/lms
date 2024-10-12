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

    const chapter = await db.chapter.findUnique({
      where: { id: chapterId, courseId }
    })

    const muxData = await db.muxData.findUnique({
      where: {
        chapterId
      }
    })

    if (
      !chapter ||
      !muxData ||
      !chapter.title ||
      !chapter.description ||
      !chapter.videoUrl
    ) {
      return new NextResponse('Chapter details are required', {
        status: 400
      })
    }
    const publishedChapter = await db.chapter.update({
      where: {
        id: chapterId,
        courseId
      },
      data: {
        isPublished: true
      }
    })

    return NextResponse.json(publishedChapter)
  } catch (error) {
    console.error('[COURSE_CHAPTER_ID_PUBLISH]::', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
