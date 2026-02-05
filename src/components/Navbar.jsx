"use client";
import { useUser } from "@clerk/nextjs";

const Navbar = () => {
   const { user } = useUser();
  const username = user?.firstName || user?.username || "";
  const role = user?.publicMetadata?.role || "";


  
  return (
    <div className="flex items-center justify-between px-4 py-6">
      <div className="hidden md:flex  text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
        <input
          type="text"
          placeholder="Search..."
          className="w-50 p-2 bg-transparent outline-none"
        />
      </div>

       <div className="flex flex-col items-end w-full md:w-auto">
    <span className="text-sm leading-4 tracking-wider font-medium capitalize">{username}</span>
    <span className="text-[10px] text-gray-500">{role}</span>
  </div>
    </div>
  );
};

export default Navbar;
