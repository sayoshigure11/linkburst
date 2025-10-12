"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Group } from "@/lib/types";
import {
  ExternalLink,
  Star,
  MoreVertical,
  Pencil,
  Trash2,
  Copy,
  Plus,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LinkItem } from "./link-item";

interface GroupCardProps {
  group: Group;
  onOpenAll: (group: Group) => void;
  onToggleFavorite: (groupId: string) => void;
  onEdit: (group: Group) => void;
  onDelete: (groupId: string) => void;
  onDuplicate: (group: Group) => void;
  onEditLink: (groupId: string, linkId: string) => void;
  onDeleteLink: (groupId: string, linkId: string) => void;
  onAddLink: (groupId: string) => void;
}

export function GroupCard({
  group,
  onOpenAll,
  onToggleFavorite,
  onEdit,
  onDelete,
  onDuplicate,
  onEditLink,
  onDeleteLink,
  onAddLink,
}: GroupCardProps) {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <Card
      className={`overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1 ${
        isDragging ? "opacity-50" : ""
      }`}
      draggable
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => setIsDragging(false)}
    >
      <div
        className="h-3 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        style={{
          background: `linear-gradient(135deg, ${group.color} 0%, ${group.color}dd 100%)`,
        }}
      />
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {group.icon && <span className="text-3xl">{group.icon}</span>}
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-xl truncate text-balance">
                {group.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {group.links.length} リンク
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onToggleFavorite(group.id)}
              className="shrink-0 hover:scale-110 transition-transform"
            >
              <Star
                className={`h-5 w-5 ${
                  group.isFavorite ? "fill-yellow-400 text-yellow-400" : ""
                }`}
              />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="shrink-0">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(group)}>
                  <Pencil className="h-4 w-4 mr-2" />
                  編集
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDuplicate(group)}>
                  <Copy className="h-4 w-4 mr-2" />
                  複製
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onDelete(group.id)}
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  削除
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          {group.links.map((link) => (
            <LinkItem
              key={link.id}
              link={link}
              onEdit={() => onEditLink(group.id, link.id)}
              onDelete={() => onDeleteLink(group.id, link.id)}
            />
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onAddLink(group.id)}
            className="w-full border-dashed hover:border-solid hover:bg-muted/50"
          >
            <Plus className="h-4 w-4 mr-2" />
            リンクを追加
          </Button>
        </div>

        <Button
          onClick={() => onOpenAll(group)}
          className="w-full font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
          style={{
            background: `linear-gradient(135deg, ${group.color} 0%, ${group.color}dd 100%)`,
            color: "white",
          }}
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          すべて開く ({group.links.length})
        </Button>
      </div>
    </Card>
  );
}
