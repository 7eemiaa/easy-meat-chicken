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

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { CartDrawer } from "@/components/CartDrawer";
import { useCartSync } from "@/hooks/useCartSync";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground font-serif">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">الصفحة غير موجودة</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            العودة إلى الرئيسية
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
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          تعذّر تحميل هذه الصفحة
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          حدث خطأ ما. يمكنك المحاولة مرة أخرى أو العودة إلى الصفحة الرئيسية.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            حاول مجدداً
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-input bg-background px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            العودة إلى الرئيسية
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
      { title: "Elgzar | الگزار — بوشري اللحوم الحمراء" },
      { name: "description", content: "Boucherie Elgzar : viande rouge halal (bœuf & agneau) livrée chez vous. لحوم حمراء حلال طازجة، بقري وخروفي، مع دجاجي للدواجن." },
      { name: "author", content: "Elgzar" },
      { property: "og:title", content: "Elgzar | الگزار — بوشري اللحوم الحمراء" },
      { property: "og:description", content: "Viande rouge halal, bœuf & agneau. لحوم حمراء حلال طازجة تُوصَّل إليك." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@elgzar" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Inter:wght@400;500;600;700&display=swap" },
    ],
  }),

  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <HeadContent />
      </head>
      <body className="font-sans antialiased">
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <CartSyncWrapper />
      <div className="min-h-screen flex flex-col">
        <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <Link to="/" className="flex items-baseline gap-2">
              <span className="text-2xl font-serif font-bold tracking-tight text-foreground">
                الگزار
              </span>
              <span className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
                Elgzar
              </span>
            </Link>
            <nav className="flex items-center gap-4">
              <Link
                to="/"
                hash="viande"
                className="hidden sm:inline-flex text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                اللحوم الحمراء · Viande
              </Link>
              <Link
                to="/"
                hash="djaji"
                className="hidden sm:inline-flex text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                دجاجي · Volaille
              </Link>
              <CartDrawer />
            </nav>

          </div>
        </header>
        <main className="flex-1">
          <Outlet />
        </main>
        <footer className="border-t border-border bg-secondary py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-serif font-bold">الگزار</span>
                <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Elgzar · incl. دجاجي Djaji
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} Elgzar. لحوم حمراء حلال — بدون خنزير. Viande rouge halal.
              </p>

            </div>
          </div>
        </footer>
      </div>
    </QueryClientProvider>
  );
}

function CartSyncWrapper() {
  useCartSync();
  return null;
}
