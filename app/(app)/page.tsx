import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import {
  PageActions,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header"

export default function IndexPage() {
  return (
    <div className="container relative">
      <PageHeader>
      <PageHeaderHeading>Hi! Welcome to MIADP</PageHeaderHeading>

        <PageHeaderHeading>Management Information System</PageHeaderHeading>
        <PageHeaderDescription>
        Welcome to the MIADP Management Information System! Our system efficiently tracks encoded documents, streamlining document management processes for easy access and organization.
        </PageHeaderDescription>
        <PageActions>
          <Link href="/supports" className={cn(buttonVariants())}>
            I-Plan
          </Link>
         
        </PageActions>
      </PageHeader>
    
    </div>
  )
}