"use client";

import { SignOutButton } from "@clerk/nextjs";
import { LogOut } from "lucide-react";

const LogoutButton = () => {
  return (
    <SignOutButton redirectUrl="/">
      <button
        className="w-full flex items-center justify-center lg:justify-start gap-4
                   text-gray-500 py-2 md:px-2 rounded-md hover:bg-sky-100 cursor-pointer"
      >
        <LogOut size={20} />
        <span className="hidden lg:block">Logout</span>
      </button>
    </SignOutButton>
  );
};

export default LogoutButton;
