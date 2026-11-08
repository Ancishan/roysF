"use client";

export default function RecentOrders({ data }: { data: any[] }) {
  return (
    <div
      className="
bg-white
rounded-xl
border
p-6
w-full
"
    >
      <div
        className="
flex
justify-between
mb-5
"
      >
        <h2
          className="
text-lg
font-semibold
"
        >
          Recent Orders
        </h2>

        <button
          className="
text-blue-600
text-sm
"
        >
          View All
        </button>
      </div>

      <div
        className="
overflow-x-auto
"
      >
        <table
          className="
w-full
min-w-[900px]
text-sm
"
        >
          <thead>
            <tr
              className="
border-b
text-gray-500
"
            >
              <th className="p-3 text-left">Order</th>

              <th className="p-3 text-left">Customer</th>

              <th className="p-3 text-left">Amount</th>

              <th className="p-3 text-left">Source</th>

              <th className="p-3 text-left">Status</th>

              <th className="p-3 text-left">Date</th>
            </tr>
          </thead>

          <tbody>
            {data.map((order) => (
              <tr
                key={order.id}
                className="
border-b
hover:bg-gray-50
"
              >
                <td className="p-3">#{order.orderNumber}</td>

                <td className="p-3">
                  <div>
                    <p className="font-medium">{order.customerName}</p>

                    <p className="text-xs text-gray-500">
                      {order.customerPhone}
                    </p>
                  </div>
                </td>

                <td className="p-3">৳ {Number(order.totalAmount)}</td>

                <td className="p-3">
                  <span
                    className="
bg-gray-100
px-3
py-1
rounded-full
text-xs
"
                  >
                    {order.source}
                  </span>
                </td>

                <td className="p-3">
                  <span
                    className="
bg-green-100
text-green-700
px-3
py-1
rounded-full
text-xs
"
                  >
                    {order.orderStatus}
                  </span>
                </td>

                <td className="p-3">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
