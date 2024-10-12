import Link from 'next/link'
import Logo from './logo'
import { Menu } from 'lucide-react'
import MobileSidebar from './mobile-sidebar'
import NavBarRoutes from '@/components/navbar-routes'

const Header = () => {
  return (
    <div className='p-4 gap-x-4 w-full h-full flex items-center bg-white border-b shadow-sm'>
      <Link href={'/'}>
        <div className='items-center gap-x-2 hidden lg:flex hover:opacity-75 transition-opacity'>
          <Logo />
        </div>
      </Link>
      <MobileSidebar />
      <NavBarRoutes />
    </div>
  )
}

export default Header
