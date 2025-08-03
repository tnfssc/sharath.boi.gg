import { Provider as JotaiProvider } from "jotai";
import { domAnimation, LazyMotion } from "motion/react";

import { ThemeProvider } from "~/components/theme-provider";
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar";

import { AppSidebar, PageHeader } from "./sidebar";

export const Providers: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <LazyMotion features={domAnimation} strict>
        <JotaiProvider>
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
              <PageHeader />
              {children}
            </SidebarInset>
          </SidebarProvider>
        </JotaiProvider>
      </LazyMotion>
    </ThemeProvider>
  );
};
