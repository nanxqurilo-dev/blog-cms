"use client";

import { useMemo } from "react";
import { useEditor } from "../EditorProvider";

export default function HeroWidget({ widget }: any) {
  const { state } = useEditor();
  const isPreview = state.mode === "preview";

  const g = widget.general || {};
  const s = widget.style || {};

  const bgStyle =
    g.bgType === "image"
      ? {
          backgroundImage: `url(${g.bgImage})`,
          backgroundSize: s.bgSize || "cover",
          backgroundPosition: s.bgPosition || "center center",
          backgroundRepeat: s.bgRepeat || "no-repeat",
        }
      : g.bgType === "gradient"
      ? {
          background: g.bgGradient || "linear-gradient(135deg, #0f172a 0%, #1d4ed8 100%)",
        }
      : {
          background: g.bgColor || "#0f172a",
        };

  const buttonRel = useMemo(() => {
    const values = new Set<string>();

    if (g.btnTarget === "_blank") {
      values.add("noopener");
      values.add("noreferrer");
    }

    if (g.btnNoFollow) {
      values.add("nofollow");
    }

    return values.size ? Array.from(values).join(" ") : undefined;
  }, [g.btnNoFollow, g.btnTarget]);

  const justifyContent =
    g.verticalAlign === "top"
      ? "flex-start"
      : g.verticalAlign === "bottom"
      ? "flex-end"
      : "center";

  const contentMargin =
    g.align === "left" ? "0 auto 0 0" : g.align === "right" ? "0 0 0 auto" : "0 auto";

  return (
    <section
      style={{
        ...bgStyle,
        minHeight: s.minHeight || s.height || "72vh",
        height: s.height || "72vh",
        padding: s.padding || "96px 32px",
        position: "relative",
        display: "flex",
        alignItems: justifyContent,
        color: s.textColor || "#ffffff",
        textAlign: g.align || "center",
        borderRadius: s.borderRadius || "0px",
        overflow: "hidden",
        boxShadow: s.boxShadow || "none",
      }}
    >
      {s.overlayColor && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: s.overlayColor,
            opacity: s.overlayOpacity ?? 0.5,
            pointerEvents: "none",
          }}
        />
      )}

      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: s.maxWidth || "1200px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            maxWidth: s.contentWidth || "720px",
            margin: contentMargin,
          }}
        >
          <h3
            style={{
              fontSize: s.subtitle?.fontSize || "14px",
              fontWeight: s.subtitle?.fontWeight || "700",
              lineHeight: s.subtitle?.lineHeight || "1.2",
              letterSpacing: s.subtitle?.letterSpacing || "0.28em",
              textTransform: s.subtitle?.textTransform || "uppercase",
              margin: `0 0 ${s.subtitle?.marginBottom || "20px"} 0`,
              color: s.subtitle?.color || "rgba(255,255,255,0.75)",
            }}
          >
            {g.subtitle || "Hero subtitle goes here"}
          </h3>

          <h1
            style={{
              fontSize: s.title?.fontSize || "56px",
              fontWeight: s.title?.fontWeight || "800",
              lineHeight: s.title?.lineHeight || "1.05",
              letterSpacing: s.title?.letterSpacing || "-0.04em",
              margin: `0 0 ${s.title?.marginBottom || "18px"} 0`,
            }}
          >
            {g.title || "Hero Title"}
          </h1>

          <p
            style={{
              fontSize: s.text?.fontSize || "18px",
              fontWeight: s.text?.fontWeight || "400",
              lineHeight: s.text?.lineHeight || "1.8",
              margin: `0 0 ${s.text?.marginBottom || "30px"} 0`,
              color: s.text?.color || "rgba(255,255,255,0.9)",
            }}
          >
            {g.description || "This is hero description. Customize it from settings panel."}
          </p>

          {g.btnText && (
            <a
              href={isPreview ? g.btnLink || "#" : "#"}
              target={g.btnTarget || "_self"}
              rel={buttonRel}
              onClick={(event) => {
                if (!isPreview) event.preventDefault();
              }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: s.button?.padding || "14px 30px",
                background: s.button?.bg || "#ffffff",
                color: s.button?.color || "#0f172a",
                borderRadius: s.button?.radius || "999px",
                border: `${s.button?.borderWidth || "0px"} ${s.button?.borderStyle || "solid"} ${s.button?.borderColor || "transparent"}`,
                boxShadow: s.button?.boxShadow || "none",
                textDecoration: "none",
                fontWeight: "600",
              }}
            >
              {g.btnText}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
