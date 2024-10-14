import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

export async function PUT(
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
    const { isCompleted } = await req.json()
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }
    const userProgress = await db.userProgress.upsert({
      where: {
        userId_chaperId: {
          userId,
          chaperId: chapterId
        }
      },
      update: {
        isCompleted
      },
      create: {
        userId,
        chaperId: chapterId,
        isCompleted
      }
    })

    return NextResponse.json(userProgress)
  } catch (error) {
    console.error('[USER_PROGRESS]::', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
