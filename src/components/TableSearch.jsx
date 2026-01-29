"use client";

import { useRouter } from "next/navigation";

const TableSearch = () => {
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    const value = e.currentTarget[0].value;

    const params = new URLSearchParams(window.location.search);
    params.set("search", value);
    router.push(`${window.location.pathname}?${params}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full md:w-auto  text-xs rounded-full ring-[1.5px] ring-gray-300 px-2"
    >
      <input
        type="text"
        placeholder="Search..."
        className="w-50 p-2 bg-transparent outline-none"
      />
    </form>
  );
};

export default TableSearch;
