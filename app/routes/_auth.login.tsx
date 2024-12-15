import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { FormField, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { AuthService } from "~/services/auth.service";
import { setAuthTokens } from "~/services/session.server";
import { getSession } from "~/services/session.server";

interface ActionData {
  errors?: {
    email?: string;
    password?: string;
    _form?: string;
  };
}

export async function loader({ request }: ActionFunctionArgs) {
  const session = await getSession(request);
  const authToken = session.get("authToken");
  const sessionToken = session.get("sessionToken");

  // If user is already authenticated, redirect to dashboard
  if (authToken && sessionToken) {
    return redirect("/");
  }

  return json({});
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  const errors: ActionData["errors"] = {};

  if (!email) errors.email = "Email is required";
  if (!password) errors.password = "Password is required";

  if (Object.keys(errors).length > 0) {
    return json<ActionData>({ errors }, { status: 400 });
  }

  try {
    const response = await AuthService.login({
      email: email!,
      password: password!,
    });

    // Set auth tokens in session
    const cookie = await setAuthTokens(
      request,
      response.token,
      response.sessionToken
    );

    return redirect("/dashboard", {
      headers: {
        "Set-Cookie": cookie,
      },
    });
  } catch (error) {
    return json<ActionData>(
      { errors: { _form: "Invalid email or password" } },
      { status: 401 }
    );
  }
}

export default function LoginPage() {
  const actionData = useActionData<ActionData>();

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight dark:text-white text-text">
            Welcome back
          </h1>
          <p className="text-sm dark:text-white text-text">
            Enter your email to sign in to your account
          </p>
        </div>

        <Form method="post" className="space-y-4">
          <FormField>
            <FormLabel htmlFor="email" className="dark:text-white text-text">
              Email
            </FormLabel>
            <Input
              id="email"
              type="email"
              name="email"
              placeholder="name@example.com"
              className="bg-white"
              required
            />
            {actionData?.errors?.email && (
              <FormMessage>{actionData.errors.email}</FormMessage>
            )}
          </FormField>

          <FormField>
            <FormLabel htmlFor="password" className="dark:text-white text-text">
              Password
            </FormLabel>
            <Input
              id="password"
              type="password"
              name="password"
              className="bg-white"
              required
            />
            {actionData?.errors?.password && (
              <FormMessage>{actionData.errors.password}</FormMessage>
            )}
          </FormField>

          {actionData?.errors?._form && (
            <FormMessage>{actionData.errors._form}</FormMessage>
          )}

          <Button type="submit" className="w-full">
            Sign In
          </Button>
        </Form>

        <div className="text-center text-sm dark:text-white text-text">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="underline hover:text-gray-800">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
