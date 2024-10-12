import { Menu } from 'lucide-react'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet'
import { Sidebar } from './sidebar'
const MobileSidebar = () => {
  return (
    <Sheet>
      <SheetTrigger className='lg:hidden pr-4 hover:opacity-75 transition'>
        <Menu />
      </SheetTrigger>
      <SheetContent side='left' className='p-0 bg-white' iconClose={false}>
        <Sidebar />
      </SheetContent>
    </Sheet>
  )
}

export default MobileSidebar
