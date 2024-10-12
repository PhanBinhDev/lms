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
      where: { id: courseId, userId },
      include: {
        chapters: {
          include: {
            muxData: true
          }
        }
      }
    })
    if (!course) {
      return new NextResponse('Course not found', {
        status: 404
      })
    }

    // if (false) {
    //   return new NextResponse('Chapter details are required', {
    //     status: 400
    //   })
    // }
    const hasPublishedChapter = course.chapters.some(
      (chapter) => chapter.isPublished
    )

    if (!hasPublishedChapter) {
      return new NextResponse('At least one published chapter is required', {
        status: 400
      })
    }

    if (
      !course.title ||
      !course.description ||
      !course.imageUrl ||
      !course.price ||
      !course.categoryId
    ) {
      return new NextResponse('All required fields are required', {
        status: 400
      })
    }

    const publishedCourse = await db.course.update({
      where: {
        id: courseId
      },
      data: {
        isPublished: true
      }
    })

    return NextResponse.json(publishedCourse)
  } catch (error) {
    console.error('[COURSE_ID_PUBLISH]::', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
