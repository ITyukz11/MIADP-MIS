import axios from "axios";

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_DRIVE_API_KEY; // Store your API key in an environment variable

// Define the structure for files and folders
interface FileData {
  id: string;
  name: string;
  mimeType: string;
  isFolder: boolean;
  contents?: FileData[]; // contents will only exist for folders
}

/**
 * Fetch Google Drive file metadata or file list.
 * @param fileIdOrFolderId - The ID of the file or folder to fetch.
 * @param isFolder - Specify if the ID belongs to a folder.
 */
export const fetchGoogleDriveData = async (
  fileIdOrFolderId: string,
  isFolder: boolean = false
): Promise<FileData[]> => {
  // Ensure it returns FileData[]
  const baseUrl = isFolder
    ? `https://www.googleapis.com/drive/v3/files?q='${fileIdOrFolderId}'+in+parents&key=${API_KEY}`
    : `https://www.googleapis.com/drive/v3/files/${fileIdOrFolderId}?key=${API_KEY}`;

  try {
    const response = await axios.get(baseUrl, {
      headers: {
        Accept: "application/json",
      },
    });

    // Return the processed data
    const filesAndFolders = await Promise.all(
      response.data.files.map(async (file: any) => {
        const fileData: FileData = {
          id: file.id,
          name: file.name,
          mimeType: file.mimeType,
          isFolder: file.mimeType === "application/vnd.google-apps.folder",
        };

        // If it's a folder, recursively fetch its contents
        if (fileData.isFolder) {
          const subfolderData = await fetchGoogleDriveData(file.id, true); // Recursively fetch subfolder
          fileData.contents = subfolderData; // Add subfolder contents to the folder data
        }

        return fileData;
      })
    );

    return filesAndFolders;
  } catch (error) {
    console.error("Error fetching Google Drive data:", error);
    throw error;
  }
};
