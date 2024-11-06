import {
  json,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  isRouteErrorResponse,
  useRouteError,
} from "@remix-run/react";
import { ErrorBoundary as ErrorBoundaryComponent } from "./components/ErrorBoundary";
import type { LinksFunction } from "@remix-run/node";

import styles from "./tailwind.css?url";
import { ThemeProvider } from "./features/theme/ThemeProvider";
import { MainLayout } from "./layouts/MainLayout";
import { themeCookie } from "./utils/theme.server";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Kanit:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Oswald:wght@200..700&family=Public+Sans:ital,wght@0,100..900;1,100..900&display=swap",
  },
  { rel: "stylesheet", href: styles },
];

export const loader = async ({ request }: { request: Request }) => {
  const theme = await themeCookie.parse(request.headers.get("Cookie"));
  return json({ theme: theme || "light" });
};

export function ErrorBoundary() {
  const error = useRouteError();
  const data = useLoaderData<typeof loader>();
  
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <ThemeProvider theme={data.theme}>
          <MainLayout>
            <ErrorBoundaryComponent error={isRouteErrorResponse(error) ? new Error(error.data) : error instanceof Error ? error : undefined} />
          </MainLayout>
          <Scripts />
        </ThemeProvider>
      </body>
    </html>
  );
}

export default function App() {
  const data = useLoaderData<typeof loader>();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <ThemeProvider theme={data.theme}>
          <MainLayout>
            <Outlet />
          </MainLayout>
          <ScrollRestoration />
          <Scripts />
        </ThemeProvider>
      </body>
    </html>
  );
}
