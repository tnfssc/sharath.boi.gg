import { Link, useMatchRoute } from "@tanstack/react-router";
import { useAtom } from "jotai";
import { FileIcon, GithubIcon, HomeIcon, LinkedinIcon, SparklesIcon, TwitterIcon, UserIcon } from "lucide-react";
import * as React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  currentInsetAtom,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "~/components/ui/sidebar";

import { ModeToggle } from "./theme-toggle";

export { currentInsetAtom };

export function PageHeader() {
  const [, setCurrentInset] = useAtom(currentInsetAtom);
  const headerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!headerRef.current) {
      return;
    }

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry.contentRect.width) {
        return;
      }

      setCurrentInset((p) => ({ ...p, vertical: `${entry.contentRect.height}px` }));
    });

    observer.observe(headerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [setCurrentInset]);

  return (
    <header
      className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12"
      ref={headerRef}
    >
      <div className="flex items-center gap-2 justify-between w-full px-4">
        <SidebarTrigger className="-ml-1 size-8" />
      </div>
    </header>
  );
}

const navData = [
  {
    icon: HomeIcon,
    title: "Home",
    url: "/",
  },
  {
    icon: FileIcon,
    title: "Past work",
    url: "/past-work",
  },
  {
    icon: UserIcon,
    title: "Hire me",
    url: "/hire",
  },
  {
    icon: SparklesIcon,
    title: "Ping me",
    url: "/ping",
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { isMobile } = useSidebar();
  const match = useMatchRoute();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link to="/">
              <SidebarMenuButton size="lg">
                <div className="flex aspect-square size-8 items-center justify-center rounded-base">
                  <img alt="Sharath's logo" className="size-7" src="/icon.svg" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-heading">sharath</span>
                  <span className="truncate text-xs">sharath@boi.gg</span>
                </div>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>About me</SidebarGroupLabel>
          <SidebarMenu>
            {navData.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  className="data-[active=true]:bg-main data-[active=true]:text-main-foreground"
                  isActive={!!match({ to: item.url })}
                >
                  <Link to={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  className="group-data-[state=collapsed]:hover:outline-0 group-data-[state=collapsed]:hover:bg-transparent overflow-visible"
                  size="lg"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage alt="tnfssc" src="https://github.com/tnfssc.png?size=40" />
                    <AvatarFallback>T</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-heading">Socials</span>
                    <span className="truncate text-xs">Contact me</span>
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56"
                side={isMobile ? "bottom" : "right"}
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-base">
                  <div className="flex items-center gap-2 px-2 py-1.5 text-sm justify-end">
                    <ModeToggle />
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <a href="https://twitter.com/tnfssc" target="_blank">
                      <TwitterIcon />
                      Twitter
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <a href="https://www.linkedin.com/in/tnfssc/" target="_blank">
                      <LinkedinIcon />
                      LinkedIn
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <a href="https://github.com/tnfssc" target="_blank">
                      <GithubIcon />
                      GitHub
                    </a>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
