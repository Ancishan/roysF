"use client";

interface Props {
  data: any[];
}

export default function TopProducts({ data }: Props) {
  return (
    <div
      className="
bg-white
rounded-xl
border
p-6
"
    >
      <h2
        className="
font-semibold
text-lg
mb-5
"
      >
        Top Selling Products
      </h2>

      <div
        className="
overflow-x-auto
"
      >
        <table
          className="
w-full
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
              <th
                className="
p-3
text-left
"
              >
                Product
              </th>

              <th
                className="
p-3
text-left
"
              >
                Quantity
              </th>

              <th
                className="
p-3
text-left
"
              >
                Revenue
              </th>
            </tr>
          </thead>

          <tbody>
            {data.map((item: any, index: number) => (
              <tr
                key={index}
                className="
border-b
hover:bg-gray-50
"
              >
                <td
                  className="
p-3
font-medium
"
                >
                  {item.productName}
                </td>

                <td
                  className="
p-3
"
                >
                  {item.quantity}
                  pcs
                </td>

                <td
                  className="
p-3
"
                >
                  ৳ {item.revenue}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
