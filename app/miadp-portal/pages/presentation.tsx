import React from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

const link =
  "https://drive.google.com/drive/folders/1OwwMr_ZdvpsZFPVqD5zp5wp2Q973WQJK";

function Presentations() {
  return (
    <div className="flex flex-col items-center justify-center">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800 tracking-wide text-center">
        INTERIM Follow-On Technical Support Mission Presentations
      </h2>
      <p className="text-gray-600 text-center mb-6 leading-relaxed">
        Access the shared Presentations folder by clicking the button below.
      </p>
      <Button className=" bg-blue-950 dark:bg-blue-950 text-blue-400 border border-blue-400 border-b-4 font-medium overflow-hidden relative px-4 py-2 rounded-md hover:brightness-150 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group">
        <span className="bg-blue-400 shadow-blue-400 absolute -top-[150%] left-0 inline-flex w-80 h-[5px] rounded-md opacity-50 group-hover:top-[150%] duration-500 shadow-[0_0_10px_10px_rgba(0,0,0,0.3)]"></span>
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-row items-center gap-2"
        >
          <ExternalLink size={18} />
          View Presentations
        </a>
      </Button>
    </div>
  );
}

export default Presentations;
