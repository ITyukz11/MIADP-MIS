"use client";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import { FaBookOpen, FaUserAlt } from "react-icons/fa";
import PersonalInformationTab from "./(tabs)/personalInformation";
import ProfileOverviewTab from "./(tabs)/overview";
import { getUserById } from "@/actions/profile/getUserById";
import { useEffect, useState, useCallback } from "react";
import ProfileSettingsTab from "./(tabs)/settings";
import { Settings2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { UnderDevelopmentDialog } from "@/components/UnderDevDialog";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatDateLong } from "@/utils/dateFormat";
import { UserType } from "@/types/users/userType";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export default function Page({ params }: { params: { id: string } }) {
  const [underDevDialogOpen, setUnderDevDialogOpen] = useState<boolean>(false);
  const [data, setData] = useState<UserType>();
  const [dataLoading, setDataLoading] = useState<boolean>(false);
  const [dataError, setDataError] = useState<string>("");

  const fetchUser = useCallback(async () => {
    setDataLoading(true);
    try {
      const user = await getUserById(params.id); // Await the result
      setData(user); // Set the fetched data
      setDataLoading(false);
    } catch (error: any) {
      setDataLoading(false);
      setDataError(error);
    }
  }, [params.id]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const OpenUnderDevDialog = () => {
    setUnderDevDialogOpen(!underDevDialogOpen);
  };

  // Return Skeleton while loading
  if (dataLoading) {
    return (
      <div className="flex flex-col md:flex-row h-screen">
        <Card className="lg:sticky top-0 h-fit w-full lg:w-1/4 p-4 overflow-hidden md:min-w-fit border-b-2 border-r-0 md:border-b-0 md:border-r-2 flex flex-col items-center">
          <CardContent className="flex flex-col items-center">
            <Skeleton className="w-64 h-64 rounded-full" />
            <Skeleton className="mt-2 w-full h-6 mb-2" />
            <Skeleton className="w-full h-16" />
          </CardContent>
        </Card>

        <div className="flex-1 p-6 lg:overflow-y-auto w-full">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="flex items-center justify-start flex-wrap h-auto mb-2 bg-slate-200 w-fit">
              <TabsTrigger value="overview">
                <FaBookOpen className="mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="PersonalInformation">
                <FaUserAlt className="mr-2" />
                Personal Information
              </TabsTrigger>
              <TabsTrigger value="settings">
                <Settings2 className="mr-2 h-5 w-5" />
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <Skeleton className="h-60" />
            </TabsContent>
            <TabsContent value="PersonalInformation">
              <Skeleton className="h-60" />
            </TabsContent>
            <TabsContent value="settings">
              <Skeleton className="h-60" />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col lg:flex-row h-full">
      {/* Sidebar Layout */}
      <Card className="lg:sticky top-0 h-fit w-full lg:w-1/4 p-4 overflow-hidden md:min-w-fit border-b-2 border-r-0 md:border-b-0 md:border-r-2 flex flex-col items-center">
        <CardContent className="flex flex-col items-center w-full">
          <FaUserAlt className="w-full h-60 max-w-60 rounded-full border-2" />
          <Label className="font-semibold text-xl mt-4">
            {data?.name || ""}
          </Label>
          <Label className="font-light text-lg ">{data?.position || ""}</Label>
          <Separator />
          <div className="flex flex-col w-full mt-2">
            <Label className="text-sm text-left font-light">Region</Label>
            <Label className="font-medium text-lg border-b-2">
              {data?.region || ""}
            </Label>
            <Label className="text-sm text-left font-light">
              Component/Unit
            </Label>
            <Label className="font-medium text-lg border-b-2">
              {data?.component || ""} {"- " + data?.unit || ""}
            </Label>

            <Label className="text-sm text-left font-light">Status</Label>
            <Label className="font-medium text-lg border-b-2">
              {data?.status || ""}
            </Label>
            <Label className="text-sm text-left font-light">Date Created</Label>
            <Label className="font-medium text-lg border-b-2">
              {formatDateLong(data?.createdAt.toString() || "")}
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Main Layout */}
      <div className="flex-1 pt-6 md:p-6 lg:overflow-y-auto w-full">
        <Tabs defaultValue="overview" className="w-full">
          <ScrollArea>
            {/* Tabs Header */}
            <TabsList className="flex items-center justify-start flex-wrap h-auto mb-2 bg-slate-200 w-fit">
              <TabsTrigger value="overview">
                <FaBookOpen className="mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="PersonalInformation">
                <FaUserAlt className="mr-2" />
                Personal Information
              </TabsTrigger>
              <TabsTrigger value="settings">
                <Settings2 className="mr-2 h-5 w-5" />
                Settings
              </TabsTrigger>
            </TabsList>
            <ScrollBar orientation="horizontal" className="pt-2" />
          </ScrollArea>
          {/* Tabs Content */}
          <TabsContent value="overview">
            <ProfileOverviewTab
              data={data}
              OpenUnderDevDialog={OpenUnderDevDialog}
              dataLoading={dataLoading}
              dataError={dataError}
            />
          </TabsContent>
          <TabsContent value="PersonalInformation">
            <PersonalInformationTab
              data={data}
              OpenUnderDevDialog={OpenUnderDevDialog}
            />
          </TabsContent>
          <TabsContent value="settings">
            <ProfileSettingsTab
              data={data}
              OpenUnderDevDialog={OpenUnderDevDialog}
            />
          </TabsContent>
        </Tabs>
      </div>
      <UnderDevelopmentDialog
        open={underDevDialogOpen}
        onClose={() => setUnderDevDialogOpen(!underDevDialogOpen)}
      />
    </div>
  );
}
