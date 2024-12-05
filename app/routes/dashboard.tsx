import { LoaderFunctionArgs, json } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { MainLayout } from "~/layouts/MainLayout";
import { JournalService } from "~/services/journal.service";
import { requireAuth } from "~/utils/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const { authToken, sessionToken } = await requireAuth(request);
  const journals = await JournalService.getJournals({
    headers: {
      Authorization: `Bearer ${authToken}`,
      "x-session-token": sessionToken,
    },
  });
  return json({ journals: journals ?? [] });
}

export default function DashboardLayout() {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
}
