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
      chapterId: string
    }
  }
) {
  try {
    const { userId } = auth()
    const { isPublished, ...values } = await req.json()
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

    const chapter = await db.chapter.update({
      where: {
        id: chapterId,
        courseId
      },
      data: {
        ...values
      }
    })

    if (values.videoUrl) {
      const existingMuxData = await db.muxData.findFirst({
        where: { chapterId }
      })

      if (existingMuxData) {
        await video.assets.delete(existingMuxData.assetId)
        await db.muxData.delete({
          where: {
            id: existingMuxData.id
          }
        })
      }

      const asset = await video.assets.create({
        input: values.videoUrl,
        playback_policy: ['public'],
        test: false
      })

      await db.muxData.create({
        data: {
          chapterId,
          assetId: asset.id,
          playbackId: asset.playback_ids?.[0]?.id!
        }
      })
    }

    return NextResponse.json(chapter)
  } catch (error) {
    console.error('[COURSE_CHAPTER_ID]::', error)
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
      where: {
        id: chapterId,
        courseId
      }
    })

    if (!chapter) {
      return new NextResponse('Chapter not found', { status: 404 })
    }

    if (chapter.videoUrl) {
      const existingMuxData = await db.muxData.findFirst({
        where: { chapterId }
      })

      if (existingMuxData) {
        await video.assets.delete(existingMuxData.assetId)
        await db.muxData.delete({
          where: {
            id: existingMuxData.id
          }
        })
      }
    }

    const deletedChapter = await db.chapter.delete({
      where: {
        id: chapterId,
        courseId
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
        where: {
          id: courseId
        },
        data: {
          isPublished: false
        }
      })
    }

    return NextResponse.json(deletedChapter)
  } catch (error) {
    console.error('[CHAPTER_ID_DELETE]::', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
