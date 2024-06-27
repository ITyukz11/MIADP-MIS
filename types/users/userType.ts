export type User = {
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
    participants: any[];
  };