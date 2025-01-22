import { FaGoogleDrive } from "react-icons/fa6";
import GoogleDriveData from "./_components/GDrive";
import { RepositoryList } from "./_components/RepositoryList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function Home() {
  const repositories = [
    {
      title: "Templates and Forms",
      description: "Explore template and form materials.",
      link: "https://drive.google.com/example1",
      childLinks: {
        "Training Templates":
          "https://drive.google.com/drive/folders/1iyyczEMV_jJ6VS0JGE2J4IbJDHiu9BRa",
        Logos:
          "https://drive.google.com/drive/folders/1SmDgOwniIG7LZYPasVSCaY3yYYWDziym",
        "Locator Slip":
          "https://drive.google.com/drive/folders/1gayuFXucv3RHX0Zqm78bEfwgppXZXUYl",
        Letterhead:
          "https://drive.google.com/drive/folders/1GXqd8Xz5P8w_aC96324L4XP85dOBTAtc",
        "Certificate of Appearance":
          "https://drive.google.com/drive/folders/1qtONV6KRW9PNgLJdaBUamUoZtgVvyikz",
        BIR: "https://drive.google.com/drive/folders/1KDtlqwt75bukVaNgizTQGNWPIi3JN93B",
      },
    },
    // {
    //   title: "Science Resources",
    //   description: "Discover science projects.",
    //   link: "https://drive.google.com/example2",
    // },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col">
        <div className="flex flex-row gap-2 items-center">
          <h2 className="flex flex-row gap-2 text-xl md:text-3xl font-bold tracking-tight">
            <FaGoogleDrive /> Google Drive Data
          </h2>
        </div>
        <Label className="text-xs sm:text-sm text-muted-foreground">
          Explore and manage your scheduled activities with ease. This calendar
          provides a comprehensive view of all planned activities, allowing you
          to stay organized and efficient.
        </Label>
      </div>
      <Card className="flex flex-row gap-2 w-full shadow-none self-center">
        <CardContent className="flex items-center justify-center md:justify-between gap-2 w-full p-4 flex-wrap">
          <GoogleDriveData />
        </CardContent>
      </Card>
    </div>
  );
}
