"use client";

import { useMemo, useState } from "react";
import { useEditor } from "../EditorProvider";

export default function ImageWidget({ widget }: any) {
  const { state } = useEditor();
  const isPreview = state.mode === "preview";

  const g = widget.general || {};
  const s = widget.style || {};
  const [hover, setHover] = useState(false);

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

  const activeOpacity = hover ? s.hover?.opacity ?? s.opacity ?? 1 : s.opacity ?? 1;
  const activeShadow = hover ? s.hover?.boxShadow || s.boxShadow : s.boxShadow || "none";
  const activeFilter = hover ? s.hover?.filter || s.filter : s.filter || "none";
  const overlayOpacity = hover
    ? s.hover?.overlayOpacity ?? s.overlay?.opacity ?? 0
    : s.overlay?.opacity ?? 0;

  const image = (
    <div
      style={{
        position: "relative",
        display: "block",
        width: s.width || "100%",
        maxWidth: s.maxWidth || "100%",
        overflow: "hidden",
        borderRadius: s.border?.radius || "0px",
        background: s.background || "transparent",
        boxShadow: activeShadow,
      }}
    >
      <img
        src={g.src || "https://via.placeholder.com/1200x800?text=Image"}
        alt={g.alt || ""}
        loading={g.loading || "lazy"}
        style={{
          width: "100%",
          maxWidth: "100%",
          height: s.height || "auto",
          minHeight: s.minHeight || "auto",
          aspectRatio: s.aspectRatio || "auto",
          objectFit: s.objectFit || "cover",
          objectPosition: s.objectPosition || "center center",
          display: "block",
          opacity: activeOpacity,
          borderRadius: s.border?.radius || "0px",
          border: `${s.border?.width || "0px"} ${s.border?.style || "solid"} ${
            s.border?.color || "transparent"
          }`,
          transform: hover
            ? `scale(${s.hover?.scale || "1"}) rotate(${s.hover?.rotate || "0deg"})`
            : "scale(1) rotate(0deg)",
          filter: activeFilter,
          transition: `all ${s.transitionDuration || "0.3s"} ease`,
          background: s.background || "transparent",
        }}
      />

      {(s.overlay?.color || overlayOpacity > 0) && (
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background: s.overlay?.color || "rgba(15, 23, 42, 0.2)",
            opacity: overlayOpacity,
            borderRadius: s.border?.radius || "0px",
            transition: `all ${s.transitionDuration || "0.3s"} ease`,
          }}
        />
      )}
    </div>
  );

  const media = g.link ? (
    <a
      href={isPreview ? g.link : "#"}
      target={g.linkTarget || "_self"}
      rel={rel}
      aria-label={g.ariaLabel || g.alt || undefined}
      onClick={(event) => {
        if (!isPreview) {
          event.preventDefault();
        }
      }}
      style={{ display: "inline-block", width: s.width || "100%", maxWidth: s.maxWidth || "100%" }}
    >
      {image}
    </a>
  ) : (
    image
  );

  const caption = g.caption ? (
    <figcaption
      style={{
        marginTop: g.captionPosition === "above" ? "0px" : s.caption?.spacing || "12px",
        marginBottom: g.captionPosition === "above" ? s.caption?.spacing || "12px" : "0px",
        color: s.caption?.color || "#6b7280",
        background: s.caption?.background || "transparent",
        padding: s.caption?.padding || "0px",
        fontSize: s.caption?.fontSize || "14px",
        fontWeight: s.caption?.fontWeight || "400",
        lineHeight: s.caption?.lineHeight || "1.6",
        textAlign: s.caption?.align || s.alignment || "left",
      }}
    >
      {g.caption}
    </figcaption>
  ) : null;

  return (
    <figure
      style={{
        textAlign: s.alignment || "left",
        padding: s.padding || "0px",
        margin: s.margin || "0px",
        width: "100%",
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {g.captionPosition === "above" && caption}
      {media}
      {g.captionPosition !== "above" && g.captionPosition !== "hidden" && caption}
    </figure>
  );
}
