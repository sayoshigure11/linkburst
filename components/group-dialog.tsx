"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type Group, type Link, GROUP_COLORS } from "@/lib/types";
import { Plus, Trash2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface GroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  group?: Group | null;
  onSave: (data: Partial<Group> & { links?: Link[] }) => void;
}

const EMOJI_OPTIONS = [
  "💻",
  "🎨",
  "📰",
  "📱",
  "🎮",
  "📚",
  "🎵",
  "🎬",
  "🏃",
  "🍔",
  "🚀",
  "⚡",
];

export function GroupDialog({
  open,
  onOpenChange,
  group,
  onSave,
}: GroupDialogProps) {
  const [name, setName] = useState("");
  const [color, setColor] = useState(GROUP_COLORS[0].value);
  const [icon, setIcon] = useState(EMOJI_OPTIONS[0]);
  const [links, setLinks] = useState<Array<{ title: string; url: string }>>([]);

  useEffect(() => {
    if (group) {
      setName(group.name);
      setColor(group.color);
      setIcon(group.icon || EMOJI_OPTIONS[0]);
      setLinks([]);
    } else {
      setName("");
      setColor(GROUP_COLORS[0].value);
      setIcon(EMOJI_OPTIONS[0]);
      setLinks([]);
    }
  }, [group, open]);

  const addLinkInput = () => {
    setLinks([...links, { title: "", url: "" }]);
  };

  const removeLinkInput = (index: number) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  const updateLink = (index: number, field: "title" | "url", value: string) => {
    const newLinks = [...links];
    newLinks[index][field] = value;
    setLinks(newLinks);
  };

  const handleSave = () => {
    if (!name.trim()) return;

    const processedLinks: Link[] = links
      .filter((l) => l.title.trim() && l.url.trim())
      .map((l, index) => {
        let finalUrl = l.url.trim();
        if (
          !finalUrl.startsWith("http://") &&
          !finalUrl.startsWith("https://")
        ) {
          finalUrl = "https://" + finalUrl;
        }
        return {
          id: `${Date.now()}-${index}`,
          title: l.title.trim(),
          url: finalUrl,
          favicon: `${new URL(finalUrl).origin}/favicon.ico`,
          order: index,
        };
      });

    onSave({ name, color, icon, links: processedLinks });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>
            {group ? "グループを編集" : "新しいグループ"}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(90vh-180px)] pr-4">
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">グループ名</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="例: 開発ツール"
              />
            </div>
            <div className="space-y-2">
              <Label>アイコン</Label>
              <div className="flex flex-wrap gap-2">
                {EMOJI_OPTIONS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => setIcon(emoji)}
                    className={`text-2xl p-2 rounded-xl transition-all ${
                      icon === emoji
                        ? "bg-primary text-primary-foreground shadow-lg scale-110"
                        : "bg-muted hover:bg-muted/80 hover:scale-105"
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>カラー</Label>
              <div className="flex flex-wrap gap-2">
                {GROUP_COLORS.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setColor(c.value)}
                    className={`h-12 w-12 rounded-xl transition-all hover:scale-110 ${
                      color === c.value
                        ? "ring-4 ring-offset-2 ring-ring shadow-lg scale-110"
                        : "shadow-md"
                    }`}
                    style={{ backgroundColor: c.value }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            {!group && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>リンク (オプション)</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addLinkInput}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    リンク追加
                  </Button>
                </div>
                {links.length > 0 && (
                  <div className="space-y-3">
                    {links.map((link, index) => (
                      <div
                        key={index}
                        className="flex gap-2 items-start p-3 bg-muted/50 rounded-lg"
                      >
                        <div className="flex-1 space-y-2">
                          <Input
                            placeholder="タイトル"
                            value={link.title}
                            onChange={(e) =>
                              updateLink(index, "title", e.target.value)
                            }
                          />
                          <Input
                            placeholder="URL"
                            value={link.url}
                            onChange={(e) =>
                              updateLink(index, "url", e.target.value)
                            }
                          />
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeLinkInput(index)}
                          className="shrink-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            キャンセル
          </Button>
          <Button onClick={handleSave} disabled={!name.trim()}>
            {group ? "更新" : "作成"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
