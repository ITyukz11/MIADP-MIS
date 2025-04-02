import React from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

const link =
  "https://drive.google.com/drive/folders/1AIDa-VVTvYtjV9MtQeEK5uM1dX4BGiUr";

function GDrive() {
  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white shadow-lg rounded-lg max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Google Drive Folder
      </h2>
      <p className="text-gray-600 text-center mb-4">
        Click the button below to access the shared Google Drive folder.
      </p>
      <Button
        asChild
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md"
      >
        <a href={link} target="_blank" rel="noopener noreferrer">
          <ExternalLink size={18} /> Open Google Drive
        </a>
      </Button>
    </div>
  );
}

export default GDrive;
