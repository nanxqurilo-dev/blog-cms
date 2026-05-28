"use client";

import type { ElementType } from "react";

export default function HeadingWidget({ widget }: any) {
  const g = widget.general || {};
  const s = widget.style || {};

  const Tag = (g.htmlTag || "h2") as ElementType;
  const alignment = s.alignment || "left";
  const highlightedText = g.highlightText || "";
  const fullText = g.text || "Your Section Heading";
  const highlightIndex = highlightedText ? fullText.indexOf(highlightedText) : -1;

  const beforeHighlight = highlightIndex >= 0 ? fullText.slice(0, highlightIndex) : fullText;
  const afterHighlight = highlightIndex >= 0 ? fullText.slice(highlightIndex + highlightedText.length) : "";

  return (
    <div style={{ width: "100%", textAlign: alignment }}>
      <div
        style={{
          width: s.width || "100%",
          maxWidth: s.maxWidth || "900px",
          minHeight: s.minHeight || undefined,
          margin: s.margin || "0px",
          padding: s.padding || "0px",
          background: s.background || "transparent",
          borderRadius: s.border?.radius || "0px",
          border: `${s.border?.width || "0px"} ${s.border?.style || "solid"} ${s.border?.color || "transparent"}`,
          boxShadow: s.boxShadow || "none",
          opacity: s.opacity ?? 1,
        }}
      >
        {g.eyebrow && (
          <div
            style={{
              marginBottom: s.eyebrow?.marginBottom || "14px",
              color: s.eyebrow?.color || "#2563eb",
              fontSize: s.eyebrow?.fontSize || "13px",
              fontWeight: s.eyebrow?.fontWeight || "700",
              lineHeight: s.eyebrow?.lineHeight || "1.2",
              letterSpacing: s.eyebrow?.letterSpacing || "0.18em",
              textTransform: s.eyebrow?.textTransform || "uppercase",
            }}
          >
            {g.eyebrow}
          </div>
        )}

        <Tag
          id={g.anchorId || undefined}
          style={{
            margin: 0,
            color: s.textColor || "#111827",
            fontSize: s.typography?.fontSize || "clamp(32px, 5vw, 56px)",
            fontWeight: s.typography?.fontWeight || "800",
            lineHeight: s.typography?.lineHeight || "1.05",
            letterSpacing: s.typography?.letterSpacing || "-0.03em",
            textTransform: s.typography?.textTransform || "none",
            textDecoration: s.typography?.textDecoration || "none",
            fontStyle: s.typography?.fontStyle || "normal",
            fontFamily: s.typography?.fontFamily || "inherit",
            textShadow: s.textShadow || "none",
          }}
        >
          {highlightIndex >= 0 ? (
            <>
              {beforeHighlight}
              <span
                style={{
                  color: s.highlight?.color || s.textColor || "#111827",
                  background: s.highlight?.background || "transparent",
                  padding: s.highlight?.padding || "0px",
                  borderRadius: s.highlight?.radius || "0px",
                  boxDecorationBreak: "clone",
                  WebkitBoxDecorationBreak: "clone",
                }}
              >
                {highlightedText}
              </span>
              {afterHighlight}
            </>
          ) : (
            fullText
          )}
        </Tag>

        {g.subtitle && (
          <p
            style={{
              margin: `${s.subtitle?.marginTop || "16px"} 0 0 0`,
              color: s.subtitle?.color || "#6b7280",
              fontSize: s.subtitle?.fontSize || "18px",
              fontWeight: s.subtitle?.fontWeight || "400",
              lineHeight: s.subtitle?.lineHeight || "1.7",
              letterSpacing: s.subtitle?.letterSpacing || "0px",
              maxWidth: s.subtitle?.maxWidth || "720px",
            }}
          >
            {g.subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
