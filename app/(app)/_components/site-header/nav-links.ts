// navLinks.ts

import {
  FaBook,
  FaCalendar,
  FaChalkboardTeacher,
  FaCode,
  FaHome,
  FaList,
  FaProjectDiagram,
  FaTable,
  FaUsers,
  FaWpforms,
} from "react-icons/fa";
import { MdForum, MdSpaceDashboard } from "react-icons/md";
import { TbReport, TbReportSearch } from "react-icons/tb";
import { FaPeopleRoof } from "react-icons/fa6";
import { GiProgression } from "react-icons/gi";
import { IoIosPeople } from "react-icons/io";
import { FaRoad } from "react-icons/fa";
import { GiGrain } from "react-icons/gi";
import { GiPapers } from "react-icons/gi";
import { HiSupport } from "react-icons/hi";

export const navLinks = [
  {
    href: "/subproject",
    text: "Subproject",
    icon: FaProjectDiagram,
    disable: false,
  },
  { href: "/e-library", text: "E-Library", icon: FaBook, disable: false },
  { href: "/forum", text: "Forum", icon: MdForum, disable: false },
  // { href: "/document-tracking", text: "Doctrack", icon: MdScreenSearchDesktop },
];

export const managementLinks = [
  { href: "/admin/account", text: "Users", icon: FaUsers },
  { href: "/admin/generate-code", text: "Subproject", icon: FaCode },
];

export const sidebarComponentSections = [
  {
    name: "Component 1",
    icon: FaChalkboardTeacher,
    links: [
      {
        href: "/component-1/dashboard",
        text: "Dashboard",
        icon: MdSpaceDashboard,
        disable: true
      },
      {
        href: "/component-1/ad-profile",
        text: "AD Profile",
        icon: FaPeopleRoof,
        disable: true
      },
      {
        href: "/component-1/ipo-profile",
        text: "IPO Profile",
        icon: IoIosPeople,
        disable: true
      },
      { href: "/component-1/adaif", 
        text: "ADAIF", 
        icon: GiProgression,
        disable:true },
      {
        href: "/component-1/table-8-tracker",
        text: "Table 8",
        icon: TbReportSearch,
      },
      {
        href: "/component-1/process-documentation-report",
        text: "PDR",
        icon: TbReport,
      },
      {
        href: "/component-1/forms",
        text: "Forms",
        icon: FaWpforms,
        disable: true
      },
    ],
  },
  {
    name: "Component 2",
    icon: FaRoad,
    links: [
      { href: "/component-2", text: "Dashboard", icon: MdSpaceDashboard, disable: true},
      { href: "/component-2/Subproject", text: "Subproject", icon: FaRoad,disable: true },
    ],
  },
  {
    name: "Component 3",
    icon: GiGrain,
    links: [
      {
        href: "/component-3/dashboard",
        text: "Dashboard",
        icon: MdSpaceDashboard,
        disable: true
      },
      {
        href: "/component-3/ipo-validation",
        text: "IPO Validation",
        icon: IoIosPeople,
        disable: true
      },
    ],
  },
  {
    name: "Component 4",
    icon: HiSupport,
    links: [
      { href: "/component-4", text: "Dashboard", icon: MdSpaceDashboard,disable: true },
      { href: "/component-4/admin", text: "Admin", icon: GiPapers, disable: true },
    ],
  },
];

export const activityLinks = [
  { href: "/activities/list", text: "List", icon: FaList },
  { href: "/activities/table", text: "Table", icon: FaTable },
  { href: "/activities/calendar", text: "Calendar", icon: FaCalendar },
  // { href: "/activities/report", text: "Report", icon: TbReportAnalytics },
];
