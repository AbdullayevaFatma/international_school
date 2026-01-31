"use client";
import { Megaphone } from "lucide-react";
import { useUser } from "@clerk/nextjs";

const Navbar = () => {
  const { user } = useUser();
  const username = user?.username
    ? user.username.charAt(0).toUpperCase() +
      user.username.slice(1).toLowerCase()
    : "";
  const role = user?.publicMetadata?.role;
  

  return (
    <div className="flex items-center justify-between p-4">
      <div className="hidden md:flex  text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
        <input
          type="text"
          placeholder="Search..."
          className="w-50 p-2 bg-transparent outline-none"
        />
      </div>

      <div className="flex items-center gap-6 justify-end w-full">
        <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer relative">
          <Megaphone width={22} height={22} />
          <div className="absolute -top-3 -right-3 w-5 h-5 flex items-center justify-center bg-primary text-white rounded-full text-xs ">
            1
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-xs leading-3 font-medium">{username}</span>
          <span className="text-[10px] text-gray-500 text-right">{role}</span>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
