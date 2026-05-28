"use client";

import { useMemo } from "react";
import { Star } from "lucide-react";

export default function TestimonialWidget({ widget }: any) {
  const g = widget.general || {};
  const s = widget.style || {};
  const rating = Math.max(0, Math.min(5, Number(g.rating ?? 5)));

  const initials = useMemo(() => {
    const value = (g.name || "Client").trim();
    if (!value) return "C";
    return value
      .split(/\s+/)
      .slice(0, 2)
      .map((part: string) => part.charAt(0).toUpperCase())
      .join("");
  }, [g.name]);

  return (
    <div style={{ textAlign: s.alignment || "left", width: "100%" }}>
      <article
        style={{
          maxWidth: s.maxWidth || "640px",
          width: s.width || "100%",
          margin: s.margin || "0px",
          padding: s.padding || "28px",
          background: s.background || "#ffffff",
          color: s.textColor || "#111827",
          borderRadius: s.border?.radius || "28px",
          border: `${s.border?.width || "1px"} ${s.border?.style || "solid"} ${
            s.border?.color || "#e5e7eb"
          }`,
          boxShadow: s.boxShadow || "0 24px 60px rgba(15, 23, 42, 0.12)",
        }}
      >
        {g.showRating !== false && (
          <div
            style={{
              display: "flex",
              justifyContent:
                s.alignment === "center" ? "center" : s.alignment === "right" ? "flex-end" : "flex-start",
              gap: "6px",
              marginBottom: s.rating?.marginBottom || "18px",
            }}
          >
            {Array.from({ length: 5 }).map((_, index) => (
              <Star
                key={index}
                size={s.rating?.size || 16}
                fill={index < rating ? s.rating?.color || "#f59e0b" : "transparent"}
                color={s.rating?.color || "#f59e0b"}
                strokeWidth={1.8}
              />
            ))}
          </div>
        )}

        <p
          style={{
            margin: `0 0 ${s.quote?.marginBottom || "22px"} 0`,
            fontSize: s.quote?.fontSize || "20px",
            fontWeight: s.quote?.fontWeight || "500",
            lineHeight: s.quote?.lineHeight || "1.8",
            letterSpacing: s.quote?.letterSpacing || "0px",
            fontStyle: s.quote?.fontStyle || "normal",
            color: s.quote?.color || s.textColor || "#111827",
            whiteSpace: "pre-wrap",
          }}
        >
          {g.quote || "Share a standout client quote that adds proof and personality to your post."}
        </p>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent:
              s.alignment === "center" ? "center" : s.alignment === "right" ? "flex-end" : "flex-start",
            gap: s.author?.gap || "14px",
          }}
        >
          {g.showAvatar !== false && (
            g.avatar ? (
              <img
                src={g.avatar}
                alt={g.name || "Testimonial author"}
                style={{
                  width: s.author?.avatarSize || "56px",
                  height: s.author?.avatarSize || "56px",
                  borderRadius: s.author?.avatarRadius || "999px",
                  objectFit: "cover",
                  flexShrink: 0,
                }}
              />
            ) : (
              <div
                style={{
                  width: s.author?.avatarSize || "56px",
                  height: s.author?.avatarSize || "56px",
                  borderRadius: s.author?.avatarRadius || "999px",
                  background: s.author?.avatarBg || "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)",
                  color: s.author?.avatarColor || "#1d4ed8",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: s.author?.avatarTextSize || "18px",
                  fontWeight: "700",
                  flexShrink: 0,
                }}
              >
                {initials}
              </div>
            )
          )}

          <div>
            <div
              style={{
                fontSize: s.author?.nameSize || "16px",
                fontWeight: s.author?.nameWeight || "700",
                lineHeight: s.author?.nameLineHeight || "1.3",
                color: s.author?.nameColor || s.textColor || "#111827",
              }}
            >
              {g.name || "Client Name"}
            </div>
            <div
              style={{
                marginTop: s.author?.metaSpacing || "4px",
                fontSize: s.author?.metaSize || "14px",
                fontWeight: s.author?.metaWeight || "500",
                lineHeight: s.author?.metaLineHeight || "1.5",
                color: s.author?.metaColor || "#6b7280",
              }}
            >
              {[g.role, g.company].filter(Boolean).join(" at ") || "Happy customer"}
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
