import { Label } from '@/components/ui/label'
import { DataTableDemo } from '@/components/wpf-table'
import React from 'react'

  import { Button } from "@/components/ui/button"

import { ArrowDownIcon } from '@radix-ui/react-icons'
import { NavigationMenuDemo } from '@/components/navigation-menu'

function page() {
  return (
    <div className='container relative'>
        <div>
        <NavigationMenuDemo/>


        </div>
        <DataTableDemo/>
    </div>
  )
}

export default page