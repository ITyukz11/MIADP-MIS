import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MIADPColorCodeProps {
  open: boolean;
  setClose: () => void;
}

const MIADPColorCodeDialog = React.memo(function MIADPColorCodeDialog({
  open,
  setClose,
}: MIADPColorCodeProps) {
  console.log("ACTIVITY MIADPColorCodeDialog");
  return (
    <Dialog open={open} onOpenChange={setClose}>
      <DialogContent className="min-w-[99%] md:min-w-[90%] lg:min-w-[60%] overflow-y-auto scrollbar-thin h-[95vh] rounded-lg">
        <DialogHeader>
          <DialogDescription className="relative h-full w-full px-4">
            <Tabs defaultValue="color-code">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="color-code">Region Color Code</TabsTrigger>
                <TabsTrigger value="others">Under Development</TabsTrigger>
              </TabsList>
              <TabsContent value="color-code">
                <DialogTitle className="flex flex-row gap-1"></DialogTitle>
                <Image
                  className="rounded-md"
                  src={"/map/region-color-code.png"}
                  alt="MIADP map color code"
                  width={3000}
                  height={3000}
                />
              </TabsContent>
              <TabsContent value="others">
                <div className="flex justify-center">
                  <Image
                    src={"/under-development/1.png"}
                    alt="Under Development"
                    width={800}
                    height={500}
                    className="rounded-lg"
                  />
                </div>
              </TabsContent>
            </Tabs>
          </DialogDescription>
        </DialogHeader>
        <Separator />
      </DialogContent>
    </Dialog>
  );
});

export default MIADPColorCodeDialog;
