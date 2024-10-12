'use client'

import { Category } from '@prisma/client'
import {
  FcEngineering,
  FcMusic,
  FcOldTimeCamera,
  FcSalesPerformance,
  FcSportsMode,
  FcFilmReel,
  FcMultipleDevices,
  FcDatabase
  // FcDa
} from 'react-icons/fc'
import { IconType } from 'react-icons/lib'
import { CategoryItem } from './category-item'

const iconMap: Record<Category['name'], IconType> = {
  Music: FcMusic,
  Photography: FcOldTimeCamera,
  Fitness: FcSportsMode,
  Accounting: FcSalesPerformance,
  'Computer Science': FcMultipleDevices,
  'Data Analytics': FcDatabase,
  Filming: FcFilmReel,
  Engineering: FcEngineering,
  Database: FcDatabase
}

export const Categories = ({ items }: { items: Category[] }) => {
  return (
    <div className='flex items-center gap-x-2 overflow-x-auto pb-2'>
      {items.map((item) => (
        <CategoryItem
          key={item.id}
          label={item.name}
          icon={iconMap[item.name]}
          value={item.id}
        />
      ))}
    </div>
  )
}
