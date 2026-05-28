"use client";

export default function SeparatorWidget({ widget }: any) {
  const g = widget.general || {};
  const s = widget.style || {};
  const hasLabel = Boolean(g.label);

  const lineStyle = {
    flex: 1,
    minWidth: hasLabel ? "24px" : "0px",
    height: g.type === "solid" ? g.thickness || "2px" : "0px",
    background: g.type === "solid" ? s.color || "#d1d5db" : "transparent",
    borderTop:
      g.type !== "solid"
        ? `${g.thickness || "2px"} ${g.type || "solid"} ${s.color || "#d1d5db"}`
        : "none",
    borderRadius: s.radius || "0px",
    boxShadow: s.boxShadow || "none",
    opacity: s.opacity ?? 1,
  } as const;

  const label = hasLabel ? (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        color: s.label?.color || "#6b7280",
        background: s.label?.background || "#ffffff",
        fontSize: s.label?.fontSize || "12px",
        fontWeight: s.label?.fontWeight || "600",
        letterSpacing: s.label?.letterSpacing || "0.24em",
        textTransform: s.label?.textTransform || "uppercase",
        padding: s.label?.padding || "0px 12px",
        whiteSpace: "nowrap",
      }}
    >
      {g.label}
    </span>
  ) : null;

  return (
    <div
      style={{
        textAlign: s.alignment || "center",
        padding: s.padding || "14px 0px",
        margin: s.margin || "0px",
        opacity: s.opacity ?? 1,
        width: "100%",
      }}
    >
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: hasLabel ? "12px" : "0px",
          width: g.width || "100%",
          maxWidth: "100%",
        }}
      >
        {(g.labelPosition === "center" || !hasLabel) && (
          <>
            <span style={lineStyle} />
            {label}
            <span style={lineStyle} />
          </>
        )}

        {hasLabel && g.labelPosition === "left" && (
          <>
            {label}
            <span style={lineStyle} />
          </>
        )}

        {hasLabel && g.labelPosition === "right" && (
          <>
            <span style={lineStyle} />
            {label}
          </>
        )}
      </div>
    </div>
  );
}
