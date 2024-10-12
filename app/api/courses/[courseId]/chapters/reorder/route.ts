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
    }
  }
) {
  try {
    const { userId } = auth()
    const { list } = await req.json()
    const { courseId } = params
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

    await db.$transaction(
      list.map((item: any) =>
        db.chapter.update({
          where: { id: item.id },
          data: {
            position: item.position
          }
        })
      )
    )
    return NextResponse.json('Success', { status: 200 })
  } catch (error) {
    console.error('[REORDER]::', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
