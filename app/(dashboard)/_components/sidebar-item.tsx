'use client'

import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'

interface SidebarItemProps {
  icon: LucideIcon
  label: string
  href: string
}

const SidebarItem = ({ icon: Icon, label, href }: SidebarItemProps) => {
  const pathname = usePathname()
  const router = useRouter()

  const isActive =
    (pathname === '/' && href === '/') ||
    pathname === href ||
    pathname?.startsWith(`${href}/`)

  const onClick = () => {
    router.push(href)
  }
  return (
    <button
      onClick={onClick}
      type='button'
      className={cn(
        'flex w-full text-sm text-muted-foreground items-center py-3.5 px-3 hover:bg-muted rounded-lg transition-background group',
        isActive && 'bg-muted text-primary font-medium'
      )}>
      <div className='flex items-center gap-x-2'>
        <Icon
          size={22}
          className={cn('text-slate-500', isActive && 'text-slate-700')}
        />
        {label}
      </div>
    </button>
  )
}

export default SidebarItem
