"use client";

import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface Props {
  data: {
    pending: number;
    confirmed: number;
    processing: number;
    shipped: number;
    delivered: number;
    cancelled: number;
  };
}

export default function OrderChart({ data }: Props) {
  const chartData = [
    {
      name: "Pending",
      value: data.pending,
    },

    {
      name: "Confirmed",
      value: data.confirmed,
    },

    {
      name: "Processing",
      value: data.processing,
    },

    {
      name: "Shipped",
      value: data.shipped,
    },

    {
      name: "Delivered",
      value: data.delivered,
    },

    {
      name: "Cancelled",
      value: data.cancelled,
    },
  ];

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
        Order Status
      </h2>

      <ResponsiveContainer width="100%" height="85%">
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            outerRadius={100}
            label
          >
            {chartData.map((item, index) => (
              <Cell key={index} />
            ))}
          </Pie>

          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
