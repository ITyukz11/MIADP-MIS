
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
         
        </PageActions>
      </PageHeader>
    
    </div>
  )
}