import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function RepositoryCard({
  title,
  description,
  link,
  childLinks,
}: {
  title: string;
  description: string;
  link: string;
  childLinks: { [key: string]: string }; // Updated to define the shape of `childLinks`
}) {
  return (
    <Card className="w-96 p-4">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="gap-2 flex flex-wrap">
        {Object.entries(childLinks).map(([name, url], index) => (
          <Link
            href={url}
            key={index}
            className={cn(buttonVariants(), "flex-initial")}
          >
            {name}
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
