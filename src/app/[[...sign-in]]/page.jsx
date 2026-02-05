"use client";

import Logo from "@/components/Logo";
import * as Clerk from "@clerk/elements/common";
import * as SignIn from "@clerk/elements/sign-in";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const router = useRouter();
  const { isLoaded, isSignedIn, user } = useUser();

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      const role = user.publicMetadata?.role;
      if (role) {
        router.push(`/${role}`);
      }
    }
  }, [isLoaded, isSignedIn, user, router]);

  if (!isLoaded) {
    return (
      <div className="h-screen text-white flex items-center justify-center bg-primary">
        Loading...
      </div>
    );
  }

  if (isSignedIn) {
    return (
      <div className="h-screen text-white flex items-center justify-center bg-primary">
        Redirecting...
      </div>
    );
  }

  return (
    <div className="h-screen flex items-center justify-center bg-primary">
      <SignIn.Root>
        <SignIn.Step
          name="start"
          className="bg-white px-10 py-8 md:px-20 md:py-14 rounded-md shadow-xl flex flex-col gap-3"
        >
          <Logo />
          <h2 className="text-gray-400 text-xs text-center">
            Sign in to your account
          </h2>

          <Clerk.GlobalError className="text-sm text-red-400" />

          <Clerk.Field name="identifier" className="flex flex-col gap-2">
            <Clerk.Label className="text-xs text-gray-500">
              Username
            </Clerk.Label>
            <Clerk.Input
              type="text"
              required
              className="p-2 rounded-md ring-1 ring-gray-300 focus:outline-none"
            />
            <Clerk.FieldError className="text-xs text-red-400" />
          </Clerk.Field>

          <Clerk.Field name="password" className="flex flex-col gap-2">
            <Clerk.Label className="text-xs text-gray-500">
              Password
            </Clerk.Label>
            <Clerk.Input
              type="password"
              required
              className="p-2 rounded-md ring-1 ring-gray-300 focus:outline-none"
            />
            <Clerk.FieldError className="text-xs text-red-400" />
          </Clerk.Field>

          <SignIn.Action
            submit
            className="bg-secondary text-white my-1 rounded-md text-sm p-2.5 cursor-pointer"
          >
            Sign In
          </SignIn.Action>
        </SignIn.Step>
      </SignIn.Root>
    </div>
  );
}
