import { getProgress } from '@/actions/get-progress'
import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { CourseSideBar } from './_components/course-sidebar'
import { CourseNavBar } from './_components/course-navbar'

const CourseLayout = async ({
  children,
  params
}: {
  children: React.ReactNode
  params: {
    courseId: string
  }
}) => {
  const { userId } = auth()

  if (!userId) return redirect('/')

  const course = await db.course.findUnique({
    where: { id: params.courseId },
    include: {
      chapters: {
        where: {
          isPublished: true
        },
        include: {
          userProgress: {
            where: {
              userId
            }
          }
        },
        orderBy: {
          position: 'asc'
        }
      }
    }
  })

  if (!course) return redirect('/')
  const progressCount = await getProgress(userId, course.id)
  return (
    <div className='h-full'>
      <div className='h-[80px] lg:pl-80 fixed inset-y-0 w-full'>
        <CourseNavBar course={course} progressCount={progressCount} />
      </div>
      <div className='hidden lg:flex h-full w-80 flex-col fixed inset-y-0 z-50'>
        <CourseSideBar course={course} progressCount={progressCount} />
      </div>
      <main className='lg:pl-80 pt-[80px] h-full'>{children}</main>
    </div>
  )
}

export default CourseLayout
