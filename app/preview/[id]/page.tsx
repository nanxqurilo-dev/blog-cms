import WidgetRenderer from "@/components/builder/WidgetRenderer";

export default async function Preview({ params }: any) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/page?id=${params.id}`,

  );
  const data = await res.json();

  return (
    <div className="p-10">
      {data.widgets.map((w: any) => (
        <WidgetRenderer key={w.id} widget={w} />
      ))}
    </div>
  );
}
