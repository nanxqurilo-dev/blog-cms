"use client";

import { useMemo, type ElementType } from "react";

const variantPresets: Record<string, { fontSize: string; lineHeight: string; fontWeight: string }> = {
  default: { fontSize: "17px", lineHeight: "1.7", fontWeight: "400" },
  lead: { fontSize: "20px", lineHeight: "1.8", fontWeight: "400" },
  muted: { fontSize: "15px", lineHeight: "1.7", fontWeight: "400" },
  accent: { fontSize: "18px", lineHeight: "1.75", fontWeight: "500" },
};

export default function TextWidget({ widget }: any) {
  const g = widget.general || {};
  const s = widget.style || {};
  const preset = variantPresets[g.variant || "default"] || variantPresets.default;

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
      {g.text || "Write your text here"}
    </span>
  );

  const Tag = (g.htmlTag || "div") as ElementType;

  return (
    <Tag
      style={{
        textAlign: s.alignment || "left",
        color: s.textColor || "#111827",
        background: s.background || "transparent",
        padding: s.padding || "0px",
        margin: s.margin || "0px",
        width: s.width || "auto",
        maxWidth: s.maxWidth || "none",
        minHeight: s.minHeight || "auto",
        opacity: s.opacity ?? 1,
        border: `${s.border?.width || "0px"} ${s.border?.style || "solid"} ${
          s.border?.color || "transparent"
        }`,
        borderRadius: s.border?.radius || "0px",
        boxShadow: s.boxShadow || "none",
        textShadow: s.textShadow || "none",
        fontSize: s.typography?.fontSize || preset.fontSize,
        fontWeight: s.typography?.fontWeight || preset.fontWeight,
        lineHeight: s.typography?.lineHeight || preset.lineHeight,
        fontFamily: s.typography?.fontFamily || "inherit",
        letterSpacing: s.typography?.letterSpacing || "0px",
        textTransform: s.typography?.textTransform || "none",
        textDecoration: s.typography?.textDecoration || "none",
        fontStyle: s.typography?.fontStyle || "normal",
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
          style={{
            color: "inherit",
            textDecoration: "inherit",
          }}
        >
          {content}
        </a>
      ) : (
        content
      )}
    </Tag>
  );
}
