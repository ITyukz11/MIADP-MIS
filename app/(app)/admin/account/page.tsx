'use client'
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { fetchPendingUsers } from "@/lib/admin/pending-users";
import PendingAccountForm from "./components/pending-account-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PendingUserType } from "@/components/table/data/pending-users/schema";

export default function SettingsAccountPage() {
  const [loading, setLoading] = useState(true);
  
  const [filteredPendingUsers, setFilteredPendingUsers] = useState<PendingUserType[]>([]);
  const [pendingUsers, setPendingUsers] = useState<PendingUserType[] | null>(null);
  
  const [showAll, setShowAll] = useState(false)
  useEffect(() => {
    const fetchData = async () => {
      try {
      
          const data = await fetchPendingUsers();
          setPendingUsers(data);
          setFilteredPendingUsers(data.filter((user: PendingUserType) => user.status.toLocaleLowerCase() == "pending"));
         
        setLoading(false);
      } catch (error) {
        console.error("Error fetching pending users:", error);
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);
  
  


  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Account</h3>
        <p className="text-sm text-muted-foreground flex justify-between">
          {showAll ? 'These are all the user accounts' : 'There are pending account approvals awaiting confirmation. '}
          <Button size={'sm'} onClick={() => setShowAll(!showAll)} disabled={loading}>{showAll ? 'Show Pending Users' : 'Show All'}</Button>
        </p>
      </div>
      <Separator />

      {loading ? (
        <div className="flex flex-row gap-2">
          <LoadingSpinner /> Please wait ...
        </div>
      ) : (
        pendingUsers && pendingUsers.length > 0 ? (
          <PendingAccountForm pendingUsers={showAll ? pendingUsers : filteredPendingUsers} disableApproveButton={showAll} />
        ) : (
          <div>
            <Label>Something went wrong.</Label>
          </div>
        )
      )}

    </div>
  );
}
