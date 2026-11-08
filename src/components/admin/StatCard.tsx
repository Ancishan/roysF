interface Props {
  title: string;

  value: string | number;
}

export default function StatCard({
  title,

  value,
}: Props) {
  return (
    <div
      className="
bg-white
rounded-xl
border
p-6
shadow-sm
hover:shadow-md
transition
"
    >
      <p
        className="
text-gray-500
text-sm
"
      >
        {title}
      </p>

      <h2
        className="
text-3xl
font-bold
mt-3
text-gray-900
"
      >
        {value}
      </h2>
    </div>
  );
}
