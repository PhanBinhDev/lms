import { db } from '@/lib/db'
import Mux from '@mux/mux-node'
import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const { video } = new Mux({
  tokenId: process.env.MUX_TOKEN_ID!,
  tokenSecret: process.env.MUX_SECRET_KEY!
})
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
    const values = await req.json()
    const { courseId } = params

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const course = await db.course.update({
      where: { id: courseId },
      data: {
        ...values
      }
    })
    return NextResponse.json(course)
  } catch (error) {
    console.error('[Course]::', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function DELETE(
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
            muxData: true,
            userProgress: true
          }
        },
        attachments: true
      }
    })

    if (!course) {
      return new NextResponse('Course not found', {
        status: 404
      })
    }

    // Delete video files
    course.chapters.map(async (chapter) => {
      if (chapter.muxData) {
        await video.assets.delete(chapter.muxData.assetId)
      }
    })

    const deletedCourse = await db.course.delete({ where: { id: courseId } })
    return NextResponse.json(deletedCourse)
  } catch (error) {
    console.error('[Course]::', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
