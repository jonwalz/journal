import { createCookie } from "@remix-run/node";
import { config } from "~/config";

export const themeCookie = createCookie("theme", {
  maxAge: 34560000, // 400 days
});
