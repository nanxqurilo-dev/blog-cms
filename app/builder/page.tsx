import Builder from "@/components/builder/Builder";

export default async function BuilderPage({
  searchParams,
}: {
  searchParams: Promise<{ templateId?: string }>;
}) {
  const { templateId } = await searchParams;

  return <Builder templateId={templateId ?? null} />;
}
