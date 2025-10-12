"use client";

import type { Link } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  ExternalLink,
  GripVertical,
  MoreVertical,
  Pencil,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface LinkItemProps {
  link: Link;
  onEdit: () => void;
  onDelete: () => void;
}

export function LinkItem({ link, onEdit, onDelete }: LinkItemProps) {
  return (
    <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors group">
      <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
      {link.favicon && (
        <img
          src={link.favicon || "/placeholder.svg"}
          alt=""
          className="h-4 w-4"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      )}
      <a
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 min-w-0 flex items-center gap-2 hover:underline"
      >
        <span className="truncate text-sm">{link.title}</span>
        <ExternalLink className="h-3 w-3 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
      </a>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0">
            <MoreVertical className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onEdit}>
            <Pencil className="h-4 w-4 mr-2" />
            編集
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onDelete} className="text-destructive">
            <Trash2 className="h-4 w-4 mr-2" />
            削除
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
