import NavBarRoutes from '@/components/navbar-routes'
import { Chapter, Course, UserProgress } from '@prisma/client'
import { CourseMobileSidebar } from './course-mobile-sidebar'

interface CourseNavbarProps {
  course: Course & {
    chapters: (Chapter & {
      userProgress: UserProgress[] | null
    })[]
  }
  progressCount: number
}

export const CourseNavBar = ({ course, progressCount }: CourseNavbarProps) => {
  return (
    <div className='border-b p-4 h-full flex items-center bg-white shadow-sm'>
      <CourseMobileSidebar course={course} progressCount={progressCount} />
      <NavBarRoutes />
    </div>
  )
}
