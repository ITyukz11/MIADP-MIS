import { Label } from "@/components/ui/label";
import Image from "next/image";
import React from "react";

type Props = {};

const Page = ({}: Props) => {
  const waitingCat = [
    "/waiting-cat/wait_cat.gif",
    "/waiting-cat/wait_cat2.gif",
  ];

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <Label className="text-2xl">Relax lang</Label>
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
