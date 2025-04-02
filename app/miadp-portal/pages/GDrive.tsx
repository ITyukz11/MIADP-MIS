import React from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

const link =
  "https://drive.google.com/drive/folders/1AIDa-VVTvYtjV9MtQeEK5uM1dX4BGiUr";

function GDrive() {
  return (
    <div className="flex flex-col items-center justify-center ">
      <p className="text-gray-600 text-center mb-4">
        Click the button below to access the shared Google Drive folder.
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
          Open Google Drive
        </a>
      </Button>
    </div>
  );
}

export default GDrive;
