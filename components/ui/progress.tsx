'use client'

import * as React from 'react'
import * as ProgressPrimitive from '@radix-ui/react-progress'

import { cn } from '@/lib/utils'
import { cva, VariantProps } from 'class-variance-authority'
const progressVariants = cva(
  'relative h-4 rounded-full overflow-hidden h-full w-full flex-1 bg-primary transition-all',
  {
    variants: {
      variant: {
        default: 'bg-emerald-500/20',
        success: 'bg-emerald-700'
      },
      defaultVariants: {
        variant: 'default'
      }
    }
  }
)
export interface ProgressProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof progressVariants> {}

type CombinedProgressProps = ProgressProps &
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  CombinedProgressProps
>(({ className, value, variant, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      progressVariants({
        variant
      }),
      className
    )}
    {...props}>
    <ProgressPrimitive.Indicator
      className='h-full w-full flex-1 bg-emerald-700 transition-all'
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
