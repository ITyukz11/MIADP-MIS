"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

import { Badge } from "@/components/ui/badge";
import { Forward } from "lucide-react";

import { useEffect, useState } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { useDispatch, useSelector } from "@/app/store/store";
import { fetchDoctrackDocumentIncomingRoutesData } from "@/app/store/document-tracking/correspondence/incomingRouteAction";
import { formatDate } from "@/components/table/data/activities/coa-columns";
import { fetchDoctrackDocumentsData } from "@/app/store/document-tracking/correspondence/documentAction";
import { Skeleton } from "@/components/ui/skeleton";

interface ViewIncomingRouteProps {
  open: boolean;
  setClose: () => void;
  selectedRow: any;
}

export function ViewIncomingRoute({
  open,
  setClose,
  selectedRow,
}: ViewIncomingRouteProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const dispatch = useDispatch();
  const { documentsData, documentError, documentLoading } = useSelector(
    (state) => state.correspondenceDocument
  );
  useEffect(() => {
    // Dispatch the async action to fetch documents
    dispatch(fetchDoctrackDocumentIncomingRoutesData());
    dispatch(fetchDoctrackDocumentsData());
  }, [dispatch]);

  const filteredDocumentData =
    documentsData &&
    documentsData.filter((document) => document.id === selectedRow.documentId);

  console.log("ASD selectedRow incoming route: ", selectedRow);
  console.log("ASD documentsData: ", documentsData);
  console.log("ASD filteredDocumentData: ", filteredDocumentData);
  const RenderDocumentInfo = (label: string, value: string) => {
    return (
      <>
        <Separator />

        <div className="flex flex-wrap sm:grid grid-cols-8 gap-1">
          <Label className="col-span-1 flex flex-row gap-1">{label}</Label>
          <Badge className="col-span-7" variant={"secondary"}>
            {value}
          </Badge>
        </div>
      </>
    );
  };
  return (
    <Dialog open={open} onOpenChange={setClose}>
      <DialogContent className="max-w-[750px] w-full overflow-y-auto scrollbar-thin max-h-[95vh] rounded-lg">
        <DialogHeader>
          <DialogTitle>Incoming Route</DialogTitle>
          <DialogDescription>
            This is the details of the incoming route, if you want to
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-col gap-2 dark:bg-slate-700 bg-slate-300 rounded-md p-3">
          {documentLoading ? (
            <>
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </>
          ) : (
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger className="p-0 font-semi-bold text-base mb-2">
                  <div>
                    Subject:{" "}
                    <Badge variant={"secondary"}>
                      {filteredDocumentData[0]?.subject}
                    </Badge>{" "}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="grid grid-col gap-2 pt-2">
                  {RenderDocumentInfo(
                    "Description:",
                    filteredDocumentData[0]?.description
                  )}
                  {RenderDocumentInfo("From:", filteredDocumentData[0]?.from)}
                  {RenderDocumentInfo(
                    "Encoder:",
                    filteredDocumentData[0]?.encoder
                  )}
                  {RenderDocumentInfo("Link:", filteredDocumentData[0]?.link)}
                  {RenderDocumentInfo("Date:", filteredDocumentData[0]?.date)}
                  {RenderDocumentInfo(
                    "Remarks:",
                    filteredDocumentData[0]?.remarks
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}
        </div>
        <div className="flex flex-col gap-4">
          <div className="w-full">
            <Label className="text-xs sm:text-sm">Subject</Label>
            <Input readOnly value={selectedRow.subject} />
          </div>
          <div className="w-full">
            <Label className="text-xs sm:text-sm">Purpose</Label>
            <Input readOnly value={selectedRow.purpose} />
          </div>
          <div className="w-full">
            <Label className="text-xs sm:text-sm">Remarks</Label>
            <Input readOnly value={selectedRow.remarks} />
          </div>
        </div>
        <DialogFooter className="flex justify-between">
          <Button type="button">
            Forward To <Forward size={17} />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
