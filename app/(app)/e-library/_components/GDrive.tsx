"use client";

import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaFolder, FaGoogleDrive, FaLink } from "react-icons/fa";

const GoogleDriveData = () => {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentFolder, setCurrentFolder] = useState<any>(null);
  const [path, setPath] = useState<any[]>([]); // Breadcrumb path

  useEffect(() => {
    const fetchData = async () => {
      try {
        const folderId = "1ORzdDmUiUwuUh_p91ewS-7utOdiNLf9B"; // Root folder ID
        const response = await fetch(`/api/gdrive?id=${folderId}`);
        const result = await response.json();
        setData(result);
        setCurrentFolder(result);
        setPath([{ id: folderId, name: "E-Library" }]); // Initialize breadcrumb with the root folder
      } catch (err) {
        setError("Failed to fetch data from Google Drive.");
      }
    };

    fetchData();
  }, []);

  if (error) return <p className="text-red-500">{error}</p>;
  if (!data) return <p>Loading...</p>;

  const handleFolderClick = (folder: any) => {
    setCurrentFolder(folder);
    setSearchQuery("");
    setPath((prev) => [...prev, { id: folder.id, name: folder.name }]);
  };

  const handleBreadcrumbClick = (index: number) => {
    const newPath = path.slice(0, index + 1);
    const targetFolderId = newPath[newPath.length - 1].id;

    if (index === 0) {
      setCurrentFolder(data);
    } else {
      const findFolder = (contents: any[], id: string): any => {
        for (const item of contents) {
          if (item.id === id) return item;
          if (item.isFolder && item.contents) {
            const found = findFolder(item.contents, id);
            if (found) return found;
          }
        }
        return null;
      };

      const newFolder = findFolder(data.contents, targetFolderId);
      setCurrentFolder(newFolder);
    }

    setPath(newPath);
  };

  const searchFolder = (contents: any[], query: string) => {
    // Ensure contents is always an array
    if (!contents || !Array.isArray(contents)) {
      return [];
    }

    return contents.reduce((acc: any[], item: any) => {
      const matchesName = item.name.toLowerCase().includes(query.toLowerCase());
      const matchesSubfolder =
        item.contents && searchFolder(item.contents, query).length > 0;

      if (matchesName || matchesSubfolder) {
        acc.push(item);
      }

      return acc;
    }, []);
  };

  const renderContents = (contents: any[], query: string) => {
    const filteredContents = searchFolder(contents, query);

    if (filteredContents.length === 0) {
      return <p>No results found</p>;
    }

    return (
      <div className="space-y-4">
        {/* Folders (row layout) */}
        <div className="flex flex-wrap gap-4 justify-center">
          {filteredContents
            .filter((item) => item.isFolder)
            .map((folder: any) => (
              <div
                key={folder.id}
                className="flex items-center gap-4 p-4 bg-background rounded shadow-sm hover:shadow-md transform transition-transform duration-200 hover:scale-105 cursor-pointer"
                onClick={() => handleFolderClick(folder)}
              >
                <FaFolder className="text-yellow-500" />
                <span className="font-sans">{folder.name}</span>
                <Badge className="ml-auto">
                  {folder.contents?.length || 0}
                </Badge>
              </div>
            ))}
        </div>

        {/* Files (column layout) */}
        <div className="space-y-2">
          {filteredContents
            .filter((item) => !item.isFolder)
            .map((file: any, index: number) => (
              <div
                key={file.id}
                className="flex items-center gap-4 p-4 bg-background rounded shadow-sm hover:shadow-md transform transition-transform duration-200 hover:scale-105"
              >
                <span>{index + 1}.</span>
                <FaLink className="text-blue-500" />
                <Link
                  href={`https://drive.google.com/file/d/${file.id}/view`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {file.name}
                </Link>
              </div>
            ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {/* Search input */}
      <Input
        type="text"
        placeholder="Search for files or folders..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-4 w-full shadow-sm"
      />
      {/* Breadcrumb for navigation */}
      <Breadcrumb className="items-center flex flex-row ">
        <BreadcrumbList>
          {path.map((item, index) => (
            <BreadcrumbItem key={item.id}>
              <span
                className={`cursor-pointer hover:underline ${
                  index === path.length - 1 ? "font-bold" : ""
                }`}
                onClick={() => handleBreadcrumbClick(index)}
              >
                {item.name}
              </span>
              {index < path.length - 1 && <BreadcrumbSeparator />}
            </BreadcrumbItem>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
      {/* Render folder contents */}
      {currentFolder && renderContents(currentFolder.contents, searchQuery)}
    </div>
  );
};

export default GoogleDriveData;
