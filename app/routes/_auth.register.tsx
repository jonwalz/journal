import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { FormField, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { AuthService } from "~/services/auth.service";

interface ActionData {
  errors?: {
    email?: string;
    password?: string;
    confirmPassword?: string;
    _form?: string;
  };
}

export async function loader() {
  // TODO: Check if user is already authenticated
  return json({});
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const confirmPassword = formData.get("confirmPassword")?.toString();

  const errors: ActionData["errors"] = {};

  if (!email) errors.email = "Email is required";
  if (!password) errors.password = "Password is required";
  if (!confirmPassword) errors.confirmPassword = "Please confirm your password";
  if (password !== confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  if (Object.keys(errors).length > 0) {
    return json<ActionData>({ errors }, { status: 400 });
  }

  try {
    await AuthService.signUp({ email: email!, password: password! });
    return redirect("/login");
  } catch (error) {
    return json<ActionData>(
      { errors: { _form: "Failed to create account. Please try again." } },
      { status: 500 }
    );
  }
}

export default function RegisterPage() {
  const actionData = useActionData<typeof action>() as ActionData;

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center mx-auto">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Create an account
          </h1>
          <p className="text-sm text-gray-500">
            Enter your email below to create your account
          </p>
        </div>

        <Form method="post" className="space-y-4">
          <FormField>
            <FormLabel htmlFor="email">Email</FormLabel>
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
            <FormLabel htmlFor="password">Password</FormLabel>
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

          <FormField>
            <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
            <Input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              className="bg-white"
              required
            />
            {actionData?.errors?.confirmPassword && (
              <FormMessage>{actionData.errors.confirmPassword}</FormMessage>
            )}
          </FormField>

          <Button type="submit" className="w-full">
            Sign Up
          </Button>
        </Form>

        <div className="text-center text-sm">
          Already have an account?{" "}
          <a href="/login" className="underline hover:text-gray-800">
            Sign in
          </a>
        </div>
      </div>
    </div>
  );
}
