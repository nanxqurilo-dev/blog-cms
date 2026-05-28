"use client";

import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";

function normalizeList(value: unknown) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item));
  }

  if (typeof value === "string") {
    return value.split(/\r?\n/);
  }

  return [];
}

export default function AccordionWidget({ widget }: any) {
  const g = widget.general || {};
  const s = widget.style || {};

  const titles = useMemo(() => normalizeList(g.itemsTitle), [g.itemsTitle]);
  const contents = useMemo(() => normalizeList(g.itemsContent), [g.itemsContent]);
  const items = titles
    .map((title, index) => ({
      title: title.trim(),
      content: (contents[index] || "").trim(),
    }))
    .filter((item) => item.title || item.content);

  const defaultOpen = g.firstOpen === false ? [] : items.length ? [0] : [];
  const [openItems, setOpenItems] = useState<number[]>(defaultOpen);
  const allowMultiple = Boolean(g.allowMultiple);

  const toggleItem = (index: number) => {
    const isOpen = openItems.includes(index);

    if (allowMultiple) {
      setOpenItems((current) =>
        isOpen ? current.filter((item) => item !== index) : [...current, index]
      );
      return;
    }

    setOpenItems(isOpen ? [] : [index]);
  };

  return (
    <div style={{ width: "100%", textAlign: s.alignment || "left" }}>
      <div
        style={{
          width: s.width || "100%",
          maxWidth: s.maxWidth || "860px",
          margin: s.margin || "0px",
          padding: s.padding || "0px",
          background: s.background || "transparent",
        }}
      >
        {items.map((item, index) => {
          const isOpen = openItems.includes(index);
          const iconFirst = (g.iconPosition || "right") === "left";

          return (
            <div
              key={`${item.title}-${index}`}
              style={{
                background: s.item?.background || "#ffffff",
                border: `${s.item?.borderWidth || "1px"} ${s.item?.borderStyle || "solid"} ${s.item?.borderColor || "#e5e7eb"}`,
                borderRadius: s.item?.radius || "22px",
                boxShadow: s.item?.boxShadow || "0 18px 45px rgba(15, 23, 42, 0.08)",
                marginBottom: s.item?.spacing || "14px",
                overflow: "hidden",
              }}
            >
              <button
                type="button"
                onClick={() => toggleItem(index)}
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: iconFirst ? "row-reverse" : "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: s.header?.gap || "16px",
                  padding: s.header?.padding || "22px 24px",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <span
                  style={{
                    color: s.header?.color || "#111827",
                    fontSize: s.header?.fontSize || "18px",
                    fontWeight: s.header?.fontWeight || "700",
                    lineHeight: s.header?.lineHeight || "1.4",
                    letterSpacing: s.header?.letterSpacing || "-0.01em",
                    flex: 1,
                  }}
                >
                  {item.title || `Accordion Item ${index + 1}`}
                </span>
                <span
                  style={{
                    width: s.icon?.boxSize || "36px",
                    height: s.icon?.boxSize || "36px",
                    minWidth: s.icon?.boxSize || "36px",
                    borderRadius: s.icon?.radius || "999px",
                    background: s.icon?.background || "rgba(37, 99, 235, 0.08)",
                    color: s.icon?.color || "#2563eb",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                    transition: `transform ${s.transitionDuration || "0.25s"} ease`,
                  }}
                >
                  <ChevronDown size={Number(s.icon?.size || 18)} />
                </span>
              </button>

              {isOpen && (
                <div
                  style={{
                    padding: s.content?.padding || "0px 24px 22px",
                    color: s.content?.color || "#6b7280",
                    fontSize: s.content?.fontSize || "16px",
                    fontWeight: s.content?.fontWeight || "400",
                    lineHeight: s.content?.lineHeight || "1.75",
                    letterSpacing: s.content?.letterSpacing || "0px",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {item.content || "Add supporting accordion content to explain this section in more detail."}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
