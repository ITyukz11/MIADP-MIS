"use client";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import ADProfileFormDialog from "./(component)/ADProfileFormDialog";

const Page = () => {
  return (
    <div className="flex flex-col gap-4">
      <ADProfileFormDialog />
    </div>
  );
};

export default Page;
