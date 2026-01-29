import React from "react";
import CountChart from "./CountChart";
import { Ellipsis } from "lucide-react";
import prisma from "@/lib/prisma";

const CountChartContainer = async () => {
  const data = await prisma.student.groupBy({
    by: ["sex"],
    _count: true,
  });

  const boys = data.find((d) => d.sex === "MALE")?._count || 0;
  const girls = data.find((d) => d.sex === "FEMALE")?._count || 0;

  return (
    <div className="bg-white rounded-xl w-full h-full py-4 px-4 pb-8">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Students</h1>
        <Ellipsis width={20} height={20} />
      </div>
      <CountChart boys={boys} girls={girls} />
      <div className="flex justify-center gap-16">
        <div className="flex flex-col gap-1">
          <div className="w-5 h-5 bg-primary rounded-full" />
          <h1 className="font-bold text-primary">{boys}</h1>
          <h2 className="text-sm text-gray-400">
            Boys ({Math.round((boys / (boys + girls)) * 100)}%)
          </h2>
        </div>
        <div className="flex flex-col gap-1">
          <div className="w-5 h-5 bg-secondary rounded-full" />
          <h1 className="font-bold text-primary">{girls}</h1>
          <h2 className="text-sm text-gray-400">
            Girls ({Math.round((girls / (girls + boys)) * 100)}%)
          </h2>
        </div>
      </div>
    </div>
  );
};

export default CountChartContainer;
