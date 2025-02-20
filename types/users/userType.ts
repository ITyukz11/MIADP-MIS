import {
  Activity,
  Participants,
} from "../calendar-of-activity/calendar-of-activity";

export type UserType = {
  id: string;
  region: string;
  name: string;
  unit: string;
  component: string;
  position: string;
  email: string;
  color: string;
  expoPushToken?: string | null;
  notification?: any | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  role: string;
  calendarOfActivityParticipant: Participants[];
  calendarOfActivities: Activity[];
  participants: any[];
};
