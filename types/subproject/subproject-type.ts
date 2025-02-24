// types.ts

import { UserType } from "../users/userType";

export interface SubProjectCodeType {
  id: string;
  briefDescription?: string | null;
  sequentialNum: string;
  subprojectTitle: string;
  component: string;
  sharedFundingWithInfra?: boolean | null;
  region: string;
  province: string;
  municipality: string;
  ancestralDomainLoc: string;
  type: string;
  coordinate: string;
  measurement?: string | null;
  physicalIndicator?: string | null;
  tepc: string;
  subProjectPhoto: SubProjectPhotoType[];
  code: string;
  userId: string;
  user: UserType;
}

export interface SubProjectPhotoType {
  id: string;
  fileName: string;
  briefDescription?: string | null;
  publicId: string;
  format: string;
  version: string;
  subProjectCodeId: string;
  subProjectCode: SubProjectCodeType;
  userId: string;
  user: UserType;
  createdAt: Date;
}
