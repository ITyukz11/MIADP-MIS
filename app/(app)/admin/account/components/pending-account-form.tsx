import { DataTable } from "@/components/table/data-table";
import { columns } from "@/components/table/data/pending-users/columns";
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

//   const submit = () => {
//     const selectedIndices = Object.keys(selectedRows)
//       .map((key) => parseInt(key)) // Convert keys to numbers
//       .filter((index) => selectedRows[index]); // Filter out non-selected rows

//     console.log("Selected indices:", selectedIndices);

//     // Get the data for the selected rows
//     const selectedData = selectedIndices.map((num) => data[num]);

//     // Update approvedPendingUsersData state with the selected data
//     setApprovedPendingUsersData(selectedData);
// }


  if (!pendingUsers) {
    return (
      <div>
        <Label>Loading...</Label>
      </div>
    );
  }
 
  return (
    <div>
      <DataTable data={pendingUsers} columns={columns}/>
    </div>
  );
}



