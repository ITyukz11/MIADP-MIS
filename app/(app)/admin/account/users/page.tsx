"use client";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { usePendingUsersData } from "@/lib/admin/usePendingUsersData";
import { columns } from "@/components/table/data/pending-users/columns";
import { DataTable } from "@/components/table/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { useUsersData } from "@/lib/users/useUserDataHook";
import { userColumns } from "@/components/table/data/users/userColumns";

export default function SettingsAccountPage() {
  const { usersData, usersLoading, usersError, refetchUsers } =
    useUsersData();

  const hiddenColumns = ["color"];
console.log("usersDAta:" , usersData)
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Account</h3>
        <p className="text-sm text-muted-foreground flex justify-between">
          These are all the user accounts
        </p>
      </div>
      <Separator />

      {usersLoading ? (
        <div className="w-full flex flex-col gap-2 items-center">
          <Skeleton className="w-full h-10" />
          <Skeleton className="w-full h-40" />
        </div>
      ) : usersError ? (
        <div className="p-4 bg-red-50 text-red-700 rounded-md border border-red-200">
          <Label>Error: {usersError.message}</Label>
        </div>
      ) : !usersData ? (
        <div className="w-full flex flex-col gap-2 items-center">
          <Skeleton className="w-full h-10" />
          <Skeleton className="w-full h-40" />
        </div>
      ) : (
        <DataTable
          data={usersData}
          columns={userColumns}
          allowSelectRow={false}
          hiddenColumns={hiddenColumns}
          cursorRowSelect={false}
        />
      )}
    </div>
  );
}
