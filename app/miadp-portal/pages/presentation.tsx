import React from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

const link =
  "https://drive.google.com/drive/folders/1OwwMr_ZdvpsZFPVqD5zp5wp2Q973WQJK";

function Presentations() {
  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white shadow-lg rounded-lg max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800 tracking-wide text-center">
        INTERIM Follow-On Technical Support Mission Presentations
      </h2>
      <p className="text-gray-600 text-center mb-6 leading-relaxed">
        Access the shared Presentations folder by clicking the button below.
      </p>
      <Button
        asChild
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg shadow-md transition duration-300"
      >
        <a href={link} target="_blank" rel="noopener noreferrer">
          <ExternalLink size={20} /> View Presentations
        </a>
      </Button>
    </div>
  );
}

export default Presentations;
