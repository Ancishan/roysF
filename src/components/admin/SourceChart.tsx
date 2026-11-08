"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Props {
  data: any[];
}

export default function SourceChart({ data }: Props) {
  return (
    <div
      className="
bg-white
rounded-xl
border
p-6
h-[380px]
"
    >
      <h2
        className="
font-semibold
mb-5
"
      >
        Order Source Analytics
      </h2>

      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={data}>
          <XAxis dataKey="source" />

          <YAxis />

          <Tooltip />

          <Bar dataKey="orders" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
