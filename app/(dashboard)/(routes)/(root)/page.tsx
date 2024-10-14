import { getDashboardCourses } from '@/actions/get-dashboard-courses'
import { CoursesList } from '@/components/courses-list'
import { auth } from '@clerk/nextjs/server'
import { Clock, SquareCheck } from 'lucide-react'
import { redirect } from 'next/navigation'
import { InfoCard } from './_components/info-card'

const Dashboard = async () => {
  const { userId } = auth()

  if (!userId) return redirect('/')

  const { completedCourses, coursesInProgress } = await getDashboardCourses(
    userId
  )
  return (
    <div className='p-6 space-y-4'>
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
        <InfoCard
          icon={Clock}
          label='In Progress'
          numberOfItems={coursesInProgress.length}
        />

        <InfoCard
          icon={SquareCheck}
          label='Completed'
          variant='success'
          numberOfItems={completedCourses.length}
        />
      </div>
      <CoursesList items={[...completedCourses, ...coursesInProgress]} />
    </div>
  )
}

export default Dashboard
