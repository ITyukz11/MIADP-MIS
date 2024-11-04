import { PageHeader, PageHeaderHeading, PageHeaderDescription } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Notebook, RouterIcon, SearchIcon } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { FcDocument } from "react-icons/fc";
import { HiDocumentCheck } from "react-icons/hi2";
import { IoDocumentAttach } from "react-icons/io5";
import Image from "next/image";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FaTools } from "react-icons/fa";


function page() {
  const documents = [
    { id: 1, type: 'Payroll', name: 'Document A', status: 'Pending', date: 'Jun 16' },
    { id: 2, type: 'Payroll', name: 'Document B', status: 'Completed', date: 'Jul 1' },
    { id: 3, type: 'Reimbursement', name: 'Document C', status: 'In Progress', date: 'Jun 30' },
  ];
     // Randomly select an image from the public/under-development folder
     const imageNumber = Math.floor(Math.random() * 6) + 1;
     const imagePath = `/under-development/${imageNumber}.png`;

  return (
    <div className="flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Doctrack</CardTitle>
          <CardDescription>This section is currently under development.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <Image 
            src={imagePath} 
            alt="Under Development" 
            width={300} 
            height={200} 
            className="rounded-md mb-4"
          />
          <Alert className="flex items-center space-x-2">
            <FaTools className="h-5 w-5 text-yellow-500" />
            <div>
              <AlertTitle>Doctrack</AlertTitle>
              <AlertDescription>
                Features and data are being implemented. Please check back soon!
              </AlertDescription>
            </div>
          </Alert>
        </CardContent>
      </Card>
    </div>
//     <div className="xs:container space-y-4">
//       <div className="w-full flex flex-col gap-2">
//         <div className="w-full flex flex-row gap-2 overflow-x-auto">
//           <Select>
//             <SelectTrigger className=" w-48 max-w-48 flex justify-between ">
//               <SelectValue placeholder="Select document type" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectGroup>
//                 <SelectLabel>Filter</SelectLabel>
//                 <SelectItem value="Payroll">Payroll</SelectItem>
//                 <SelectItem value="Reimbursement">Reimbursement</SelectItem>
//               </SelectGroup>
//             </SelectContent>
//           </Select>

//           <Input
//             type="text"
//             placeholder="Input what document you want to search"
//             className="w-full p-2 border pr-10 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />


//           <Button type="button" className="flex flex-row items-center justify-center text-xs sm:text-sm">
//             <SearchIcon size={20} />Search
//           </Button>
//         </div>
// {/* 
//         <Card className="rounded-sm">
//           <CardContent className="w-full min-h-fit">
//             <Table>
//               <TableCaption>List of Documents</TableCaption>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>ID</TableHead>
//                   <TableHead>Type</TableHead>
//                   <TableHead>Name</TableHead>
//                   <TableHead>Status</TableHead>
//                   <TableHead>Date</TableHead>
//                   <TableHead>Action</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {documents.map(doc => (
//                   <TableRow key={doc.id}>
//                     <TableCell>{doc.id}</TableCell>
//                     <TableCell>{doc.type}</TableCell>
//                     <TableCell>{doc.name}</TableCell>
//                     <TableCell>
//                       {doc.status == "Completed" ?
//                         <Badge variant="secondary">{doc.status}</Badge> :
//                         <Badge variant="destructive">{doc.status}</Badge>

//                       }

//                     </TableCell>
//                     <TableCell>{doc.date}</TableCell>
//                     <TableCell>
//                     <Button variant={'outline'} className="text-xs">View</Button>
//                   </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//               <TableFooter>
//                 <TableRow>
//                   <TableCell colSpan={4}>
//                     Total Documents: {documents.length}
//                   </TableCell>
//                 </TableRow>
//               </TableFooter>
//             </Table>
//           </CardContent>
//         </Card> */}
//       </div>
//     </div>
  );
}

export default page;
