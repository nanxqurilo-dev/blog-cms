"use client";

import { useMemo, useState } from "react";
import { Play } from "lucide-react";

function getEmbedUrl(url: string) {
  if (!url) return "";

  try {
    const parsed = new URL(url);

    if (parsed.hostname.includes("youtube.com")) {
      const videoId = parsed.searchParams.get("v");
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    }

    if (parsed.hostname.includes("youtu.be")) {
      const videoId = parsed.pathname.replace("/", "");
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    }

    if (parsed.hostname.includes("vimeo.com")) {
      const videoId = parsed.pathname.split("/").filter(Boolean)[0];
      return videoId ? `https://player.vimeo.com/video/${videoId}` : url;
    }

    return url;
  } catch {
    return url;
  }
}

export default function VideoWidget({ widget }: any) {
  const g = widget.general || {};
  const s = widget.style || {};
  const [isHovered, setIsHovered] = useState(false);

  const sourceType = g.sourceType || "hosted";
  const embedUrl = useMemo(() => getEmbedUrl(g.embedUrl || g.src || ""), [g.embedUrl, g.src]);
  const videoUrl = g.src || "";
  const showCaption = g.showCaption !== false && Boolean(g.caption);
  const showPlayIcon = g.showPlayIcon !== false;
  const wrapperRadius = s.border?.radius || "28px";
  const hoverScale = s.hover?.scale && isHovered ? `scale(${s.hover.scale})` : "scale(1)";
  const activeShadow = isHovered && s.hover?.boxShadow ? s.hover.boxShadow : s.boxShadow || "0 24px 60px rgba(15, 23, 42, 0.14)";

  return (
    <div style={{ textAlign: s.alignment || "left", width: "100%" }}>
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          width: s.width || "100%",
          maxWidth: s.maxWidth || "860px",
          minHeight: s.minHeight || undefined,
          margin: s.margin || "0px",
          padding: s.padding || "0px",
          background: s.background || "transparent",
          borderRadius: wrapperRadius,
          border: `${s.border?.width || "0px"} ${s.border?.style || "solid"} ${s.border?.color || "transparent"}`,
          boxShadow: activeShadow,
          overflow: "hidden",
          position: "relative",
          transition: `transform ${s.transitionDuration || "0.3s"} ease, box-shadow ${s.transitionDuration || "0.3s"} ease`,
          transform: hoverScale,
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
          {sourceType === "embed" ? (
            embedUrl ? (
              <iframe
                src={embedUrl}
                title={g.title || "Embedded video"}
                loading={g.loading || "lazy"}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  border: "0",
                  display: "block",
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
                Paste a YouTube, Vimeo, or embed URL to preview your video.
              </div>
            )
          ) : videoUrl ? (
            <video
              src={videoUrl}
              poster={g.poster || undefined}
              controls={g.controls !== false}
              autoPlay={Boolean(g.autoplay)}
              muted={g.muted !== false}
              loop={Boolean(g.loop)}
              playsInline={g.playsInline !== false}
              preload={g.preload || "metadata"}
              style={{
                width: "100%",
                height: "100%",
                display: "block",
                objectFit: s.objectFit || "cover",
                objectPosition: s.objectPosition || "center center",
                opacity: s.opacity ?? 1,
                filter: s.filter || "none",
                background: s.frameBackground || "#0f172a",
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
              Add an MP4 or WebM source to preview your hosted video.
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

          {showPlayIcon && (
            <div
              style={{
                position: "absolute",
                right: s.playIcon?.positionX || "20px",
                bottom: s.playIcon?.positionY || "20px",
                width: s.playIcon?.size || "56px",
                height: s.playIcon?.size || "56px",
                borderRadius: "999px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: s.playIcon?.background || "rgba(255, 255, 255, 0.16)",
                color: s.playIcon?.color || "#ffffff",
                backdropFilter: "blur(12px)",
                boxShadow: s.playIcon?.boxShadow || "0 12px 30px rgba(15, 23, 42, 0.24)",
                pointerEvents: "none",
              }}
            >
              <Play size={Number.parseInt(String(s.playIcon?.iconSize || 22), 10) || 22} fill="currentColor" />
            </div>
          )}
        </div>

        {showCaption && (
          <div
            style={{
              padding: s.caption?.padding || "14px 16px 0px",
              background: s.caption?.background || "transparent",
              color: s.caption?.color || "#6b7280",
              fontSize: s.caption?.fontSize || "14px",
              fontWeight: s.caption?.fontWeight || "400",
              lineHeight: s.caption?.lineHeight || "1.6",
              letterSpacing: s.caption?.letterSpacing || "0px",
              textAlign: s.caption?.align || "left",
            }}
          >
            {g.caption}
          </div>
        )}
      </div>
    </div>
  );
}
