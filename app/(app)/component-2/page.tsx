"use client";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import ADProfileFormDialog from "./(component)/ADProfileFormDialog";
import { Label } from "@/components/ui/label";
import Image from "next/image";

const Page = () => {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a CSV file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    setMessage(data.message || "Upload failed.");
  };
  const waitingCat = [
    "/waiting-cat/wait_cat.gif",
    "/waiting-cat/wait_cat2.gif",
  ];
  return (
    // <div className="flex flex-col gap-4">
    //   <ADProfileFormDialog />

    //   <input
    //     type="file"
    //     accept=".csv"
    //     onChange={(e) => setFile(e.target.files?.[0] || null)}
    //   />
    //   <button
    //     onClick={handleUpload}
    //     className="ml-2 bg-blue-500 text-white p-2"
    //   >
    //     Upload CSV
    //   </button>
    //   {message && <p className="mt-2">{message}</p>}
    // </div>
    <div className="w-full flex flex-col justify-center items-center">
      <Image
        src={waitingCat[Math.floor(Math.random() * waitingCat.length)]}
        width={300}
        height={300}
        alt="Waiting cat"
        className="rounded-xl"
      />
      <Label className="text-2xl italic">Under development!</Label>
    </div>
  );
};

export default Page;
