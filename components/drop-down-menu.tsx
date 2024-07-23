'use client'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { FaBook, FaUser } from "react-icons/fa";
import { MdLiveHelp, MdLogout } from "react-icons/md";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { signOut } from "next-auth/react";
import { TbPlugConnectedX } from "react-icons/tb";
import { useState } from "react";
import { ProfileDialog } from "./profile/dialog/profile-dialog";


interface DropDownMenuComponentProps {

}

export const DropDownMenuComponent = ({ }: DropDownMenuComponentProps) => {
  const [profileDialog, setProfileDialog] = useState<boolean>(false)

  const handleProfile = ()=> {
    setProfileDialog(true)
  }
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="cursor-pointer">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={handleProfile}>
              <FaUser />  Profile
            </DropdownMenuItem>
            <DropdownMenuItem disabled>
              <FaBook /> Logs
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem disabled><MdLiveHelp />  Help</DropdownMenuItem>
          <DropdownMenuItem disabled><TbPlugConnectedX /> API</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => signOut()}>
            <MdLogout /> Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ProfileDialog open={profileDialog} setClose={()=> setProfileDialog(!profileDialog)}/>
    </>
  )
}