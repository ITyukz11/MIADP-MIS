'use client'
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import { FaBookOpen, FaUserAlt } from "react-icons/fa";
import PersonalInformationTab from "./(tabs)/personalInformation";
import ProfileOverviewTab from "./(tabs)/overview";
import { getUserById } from "@/actions/profile/getUserById";
import { useEffect, useState } from "react";
import ProfileSettingsTab from "./(tabs)/settings";
import { Settings, Settings2, SettingsIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { UnderDevelopmentDialog } from "@/components/UnderDevDialog";

export default function Page({ params }: { params: { id: string } }) {
  const [underDevDialogOpen, setUnderDevDialogOpen] = useState<boolean>(false)
  const [data, setData] = useState<any>({})
  const [dataLoading, setDataLoading] = useState<boolean>(false)
  const [dataError, setDataError] = useState<string>('')

  useEffect(() => {
    const fetchUser = async () => {
      setDataLoading(true)
      try {
        const user = await getUserById(params.id); // Await the result
        setData(user); // Set the fetched data
        setDataLoading(false)
      } catch (error:any) {
        //alert(error); // Handle error
        setDataLoading(false)
        setDataError(error)
      }
    };

    fetchUser(); // Call the async function
  }, [params.id]);

  const OpenUnderDevDialog = ()=>{
    setUnderDevDialogOpen(!underDevDialogOpen)
  }
  if(!data) return(<Skeleton className="w-4"/>)
  return(
    <div className="flex flex-col md:flex-row">
      {/* Sidebar Layout */}
      <div className="w-full md:w-1/4 p-4 border-b-2 border-r-0 md:border-b-0 md:border-r-2 flex flex-col items-center">
        <FaUserAlt className="w-full h-60 max-w-60 rounded-full border-2"/>
      <Label className="font-semibold text-xl mt-4">{data.name || ''}</Label>
        <Label className="font-extralight text-lg text-gray-500">{data.position || ''}</Label>
      </div>

      {/* Main Layout */}
      <div className="flex-1 p-6 overflow-hidden">
        <Tabs defaultValue="overview" className="w-full">
          {/* Tabs Header */}
          <TabsList className="mb-2 flex flex-wrap h-fit w-fit">
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

          {/* Tabs Content */}
          <TabsContent value="overview">
            <ProfileOverviewTab data={data} OpenUnderDevDialog={OpenUnderDevDialog} dataLoading={dataLoading} dataError={dataError}/>
          </TabsContent>
          <TabsContent value="PersonalInformation">
            <PersonalInformationTab data={data} OpenUnderDevDialog={OpenUnderDevDialog}/>
          </TabsContent>
          <TabsContent value="settings">
            <ProfileSettingsTab data={data} OpenUnderDevDialog={OpenUnderDevDialog}/>
          </TabsContent>
        </Tabs>
      </div>
      <UnderDevelopmentDialog open={underDevDialogOpen} onClose={()=>setUnderDevDialogOpen(!underDevDialogOpen)}/>
    </div>
  );
}
