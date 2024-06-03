import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { FaCalendarAlt } from 'react-icons/fa';
import { useCalendarOfActivityContext } from '@/components/CalendarOfActivityContext';
import { DataTable } from '@/components/table/data-table';
import { useCurrentUser } from '@/components/CurrentUserContext';
import { columns } from '@/components/table/data/activities/coa-columns';
import TrashLottieAnimation from '@/components/lottie-icon-animations/Trash';
import AssignmentLottieAnimation from '@/components/lottie-icon-animations/Assignment';

type Props = {};

export const ViewMySchedDialog = (props: Props) => {
  const { activities, loading, error } = useCalendarOfActivityContext();
  const { currentUser } = useCurrentUser();

  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [isHoveredTrash, setIsHoveredTrash] = useState(false);
  const [isHoveredAssignment, setIsHoveredAssignment] = useState(false);
  useEffect(() => {
    if (currentUser && currentUser.name) {
      const filtered = activities.filter(activity => activity.userName === currentUser.name);
      setFilteredData(filtered);
    }
  }, [currentUser, activities]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className='flex flex-row items-center gap-1 justify-center'>
          <FaCalendarAlt /> View my Activity
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-[90vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>My Activities</DialogTitle>
          <DialogDescription>
            Total activities: <b>{filteredData.length}</b>. You can update and delete your activities here.

          </DialogDescription>
          <div className='flex flex-row gap-2 mt-2'>
          <Button
              variant="outline"
              onMouseEnter={() => setIsHoveredAssignment(true)}
              onMouseLeave={() => setIsHoveredAssignment(false)}
            >
              <AssignmentLottieAnimation width={25} height={25} isHovered={isHoveredAssignment}/>Update</Button>
            <Button
              variant="outline"
              onMouseEnter={() => setIsHoveredTrash(true)}
              onMouseLeave={() => setIsHoveredTrash(false)}
            >
              <TrashLottieAnimation width={25} height={25} isHovered={isHoveredTrash} />
              Delete
            </Button>
          </div>

        </DialogHeader>
        <div className='overflow-x-hidden'>
          <DataTable data={filteredData} columns={columns} />
        </div>
      </DialogContent>
    </Dialog>
  );
};
