import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth()
    const { url } = await req.json()
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

    const attachments = await db.attachment.create({
      data: {
        url,
        courseId,
        name: url.split('/').pop()
      }
    })

    return NextResponse.json(attachments)
  } catch (error) {
    console.log('[ATTACHMENT]::', error)
    return new NextResponse('Internal Server Error', {
      status: 500
    })
  }
}
