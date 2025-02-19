"use client";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../ui/card";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { useSession } from "next-auth/react";

interface ChangelogItem {
  id: number;
  date: string;
  title: string;
  changes: { id: number; change: string }[];
  comments: { id: number; author: string; text: string }[];
}

const Changelog: React.FC<{ items: ChangelogItem[] }> = ({ items }) => {
  const [comment, setComment] = useState("");
  const [currentItemIndex, setCurrentItemIndex] = useState<number | null>(null);
  const [openComments, setOpenComments] = useState<boolean[]>(
    Array(items.length).fill(false)
  );

  const addComment = (index: number) => {
    if (comment.trim() && currentItemIndex !== null) {
      items[currentItemIndex].comments.push({
        id: new Date().getTime(),
        author: "User",
        text: comment,
      });
      setComment("");
    }
  };

  const toggleComments = (index: number) => {
    const newOpenComments = [...openComments];
    newOpenComments[index] = !newOpenComments[index];
    setOpenComments(newOpenComments);
  };

  const { data: currentUser } = useSession();

  return (
    <div className="space-y-6">
      <Label className="text-3xl font-bold">Changelogs</Label>
      {items.map((item, index) => (
        <Card key={item.id} className="cursor-pointer">
          <CardHeader>
            <CardTitle className="flex flex-row gap-2 items-center">
              <Label className="text-xl font-bold">{item.title}</Label>
              <Label> - {new Date(item.date).toLocaleDateString()} - </Label>
              <Badge onClick={() => toggleComments(index)}>
                {item.comments.length}
              </Badge>
            </CardTitle>
            <Separator />
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2">
              {item.changes.map((change) => (
                <li key={change.id}>{change.change}</li>
              ))}
            </ul>
            {openComments[index] && (
              <div className="mt-4">
                <h4 className="font-semibold">Comments</h4>
                <div className="space-y-2">
                  {item.comments.map((comment) => (
                    <Label key={comment.id}>
                      <strong>{currentUser?.user.name?.split(" ")[0]}:</strong>{" "}
                      {comment.text}
                      <br />
                    </Label>
                  ))}
                </div>
                <div className="mt-4">
                  <Textarea
                    value={comment}
                    onChange={(e) => {
                      setCurrentItemIndex(index);
                      setComment(e.target.value);
                    }}
                    placeholder="Add a comment"
                    className="w-full"
                  />
                  <Button onClick={() => addComment(index)} className="mt-2">
                    Add Comment
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default Changelog;
