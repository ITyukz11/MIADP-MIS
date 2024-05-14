'use client'
import { Separator } from "@/components/ui/separator";
import { PendingUser } from "./components/pending-account-form";
import { useEffect, useState } from "react";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { fetchPendingUsers } from "@/lib/admin/pending-users";
import PendingAccountForm from "./components/pending-account-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function SettingsAccountPage() {
  const [loading, setLoading] = useState(true);
  
  const [filteredPendingUsers, setFilteredPendingUsers] = useState<PendingUser[]>([]);
  const [pendingUsers, setPendingUsers] = useState<PendingUser[] | null>(null);
  
  const [showAll, setShowAll] = useState(false)
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Retrieve cached data from localStorage
        // const cachedDataString = localStorage.getItem("pendingUsers");
        // if (cachedDataString) {
        //   // If data is found in localStorage, parse it and set the state
        //   const cachedData: PendingUser[] = JSON.parse(cachedDataString);
        //   setPendingUsers(cachedData);
        //   setFilteredPendingUsers(cachedData.filter((user: PendingUser) => user.status == "pending"));
        // } else {
          // If no data found in localStorage, fetch from API and store in localStorage
          const data = await fetchPendingUsers();
          setPendingUsers(data);
          setFilteredPendingUsers(data.filter((user: PendingUser) => user.status.toLocaleLowerCase() == "pending"));
         // localStorage.setItem("pendingUsers", JSON.stringify(data));
        //}
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
