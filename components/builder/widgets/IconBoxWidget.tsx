"use client";

import {
  ArrowRight,
  BadgeCheck,
  Globe,
  Lightbulb,
  Rocket,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const iconMap = {
  badge: BadgeCheck,
  sparkles: Sparkles,
  rocket: Rocket,
  shield: ShieldCheck,
  globe: Globe,
  bulb: Lightbulb,
};

export default function IconBoxWidget({ widget }: any) {
  const g = widget.general || {};
  const s = widget.style || {};
  const Icon = iconMap[(g.icon || "badge") as keyof typeof iconMap] || BadgeCheck;
  const alignment = s.alignment || "left";
  const layout = g.layout || "vertical";
  const cardLink = g.link || "";
  const rel = [g.linkTarget === "_blank" ? "noopener noreferrer" : "", g.noFollow ? "nofollow" : ""]
    .filter(Boolean)
    .join(" ") || undefined;

  const content = (
    <div
      style={{
        width: s.width || "100%",
        maxWidth: s.maxWidth || "420px",
        margin: s.margin || "0px",
        padding: s.padding || "28px",
        background: s.background || "#ffffff",
        borderRadius: s.border?.radius || "28px",
        border: `${s.border?.width || "1px"} ${s.border?.style || "solid"} ${s.border?.color || "#e5e7eb"}`,
        boxShadow: s.boxShadow || "0 24px 60px rgba(15, 23, 42, 0.12)",
        textAlign: alignment as "left" | "center" | "right",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: layout === "horizontal" ? "row" : "column",
          alignItems: layout === "horizontal" ? "flex-start" : alignment === "center" ? "center" : alignment === "right" ? "flex-end" : "flex-start",
          gap: s.gap || "18px",
        }}
      >
        {g.showIcon !== false && (
          <div
            style={{
              width: s.icon?.boxSize || "64px",
              height: s.icon?.boxSize || "64px",
              minWidth: s.icon?.boxSize || "64px",
              borderRadius: s.icon?.radius || "20px",
              background: s.icon?.background || "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)",
              color: s.icon?.color || "#1d4ed8",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: s.icon?.boxShadow || "inset 0 1px 0 rgba(255,255,255,0.3)",
            }}
          >
            <Icon size={Number(s.icon?.size || 26)} />
          </div>
        )}

        <div style={{ width: "100%" }}>
          {g.eyebrow && (
            <div
              style={{
                marginBottom: s.eyebrow?.marginBottom || "10px",
                color: s.eyebrow?.color || "#2563eb",
                fontSize: s.eyebrow?.fontSize || "12px",
                fontWeight: s.eyebrow?.fontWeight || "700",
                lineHeight: s.eyebrow?.lineHeight || "1.2",
                letterSpacing: s.eyebrow?.letterSpacing || "0.18em",
                textTransform: s.eyebrow?.textTransform || "uppercase",
              }}
            >
              {g.eyebrow}
            </div>
          )}

          <div
            style={{
              color: s.title?.color || "#111827",
              fontSize: s.title?.fontSize || "24px",
              fontWeight: s.title?.fontWeight || "700",
              lineHeight: s.title?.lineHeight || "1.2",
              letterSpacing: s.title?.letterSpacing || "-0.02em",
              marginBottom: s.title?.marginBottom || "12px",
            }}
          >
            {g.title || "Feature Title"}
          </div>

          <div
            style={{
              color: s.description?.color || "#6b7280",
              fontSize: s.description?.fontSize || "16px",
              fontWeight: s.description?.fontWeight || "400",
              lineHeight: s.description?.lineHeight || "1.7",
              letterSpacing: s.description?.letterSpacing || "0px",
            }}
          >
            {g.description || "Describe the value of this feature with a clean, editorial-style content block."}
          </div>

          {g.linkText && (
            <div
              style={{
                marginTop: s.link?.marginTop || "18px",
                display: "inline-flex",
                alignItems: "center",
                gap: s.link?.gap || "8px",
                color: s.link?.color || "#1d4ed8",
                fontSize: s.link?.fontSize || "15px",
                fontWeight: s.link?.fontWeight || "600",
                lineHeight: s.link?.lineHeight || "1.4",
              }}
            >
              <span>{g.linkText}</span>
              <ArrowRight size={Number(s.link?.iconSize || 16)} />
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (!cardLink) {
    return <div style={{ width: "100%" }}>{content}</div>;
  }

  return (
    <a
      href={cardLink}
      target={g.linkTarget || "_self"}
      rel={rel}
      aria-label={g.ariaLabel || g.title || "Icon box link"}
      style={{ display: "block", width: "100%", textDecoration: "none" }}
      onClick={(event) => {
        if (widget?.isEditing) {
          event.preventDefault();
        }
      }}
    >
      {content}
    </a>
  );
}
