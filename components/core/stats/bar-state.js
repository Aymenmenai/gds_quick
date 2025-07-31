import axios from "axios";
import React, { useState } from "react";
import { useQuery } from "react-query";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// const data = [
//   {
//     name: "Page A",
//     uv: 4000,
//     pv: 2400,
//     amt: 2400,
//   },
//   {
//     name: "Page B",
//     uv: 3000,
//     pv: 1398,
//     amt: 2210,
//   },
//   {
//     name: "Page C",
//     uv: 2000,
//     pv: 9800,
//     amt: 2290,
//   },
//   {
//     name: "Page D",
//     uv: 2780,
//     pv: 3908,
//     amt: 2000,
//   },
//   {
//     name: "Page E",
//     uv: 1890,
//     pv: 4800,
//     amt: 2181,
//   },
//   {
//     name: "Page F",
//     uv: 2390,
//     pv: 3800,
//     amt: 2500,
//   },
//   {
//     name: "Page G",
//     uv: 3490,
//     pv: 4300,
//     amt: 2100,
//   },
// ];

const BarState = () => {
  // INITIAL
  const initialTime = new Date(Date.now());
  const initialStart = "today";

  const [time, setTime] = useState(initialTime);
  const [startedDay, setStartedDay] = useState(initialStart);

  const data = useQuery("mainStats", () => {
    return axios.get("/api/v1/stats/io", { startedDay, time });
  });

  if (data.isLoading) {
    return <>Loading</>;
  }
  // console.log(data.data.data.dat);

  return (
    <div className="flex justify-center items-center flex-col shadow-lg rounded-xl w-full h-full row-span-2 col-span-3 p-4 bg-white">
      <div className="text-xl font-semibold">State</div>
      <ResponsiveContainer width="90%" height="80%">
        <BarChart
          width={500}
          height={300}
          data={data.data.data.data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="entree" fill="#8884d8" />
          <Bar dataKey="sortie" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarState;
