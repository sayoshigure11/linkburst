"use client";

import { Home, Search, Plus, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MobileNavProps {
  currentTab: "home" | "search" | "add" | "settings";
  onTabChange: (tab: "home" | "search" | "add" | "settings") => void;
}

export function MobileNav({ currentTab, onTabChange }: MobileNavProps) {
  const tabs = [
    { id: "home" as const, icon: Home, label: "一覧" },
    { id: "search" as const, icon: Search, label: "検索" },
    { id: "add" as const, icon: Plus, label: "追加" },
    { id: "settings" as const, icon: Settings, label: "設定" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border md:hidden safe-area-inset-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <Button
              key={tab.id}
              variant="ghost"
              size="sm"
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center gap-1 h-auto py-2 px-3 ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <Icon
                className={`h-5 w-5 ${isActive ? "fill-primary/20" : ""}`}
              />
              <span className="text-xs font-medium">{tab.label}</span>
            </Button>
          );
        })}
      </div>
    </nav>
  );
}
