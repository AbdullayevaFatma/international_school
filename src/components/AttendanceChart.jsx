"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { RechartsDevtools } from "@recharts/devtools";



const AttendanceChart = ({data}) => {
  return (
   
      <div className="w-full h-full">
      <BarChart
        style={{
          width: "100%",
          height: "100%",
          maxWidth: "700px",
          maxHeight: "70vh",
          aspectRatio: 1.618,
        }}
         margin={{
            bottom: 20,
          }}
        responsive
        data={data}
        barSize={20}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ddd"/>
        <XAxis dataKey="day" axisLine={false} tick={{fill:"#d1d5db"}} tickLine={false}/>
        <YAxis width="auto"  axisLine={false} tick={{fill:"#d1d5db"}} tickLine={false}/>
        <Tooltip contentStyle={{borderRadius: "10px",borderColor: "lightgray"}}/>
        <Legend  align="left" verticalAlign="top" wrapperStyle={{paddingTop: "20px",paddingBottom: "40px"}}/>
        <Bar
          dataKey="present"
          fill="#a12241"
          radius={[50, 50, 0, 0]}
          legendType="circle"
        />
        <Bar
          dataKey="absent"
          fill="#01305f"
          radius={[50, 50, 0, 0]}
          legendType="circle"
        />
        <RechartsDevtools />
      </BarChart>
      </div>
    
  );
};

export default AttendanceChart;
