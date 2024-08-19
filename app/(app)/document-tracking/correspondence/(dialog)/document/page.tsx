import { Label } from '@/components/ui/label'
import { Construction } from 'lucide-react'
import React from 'react'

type Props = {}

function Page({ }: Props) {
  return (
    <div>
      <div className='flex flex-row gap-2 items-center'>
        <Construction />

        <Label>Still under development!</Label>
        <Construction />
      </div>

    </div>
  )
}

export default Page