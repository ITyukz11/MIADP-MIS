// pages/changelog.tsx

import React from 'react';
import Changelog from '../../../components/change-log/Changelog'
import { PageHeader, PageHeaderDescription, PageHeaderHeading } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { FaTools } from "react-icons/fa"
import Image from "next/image"

const changelogItems = [
  {
    id: 1,
    title:'Updates on calendar of activities "Calendar"',
    date: '2024-06-05',
    changes: [
      { id: 1, change: 'Fixed time not showing' },
      { id: 2, change: 'Fixed upcoming and ongoing events container overflowing' },
      { id: 3, change: 'Added cursor pointer per activities when hovered' },
      { id: 4, change: 'Added year feature displaying months with activities' },
      { id: 5, change: 'Modifying update and delete function still on going' },
    ],
    comments: [
      { id: 1, author: 'Admin', text: 'Comments still under development!' },
    ],
  },
  {
    id: 2,
    title:'New feature change logs route',
    date: '2024-06-05',
    changes: [
      { id: 1, change: 'Added title and change logs content for any change logs in the system' },
    ],
    comments: [],
  },
  {
    id: 3,
    title:'Updates on calendar of activities "Calendar"',
    date: '2024-06-06',
    changes: [
      { id: 1, change: 'Limited upcoming and ongoing events on the calendar to 10 in the overview, and show the additional events count if there are more than 10.' },
      { id: 2, change: 'Added "UPDATE" and "DELETE" functions to the "View My Activities" component, with the ability to select rows.' },
      { id: 3, change: 'Sorted the calendar of activities table in descending order based on the creation date.' },
      { id: 4, change: 'Added status color code layout badges to the table.' },
      { id: 5, change: 'Fixed some layout issues in the calendar of activities.' },
      { id: 6, change: 'Added a partial UI for the calendar of activities overview chart.' },
    ],
    comments: [],
  },
  {
    "id": 4,
    "title": "Updates on Calendar of Activities",
    "date": "2024-06-10",
    "changes": [
      { "id": 1, "change": "Added a new field for participants in the Calendar of Activity form. The value for this field is sourced from the registered users of the MMIS." },
      { "id": 2, "change": "Included a region filter in the participants dropdown in the Calendar of Activity form." },
      { "id": 3, "change": "Added additional participant information in the sheet component, accessible by clicking the activity in the full calendar component." },
      { "id": 4, "change": "Updated the MIADP AI assistant with the revised operation manual." },
      { "id": 5, "change": "Increased the calendar sheet width to at least 40% of the screen width." },
      { "id": 6, "change": "Fixed the issue with the calendar end date not being accurate." }
    ],
    "comments": []
  },
  {
    "id": 5,
    "title": "Updates on Calendar of Activities",
    "date": "2024-06-12",
    "changes": [
      { "id": 1, "change": "Fixed calendar layout to fit to light and dark mode" },
      { "id": 2, "change": "Added initial data structure for messenger feature" },
    ],
    "comments": []
  },
  {
    "id": 6,
    "title": "Updates on Calendar of Activities",
    "date": "2024-06-13",
    "changes": [
      {
        "id": 1,
        "change": "Disabled the PRINT button as its functionality is not yet implemented."
      },
      {
        "id": 2,
        "change": "Added attachment feature to the calendar form and improved the display of form messages for incomplete data."
      },
      {
        "id": 3,
        "change": "Updated login and registration form layouts for better responsiveness."
      },
      {
        "id": 4,
        "change": "Removed the 'target participant' column as a default column in the activity table."
      },
      {
        "id": 5,
        "change": "Added the MIADP PSO logo with a round frame during component loading states."
      },
      {
        "id": 6,
        "change": "Replaced the error messages in the calendar form with a '*' indicator."
      },
      {
        "id": 7,
        "change": "Added functionality to display attachment data as links in calendar sheets."
      },
      {
        "id": 8,
        "change": "Updated status styling to include a small shadow effect."
      }
    ],
    "comments": []
  },
  {
    "id": 7,
    "title": "Updates on Calendar of Activities",
    "date": "2024-06-18",
    "changes": [
      { "id": 1, "change": "Modified color code activities, now its based on assigned regions" },
      { "id": 2, "change": "Fixed layout for wider screens" },
    ],
    "comments": []
  },
  
];
const sortedChangelogItems = [...changelogItems].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
const ChangelogPage: React.FC = () => {
  const imageNumber = Math.floor(Math.random() * 6) + 1;
  const imagePath = `/under-development/${imageNumber}.png`;

  return (
    <div className="flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Changelogs</CardTitle>
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
              <AlertTitle>Under Development</AlertTitle>
              <AlertDescription>
                Features and data are being implemented. Please check back soon!
              </AlertDescription>
            </div>
          </Alert>
        </CardContent>
      </Card>
    </div>

  //   <div className="mx-auto flex justify-center relative md:px-56 flex-col">
  //   <PageHeader>
  //     <PageHeaderHeading>MIADP MIS System Updates</PageHeaderHeading>
  //     <PageHeaderDescription>
  //       Stay updated with the latest changes and improvements to our system.
  //     </PageHeaderDescription>
  //   </PageHeader>
  //   <Changelog items={sortedChangelogItems} />
  // </div>
  );
};

export default ChangelogPage;
