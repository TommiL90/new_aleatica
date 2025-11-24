"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { useAbility } from "@/providers/ability-context";
import {
  filterMenuItems,
  type NavBarFirstSubItem,
  type NavBarSecondSubItem,
  type NavBarThirdSubItem,
  type NavbarItem,
  navbarList,
} from "@/config/navbarList";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

// Normalized interface for recursion
interface NormalizedItem {
  title: string;
  url?: string;
  icon?: LucideIcon;
  items?: NormalizedItem[];
}

// Helper to normalize the disparate types from navbarList
function normalizeItems(
  items: (
    | NavbarItem
    | NavBarFirstSubItem
    | NavBarSecondSubItem
    | NavBarThirdSubItem
  )[]
): NormalizedItem[] {
  return items.map((item) => {
    const normalized: NormalizedItem = {
      title: item.title,
      url: "href" in item ? item.href : undefined,
    };

    // Check for nested arrays in the specific properties defined in navbarList types
    let children: (
      | NavBarFirstSubItem
      | NavBarSecondSubItem
      | NavBarThirdSubItem
    )[] = [];

    if ("firstSubItems" in item && item.firstSubItems) {
      children = item.firstSubItems;
    } else if ("secondSubItems" in item && item.secondSubItems) {
      children = item.secondSubItems;
    } else if ("thirdSubItems" in item && item.thirdSubItems) {
      children = item.thirdSubItems;
    }

    if (children.length > 0) {
      normalized.items = normalizeItems(children);
    }

    return normalized;
  });
}

// Recursive component for nested levels
function RecursiveMenuItem({
  item,
  level = 0,
}: {
  item: NormalizedItem;
  level?: number;
}) {
  const hasChildren = item.items && item.items.length > 0;
  const isTopLevel = level === 0;

  // If it's a leaf node (no children), render a link
  if (!hasChildren) {
    // Top level leaf
    if (isTopLevel) {
      return (
        <SidebarMenuItem>
          <SidebarMenuButton asChild tooltip={item.title}>
            <Link href={item.url ?? "#"}>
              {item.icon && <item.icon />}
              <span className="truncate">{item.title}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      );
    }
    // Nested leaf
    return (
      <SidebarMenuSubItem>
        <SidebarMenuSubButton asChild>
          <Link href={item.url ?? "#"}>
            <span className="truncate">{item.title}</span>
          </Link>
        </SidebarMenuSubButton>
      </SidebarMenuSubItem>
    );
  }

  // If it's a branch node (has children)
  if (isTopLevel) {
    return (
      <Collapsible asChild className="group/collapsible">
        <SidebarMenuItem>
          <SidebarMenuButton tooltip={item.title}>
            {item.icon && <item.icon />}
            <span className="truncate">{item.title}</span>
          </SidebarMenuButton>
          <CollapsibleTrigger asChild>
            <SidebarMenuAction className="data-[state=open]:rotate-90">
              <ChevronRight />
              <span className="sr-only">Toggle</span>
            </SidebarMenuAction>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              {item.items?.map((subItem) => (
                <RecursiveMenuItem
                  item={subItem}
                  key={subItem.title}
                  level={level + 1}
                />
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    );
  }

  // Nested branch
  // IMPORTANT: SidebarMenuSubItem renders an 'li'. We must NOT render another 'li' inside it.
  // RecursiveMenuItem is called inside a map, so it should return the 'li' (SidebarMenuSubItem).
  // But if we recurse, the children will also be 'li's.
  // SidebarMenuSub (ul) -> SidebarMenuSubItem (li) -> Collapsible -> [SidebarMenuSubButton, CollapsibleContent]
  // Inside CollapsibleContent, we need another SidebarMenuSub (ul) to hold the children (li).

  return (
    <Collapsible asChild className="group/collapsible">
      <SidebarMenuSubItem>
        <SidebarMenuSubButton className="w-full justify-between pr-0">
          <span className="truncate">{item.title}</span>
          <CollapsibleTrigger asChild>
            <div className="flex h-6 w-6 items-center justify-center rounded-md transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[state=open]:rotate-90">
              <ChevronRight className="h-4 w-4" />
            </div>
          </CollapsibleTrigger>
        </SidebarMenuSubButton>
        <CollapsibleContent>
          {/* We MUST wrap nested items in a SidebarMenuSub (ul) to be valid HTML inside the parent li's content flow, 
                or just render them if the parent structure allows. 
                Looking at sidebar.tsx, SidebarMenuSub is a 'ul'. 
                So: li (SidebarMenuSubItem) -> div (CollapsibleContent) -> ul (SidebarMenuSub) -> li (RecursiveMenuItem) 
            */}
          <SidebarMenuSub className="mr-0 px-0">
            {item.items?.map((subItem) => (
              <RecursiveMenuItem
                item={subItem}
                key={subItem.title}
                level={level + 1}
              />
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuSubItem>
    </Collapsible>
  );
}

export function NavRecursive() {
  const ability = useAbility();

  // 1. Filter items based on permissions
  const filteredItems = filterMenuItems(navbarList, ability);

  // 2. Normalize structure for recursion
  const normalizedItems = normalizeItems(filteredItems);

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Menu</SidebarGroupLabel>
      <SidebarMenu>
        {normalizedItems.map((item) => (
          <RecursiveMenuItem item={item} key={item.title} />
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
