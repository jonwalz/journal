import { LoaderFunctionArgs, json } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { MainLayout } from "~/layouts/MainLayout";
import { requireUserSession } from "~/services/session.server";

export async function loader({ request }: LoaderFunctionArgs) {
  await requireUserSession(request);
  return json({});
}

export default function DashboardLayout() {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
}
