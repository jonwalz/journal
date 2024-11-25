import { Outlet } from "@remix-run/react";

export default function AuthLayout() {
  return (
    <div className="flex">
      <Outlet />
      <div className="hidden md:flex flex flex-col w-full justify-center items-center border-2 bg-slate-600">
        Placeholder for large photo
      </div>
    </div>
  );
}
