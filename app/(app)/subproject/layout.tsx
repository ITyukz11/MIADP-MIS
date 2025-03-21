"use client";
import { Label } from "@radix-ui/react-label";

interface ActivitiesLayoutProps {
  children: React.ReactNode;
}

export default function SubProjectLayout({ children }: ActivitiesLayoutProps) {
  return (
    <div className="xs:container space-y-2">
      <div className="flex flex-row flex-wrap justify-center gap-2 md:justify-between">
        <div className="flex flex-col">
          <div className="flex flex-row gap-2 items-center">
            <h2 className="text-xl md:text-3xl font-bold tracking-tight">
              Subproject{" "}
            </h2>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}
