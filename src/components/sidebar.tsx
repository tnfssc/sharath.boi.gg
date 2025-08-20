import { useQuery } from "@tanstack/react-query";
import { Link, useMatchRoute } from "@tanstack/react-router";
import { useAtom } from "jotai";
import { FileIcon, GithubIcon, HomeIcon, LinkedinIcon, SparklesIcon, TwitterIcon, UploadCloudIcon } from "lucide-react";
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
import { useTRPC } from "~/lib/trpc";

import { AccountButton } from "./account-button";
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
      <div className="flex w-full items-center justify-between gap-2 px-4">
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
    icon: SparklesIcon,
    title: "Ping me",
    url: "/ping",
  },
];

const privateNavData = [
  {
    icon: UploadCloudIcon,
    title: "Upload",
    url: "/upload-to-cdn",
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { isMobile } = useSidebar();
  const match = useMatchRoute();
  const trpc = useTRPC();
  const isOwnerQuery = useQuery(trpc.auth.isOwner.queryOptions());

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link to="/">
              <SidebarMenuButton size="lg">
                <div className="flex aspect-square size-8 items-center justify-center rounded-full bg-black">
                  <img alt="Sharath's logo" className="size-7" src="/icon.svg" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="font-heading truncate">sharath</span>
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
        {isOwnerQuery.data && (
          <SidebarGroup>
            <SidebarGroupLabel>Private</SidebarGroupLabel>
            <SidebarMenu>
              {privateNavData.map((item) => (
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
        )}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  className="overflow-visible group-data-[state=collapsed]:hover:bg-transparent group-data-[state=collapsed]:hover:outline-0"
                  size="lg"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage alt="tnfssc" src="https://github.com/tnfssc.png?size=40" />
                    <AvatarFallback>T</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="font-heading truncate">Socials</span>
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
                <DropdownMenuLabel className="font-base p-0">
                  <div className="flex items-center justify-between gap-2 px-2 py-1.5 text-sm">
                    <AccountButton />
                    <ModeToggle />
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <a href="https://twitter.com/tnfssc" rel="noreferrer noopener" target="_blank">
                      <TwitterIcon />
                      Twitter
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <a href="https://www.linkedin.com/in/tnfssc/" rel="noreferrer noopener" target="_blank">
                      <LinkedinIcon />
                      LinkedIn
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <a href="https://github.com/tnfssc" rel="noreferrer noopener" target="_blank">
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
