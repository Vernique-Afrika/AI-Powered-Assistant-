import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center glass-panel rounded-3xl p-10">
        <h1 className="text-7xl font-serif text-gold">404</h1>
        <h2 className="mt-4 text-xl font-serif text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          This page has slipped off the runway.
        </p>
        <div className="mt-6">
          <Link to="/" className="btn-luxe hover:[&]:btn-luxe-hover inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm font-medium">
            Return home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center glass-panel rounded-3xl p-10">
        <h1 className="text-xl font-serif text-foreground">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong. Try again or head home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="btn-luxe hover:[&]:btn-luxe-hover inline-flex items-center justify-center rounded-full px-5 py-2 text-sm font-medium"
          >
            Try again
          </button>
          <a href="/" className="inline-flex items-center justify-center rounded-full border border-input bg-background px-5 py-2 text-sm font-medium hover:bg-accent/20">
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Vernique Afrika — AI Business Assistant" },
      { name: "description", content: "Luxury African fashion, powered by AI. Automate emails, marketing, product copy, meeting notes, research and more for the Vernique Afrika business." },
      { name: "author", content: "Vernique Afrika" },
      { property: "og:title", content: "Vernique Afrika — AI Business Assistant" },
      { property: "og:description", content: "Luxury African fashion, powered by AI. Automate emails, marketing, product copy, meeting notes, research and more for the Vernique Afrika business." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Vernique Afrika — AI Business Assistant" },
      { name: "twitter:description", content: "Luxury African fashion, powered by AI. Automate emails, marketing, product copy, meeting notes, research and more for the Vernique Afrika business." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/9b0ec283-6ad0-488b-b5ca-daf8762781f2/id-preview-7690b55a--6b61a8e5-54ca-461e-af76-ff0933058056.lovable.app-1784118379956.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/9b0ec283-6ad0-488b-b5ca-daf8762781f2/id-preview-7690b55a--6b61a8e5-54ca-461e-af76-ff0933058056.lovable.app-1784118379956.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap" },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const router = useRouter();

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
      router.invalidate();
      if (event !== "SIGNED_OUT") queryClient.invalidateQueries();
    });
    return () => sub.subscription.unsubscribe();
  }, [router, queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <Toaster richColors position="top-right" />
    </QueryClientProvider>
  );
}
