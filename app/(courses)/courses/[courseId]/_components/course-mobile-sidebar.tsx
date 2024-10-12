import { Chapter, Course, UserProgress } from '@prisma/client'

import { Menu } from 'lucide-react'

import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet'

import { CourseSideBar } from './course-sidebar'

interface CourseMobileNavbarProps {
  course: Course & {
    chapters: (Chapter & {
      userProgress: UserProgress[] | null
    })[]
  }
  progressCount: number
}

export const CourseMobileSidebar = ({
  course,
  progressCount
}: CourseMobileNavbarProps) => {
  return (
    <Sheet>
      <SheetTrigger className='lg:hidden p-4 hover:opacity-75 transition'>
        <Menu />
      </SheetTrigger>
      <SheetContent side={'left'} className='p-0 bg-white w-72'>
        <CourseSideBar course={course} progressCount={progressCount} />
      </SheetContent>
    </Sheet>
  )
}
