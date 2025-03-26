// navLinks.ts

import {
  FaBook,
  FaCalendar,
  FaCode,
  FaHome,
  FaList,
  FaProjectDiagram,
  FaTable,
  FaUsers,
} from "react-icons/fa";
import { TbReportAnalytics } from "react-icons/tb";
import { MdScreenSearchDesktop } from "react-icons/md";
import { Construction } from "lucide-react";
import { TbReportSearch } from "react-icons/tb";
import { FaPeopleRoof } from "react-icons/fa6";
import { GiProgression } from "react-icons/gi";

export const navLinks = [
  { href: "/", text: "Home", icon: FaHome, disable: false },
  { href: "/ad-infra", text: "AD Infra", icon: Construction, disable: true },
  {
    href: "/subproject",
    text: "Subproject",
    icon: FaProjectDiagram,
    disable: false,
  },
  { href: "/e-library", text: "E-Library", icon: FaBook, disable: false },
  // { href: "/document-tracking", text: "Doctrack", icon: MdScreenSearchDesktop },
];

export const managementLinks = [
  { href: "/admin/account", text: "Users", icon: FaUsers },
  { href: "/admin/generate-code", text: "Subproject", icon: FaCode },
];

export const adPlanLinks = [
  { href: "/ad-plan/ad-profile", text: "AD Profile", icon: FaPeopleRoof },
  { href: "/ad-plan/adaif", text: "ADAIF", icon: GiProgression },
  { href: "/ad-plan/table-8-tracker", text: "Table 8", icon: TbReportSearch },
  // { href: "/activities/report", text: "Report", icon: TbReportAnalytics },
];

export const activityLinks = [
  { href: "/activities/list", text: "List", icon: FaList },
  { href: "/activities/table", text: "Table", icon: FaTable },
  { href: "/activities/calendar", text: "Calendar", icon: FaCalendar },
  // { href: "/activities/report", text: "Report", icon: TbReportAnalytics },
];
