"use client";

import { useMemo } from "react";

function normalizeList(value: unknown) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim());
  }

  if (typeof value === "string") {
    return value.split(/\r?\n/).map((item) => item.trim());
  }

  return [];
}

function getGridTemplate(layoutPreset: string, itemCount: number) {
  if (layoutPreset === "3-col") {
    return "repeat(3, minmax(0, 1fr))";
  }

  if (layoutPreset === "feature-left") {
    return "minmax(0, 1.35fr) minmax(0, 0.85fr)";
  }

  if (layoutPreset === "feature-right") {
    return "minmax(0, 0.85fr) minmax(0, 1.35fr)";
  }

  return itemCount >= 3 ? "repeat(3, minmax(0, 1fr))" : "repeat(2, minmax(0, 1fr))";
}

export default function InnerSectionWidget({ widget }: any) {
  const g = widget.general || {};
  const s = widget.style || {};

  const itemEyebrows = useMemo(() => normalizeList(g.itemEyebrows), [g.itemEyebrows]);
  const itemTitles = useMemo(() => normalizeList(g.itemTitles), [g.itemTitles]);
  const itemContents = useMemo(() => normalizeList(g.itemContents), [g.itemContents]);

  const items = itemTitles
    .map((title, index) => ({
      eyebrow: itemEyebrows[index] || "",
      title,
      content: itemContents[index] || "",
    }))
    .filter((item) => item.eyebrow || item.title || item.content);

  const layoutPreset = g.layoutPreset || "2-col";
  const showIntro = g.showIntro !== false;
  const verticalAlign =
    g.verticalAlign === "center"
      ? "center"
      : g.verticalAlign === "bottom"
      ? "end"
      : "start";

  return (
    <section style={{ width: "100%", textAlign: s.alignment || "left" }}>
      <div
        style={{
          width: s.width || "100%",
          maxWidth: s.maxWidth || "1100px",
          minHeight: s.minHeight || undefined,
          margin: s.margin || "0px",
          padding: s.padding || "36px",
          background: s.background || "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
          borderRadius: s.border?.radius || "28px",
          border: `${s.border?.width || "1px"} ${s.border?.style || "solid"} ${s.border?.color || "#e5e7eb"}`,
          boxShadow: s.boxShadow || "0 24px 60px rgba(15, 23, 42, 0.08)",
          overflow: "hidden",
        }}
      >
        {showIntro && (g.eyebrow || g.title || g.description) && (
          <div
            style={{
              maxWidth: s.intro?.maxWidth || "720px",
              margin:
                s.alignment === "center"
                  ? `0 auto ${s.intro?.marginBottom || "28px"}`
                  : s.alignment === "right"
                  ? `0 0 ${s.intro?.marginBottom || "28px"} auto`
                  : `0 auto ${s.intro?.marginBottom || "28px"} 0`,
            }}
          >
            {g.eyebrow && (
              <div
                style={{
                  color: s.eyebrow?.color || "#2563eb",
                  fontSize: s.eyebrow?.fontSize || "12px",
                  fontWeight: s.eyebrow?.fontWeight || "700",
                  lineHeight: s.eyebrow?.lineHeight || "1.2",
                  letterSpacing: s.eyebrow?.letterSpacing || "0.18em",
                  textTransform: s.eyebrow?.textTransform || "uppercase",
                  marginBottom: s.eyebrow?.marginBottom || "12px",
                }}
              >
                {g.eyebrow}
              </div>
            )}

            {g.title && (
              <h3
                style={{
                  margin: `0 0 ${s.title?.marginBottom || "14px"} 0`,
                  color: s.title?.color || "#111827",
                  fontSize: s.title?.fontSize || "clamp(28px, 4vw, 44px)",
                  fontWeight: s.title?.fontWeight || "800",
                  lineHeight: s.title?.lineHeight || "1.08",
                  letterSpacing: s.title?.letterSpacing || "-0.03em",
                }}
              >
                {g.title}
              </h3>
            )}

            {g.description && (
              <p
                style={{
                  margin: 0,
                  color: s.description?.color || "#6b7280",
                  fontSize: s.description?.fontSize || "17px",
                  fontWeight: s.description?.fontWeight || "400",
                  lineHeight: s.description?.lineHeight || "1.8",
                  letterSpacing: s.description?.letterSpacing || "0px",
                }}
              >
                {g.description}
              </p>
            )}
          </div>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: getGridTemplate(layoutPreset, items.length),
            alignItems: verticalAlign,
            gap: s.grid?.gap || "20px",
          }}
        >
          {items.map((item, index) => (
            <article
              key={`${item.title}-${index}`}
              style={{
                minHeight: s.item?.minHeight || undefined,
                padding: s.item?.padding || "24px",
                background: s.item?.background || "#ffffff",
                borderRadius: s.item?.radius || "22px",
                border: `${s.item?.borderWidth || "1px"} ${s.item?.borderStyle || "solid"} ${s.item?.borderColor || "#e5e7eb"}`,
                boxShadow: s.item?.boxShadow || "0 14px 30px rgba(15, 23, 42, 0.06)",
              }}
            >
              {item.eyebrow && (
                <div
                  style={{
                    marginBottom: s.itemEyebrow?.marginBottom || "10px",
                    color: s.itemEyebrow?.color || "#2563eb",
                    fontSize: s.itemEyebrow?.fontSize || "11px",
                    fontWeight: s.itemEyebrow?.fontWeight || "700",
                    lineHeight: s.itemEyebrow?.lineHeight || "1.2",
                    letterSpacing: s.itemEyebrow?.letterSpacing || "0.18em",
                    textTransform: s.itemEyebrow?.textTransform || "uppercase",
                  }}
                >
                  {item.eyebrow}
                </div>
              )}

              <div
                style={{
                  marginBottom: s.itemTitle?.marginBottom || "10px",
                  color: s.itemTitle?.color || "#111827",
                  fontSize: s.itemTitle?.fontSize || "22px",
                  fontWeight: s.itemTitle?.fontWeight || "700",
                  lineHeight: s.itemTitle?.lineHeight || "1.25",
                  letterSpacing: s.itemTitle?.letterSpacing || "-0.02em",
                }}
              >
                {item.title || `Column ${index + 1}`}
              </div>

              <div
                style={{
                  color: s.itemContent?.color || "#6b7280",
                  fontSize: s.itemContent?.fontSize || "15px",
                  fontWeight: s.itemContent?.fontWeight || "400",
                  lineHeight: s.itemContent?.lineHeight || "1.75",
                  letterSpacing: s.itemContent?.letterSpacing || "0px",
                  whiteSpace: "pre-wrap",
                }}
              >
                {item.content || "Add structured supporting content for this inner section column."}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
