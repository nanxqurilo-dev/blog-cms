"use client"

type TabsProps = {
  tab: "general" | "style"
  setTab: (tab: "general" | "style") => void
}

export default function Tabs({ tab, setTab }: TabsProps) {
  return (
    <div className="flex border-b mb-4">
      <button
        onClick={() => setTab("general")}
        className={`flex-1 py-2 text-sm font-medium ${
          tab === "general"
            ? "border-b-2 border-primary text-primary"
            : "text-muted-foreground"
        }`}
      >
        General
      </button>

      <button
        onClick={() => setTab("style")}
        className={`flex-1 py-2 text-sm font-medium ${
          tab === "style"
            ? "border-b-2 border-primary text-primary"
            : "text-muted-foreground"
        }`}
      >
        Style
      </button>
    </div>
  )
}
