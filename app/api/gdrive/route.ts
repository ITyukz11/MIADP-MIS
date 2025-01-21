import { fetchGoogleDriveData } from "@/utils/FetchGoogleDriveData";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const folderId = searchParams.get("id");

  if (!folderId) {
    return NextResponse.json(
      { error: "Folder ID is missing" },
      { status: 400 }
    );
  }

  try {
    // Fetch data from Google Drive (using your utility function)
    const filesAndFolders = await fetchGoogleDriveData(folderId, true); // true indicates it's a folder

    // Format the data
    const driveData = {
      id: folderId,
      type: "Folder",
      contents: filesAndFolders.map((file: any) => ({
        name: file.name,
        id: file.id,
        isFolder: file.isFolder,
        contents: file.contents || [], // Nested contents for subfolders
      })),
    };

    return NextResponse.json(driveData, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching Google Drive data:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: error.message },
      { status: 500 }
    );
  }
}
