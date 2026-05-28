"use client";

import { useMemo, type ElementType } from "react";

const variantPresets: Record<string, { fontSize: string; lineHeight: string; fontWeight: string; color: string }> = {
  body: { fontSize: "17px", lineHeight: "1.85", fontWeight: "400", color: "#374151" },
  intro: { fontSize: "20px", lineHeight: "1.9", fontWeight: "400", color: "#1f2937" },
  compact: { fontSize: "15px", lineHeight: "1.7", fontWeight: "400", color: "#4b5563" },
  emphasis: { fontSize: "18px", lineHeight: "1.9", fontWeight: "500", color: "#111827" },
};

export default function ParagraphWidget({ widget }: any) {
  const g = widget.general || {};
  const s = widget.style || {};
  const preset = variantPresets[g.variant || "body"] || variantPresets.body;

  const rel = useMemo(() => {
    const values = new Set<string>();

    if (g.linkTarget === "_blank") {
      values.add("noopener");
      values.add("noreferrer");
    }

    if (g.noFollow) {
      values.add("nofollow");
    }

    return values.size ? Array.from(values).join(" ") : undefined;
  }, [g.linkTarget, g.noFollow]);

  const content = (
    <span>
      {g.text || "This is a paragraph. Edit me from settings panel."}
    </span>
  );

  const Tag = (g.htmlTag || "p") as ElementType;

  return (
    <Tag
      style={{
        textAlign: s.alignment || "left",
        color: s.textColor || preset.color,
        background: s.background || "transparent",
        fontSize: s.typography?.fontSize || preset.fontSize,
        fontWeight: s.typography?.fontWeight || preset.fontWeight,
        lineHeight: s.typography?.lineHeight || preset.lineHeight,
        letterSpacing: s.typography?.letterSpacing || "0px",
        textTransform: s.typography?.textTransform || "none",
        textDecoration: s.typography?.textDecoration || "none",
        fontStyle: s.typography?.fontStyle || "normal",
        fontFamily: s.typography?.fontFamily || "inherit",
        padding: s.padding || "0px",
        margin: s.margin || "0px",
        width: s.width || "100%",
        maxWidth: s.maxWidth || "none",
        minHeight: s.minHeight || "auto",
        opacity: s.opacity ?? 1,
        textShadow: s.textShadow || "none",
        boxShadow: s.boxShadow || "none",
        border: `${s.border?.width || "0px"} ${s.border?.style || "solid"} ${
          s.border?.color || "transparent"
        }`,
        borderRadius: s.border?.radius || "0px",
        transition: `all ${s.transitionDuration || "0.25s"} ease`,
        overflowWrap: "anywhere",
        whiteSpace: "pre-wrap",
      }}
    >
      {g.link ? (
        <a
          href={g.link}
          target={g.linkTarget || "_self"}
          rel={rel}
          aria-label={g.ariaLabel || undefined}
          style={{ color: "inherit", textDecoration: "inherit" }}
        >
          {content}
        </a>
      ) : (
        content
      )}
    </Tag>
  );
}
