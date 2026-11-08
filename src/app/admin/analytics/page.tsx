"use client";

import { useEffect, useState } from "react";

import api from "@/lib/axios";

import SalesChart from "@/components/admin/SalesChart";

import OrderChart from "@/components/admin/OrderChart";

import SourceChart from "@/components/admin/SourceChart";

import TopProducts from "@/components/admin/TopProducts";

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get("/dashboard");

        const data = res.data.data;

        setAnalytics({
          salesChart: data.sales?.chart || [],

          orderStatus: data.orders,

          sourceAnalytics: data.sourceAnalytics || [],

          topProducts: data.topProducts || [],
        });
      } catch (error) {
        console.log(error);
      }
    };

    fetchAnalytics();
  }, []);

  if (!analytics) {
    return <div className="p-6">Loading Analytics...</div>;
  }

  return (
    <div
      className="
space-y-6
"
    >
      {/* HEADER */}

      <div>
        <h1
          className="
text-3xl
font-bold
"
        >
          Analytics
        </h1>

        <p
          className="
text-gray-500
mt-1
"
        >
          Business performance overview
        </p>
      </div>

      {/* CHARTS */}

      <div
        className="
grid
grid-cols-1
xl:grid-cols-2
gap-6
"
      >
        <SalesChart data={analytics.salesChart} />

        <OrderChart data={analytics.orderStatus} />
      </div>

      {/* SOURCE + PRODUCTS */}

      <div
        className="
grid
grid-cols-1
xl:grid-cols-2
gap-6
"
      >
        <SourceChart data={analytics.sourceAnalytics} />

        <TopProducts data={analytics.topProducts} />
      </div>
    </div>
  );
}
