'use client'

import { UserButton } from '@clerk/nextjs'
import { usePathname, useRouter } from 'next/navigation'

import { Button } from './ui/button'
import { LogOut } from 'lucide-react'
import Link from 'next/link'
import { SearchInput } from './search-input'

const NavBarRoutes = () => {
  const pathname = usePathname()
  const router = useRouter()

  const isTeacherPage = pathname?.startsWith('/teacher')
  const isCoursePage = pathname?.startsWith('/courses')
  const isSearchPage = pathname === '/search'
  return (
    <>
      {isSearchPage && (
        <div className='hidden lg:block mx-auto'>
          <SearchInput />
        </div>
      )}
      <div className='flex gap-x-2 ml-auto'>
        {isTeacherPage || isCoursePage ? (
          <Link href='/'>
            <Button variant={'destructive'} size='sm'>
              <LogOut className='size-4 mr-2' />
              Exit
            </Button>
          </Link>
        ) : (
          <Link href='/teacher/courses'>
            <Button variant={'ghost'} size='sm'>
              Teacher mode
            </Button>
          </Link>
        )}
        <UserButton />
      </div>
    </>
  )
}

export default NavBarRoutes