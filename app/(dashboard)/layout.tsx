import Header from './_components/header'
import { Sidebar } from './_components/sidebar'

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='h-full'>
      <div className='h-[80px] fixed inset-y-0 w-full z-[50]'>
        <Header />
      </div>
      <div className='hidden lg:flex mt-[80px] h-full w-72 flex-col fixed inset-y-0 z-50'>
        <Sidebar />
      </div>
      <main className='lg:pl-72 pt-[80px]'>{children}</main>
    </div>
  )
}

export default DashboardLayout
