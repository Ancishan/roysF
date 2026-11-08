"use client";

import { useEffect, useState } from "react";

import api from "@/lib/axios";

import StatCard from "@/components/admin/StatCard";

import RecentOrders from "@/components/admin/RecentOrders";

export default function Dashboard() {
  const [dashboard, setDashboard] = useState<any>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get("/dashboard");

        setDashboard(res.data.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchDashboard();
  }, []);

  if (!dashboard) {
    return (
      <div
        className="
p-6
text-gray-600
"
      >
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div
      className="
space-y-6
"
    >
      {/* HEADER */}

      <div
        className="
flex
justify-between
items-center
"
      >
        <div>
          <h1
            className="
text-3xl
font-bold
text-gray-900
"
          >
            Dashboard
          </h1>

          <p
            className="
text-gray-500
mt-1
"
          >
            Welcome back Admin
          </p>
        </div>

        {/* <button
          className="
bg-black
text-white
px-5
py-3
rounded-lg
hover:bg-gray-800
"
        >
          + New Order
        </button> */}
      </div>

      {/* STAT CARDS */}

      <div
        className="
grid
grid-cols-1
sm:grid-cols-2
xl:grid-cols-4
gap-5
"
      >
        <StatCard title="Total Orders" value={dashboard.overview.totalOrders} />

        <StatCard
          title="Revenue"
          value={`৳ ${dashboard.overview.totalRevenue}`}
        />

        <StatCard title="Customers" value={dashboard.overview.totalCustomers} />

        <StatCard title="Products" value={dashboard.overview.totalProducts} />
      </div>

      {/* RECENT ORDERS */}

      <RecentOrders data={dashboard.recentOrders} />
    </div>
  );
}
