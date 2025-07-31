import React from "react";
import {
  RadialBarChart,
  RadialBar,
  Legend,
  ResponsiveContainer,
} from "recharts";

const ProgressCircle = ({ data }) => {
  return (
    <div className="shadow-lg rounded-xl w-full h-80 col-span-2 bg-white ">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius="20%"
          outerRadius="80%"
          barSize={10}
          data={data}
        >
          <RadialBar minAngle={15} background clockWise dataKey="value" />
          <Legend
            iconSize={10}
            width={120}
            height={140}
            layout="vertical"
            verticalAlign="middle"
            align="right"
            wrapperStyle={{
              position: "absolute",
              top: "50%",
              right: "10px",
              transform: "translateY(-50%)",
            }}
          />
        </RadialBarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProgressCircle;
