"use client";
import { DataTable } from "@/components/table/data-table";
import { incomingDocumentRouteColumn } from "@/components/table/data/documents/incoming-routes";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "@/app/store/store";
import { fetchDoctrackDocumentIncomingRoutesData } from "@/app/store/document-tracking/correspondence/incomingRouteAction";
import { ViewIncomingRoute } from "./(dialog)/view-incoming-route-dialog";
import { ReceivedIncomingRouteDialog } from "./(dialog)/received-inc-route-dialog";
import { getUserById } from "@/actions/profile/getUserById";
import { insertNewStatus } from "@/actions/document-tracking/correspondence/incoming/insertNewStatus";
import { getCurrentUser } from "@/lib/session";
import { ToastAction } from "@/components/ui/toast";
import { toast } from "@/components/ui/use-toast";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "next-auth/react";

export default function Page() {
  const [viewRoute, setViewRoute] = useState<boolean>(false);
  const [receiveDialog, setReceiveDialog] = useState<boolean>(false);

  const [selectedRow, setSelectedRow] = useState<object>({});
  const [documentId, setDocumentId] = useState<string>();

  const [loadingReceive, setLoadingReceive] = useState<boolean>(false);

  const { data: currentUser } = useSession();
  const handleRouteClick = (row: any) => {
    console.log(`Route clicked for row: ${JSON.stringify(row)}`);
    setSelectedRow(row.original);
    // setIncOrOutDialog(true)
  };

  const handlePreviewClick = (row: any) => {
    console.log(`Preview clicked for row ${row}`);
    setSelectedRow(row.original);
    setViewRoute(true);
    // Implement your preview logic here
  };

  const handleRouteReceived = async (documentId: string) => {
    console.log("handleRouteReceived documentId: ", documentId);
    setDocumentId(documentId);
    setReceiveDialog(true);
    // Implement your preview logic here
  };

  const handleHistoryStatusClick = (row: any) => {
    console.log(`preview row: `, row);
  };

  const documentIncomingRouteColumns = incomingDocumentRouteColumn({
    onRouteClick: handleRouteClick,
    onPreviewClick: handlePreviewClick,
    onHistoryStatusClick: handleHistoryStatusClick,
    handleRouteReceived: handleRouteReceived,
  });
  const dispatch = useDispatch();
  const {
    documentsIncomingRouteData,
    documentIncomingRouteError,
    documentIncomingRouteLoading,
  } = useSelector((state) => state.correspondenceIncomingRoute);
  useEffect(() => {
    // Dispatch the async action to fetch documents
    dispatch(fetchDoctrackDocumentIncomingRoutesData());
  }, [dispatch]);

  // console.log("documentsIncomingRouteData: ", documentsIncomingRouteData)
  // console.log("documentIncomingRouteError: ", documentIncomingRouteError)
  // console.log("documentIncomingRouteLoading: ", documentIncomingRouteLoading)

  const handleReceivedDialog = () => {
    setLoadingReceive(true);
    console.log("received !");
    console.log("documentId: ", documentId);
    let values = [
      {
        status: `${
          currentUser?.user.unit
            ? currentUser?.user.unit
            : currentUser?.user.component
        } Received`,
        doctrackDocumentIncomingRouteId: documentId,
        userId: currentUser?.user.id,
      },
    ];
    insertNewStatus(values).then((data) => {
      if (!data.error) {
        dispatch(fetchDoctrackDocumentIncomingRoutesData());
        setLoadingReceive(false);
        setReceiveDialog(false);
        toast({
          title: "Received Success",
          description: "Incoming route document received successfully",
          duration: 5000,
          action: <ToastAction altText="Ok">Ok</ToastAction>,
        });
      }
    });
  };
  return (
    <>
      {documentIncomingRouteLoading ? (
        <>
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </>
      ) : (
        <>
          <DataTable
            data={documentsIncomingRouteData}
            columns={documentIncomingRouteColumns}
            // hiddenColumns={hiddenColumns}
            allowSelectRow={false}
          />
        </>
      )}
      <ViewIncomingRoute
        open={viewRoute}
        setClose={() => setViewRoute(false)}
        selectedRow={selectedRow}
      />
      <ReceivedIncomingRouteDialog
        open={receiveDialog}
        closeAlertDialog={() => setReceiveDialog(!receiveDialog)}
        received={handleReceivedDialog}
        loading={loadingReceive}
      />
    </>
  );
}
