"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

function normalizeList(value: unknown) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(/\r?\n/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

export default function ImageCarouselWidget({ widget }: any) {
  const g = widget.general || {};
  const s = widget.style || {};
  const slides = useMemo(() => normalizeList(g.images), [g.images]);
  const captions = useMemo(() => normalizeList(g.captions), [g.captions]);
  const totalSlides = slides.length;
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const displayIndex = totalSlides === 0 ? 0 : Math.min(activeIndex, totalSlides - 1);

  useEffect(() => {
    if (!g.autoplay || totalSlides < 2) return;
    if (g.pauseOnHover !== false && isHovered) return;

    const delay = Number(g.autoplaySpeed) || 3500;
    const timer = window.setInterval(() => {
      setActiveIndex((current) => {
        if (current >= totalSlides - 1) {
          return g.loop === false ? current : 0;
        }
        return current + 1;
      });
    }, delay);

    return () => window.clearInterval(timer);
  }, [g.autoplay, g.autoplaySpeed, g.loop, g.pauseOnHover, isHovered, totalSlides]);

  const goToSlide = (nextIndex: number) => {
    if (!totalSlides) return;

    if (nextIndex < 0) {
      setActiveIndex(g.loop === false ? 0 : totalSlides - 1);
      return;
    }

    if (nextIndex >= totalSlides) {
      setActiveIndex(g.loop === false ? totalSlides - 1 : 0);
      return;
    }

    setActiveIndex(nextIndex);
  };

  const currentImage = slides[displayIndex] || "";
  const activeCaption = captions[displayIndex] || "";
  const showCaption = g.showCaption !== false && Boolean(activeCaption);

  return (
    <div style={{ width: "100%", textAlign: s.alignment || "left" }}>
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          width: s.width || "100%",
          maxWidth: s.maxWidth || "960px",
          margin: s.margin || "0px",
          padding: s.padding || "0px",
          background: s.background || "transparent",
          borderRadius: s.border?.radius || "28px",
          border: `${s.border?.width || "0px"} ${s.border?.style || "solid"} ${s.border?.color || "transparent"}`,
          boxShadow: s.boxShadow || "0 24px 70px rgba(15, 23, 42, 0.16)",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "relative",
            aspectRatio: s.aspectRatio || "16 / 9",
            minHeight: s.minHeight || undefined,
            background: s.frameBackground || "#0f172a",
          }}
        >
          {currentImage ? (
            <img
              src={currentImage}
              alt={`${g.altPrefix || "Carousel image"} ${displayIndex + 1}`}
              style={{
                width: "100%",
                height: "100%",
                display: "block",
                objectFit: s.objectFit || "cover",
                objectPosition: s.objectPosition || "center center",
                transition: `opacity ${s.transitionDuration || "0.45s"} ease`,
              }}
            />
          ) : (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "24px",
                color: s.placeholder?.color || "#cbd5e1",
                textAlign: "center",
                background: s.placeholder?.background || "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
              }}
            >
              Add one or more image URLs to preview your carousel.
            </div>
          )}

          <div
            style={{
              position: "absolute",
              inset: 0,
              background: s.overlay?.color || "rgba(15, 23, 42, 0)",
              opacity: s.overlay?.opacity ?? 0,
              pointerEvents: "none",
            }}
          />

          {g.showArrows !== false && totalSlides > 1 && (
            <>
              <button
                type="button"
                onClick={() => goToSlide(activeIndex - 1)}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: s.arrows?.offset || "18px",
                  transform: "translateY(-50%)",
                  width: s.arrows?.size || "46px",
                  height: s.arrows?.size || "46px",
                  borderRadius: "999px",
                  border: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: s.arrows?.background || "rgba(255, 255, 255, 0.16)",
                  color: s.arrows?.color || "#ffffff",
                  boxShadow: s.arrows?.boxShadow || "0 12px 28px rgba(15, 23, 42, 0.24)",
                  backdropFilter: "blur(12px)",
                  cursor: "pointer",
                }}
              >
                <ChevronLeft size={Number.parseInt(String(s.arrows?.iconSize || 20), 10) || 20} />
              </button>
              <button
                type="button"
                onClick={() => goToSlide(activeIndex + 1)}
                style={{
                  position: "absolute",
                  top: "50%",
                  right: s.arrows?.offset || "18px",
                  transform: "translateY(-50%)",
                  width: s.arrows?.size || "46px",
                  height: s.arrows?.size || "46px",
                  borderRadius: "999px",
                  border: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: s.arrows?.background || "rgba(255, 255, 255, 0.16)",
                  color: s.arrows?.color || "#ffffff",
                  boxShadow: s.arrows?.boxShadow || "0 12px 28px rgba(15, 23, 42, 0.24)",
                  backdropFilter: "blur(12px)",
                  cursor: "pointer",
                }}
              >
                <ChevronRight size={Number.parseInt(String(s.arrows?.iconSize || 20), 10) || 20} />
              </button>
            </>
          )}

          {g.showCounter !== false && totalSlides > 0 && (
            <div
              style={{
                position: "absolute",
                top: s.counter?.top || "18px",
                right: s.counter?.right || "18px",
                padding: s.counter?.padding || "8px 12px",
                borderRadius: s.counter?.radius || "999px",
                background: s.counter?.background || "rgba(15, 23, 42, 0.58)",
                color: s.counter?.color || "#ffffff",
                fontSize: s.counter?.fontSize || "12px",
                fontWeight: s.counter?.fontWeight || "600",
                letterSpacing: s.counter?.letterSpacing || "0.04em",
              }}
            >
              {`${displayIndex + 1} / ${totalSlides}`}
            </div>
          )}

          {g.showDots !== false && totalSlides > 1 && (
            <div
              style={{
                position: "absolute",
                left: "50%",
                bottom: s.dots?.bottom || "18px",
                transform: "translateX(-50%)",
                display: "flex",
                gap: s.dots?.gap || "8px",
                zIndex: 2,
              }}
            >
              {slides.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => goToSlide(index)}
                  style={{
                    width: s.dots?.size || "10px",
                    height: s.dots?.size || "10px",
                    borderRadius: "999px",
                    border: "none",
                    padding: 0,
                    background: index === displayIndex ? s.dots?.activeColor || "#ffffff" : s.dots?.color || "rgba(255, 255, 255, 0.45)",
                    cursor: "pointer",
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {showCaption && (
          <div
            style={{
              padding: s.caption?.padding || "16px 18px",
              background: s.caption?.background || "#ffffff",
              color: s.caption?.color || "#475569",
              fontSize: s.caption?.fontSize || "14px",
              fontWeight: s.caption?.fontWeight || "400",
              lineHeight: s.caption?.lineHeight || "1.7",
              letterSpacing: s.caption?.letterSpacing || "0px",
              textAlign: s.caption?.align || "left",
            }}
          >
            {activeCaption}
          </div>
        )}
      </div>
    </div>
  );
}
