"use client";
import { ChevronRight, LucideIcon } from "lucide-react";
import { VscDebugBreakpointLogUnverified } from "react-icons/vsc";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Sidebar Item type (icon is now only string for Image)
export type TSidebarItem = {
  title?: string;
  url?: string;
  Icon?: LucideIcon; // only image src
  show?: boolean;
  isActive?: boolean;
  items?: {
    title: string;
    url: string;
  }[];
}[];

export function NavMain({ items }: { items: TSidebarItem }) {
  const pathName = usePathname();

  return (
    <SidebarGroup>
      <SidebarMenu className="space-y-2">
        {items.map((item, idx) => {
          const isActive = pathName === item.url;
          const { Icon } = item;

          return (
            item.show && (
              <Collapsible
                key={idx}
                asChild
                defaultOpen={item.isActive}
                className="group/collapsible"
              >
                <SidebarMenuItem className="hover:bg-transparent active:bg-transparent">
                  <CollapsibleTrigger
                    className="hover:bg-transparent active:bg-transparent hover:text-white cursor-pointer"
                    asChild
                  >
                    {item.items ? (
                      <SidebarMenuButton
                        tooltip={item.title}
                        className={`flex items-center gap-2 w-full px-4 py-4 h-10 hover:bg-secondary/65 hover:text-white  ${
                          isActive ? "bg-[#1E1E1E] text-white rounded-lg" : ""
                        }`}
                      >
                        {Icon && <Icon />}
                        <span>{item.title}</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    ) : (
                      <SidebarMenuButton
                        tooltip={item.title}
                        className={`rounded-lg font-medium font-onest text-base h-11 ${
                          isActive
                            ? "bg-[#1E1E1E] w-full  text-white hover:bg-[#1E1E1E]  hover:text-white"
                            : "hover:bg-gray-200 hover:text-black"
                        }
                            `}
                      >
                        {item.url && (
                          <Link
                            href={item.url}
                            className={`flex  items-center gap-2 w-full px-2 py-4`}
                          >
                            {Icon && <Icon size={18} />}
                            <span className="font-medium">{item.title}</span>
                          </Link>
                        )}
                      </SidebarMenuButton>
                    )}
                  </CollapsibleTrigger>

                  {item.items?.length ? (
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items.map((subItem, idx) => (
                          <Link key={idx} href={subItem.url}>
                            <div
                              className={`flex items-center justify-start gap-2 w-full px-4 py-4 h-10 hover:bg-secondary/65 hover:text-white ${
                                pathName === subItem.url
                                  ? "bg-secondary text-white rounded-none"
                                  : ""
                              }`}
                            >
                              <VscDebugBreakpointLogUnverified />
                              <span>{subItem.title}</span>
                            </div>
                          </Link>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  ) : null}
                </SidebarMenuItem>
              </Collapsible>
            )
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
