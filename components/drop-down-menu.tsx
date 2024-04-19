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
import { signOut } from "next-auth/react";
import { FaBook, FaCopyright, FaSearch, FaUser } from "react-icons/fa";
import { MdEngineering, MdInventory, MdLiveHelp, MdLogout } from "react-icons/md";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";


interface DropDownMenuComponentProps {

}

export const DropDownMenuComponent = ({ }: DropDownMenuComponentProps) => {




  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className=" cursor-pointer">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          {/* <Button variant="outline">{session.data?.user?.name}</Button> */}
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <FaUser />  Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />

            <DropdownMenuItem >
              <FaSearch /> Doctrack
            </DropdownMenuItem>
            <DropdownMenuItem >
              <FaBook /> Logs
            </DropdownMenuItem>

          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Encode</DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem><MdEngineering />Accomplishment</DropdownMenuItem>
                  <DropdownMenuItem><MdInventory />Inventory</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem disabled>More...</DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>

          </DropdownMenuGroup>
          <DropdownMenuSeparator />

          <DropdownMenuItem><MdLiveHelp />  Help</DropdownMenuItem>
          <DropdownMenuItem><FaCopyright /> Credits</DropdownMenuItem>
          <DropdownMenuItem disabled>API</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => signOut()}>
            <MdLogout /> Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

    </>
  )
}