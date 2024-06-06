// Import necessary components and types
import { DataTable } from "@/components/table/data-table";
import { columns } from "@/components/table/data/pending-users/columns"; // Adjust the import path
import { Label } from "@/components/ui/label";

// Define the PendingUser interface
interface PendingUser {
  id: string; 
  region: string; 
  name: string; 
  email: string; 
  status: string; 
  createdAt: string;
  component: string;
  unit: string;
  position: string;
}

// Define the props for PendingAccountForm component
interface PendingAccountFormProps {
  pendingUsers: PendingUser[];
  disableApproveButton: boolean; // Define the prop here
}

// Define the PendingAccountForm component
export default function PendingAccountForm({ pendingUsers }: PendingAccountFormProps) {
  if (!pendingUsers) {
    return (
      <div>
        <Label>Loading...</Label>
      </div>
    );
  }

  return (
    <div>
      <DataTable data={pendingUsers} columns={columns} allowSelectRow={true}/>
    </div>
  );
}
