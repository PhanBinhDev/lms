import { db } from '@/lib/db'
import { Attachment, Chapter, UserProgress } from '@prisma/client'

interface GetChapterProps {
  userId: string
  courseId: string
  chapterId: string
}

export const getChapter = async ({
  userId,
  courseId,
  chapterId
}: GetChapterProps) => {
  try {
    const pucharse = await db.purchase.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId
        }
      }
    })

    const course = await db.course.findUnique({
      where: {
        isPublished: true,
        id: courseId
      },
      select: {
        price: true
      }
    })

    const chapter = await db.chapter.findUnique({
      where: {
        id: chapterId,
        isPublished: true
      }
    })

    if (!chapter || !course) {
      throw new Error('Chapter or Course not found')
    }

    let muxData = null,
      nextChapter: Chapter | null = null,
      attachments: Attachment[] = []

    if (pucharse) {
      attachments = await db.attachment.findMany({
        where: {
          courseId
        }
      })
    }

    if (chapter.isFree || pucharse) {
      muxData = await db.muxData.findUnique({
        where: {
          chapterId
        }
      })
      nextChapter = await db.chapter.findFirst({
        where: {
          courseId,
          isPublished: true,
          position: chapter.position + 1
        },
        orderBy: {
          position: 'asc'
        }
      })
    }

    let userProgress = await db.userProgress.findUnique({
      where: {
        userId_chaperId: {
          userId,
          chaperId: chapterId
        }
      }
    })

    console.log({
      attachments
    })
    return {
      chapter,
      course,
      muxData,
      nextChapter,
      userProgress,
      purchase: pucharse || null,
      attachments
    }
  } catch (error) {
    console.log('[GET_CHAPTER]', error)
    return {
      chapter: null,
      course: null,
      muxData: null,
      nextChapter: null,
      userProgress: null,
      purchase: null
    }
  }
}
