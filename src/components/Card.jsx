import prisma from "@/lib/prisma";
import { Ellipsis } from "lucide-react";

const Card = async ({ type }) => {
  const modelMap = {
    admin: prisma.admin,
    teacher: prisma.teacher,
    student: prisma.student,
    parent: prisma.parent,
  };

  const model = modelMap[type];

  if (!model) return null;

  const data = await model.count();
  const dateLabel = new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date());

  return (
    <div className="rounded-2xl odd:bg-primary even:bg-secondary p-4 flex-1 min-w-32.5">
      <div className="flex justify-between items-center">
        <span className="text-[10px] font-semibold bg-white px-2 py-1 rounded-full text-accent">
          {dateLabel}
        </span>
        <Ellipsis width={20} height={20} color="white" />
      </div>
      <h1 className="text-2xl font-semibold my-4 text-white">{data}</h1>
      <h2 className="capitalize text-sm font-medium text-gray-100">{type}s</h2>
    </div>
  );
};

export default Card;
