// Import necessary components and types
import { DataTable } from "@/components/table/data-table";
import { columns } from "@/components/table/data/pending-users/columns"; // Adjust the import path
import { PendingUserType } from "@/components/table/data/pending-users/schema";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

// Define the props for PendingAccountForm component
interface PendingAccountFormProps {
  pendingUsers: PendingUserType[];
  disableApproveButton: boolean; // Define the prop here
}

// Define the PendingAccountForm component
const hiddenColumns = ["color"];
export default function PendingAccountForm({
  pendingUsers,
}: PendingAccountFormProps) {
  return (
    <div>
      <DataTable
        data={pendingUsers}
        columns={columns}
        allowSelectRow={true}
        hiddenColumns={hiddenColumns}
      />
    </div>
  );
}
