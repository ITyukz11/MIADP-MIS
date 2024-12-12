'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDispatch, useSelector } from '@/app/store/store';
import { fetchSubprojectData } from '@/app/store/subproject/subprojectAction';
import { DataTable } from '@/components/table/data-table';
import { subprojectColumn } from '@/components/table/data/subproject/subproject-column';
import { Skeleton } from '@/components/ui/skeleton';
import { Label } from '@/components/ui/label';
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";
// import dynamic from 'next/dynamic';
import { TargetIcon } from '@radix-ui/react-icons';
import { UnderDevelopmentDialog } from '@/components/UnderDevDialog';
import { LuConstruction } from "react-icons/lu";
import { FaStore } from "react-icons/fa";
import PhilippineMap from '../(components)/PhilippineMap';
import Image from 'next/image';

// const PhilippineMapz = dynamic(() => import("../(components)/PhilippineMap"), { ssr:false })


// Define a custom marker icon
// const customMarkerIcon = new L.Icon({
//   iconUrl: "/marker.png", // Replace with your custom marker image path
//   iconSize: [32, 32], // Size of the marker icon
//   iconAnchor: [16, 32], // Anchor the icon to the bottom center
//   popupAnchor: [0, -32], // Position the popup above the marker
// });

interface MarkerData {
  position: [number, number];
  text: string;
}

type Props = {};

const Page = (props: Props) => {
  const [openGenerateDialog, setGenerateDialog] = useState<boolean>(false);

  const dispatch = useDispatch();
  const { subprojectData, subprojectError, subprojectLoading } = useSelector((state) => state.subprojectData);

  useEffect(() => {
    if (Object.keys(subprojectData).length === 0) {
      dispatch(fetchSubprojectData());
    }
  }, [dispatch, subprojectData]);


  // Center position for the map
  const mapCenter: [number, number] = [7.188559177058451, 125.49113793170541]; // Example: London

  // Dynamic marker data
  const markers: MarkerData[] = useMemo(
    () => [
      { position: [8.167892386524807, 123.28865103497571], text: "Improvement/Concreting of Junction Tamurayan to Macasing FMR, Dumingag, Zamboanga del Sur" },
      { position: [8.338201136267228, 126.04721180813691], text: "Improvement/Concreting of NRJ Purok Ocite to Bahi FMR Municipality of Rosario, Agusan del Sur" },
      { position: [6.3953716062573855, 124.34789294525619], text: "IMPROVEMENT/CONCRETING OF BARANGAY NATI AND TINALON: NATIONAL HIGHWAY JUNCTION - SITIO TAGBAKTAGBAK -SITIO BALITE – SITIO MULAWIN FMR" },
      { position: [7.0885177538278255, 125.24333152717006], text: "Improvement/Concreting of Brgy. Manovisa: So. Mabato - So. Timodas Farm-to-Market Road, Municipality of Magpet, Cotabato" },
      { position: [7.137855565904243, 125.18160931635563], text: "Rubber Cup Lump Productions, Consolidation and Marketing Imamaling, Magpet, Cotabato" },
      { position: [6.504863763590235, 124.28967886058803], text: "Green Coffee Beans Production, Consolidation and Marketing Kulaman" },
    ],
    []
  );
  const [openUnderDev, setOpenUnderDev] = useState<boolean>(false)

  return (
    <div className="xs:container space-y-4">
       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
       <Card className="hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer" onClick={()=> setOpenUnderDev(true)}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Infrastructure
                    </CardTitle>
                    <LuConstruction className="text-muted-foreground w-5 h-5" />
                  </CardHeader>
                  <CardContent>
                  
                        <div className="text-2xl font-bold">4</div>
                        <p className="text-xs text-muted-foreground">
                          +2 added from last month
                        </p>
                  </CardContent>
                </Card>
                <Card className="hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer" onClick={()=> setOpenUnderDev(true)}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Enterprise
                    </CardTitle>
                    <FaStore className="text-muted-foreground w-5 h-5" />
                  </CardHeader>
                  <CardContent>
                  
                        <div className="text-2xl font-bold">5</div>
                        <p className="text-xs text-muted-foreground">
                          +2 added from last month
                        </p>
                  </CardContent>
                </Card>
                <Card className="hover:bg-gray-100 dark:hover:bg-gray-800  cursor-pointer" onClick={()=> setOpenUnderDev(true)}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Subproject Status
                    </CardTitle>
                    <TargetIcon className="text-muted-foreground w-5 h-5" />
                  </CardHeader>
                  <CardContent>
                  
                        <div className="text-2xl font-bold">15%</div>
                        <p className="text-xs text-muted-foreground">
                          +1% added from last month
                        </p>
                  </CardContent>
                </Card>
                <Card className="hover:bg-gray-100 dark:hover:bg-gray-800  cursor-pointer" onClick={()=> setOpenUnderDev(true)}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Generated Subproject Code
                    </CardTitle>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-muted-foreground">
                      <path d="M20 7v10a2 2 0 01-2 2H6a2 2 0 01-2-2V7a2 2 0 012-2h12a2 2 0 012 2zM10 4h4" />
                      <line x1="12" y1="9" x2="12" y2="13" />
                      <line x1="9" y1="10" x2="9" y2="14" />
                      <line x1="15" y1="10" x2="15" y2="14" />
                    </svg>

                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">+9</div>
                    <p className="text-xs text-muted-foreground">
                      +2 since last month
                    </p>
                  </CardContent>
                </Card>
              </div>
        <Card>
          <CardHeader></CardHeader>
          <CardContent>
            {subprojectError && <Label className="text-destructive">{subprojectError}</Label>}
            {subprojectLoading ? 
            <div className='flex flex-col gap-2'>
              <Skeleton className='w-full h-10'/>
              <Skeleton className='w-full h-50'/>
              <Skeleton className='w-full h-10'/>
            </div>:
               <DataTable
               data={subprojectData}
               columns={subprojectColumn}
               allowSelectRow={false}
               hiddenColumns={[
                 'subprojectTitle',
                 'province',
                 'municipality',
                 'ancestralDomainLoc',
                 'createdAt',
               ]}
             />}
          </CardContent>
        </Card>
      
      <Card className="w-full">
          <CardHeader></CardHeader>
          <CardContent className="w-full">
          ***MAP HERE
          <div className="flex justify-center">
                        <Image
                            src={'/under-development/1.png'}
                            alt="Under Development"
                            width={300} // Adjust width as needed
                            height={200} // Adjust height as needed
                            className="rounded-lg" // Optional styling
                        />
                </div>
               {/* <PhilippineMap/> */}

          </CardContent>
        </Card>
      <UnderDevelopmentDialog open={openUnderDev} onClose={()=>setOpenUnderDev(!openUnderDev)}/>
    </div>
  );
};

export default Page;
