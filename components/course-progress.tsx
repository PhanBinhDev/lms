import { cn } from '@/lib/utils'
import { Progress } from '@/components/ui/progress'

interface CourseProgressProps {
  variant?: 'default' | 'success'
  size?: 'default' | 'sm'
  value: number
}

export const colorByVariant = {
  default: 'text-emerald-700',
  success: 'text-emerald-700'
}

export const sizeByVariant = {
  default: 'text-sm',
  sm: 'text-xs'
}

export const CourseProgress = ({
  variant = 'default',
  size = 'default',
  value
}: CourseProgressProps) => {
  return (
    <div>
      <Progress variant={variant} value={value} className='h-2' />
      <p
        className={cn(
          'font-medium mt-2 text-sky-700',
          colorByVariant[variant || 'default'],
          sizeByVariant[size || 'default']
        )}>
        {Math.round(value)}% Complete
      </p>
    </div>
  )
}
