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
];

const ChangelogPage: React.FC = () => {
  return (
    <div className="container relative md:px-56">
    <PageHeader>
      <PageHeaderHeading>MIADP MIS System Updates</PageHeaderHeading>
      <PageHeaderDescription>
        Stay updated with the latest changes and improvements to our system.
      </PageHeaderDescription>
    </PageHeader>
    <Changelog items={changelogItems} />
  </div>
  );
};

export default ChangelogPage;
