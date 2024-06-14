"use client";
import { PageHeader, PageHeaderHeading, PageHeaderDescription } from "@/components/page-header";

function page() {
  return (
    <div className="xs:container relative">
      <PageHeader>
        <PageHeaderHeading>
          Document Tracking
        </PageHeaderHeading>

        <div className=''>
          <PageHeaderDescription>
            This Document Tracking page is still under development. It will be available for use soon. Please be patient as PSO currently has only one programmer.
          </PageHeaderDescription>
        </div>
      </PageHeader>
    </div>
  );
}

export default page;
