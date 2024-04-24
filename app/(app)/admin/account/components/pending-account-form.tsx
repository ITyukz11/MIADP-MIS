import { DataTable } from "@/components/table/data-table";
import { columns } from "@/components/table/columns";
import { Label } from "@/components/ui/label";

export interface PendingUser {
  id: string; 
  region: string; 
  name: string; 
  email: string; 
  status: string; 
  createdAt: string;
}

interface PendingAccountFormProps {
  pendingUsers: PendingUser[];
  disableApproveButton: boolean; // Define the prop here
}

export default function PendingAccountForm({ pendingUsers, disableApproveButton }: PendingAccountFormProps) {
  if (!pendingUsers) {
    return (
      <div>
        <Label>Loading...</Label>
      </div>
    );
  }

  return (
    <div>
      <DataTable data={pendingUsers} columns={columns} disableApproveButton={disableApproveButton}/>
    </div>
  );
}



