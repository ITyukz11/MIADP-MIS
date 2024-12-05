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
import { FaBook, FaUser, FaWpforms } from "react-icons/fa";
import { MdLiveHelp, MdLogout } from "react-icons/md";
import { Avatar, AvatarFallback, AvatarImage } from "../../../../components/ui/avatar";
import { signOut } from "next-auth/react";
import { TbNumber123, TbPlugConnectedX } from "react-icons/tb";
import { useState } from "react";
import { ProfileDialog } from "../../../../components/profile/dialog/profile-dialog";
import { useCurrentUser } from "../../../../components/context/CurrentUserContext";
import { useRouter } from "next/navigation";
import { IoAirplane } from "react-icons/io5";
import RequestFormPalTicket from "../../../../components/dialog/form-pal-ticket";
import RequestFormPalTicketTest from "../../../../components/dialog/form-pal-ticket-test";
import GenerateCodeDialog from "../../../../components/dialog/generate-code-dialog";

interface DropDownMenuComponentProps {

}

export const DropDownMenuComponent = ({ }: DropDownMenuComponentProps) => {
  const [profileDialog, setProfileDialog] = useState<boolean>(false)
  const [palTicketDialog, setPalTicketDialog] = useState<boolean>(false)
  const [openGenerateDialog, setGenerateDialog] = useState<boolean>(false)
  const {currentUser} = useCurrentUser()

  const router = useRouter()

  const handleProfile = ()=> {
    // setProfileDialog(true)
    router.push(`/profile/${currentUser?.id}`)
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
          <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger><FaWpforms className="mr-2"/>Forms</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem disabled onClick={()=> setGenerateDialog(!openGenerateDialog)}><TbNumber123/>Request Subproject Code</DropdownMenuItem>
                <DropdownMenuItem disabled onClick={()=> setPalTicketDialog(true)}><IoAirplane/>Request Form for PAL Ticket</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem disabled><MdLiveHelp />  Help</DropdownMenuItem>
          <DropdownMenuItem disabled><TbPlugConnectedX /> API</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => {signOut(); localStorage.removeItem('currentUser');}}>
            <MdLogout /> Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ProfileDialog open={profileDialog} setClose={()=> setProfileDialog(!profileDialog)}/>
      {/* <RequestFormPalTicketTest open={palTicketDialog} close={()=> setPalTicketDialog(!palTicketDialog)}/>
      <GenerateCodeDialog open={openGenerateDialog} close={()=> setGenerateDialog(!openGenerateDialog)}/> */}
    </>
  )
}