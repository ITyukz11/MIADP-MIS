// pages/changelog.tsx

import React from 'react';
import Changelog from '../../../components/change-log/Changelog'
import { PageHeader, PageHeaderDescription, PageHeaderHeading } from '@/components/page-header';

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
];
const sortedChangelogItems = [...changelogItems].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
const ChangelogPage: React.FC = () => {
  return (
    <div className="container relative md:px-56">
    <PageHeader>
      <PageHeaderHeading>MIADP MIS System Updates</PageHeaderHeading>
      <PageHeaderDescription>
        Stay updated with the latest changes and improvements to our system.
      </PageHeaderDescription>
    </PageHeader>
    <Changelog items={sortedChangelogItems} />
  </div>
  );
};

export default ChangelogPage;
