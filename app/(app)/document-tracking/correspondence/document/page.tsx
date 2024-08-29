'use client'
import { useDispatch, useSelector } from '@/app/store/store'
import { DataTable } from '@/components/table/data-table'
import { documentColumn } from '@/components/table/data/documents/data'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import React, { useEffect, useState } from 'react'
import IncOrOutDialog from '../(dialog)/incoming-or-outgoing-dialog'
import { IncomingRoutingSlipDialog } from '../(dialog)/incoming-routing-slip-dialog'
import { OutgoingFormDialog } from '../(dialog)/outgoing-form-dialog'
import { CorrespondenceDocumentType } from '@/types/document-tracking/correspondence-documents'
import { fetchDoctrackDocumentsData } from '@/app/store/document-tracking/correspondence/documentAction'

type Props = {}

function Page({ }: Props) {
  const hiddenColumns = [
    'from',
    'link',
  ]

  const dispatch = useDispatch();
  const { documentsData, documentError, documentLoading } = useSelector((state) => state.correspondenceDocument);
  const [addIncomingRoutingSlipDialog, setAddIncomingRoutingSlipDialog] = useState<boolean>(false)
  const [addOutgoingFormDialog, setAddOutgoingFormDialog] = useState<boolean>(false)
  const [incOrOutDialog, setIncOrOutDialog] = useState<boolean>(false)
  const [selectedRow, setSelectedRow] = useState<object>({})

  useEffect(() => {
    // Dispatch the async action to fetch documents
    dispatch(fetchDoctrackDocumentsData());
  }, [dispatch]);

  console.log("documentsData: ", documentsData)
  const handleRouteClick = (row: any) => {
    console.log(`Route clicked for row: ${JSON.stringify(row)}`);
    setSelectedRow(row.original)
    // setIncOrOutDialog(true)
    setAddIncomingRoutingSlipDialog(true)
  };

  const handlePreviewClick = (row: any) => {
    console.log(`Preview clicked for row ${row}`);
    // Implement your preview logic here
  };

  const documentColumns = documentColumn({
    onRouteClick: handleRouteClick,
    onPreviewClick: handlePreviewClick,
  });
  return (
    <>
      {documentLoading ?
        <>
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </> :
        <div className='w-full overflow-x-auto scrollbar-thin p-1 flex justify-center'>
          <DataTable
            data={documentsData}
            columns={documentColumns}
            hiddenColumns={hiddenColumns}
            allowSelectRow={false}
          />
          {documentError && <Label className=' text-destructive'>{documentError}</Label>}
          <IncomingRoutingSlipDialog
            open={addIncomingRoutingSlipDialog}
            setClose={() => setAddIncomingRoutingSlipDialog(!addIncomingRoutingSlipDialog)}
            selectedRow={selectedRow} />
          <OutgoingFormDialog open={addOutgoingFormDialog} setClose={() => setAddOutgoingFormDialog(!addOutgoingFormDialog)} />
        </div>
      }
    </>
  )
}

export default Page