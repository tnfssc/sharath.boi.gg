import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Provider as JotaiProvider } from "jotai";
import { domAnimation, LazyMotion } from "motion/react";

import { ThemeProvider } from "~/components/theme-provider";
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar";

import { AppSidebar, PageHeader } from "./sidebar";

let _queryClientSingleton: null | QueryClient = null;

const getQueryClient = () => {
  if (typeof window === "undefined") {
    return new QueryClient();
  }
  if (_queryClientSingleton) {
    return _queryClientSingleton;
  }
  const queryClient = new QueryClient();
  _queryClientSingleton = queryClient;
  return queryClient;
};

export const Providers: React.FC<React.PropsWithChildren> = ({ children }) => {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
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
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
};
