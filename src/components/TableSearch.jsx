"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

const TableSearch = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  console.log("pathhhh",pathname);

  const [value, setValue] = useState(searchParams.get("search") || "");

 
  useEffect(() => {
    const handler = setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      
      if (value) {
        params.set("search", value);
        params.delete("page"); 
      } else {
        params.delete("search");
        params.delete("page");
      }
      router.push(`${pathname}?${params.toString()}`);
    }, 300); 

    return () => clearTimeout(handler);
  }, [value, pathname, router]);

  return (
    <div className="w-full md:w-auto text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
      <input
        type="text"
        placeholder="Search..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-50 p-2 bg-transparent outline-none"
      />
    </div>
  );
};

export default TableSearch;
