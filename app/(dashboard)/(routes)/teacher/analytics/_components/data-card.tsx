import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatPrice } from '@/lib/format'

interface DataCardProps {
  value: number
  label: string
  shouldFormat?: boolean
}

export const DataCard = ({ value, label, shouldFormat }: DataCardProps) => {
  return (
    <Card>
      <CardHeader className='flex items-center flex-row justify-between space-y-0 pb-2'>
        <CardTitle className='text-sm font-medium'>{label}</CardTitle>
      </CardHeader>
      <CardContent className='font-bold'>
        {shouldFormat ? formatPrice(value) : value}
      </CardContent>
    </Card>
  )
}
