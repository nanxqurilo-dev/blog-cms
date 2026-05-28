"use client";

import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Download,
  ExternalLink,
  Mail,
  Plus,
  type LucideIcon,
} from "lucide-react";
import { useEditor } from "../EditorProvider";

const iconMap: Record<string, LucideIcon> = {
  "arrow-left": ArrowLeft,
  "arrow-right": ArrowRight,
  arrow: ArrowRight,
  check: Check,
  download: Download,
  external: ExternalLink,
  mail: Mail,
  plus: Plus,
};

const sizePresets: Record<
  string,
  { padding: string; fontSize: string; iconSize: number }
> = {
  xs: { padding: "10px 18px", fontSize: "13px", iconSize: 14 },
  sm: { padding: "12px 22px", fontSize: "14px", iconSize: 16 },
  md: { padding: "14px 28px", fontSize: "16px", iconSize: 18 },
  lg: { padding: "16px 34px", fontSize: "18px", iconSize: 20 },
  xl: { padding: "18px 40px", fontSize: "20px", iconSize: 22 },
};

export default function ButtonWidget({ widget }: any) {
  const { state } = useEditor();
  const [hover, setHover] = useState(false);

  const isPreview = state.mode === "preview";
  const g = widget.general || {};
  const s = widget.style || {};
  const preset = sizePresets[g.size || "md"] || sizePresets.md;

  const IconComponent = g.icon ? iconMap[g.icon] || null : null;
  const background = hover ? s.hover?.background || s.background : s.background;
  const textColor = hover ? s.hover?.textColor || s.textColor : s.textColor;
  const borderColor = hover
    ? s.hover?.borderColor || s.border?.color
    : s.border?.color;
  const boxShadow = hover ? s.hover?.boxShadow || s.boxShadow : s.boxShadow;
  const translateY = hover ? s.hover?.translateY || "0px" : "0px";

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

  return (
    <div style={{ textAlign: s.alignment || "left", width: "100%" }}>
      <a
        id={g.buttonId}
        href={g.link || "#"}
        target={g.linkTarget || "_self"}
        rel={rel}
        aria-label={g.ariaLabel || g.text || "Button"}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={(event) => {
          if (!isPreview) {
            event.preventDefault();
          }
        }}
        style={{
          display: "inline-flex",
          width: g.widthMode === "full" ? "100%" : s.width || "auto",
          minWidth: s.minWidth || "auto",
          justifyContent: "center",
          alignItems: "center",
          gap: g.iconSpacing ?? 8,
          background:
            background || "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
          color: textColor || "#ffffff",
          padding: s.padding || preset.padding,
          margin: s.margin || "0px",
          fontSize: s.typography?.fontSize || preset.fontSize,
          fontWeight: s.typography?.fontWeight || "600",
          fontFamily: s.typography?.fontFamily || "inherit",
          lineHeight: s.typography?.lineHeight || "1",
          letterSpacing: s.typography?.letterSpacing || "0px",
          textTransform: s.typography?.textTransform || "none",
          textShadow: s.textShadow || "none",
          borderRadius: s.border?.radius || "999px",
          border: `${s.border?.width || "1px"} ${s.border?.style || "solid"} ${
            borderColor || "#2563eb"
          }`,
          boxShadow: boxShadow || "0 10px 25px rgba(37, 99, 235, 0.22)",
          transform: `translateY(${translateY})`,
          transition: `all ${s.transitionDuration || "0.25s"} ease`,
          cursor: isPreview ? "pointer" : "default",
          textDecoration: "none",
          overflow: "hidden",
        }}
      >
        {IconComponent && g.iconPosition !== "right" && (
          <IconComponent size={g.iconSize || preset.iconSize} strokeWidth={2.2} />
        )}
        <span>{g.text || "Button"}</span>
        {IconComponent && g.iconPosition === "right" && (
          <IconComponent size={g.iconSize || preset.iconSize} strokeWidth={2.2} />
        )}
      </a>
    </div>
  );
}
