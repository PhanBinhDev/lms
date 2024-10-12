'use client'

import qs from 'query-string'
import { Search } from 'lucide-react'
import { Input } from './ui/input'
import { useEffect, useState } from 'react'
import { useDebounce } from '@/app/hooks/use-debounce'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

export const SearchInput = () => {
  const [value, setValue] = useState('')
  const debouncedValue = useDebounce(value)

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const currentCategoryId = searchParams.get('categoryId')

  useEffect(() => {
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          categoryId: currentCategoryId,
          title: debouncedValue
        }
      },
      {
        skipEmptyString: true,
        skipNull: true
      }
    )
    router.push(url)
  }, [debouncedValue, currentCategoryId, pathname, router])
  return (
    <div className='relative'>
      <Search className='size-4 absolute top-3 left-3 text-slate-600' />
      <Input
        onChange={(e) => setValue(e.target.value)}
        className='w-full lg:w-[300px] pl-9 rounded-md bg-slate-100 focus-visible:ring-slate-200'
        placeholder='Seach for a course'
      />
    </div>
  )
}
