import prisma from "@/lib/prisma";
import { Ellipsis } from "lucide-react";

const Card = async ({ type }) => {
  const modelMap = {
    admin: prisma.admin,
    teacher: prisma.teacher,
    student: prisma.student,
    parent: prisma.parent,
  };
  if (!modelMap[type]) {
    throw new Error("Invalid user type");
  }
  const data = await modelMap[type].count();
  return (
    <div className="rounded-2xl odd:bg-primary even:bg-secondary p-4 flex-1 min-w-32.5">
      <div className="flex justify-between items-center">
        <span className="text-[10px] bg-white px-2 py-1 rounded-full text-accent">
          2024/25
        </span>
        <Ellipsis width={20} height={20} color="white" />
      </div>
      <h1 className="text-2xl font-semibold my-4 text-white">{data}</h1>
      <h2 className="capitalize text-sm font-medium text-gray-300">{type}s</h2>
    </div>
  );
};

export default Card;
