"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Group, Link } from "@/lib/types";
import { mockGroups } from "@/lib/mock-data";
import { GroupCard } from "@/components/group-card";
import { GroupDialog } from "@/components/group-dialog";
import { LinkDialog } from "@/components/link-dialog";
import { MobileNav } from "@/components/mobile-nav";
import { Plus, Search, Star, Grid3x3, List, SettingsIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

type ViewMode = "grid" | "list";
type SortMode = "name" | "recent" | "created";
type TabMode = "home" | "search" | "add" | "settings";

export default function Home() {
  const [groups, setGroups] = useState<Group[]>(mockGroups);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortMode, setSortMode] = useState<SortMode>("name");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [currentTab, setCurrentTab] = useState<TabMode>("home");

  const [groupDialogOpen, setGroupDialogOpen] = useState(false);
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [editingLink, setEditingLink] = useState<{
    groupId: string;
    link: Link;
  } | null>(null);
  const [selectedGroupForLink, setSelectedGroupForLink] = useState<
    string | null
  >(null);

  const filteredAndSortedGroups = useMemo(() => {
    let filtered = groups;

    if (showFavoritesOnly) {
      filtered = filtered.filter((g) => g.isFavorite);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (g) =>
          g.name.toLowerCase().includes(query) ||
          g.links.some(
            (l) =>
              l.title.toLowerCase().includes(query) ||
              l.url.toLowerCase().includes(query)
          )
      );
    }

    const sorted = [...filtered].sort((a, b) => {
      if (sortMode === "name") {
        return a.name.localeCompare(b.name, "ja");
      } else if (sortMode === "recent") {
        return (b.lastOpened?.getTime() || 0) - (a.lastOpened?.getTime() || 0);
      } else {
        return b.createdAt.getTime() - a.createdAt.getTime();
      }
    });

    return sorted;
  }, [groups, searchQuery, sortMode, showFavoritesOnly]);

  const handleOpenAll = (group: Group) => {
    group.links.forEach((link) => {
      window.open(link.url, "_blank");
    });

    setGroups((prev) =>
      prev.map((g) =>
        g.id === group.id ? { ...g, lastOpened: new Date() } : g
      )
    );

    toast("リンクを開きました", {
      description: `${group.name}の${group.links.length}個のリンクを開きました`,
    });
  };

  const handleToggleFavorite = (groupId: string) => {
    setGroups((prev) =>
      prev.map((g) =>
        g.id === groupId ? { ...g, isFavorite: !g.isFavorite } : g
      )
    );
  };

  const handleSaveGroup = (data: Partial<Group> & { links?: Link[] }) => {
    if (editingGroup) {
      setGroups((prev) =>
        prev.map((g) => (g.id === editingGroup.id ? { ...g, ...data } : g))
      );
      toast("グループを更新しました");
    } else {
      const newGroup: Group = {
        id: Date.now().toString(),
        name: data.name!,
        color: data.color!,
        icon: data.icon,
        links: data.links || [],
        isFavorite: false,
        order: groups.length,
        createdAt: new Date(),
      };
      setGroups((prev) => [...prev, newGroup]);
      toast("グループを作成しました");
    }
    setEditingGroup(null);
  };

  const handleDeleteGroup = (groupId: string) => {
    setGroups((prev) => prev.filter((g) => g.id !== groupId));
    toast("グループを削除しました");
  };

  const handleDuplicateGroup = (group: Group) => {
    const newGroup: Group = {
      ...group,
      id: Date.now().toString(),
      name: `${group.name} (コピー)`,
      createdAt: new Date(),
      lastOpened: undefined,
    };
    setGroups((prev) => [...prev, newGroup]);
    toast("グループを複製しました");
  };

  const handleSaveLink = (data: Partial<Link>) => {
    const groupId = selectedGroupForLink || editingLink?.groupId;
    if (!groupId) return;

    if (editingLink) {
      setGroups((prev) =>
        prev.map((g) =>
          g.id === groupId
            ? {
                ...g,
                links: g.links.map((l) =>
                  l.id === editingLink.link.id ? { ...l, ...data } : l
                ),
              }
            : g
        )
      );
      toast("リンクを更新しました");
    } else {
      const newLink: Link = {
        id: Date.now().toString(),
        title: data.title!,
        url: data.url!,
        favicon: data.favicon,
        order: 0,
      };
      setGroups((prev) =>
        prev.map((g) =>
          g.id === groupId ? { ...g, links: [...g.links, newLink] } : g
        )
      );
      toast("リンクを追加しました");
    }
    setEditingLink(null);
    setSelectedGroupForLink(null);
  };

  const handleEditLink = (groupId: string, linkId: string) => {
    const group = groups.find((g) => g.id === groupId);
    const link = group?.links.find((l) => l.id === linkId);
    if (link) {
      setEditingLink({ groupId, link });
      setLinkDialogOpen(true);
    }
  };

  const handleDeleteLink = (groupId: string, linkId: string) => {
    setGroups((prev) =>
      prev.map((g) =>
        g.id === groupId
          ? { ...g, links: g.links.filter((l) => l.id !== linkId) }
          : g
      )
    );
    toast("リンクを削除しました");
  };

  const handleAddLinkToGroup = (groupId: string) => {
    setSelectedGroupForLink(groupId);
    setLinkDialogOpen(true);
  };

  const handleTabChange = (tab: TabMode) => {
    setCurrentTab(tab);
    if (tab === "add") {
      setGroupDialogOpen(true);
    } else if (tab === "search") {
      // Focus on search input
      document.getElementById("search-input")?.focus();
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <header className="border-b bg-card/95 backdrop-blur-sm sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-3 md:py-4">
          <div className="flex items-center justify-between gap-4 mb-3 md:mb-4">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="h-8 w-8 md:h-10 md:w-10 rounded-xl bg-gradient-to-br from-primary via-accent to-primary flex items-center justify-center text-xl md:text-2xl shadow-lg">
                🔗
              </div>
              <div>
                <h1 className="text-lg md:text-2xl font-bold text-balance">
                  LinkBurst
                </h1>
                <p className="text-xs md:text-sm text-muted-foreground hidden md:block">
                  リンクをまとめて管理・一括オープン
                </p>
              </div>
            </div>
            <Button
              onClick={() => setGroupDialogOpen(true)}
              size="default"
              className="hidden md:flex shadow-md"
            >
              <Plus className="h-4 w-4 mr-2" />
              グループ追加
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="search-input"
                placeholder="グループやリンクを検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={showFavoritesOnly ? "default" : "outline"}
                size="icon"
                onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                title="お気に入りのみ"
                className="shadow-sm"
              >
                <Star
                  className={`h-4 w-4 ${
                    showFavoritesOnly ? "fill-current" : ""
                  }`}
                />
              </Button>
              <Select
                value={sortMode}
                onValueChange={(v) => setSortMode(v as SortMode)}
              >
                <SelectTrigger className="w-[120px] md:w-[140px] shadow-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">名前順</SelectItem>
                  <SelectItem value="recent">最近使用</SelectItem>
                  <SelectItem value="created">作成日順</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  setViewMode(viewMode === "grid" ? "list" : "grid")
                }
                title={viewMode === "grid" ? "リスト表示" : "グリッド表示"}
                className="hidden md:flex shadow-sm"
              >
                {viewMode === "grid" ? (
                  <List className="h-4 w-4" />
                ) : (
                  <Grid3x3 className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 md:py-8">
        {currentTab === "settings" ? (
          <div className="max-w-2xl mx-auto">
            <div className="bg-card rounded-2xl p-6 md:p-8 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
                  <SettingsIcon className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">設定</h2>
                  <p className="text-sm text-muted-foreground">
                    アプリの設定を管理
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-xl">
                  <h3 className="font-semibold mb-2">データ管理</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    現在はモックデータを使用しています。データベース統合は今後実装予定です。
                  </p>
                  <Button variant="outline" disabled>
                    エクスポート (準備中)
                  </Button>
                </div>
                <div className="p-4 bg-muted/50 rounded-xl">
                  <h3 className="font-semibold mb-2">アカウント</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    ログイン機能は今後実装予定です。
                  </p>
                  <Button variant="outline" disabled>
                    ログイン (準備中)
                  </Button>
                </div>
                <div className="p-4 bg-muted/50 rounded-xl">
                  <h3 className="font-semibold mb-2">バージョン</h3>
                  <p className="text-sm text-muted-foreground">
                    LinkBurst v1.0.0 (MVP)
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : filteredAndSortedGroups.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-semibold mb-2">
              {searchQuery
                ? "グループが見つかりません"
                : "グループがありません"}
            </h2>
            <p className="text-muted-foreground mb-6">
              {searchQuery
                ? "別のキーワードで検索してみてください"
                : "新しいグループを作成してリンクを整理しましょう"}
            </p>
            {!searchQuery && (
              <Button
                onClick={() => setGroupDialogOpen(true)}
                size="lg"
                className="shadow-lg"
              >
                <Plus className="h-4 w-4 mr-2" />
                最初のグループを作成
              </Button>
            )}
          </div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
                : "space-y-4 max-w-3xl mx-auto"
            }
          >
            {filteredAndSortedGroups.map((group) => (
              <GroupCard
                key={group.id}
                group={group}
                onOpenAll={handleOpenAll}
                onToggleFavorite={handleToggleFavorite}
                onEdit={(g) => {
                  setEditingGroup(g);
                  setGroupDialogOpen(true);
                }}
                onDelete={handleDeleteGroup}
                onDuplicate={handleDuplicateGroup}
                onEditLink={handleEditLink}
                onDeleteLink={handleDeleteLink}
                onAddLink={handleAddLinkToGroup}
              />
            ))}
          </div>
        )}
      </main>

      <MobileNav currentTab={currentTab} onTabChange={handleTabChange} />

      <GroupDialog
        open={groupDialogOpen}
        onOpenChange={(open) => {
          setGroupDialogOpen(open);
          if (!open) {
            setEditingGroup(null);
            setCurrentTab("home");
          }
        }}
        group={editingGroup}
        onSave={handleSaveGroup}
      />

      <LinkDialog
        open={linkDialogOpen}
        onOpenChange={(open) => {
          setLinkDialogOpen(open);
          if (!open) {
            setEditingLink(null);
            setSelectedGroupForLink(null);
          }
        }}
        link={editingLink?.link}
        onSave={handleSaveLink}
      />
    </div>
  );
}
