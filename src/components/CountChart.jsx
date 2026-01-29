"use client";
import { RadialBarChart, RadialBar } from "recharts";
import { RechartsDevtools } from "@recharts/devtools";
import Image from "next/image";

const CountChart = ({ boys, girls }) => {
  const data = [
    {
      name: "Total",
      count: boys + girls,
      fill: "white",
    },
    {
      name: "Girls",
      count: girls,
      fill: "#a12241",
    },
    {
      name: "Boys",
      count: boys,
      fill: "#01305f",
    },
  ];

  return (
    <div className="w-full h-[75%] relative">
      <RadialBarChart
        responsive
        cx="50%"
        cy="50%"
        innerRadius="40%"
        outerRadius="100%"
        barSize={32}
        data={data}
        style={{ width: "100%", height: "100%" }}
      >
        <RadialBar background dataKey="count" />
        <RechartsDevtools />
      </RadialBarChart>
      <Image
        alt="female male icon"
        src="/malefemale.svg"
        width="50"
        height="50"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      />
    </div>
  );
};

export default CountChart;
