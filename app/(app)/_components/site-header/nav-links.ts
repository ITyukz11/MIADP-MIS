// navLinks.ts

import { FaCode, FaHome, FaProjectDiagram, FaUsers } from "react-icons/fa";
import { TbActivity } from "react-icons/tb";
import { MdScreenSearchDesktop } from "react-icons/md";
import { GrUserAdmin } from "react-icons/gr";

export const navLinks = [
    { href: "/", text: "Home",icon:FaHome },
    { href: "/subproject", text: "Subproject", icon:FaProjectDiagram },
    { href: "/activities/list", text: "Activities", icon:TbActivity},
    { href: "/document-tracking", text: "Doctrack", icon:MdScreenSearchDesktop},
    // { href: "/supports", text: "Supports" },
    // { href: "/change-log", text: "Changelogs" },
  ];

export const managementLinks = [
    {href:'/admin/account', text: 'Users', icon:FaUsers},
    {href:'/admin/generate-code', text: 'Subproject', icon:FaCode}
]
  