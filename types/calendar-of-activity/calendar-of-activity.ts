// types/Activity.ts

export interface User {
    id: string;
    component: string;
    unit: string;
    position: string;
    region: string;
    color: string;
  }
  
  export interface PreparatoryList {
    id: string;
    description: string;
    status: string;
    remarks: string;
    activity: string;
    createdAt: string;
    updatedAt: string;
  }

  export interface CalendarOfActivityAttachment {
    id: string;
    details: string;
    link: string;
    activity: string;
    createdAt: string;
  }

   
  export interface Participants {
    calendarOfActivityId: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface Activity {
    id: string;
    authorizeOther: boolean;
    individualActivity:boolean;
    activityTitle: string;
    activityDescription: string;
    type: string;
    otherType:string;
    targetParticipant: string;
    participants: Participants[];
    location: string;
    dateFrom: string;
    dateTo: string;
    timeStart: string;
    timeEnd: string;
    allDay: boolean;
    remarks: string;
    color: string;
    attachments: any;
    status: string;
    userName: string;
    createdAt: string;
    updatedAt: string;
    user: User;
    calendarOfActivityAttachment:CalendarOfActivityAttachment[];
    calendarOfActivityHistory: any[];
    listMode:boolean;
    preparatoryList: PreparatoryList[];
    preparatoryContent:string;
  }

  export interface CountActivity {
    [region: string]: number;
  }

  export interface ComponentCounts {
    [component: string]: number;
  }
  
  // Define a type for all regions with their component counts
  export interface CountComponentActivity {
    [region: string]: ComponentCounts;
  }
  
  