// types/Activity.ts

export interface User {
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
  
  export interface Activity {
    id: string;
    authorizeOther: boolean;
    activityTitle: string;
    activityDescription: string;
    type: string;
    targetParticipant: string;
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
    calendarOfActivityHistory: any[];
    preparatoryList: PreparatoryList[];
  }
  