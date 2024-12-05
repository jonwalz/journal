import { redirect } from "@remix-run/node";
import { AuthService } from "~/services/auth.service";
import { getAuthToken, getSessionToken } from "~/services/session.server";

export async function requireAuth(request: Request) {
  const authToken = await getAuthToken(request);
  const sessionToken = await getSessionToken(request);

  if (!authToken || !sessionToken) {
    throw redirect("/login");
  }

  try {
    // Verify both tokens
    await Promise.all([
      AuthService.verifyAuthToken(authToken),
      AuthService.verifySessionToken(sessionToken),
    ]);

    return { authToken, sessionToken };
  } catch (error) {
    throw redirect("/login");
  }
}