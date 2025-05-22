// components/ReactionButton.tsx
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown } from "lucide-react";

type ReactionType = "UPVOTE" | "DOWNVOTE";

interface ReactionButtonProps {
  type: ReactionType;
  active: boolean;
  onClick: () => void;
}

export function ReactionButton({ type, active, onClick }: ReactionButtonProps) {
  const Icon = type === "UPVOTE" ? ArrowUp : ArrowDown;
  const colorClass = type === "UPVOTE" ? "text-blue-500" : "text-red-500";

  return (
    <Button
      size="icon"
      variant="ghost"
      onClick={onClick}
      className={active ? colorClass : ""}
    >
      <Icon className="w-4 h-4" />
    </Button>
  );
}
