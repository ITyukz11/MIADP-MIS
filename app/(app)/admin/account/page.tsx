'use client'
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import PendingAccountForm from "./components/pending-account-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PendingUserType } from "@/components/table/data/pending-users/schema";
import { usePendingUsersData } from "@/lib/admin/usePendingUsersData";

export default function SettingsAccountPage() {
  const [filteredPendingUsers, setFilteredPendingUsers] = useState<PendingUserType[]>([]);
  const [pendingUsers, setPendingUsers] = useState<PendingUserType[] | null>(null);
  const [showAll, setShowAll] = useState(false);

  const { pendingUsersData, pendingUsersError, pendingUsersLoading } = usePendingUsersData();

  useEffect(() => {
    if (pendingUsersData) {
      const sortedData = pendingUsersData.sort(
        (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      const filteredData = pendingUsersData.filter(
        (user: PendingUserType) => user.status.toLowerCase() === "pending"
      );
      const sortedFilteredData = filteredData.sort(
        (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setPendingUsers(sortedData);
      setFilteredPendingUsers(sortedFilteredData);
    }
  }, [pendingUsersData]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Account</h3>
        <p className="text-sm text-muted-foreground flex justify-between">
          {showAll ? 'These are all the user accounts' : 'There are pending account approvals awaiting confirmation. '}
          <Button size={'sm'} onClick={() => setShowAll(!showAll)} disabled={pendingUsersLoading}>
            {showAll ? 'Show Pending Users' : 'Show All'}
          </Button>
        </p>
      </div>
      <Separator />

      {pendingUsersLoading ? (
        <div className="flex flex-row gap-2">
          <LoadingSpinner /> Please wait ...
        </div>
      ) : pendingUsersError ? (
        <div>
          <Label>Error: {pendingUsersError.message}</Label>
        </div>
      ) : pendingUsers && (
        <PendingAccountForm pendingUsers={showAll ? pendingUsers : filteredPendingUsers} disableApproveButton={showAll} />
      ) }
    </div>
  );
}
