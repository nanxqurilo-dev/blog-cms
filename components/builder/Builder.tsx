"use client";

import { useEffect, useRef, useState } from "react";
import WidgetList from "./WidgetList";
import Canvas from "./Canvas";
import SettingsPanel from "./SettingsPanel";
import EditorToolbar from "./EditorToolbar";
import { EditorProvider, useEditor, type WidgetData } from "./EditorProvider";
import { useRouter } from "next/navigation";


import {
  DndContext,
  closestCenter,
  type DragEndEvent,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

const BUILDER_TEMPLATE_API =
  `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/builder/template`;

function createWidget(type: string) {
  const id = crypto.randomUUID();

  if (type === "button") {
    return {
      id,
      type,
      general: {
        text: "Read More",
        link: "#",
        linkTarget: "_self",
        buttonId: "",
        ariaLabel: "",
        noFollow: false,
        icon: "arrow-right",
        iconPosition: "right",
        iconSpacing: 8,
        iconSize: 18,
        size: "md",
        widthMode: "auto",
      },
      style: {
        alignment: "left",
        width: "",
        minWidth: "",
        padding: "14px 28px",
        margin: "0px",
        background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
        textColor: "#ffffff",
        textShadow: "none",
        boxShadow: "0 10px 25px rgba(37, 99, 235, 0.22)",
        transitionDuration: "0.25s",
        typography: {
          fontSize: "16px",
          fontWeight: "600",
          lineHeight: "1",
          letterSpacing: "0px",
          textTransform: "none",
          fontFamily: "inherit",
        },
        border: {
          width: "1px",
          style: "solid",
          color: "#2563eb",
          radius: "999px",
        },
        hover: {
          background: "linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)",
          textColor: "#ffffff",
          borderColor: "#1d4ed8",
          boxShadow: "0 16px 35px rgba(29, 78, 216, 0.28)",
          translateY: "-2px",
        },
      },
    };
  }

  if (type === "text") {
    return {
      id,
      type,
      general: {
        text: "Start writing your story with rich text styling.",
        htmlTag: "div",
        variant: "default",
        link: "",
        linkTarget: "_self",
        ariaLabel: "",
        noFollow: false,
      },
      style: {
        alignment: "left",
        width: "",
        maxWidth: "",
        minHeight: "",
        padding: "0px",
        margin: "0px",
        background: "transparent",
        textColor: "#111827",
        opacity: 1,
        textShadow: "none",
        boxShadow: "none",
        transitionDuration: "0.25s",
        typography: {
          fontSize: "17px",
          fontWeight: "400",
          lineHeight: "1.7",
          letterSpacing: "0px",
          textTransform: "none",
          textDecoration: "none",
          fontStyle: "normal",
          fontFamily: "inherit",
        },
        border: {
          width: "0px",
          style: "solid",
          color: "#e5e7eb",
          radius: "0px",
        },
      },
    };
  }

  if (type === "image") {
    return {
      id,
      type,
      general: {
        src: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
        alt: "Workspace setup",
        caption: "Showcase your visuals with polished image controls.",
        link: "",
        linkTarget: "_self",
        ariaLabel: "",
        noFollow: false,
        loading: "lazy",
        captionPosition: "below",
      },
      style: {
        alignment: "left",
        width: "100%",
        maxWidth: "720px",
        height: "auto",
        minHeight: "",
        aspectRatio: "16 / 9",
        objectFit: "cover",
        objectPosition: "center center",
        padding: "0px",
        margin: "0px",
        background: "transparent",
        opacity: 1,
        filter: "none",
        boxShadow: "0 18px 40px rgba(15, 23, 42, 0.14)",
        transitionDuration: "0.3s",
        border: {
          width: "0px",
          style: "solid",
          color: "#e5e7eb",
          radius: "24px",
        },
        overlay: {
          color: "rgba(15, 23, 42, 0)",
          opacity: 0,
        },
        caption: {
          color: "#6b7280",
          fontSize: "14px",
          fontWeight: "400",
          lineHeight: "1.6",
          align: "left",
          spacing: "12px",
          background: "transparent",
          padding: "0px",
        },
        hover: {
          opacity: 1,
          scale: "1.02",
          rotate: "0deg",
          filter: "none",
          overlayOpacity: 0,
          boxShadow: "0 24px 50px rgba(15, 23, 42, 0.18)",
        },
      },
    };
  }

  if (type === "paragraph") {
    return {
      id,
      type,
      general: {
        text: "Craft polished long-form content with comfortable reading rhythm and clear visual hierarchy.",
        htmlTag: "p",
        variant: "body",
        link: "",
        linkTarget: "_self",
        ariaLabel: "",
        noFollow: false,
      },
      style: {
        alignment: "left",
        width: "100%",
        maxWidth: "760px",
        minHeight: "",
        padding: "0px",
        margin: "0px 0px 18px 0px",
        background: "transparent",
        textColor: "#374151",
        opacity: 1,
        textShadow: "none",
        boxShadow: "none",
        transitionDuration: "0.25s",
        typography: {
          fontSize: "17px",
          fontWeight: "400",
          lineHeight: "1.85",
          letterSpacing: "0px",
          textTransform: "none",
          textDecoration: "none",
          fontStyle: "normal",
          fontFamily: "inherit",
        },
        border: {
          width: "0px",
          style: "solid",
          color: "#e5e7eb",
          radius: "0px",
        },
      },
    };
  }

  if (type === "separator") {
    return {
      id,
      type,
      general: {
        type: "solid",
        thickness: "2px",
        width: "100%",
        label: "",
        labelPosition: "center",
      },
      style: {
        alignment: "center",
        color: "#d1d5db",
        opacity: 1,
        radius: "999px",
        padding: "14px 0px",
        margin: "0px",
        boxShadow: "none",
        label: {
          color: "#6b7280",
          background: "#ffffff",
          fontSize: "12px",
          fontWeight: "600",
          letterSpacing: "0.24em",
          textTransform: "uppercase",
          padding: "0px 12px",
        },
      },
    };
  }

  if (type === "hero") {
    return {
      id,
      type,
      general: {
        title: "Build standout stories with a hero section that feels intentional.",
        subtitle: "Elementor-style hero block",
        description: "Mix striking backgrounds, clear hierarchy, and focused calls to action to open every post with confidence.",
        bgType: "gradient",
        bgColor: "#0f172a",
        bgImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=80",
        bgGradient: "linear-gradient(135deg, #0f172a 0%, #1d4ed8 55%, #38bdf8 100%)",
        btnText: "Explore Story",
        btnLink: "#",
        btnTarget: "_self",
        btnNoFollow: false,
        align: "center",
        verticalAlign: "center",
      },
      style: {
        height: "72vh",
        minHeight: "560px",
        maxWidth: "1200px",
        contentWidth: "720px",
        padding: "96px 32px",
        borderRadius: "32px",
        textColor: "#ffffff",
        bgSize: "cover",
        bgPosition: "center center",
        bgRepeat: "no-repeat",
        boxShadow: "0 28px 70px rgba(15, 23, 42, 0.28)",
        overlayColor: "#020617",
        overlayOpacity: 0.42,
        title: {
          fontSize: "clamp(42px, 7vw, 72px)",
          fontWeight: "800",
          lineHeight: "1.02",
          letterSpacing: "-0.04em",
          marginBottom: "18px",
        },
        subtitle: {
          fontSize: "14px",
          fontWeight: "700",
          lineHeight: "1.2",
          letterSpacing: "0.28em",
          textTransform: "uppercase",
          marginBottom: "20px",
          color: "rgba(255,255,255,0.75)",
        },
        text: {
          fontSize: "18px",
          fontWeight: "400",
          lineHeight: "1.8",
          marginBottom: "30px",
          color: "rgba(255,255,255,0.9)",
        },
        button: {
          padding: "14px 30px",
          bg: "#ffffff",
          color: "#0f172a",
          radius: "999px",
          borderWidth: "0px",
          borderStyle: "solid",
          borderColor: "transparent",
          boxShadow: "0 18px 35px rgba(15, 23, 42, 0.2)",
        },
      },
    };
  }

  if (type === "heading") {
    return {
      id,
      type,
      general: {
        text: "Build more polished blog sections with clear, editorial-style headings.",
        highlightText: "editorial-style",
        subtitle: "Use strong hierarchy, optional eyebrow text, and highlighted phrases to guide readers through your post.",
        eyebrow: "Section Intro",
        htmlTag: "h2",
        anchorId: "",
      },
      style: {
        alignment: "left",
        width: "100%",
        maxWidth: "900px",
        minHeight: "",
        padding: "0px",
        margin: "0px 0px 28px 0px",
        background: "transparent",
        textColor: "#111827",
        opacity: 1,
        textShadow: "none",
        boxShadow: "none",
        typography: {
          fontSize: "clamp(32px, 5vw, 56px)",
          fontWeight: "800",
          lineHeight: "1.05",
          letterSpacing: "-0.03em",
          textTransform: "none",
          textDecoration: "none",
          fontStyle: "normal",
          fontFamily: "inherit",
        },
        border: {
          width: "0px",
          style: "solid",
          color: "#e5e7eb",
          radius: "0px",
        },
        highlight: {
          color: "#1d4ed8",
          background: "transparent",
          padding: "0px",
          radius: "0px",
        },
        eyebrow: {
          color: "#2563eb",
          fontSize: "13px",
          fontWeight: "700",
          lineHeight: "1.2",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          marginBottom: "14px",
        },
        subtitle: {
          color: "#6b7280",
          fontSize: "18px",
          fontWeight: "400",
          lineHeight: "1.7",
          letterSpacing: "0px",
          marginTop: "16px",
          maxWidth: "720px",
        },
      },
    };
  }

  if (type === "image-carousel") {
    return {
      id,
      type,
      general: {
        images: [
          "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1400&q=80",
          "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1400&q=80",
          "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1400&q=80",
        ],
        captions: [
          "Use carousel slides to create editorial product stories and visual sequences.",
          "Blend landscape visuals, campaign frames, or article media inside one polished block.",
          "Give readers a smoother visual experience without breaking the flow of the post.",
        ],
        altPrefix: "Carousel image",
        autoplay: true,
        autoplaySpeed: 3500,
        loop: true,
        pauseOnHover: true,
        showArrows: true,
        showDots: true,
        showCounter: true,
        showCaption: true,
      },
      style: {
        alignment: "left",
        width: "100%",
        maxWidth: "960px",
        minHeight: "",
        padding: "0px",
        margin: "0px",
        background: "transparent",
        frameBackground: "#0f172a",
        objectFit: "cover",
        objectPosition: "center center",
        aspectRatio: "16 / 9",
        transitionDuration: "0.45s",
        boxShadow: "0 24px 70px rgba(15, 23, 42, 0.16)",
        border: {
          width: "0px",
          style: "solid",
          color: "#e5e7eb",
          radius: "28px",
        },
        overlay: {
          color: "rgba(15, 23, 42, 0.12)",
          opacity: 0,
        },
        caption: {
          color: "#475569",
          fontSize: "14px",
          fontWeight: "400",
          lineHeight: "1.7",
          letterSpacing: "0px",
          align: "left",
          background: "#ffffff",
          padding: "16px 18px",
        },
        arrows: {
          size: "46px",
          iconSize: "20",
          offset: "18px",
          background: "rgba(255, 255, 255, 0.16)",
          color: "#ffffff",
          boxShadow: "0 12px 28px rgba(15, 23, 42, 0.24)",
        },
        dots: {
          size: "10px",
          gap: "8px",
          color: "rgba(255, 255, 255, 0.45)",
          activeColor: "#ffffff",
          bottom: "18px",
        },
        counter: {
          top: "18px",
          right: "18px",
          padding: "8px 12px",
          radius: "999px",
          background: "rgba(15, 23, 42, 0.58)",
          color: "#ffffff",
          fontSize: "12px",
          fontWeight: "600",
          letterSpacing: "0.04em",
        },
        placeholder: {
          color: "#cbd5e1",
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        },
      },
    };
  }

  if (type === "icon-box") {
    return {
      id,
      type,
      general: {
        eyebrow: "Feature Block",
        title: "Turn key ideas into polished visual sections.",
        description: "Use icon boxes to highlight benefits, content pillars, service points, or product advantages with stronger structure and hierarchy.",
        icon: "badge",
        showIcon: true,
        layout: "vertical",
        link: "",
        linkText: "Learn more",
        linkTarget: "_self",
        ariaLabel: "",
        noFollow: false,
      },
      style: {
        alignment: "left",
        width: "100%",
        maxWidth: "420px",
        gap: "18px",
        margin: "0px",
        padding: "28px",
        background: "#ffffff",
        boxShadow: "0 24px 60px rgba(15, 23, 42, 0.12)",
        border: {
          width: "1px",
          style: "solid",
          color: "#e5e7eb",
          radius: "28px",
        },
        icon: {
          size: 26,
          boxSize: "64px",
          radius: "20px",
          color: "#1d4ed8",
          background: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.3)",
        },
        eyebrow: {
          color: "#2563eb",
          fontSize: "12px",
          fontWeight: "700",
          lineHeight: "1.2",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          marginBottom: "10px",
        },
        title: {
          color: "#111827",
          fontSize: "24px",
          fontWeight: "700",
          lineHeight: "1.2",
          letterSpacing: "-0.02em",
          marginBottom: "12px",
        },
        description: {
          color: "#6b7280",
          fontSize: "16px",
          fontWeight: "400",
          lineHeight: "1.7",
          letterSpacing: "0px",
        },
        link: {
          color: "#1d4ed8",
          fontSize: "15px",
          fontWeight: "600",
          lineHeight: "1.4",
          marginTop: "18px",
          gap: "8px",
          iconSize: 16,
        },
      },
    };
  }

  if (type === "accordion") {
    return {
      id,
      type,
      general: {
        itemsTitle: [
          "What makes this builder feel more Elementor-like?",
          "Can I use accordion sections inside blog posts?",
          "Does it support richer styling controls?",
        ],
        itemsContent: [
          "Each widget now starts with stronger defaults, richer style controls, and more flexible content editing directly from the sidebar.",
          "Yes. Accordion blocks work well for FAQs, content breakdowns, product details, and expandable reading sections inside long-form posts.",
          "You can control spacing, border radius, colors, shadows, icon styling, title styling, and body typography so the section fits your layout.",
        ],
        firstOpen: true,
        allowMultiple: false,
        iconPosition: "right",
      },
      style: {
        alignment: "left",
        width: "100%",
        maxWidth: "860px",
        margin: "0px",
        padding: "0px",
        background: "transparent",
        transitionDuration: "0.25s",
        item: {
          background: "#ffffff",
          borderWidth: "1px",
          borderStyle: "solid",
          borderColor: "#e5e7eb",
          radius: "22px",
          spacing: "14px",
          boxShadow: "0 18px 45px rgba(15, 23, 42, 0.08)",
        },
        header: {
          color: "#111827",
          fontSize: "18px",
          fontWeight: "700",
          lineHeight: "1.4",
          letterSpacing: "-0.01em",
          padding: "22px 24px",
          gap: "16px",
        },
        content: {
          color: "#6b7280",
          fontSize: "16px",
          fontWeight: "400",
          lineHeight: "1.75",
          letterSpacing: "0px",
          padding: "0px 24px 22px",
        },
        icon: {
          size: 18,
          boxSize: "36px",
          radius: "999px",
          color: "#2563eb",
          background: "rgba(37, 99, 235, 0.08)",
        },
      },
    };
  }

  if (type === "inner-section") {
    return {
      id,
      type,
      general: {
        eyebrow: "Inner Section",
        title: "Create structured multi-column sections inside long-form posts.",
        description:
          "Use inner sections to break content into polished feature rows, comparison blocks, or supporting content clusters with clearer layout control.",
        showIntro: true,
        layoutPreset: "2-col",
        verticalAlign: "top",
        itemEyebrows: ["Column One", "Column Two"],
        itemTitles: [
          "Highlight related ideas side by side.",
          "Keep visual structure clean and readable.",
        ],
        itemContents: [
          "Inner sections help you present supporting information, content pillars, or feature summaries in a more modular way.",
          "With independent card styling, spacing, and layout presets, this block can carry a professional editorial feel across the page.",
        ],
      },
      style: {
        alignment: "left",
        width: "100%",
        maxWidth: "1100px",
        minHeight: "",
        margin: "0px",
        padding: "36px",
        background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
        boxShadow: "0 24px 60px rgba(15, 23, 42, 0.08)",
        border: {
          width: "1px",
          style: "solid",
          color: "#e5e7eb",
          radius: "28px",
        },
        intro: {
          maxWidth: "720px",
          marginBottom: "28px",
        },
        eyebrow: {
          color: "#2563eb",
          fontSize: "12px",
          fontWeight: "700",
          lineHeight: "1.2",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          marginBottom: "12px",
        },
        title: {
          color: "#111827",
          fontSize: "clamp(28px, 4vw, 44px)",
          fontWeight: "800",
          lineHeight: "1.08",
          letterSpacing: "-0.03em",
          marginBottom: "14px",
        },
        description: {
          color: "#6b7280",
          fontSize: "17px",
          fontWeight: "400",
          lineHeight: "1.8",
          letterSpacing: "0px",
        },
        grid: {
          gap: "20px",
        },
        item: {
          minHeight: "",
          padding: "24px",
          background: "#ffffff",
          borderWidth: "1px",
          borderStyle: "solid",
          borderColor: "#e5e7eb",
          radius: "22px",
          boxShadow: "0 14px 30px rgba(15, 23, 42, 0.06)",
        },
        itemEyebrow: {
          color: "#2563eb",
          fontSize: "11px",
          fontWeight: "700",
          lineHeight: "1.2",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          marginBottom: "10px",
        },
        itemTitle: {
          color: "#111827",
          fontSize: "22px",
          fontWeight: "700",
          lineHeight: "1.25",
          letterSpacing: "-0.02em",
          marginBottom: "10px",
        },
        itemContent: {
          color: "#6b7280",
          fontSize: "15px",
          fontWeight: "400",
          lineHeight: "1.75",
          letterSpacing: "0px",
        },
      },
    };
  }

  if (type === "video") {
    return {
      id,
      type,
      general: {
        sourceType: "embed",
        src: "",
        embedUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        title: "Product walkthrough",
        poster: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=80",
        caption: "Use a polished video block to add interviews, demos, or story-driven media inside your post.",
        showCaption: true,
        controls: true,
        autoplay: false,
        muted: true,
        loop: false,
        playsInline: true,
        preload: "metadata",
        loading: "lazy",
        showPlayIcon: true,
      },
      style: {
        alignment: "left",
        width: "100%",
        maxWidth: "860px",
        minHeight: "",
        padding: "0px",
        margin: "0px",
        background: "transparent",
        frameBackground: "#0f172a",
        opacity: 1,
        filter: "none",
        objectFit: "cover",
        objectPosition: "center center",
        aspectRatio: "16 / 9",
        boxShadow: "0 24px 60px rgba(15, 23, 42, 0.14)",
        transitionDuration: "0.3s",
        border: {
          width: "0px",
          style: "solid",
          color: "#e5e7eb",
          radius: "28px",
        },
        overlay: {
          color: "rgba(15, 23, 42, 0.15)",
          opacity: 0,
        },
        playIcon: {
          size: "56px",
          iconSize: "22",
          positionX: "20px",
          positionY: "20px",
          background: "rgba(255, 255, 255, 0.16)",
          color: "#ffffff",
          boxShadow: "0 12px 30px rgba(15, 23, 42, 0.24)",
        },
        caption: {
          color: "#6b7280",
          fontSize: "14px",
          fontWeight: "400",
          lineHeight: "1.6",
          letterSpacing: "0px",
          align: "left",
          background: "transparent",
          padding: "14px 16px 0px",
        },
        placeholder: {
          color: "#cbd5e1",
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        },
        hover: {
          scale: "1",
          boxShadow: "0 28px 70px rgba(15, 23, 42, 0.18)",
        },
      },
    };
  }

  if (type === "testimonial") {
    return {
      id,
      type,
      general: {
        quote: "This builder now feels far more intentional. We can launch polished pages much faster without fighting the layout.",
        name: "Aarav Mehta",
        role: "Product Lead",
        company: "Northstar Studio",
        avatar: "",
        showAvatar: true,
        rating: 5,
        showRating: true,
      },
      style: {
        alignment: "left",
        width: "100%",
        maxWidth: "640px",
        margin: "0px",
        padding: "28px",
        background: "#ffffff",
        textColor: "#111827",
        boxShadow: "0 24px 60px rgba(15, 23, 42, 0.12)",
        border: {
          width: "1px",
          style: "solid",
          color: "#e5e7eb",
          radius: "28px",
        },
        quote: {
          color: "#111827",
          fontSize: "20px",
          fontWeight: "500",
          lineHeight: "1.8",
          letterSpacing: "0px",
          fontStyle: "normal",
          marginBottom: "22px",
        },
        rating: {
          color: "#f59e0b",
          size: 16,
          marginBottom: "18px",
        },
        author: {
          gap: "14px",
          avatarSize: "56px",
          avatarRadius: "999px",
          avatarBg: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)",
          avatarColor: "#1d4ed8",
          avatarTextSize: "18px",
          nameColor: "#111827",
          nameSize: "16px",
          nameWeight: "700",
          nameLineHeight: "1.3",
          metaColor: "#6b7280",
          metaSize: "14px",
          metaWeight: "500",
          metaLineHeight: "1.5",
          metaSpacing: "4px",
        },
      },
    };
  }

  return {
    id,
    type,
    general: {},
    style: {},
  };
}

function BuilderContent({ templateId }: { templateId: string | null }) {
  const { state, dispatch } = useEditor();

  const router = useRouter(); // ✅ HERE
  const widgets = state.present.widgets;



// ✅ 👉 PASTE HERE
  async function saveDraft() {
    if (!templateId) return;

    const token = localStorage.getItem("cms_token");

    try {
      const res = await fetch(
        `${BUILDER_TEMPLATE_API}/${templateId}/draft`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: JSON.stringify({
            title: state.present.title,
            description: state.present.description,
            content: {
              widgets: state.present.widgets,
            },
          }),
        }
      );

      const data = await res.json();

      console.log("Saved 👉", data);
    } catch (err) {
      console.error("Save error:", err);
    }
  }


  const [activeId, setActiveId] = useState<string | null>(null);
  const loadedTemplateIdRef = useRef<string | null>(null);





useEffect(() => {
  const savedTemplate = localStorage.getItem("builder_template");

  if (savedTemplate) {
    try {
      const parsed = JSON.parse(savedTemplate);

      console.log("Loaded from localStorage:", parsed);

      // if (parsed?.widgets) {
      //   dispatch({
      //     type: "UPDATE",
      //     payload: {
      //       ...state.present,
      //       widgets: parsed.widgets,
      //     },
      //   });
      // }




if (parsed) {
  dispatch({
    type: "UPDATE",
    payload: {
      ...state.present,
      widgets: parsed.widgets || [],
      title: parsed.title || "",
      slug: parsed.slug || "",
      description: parsed.description || "",
    },
  });
}




      // optional cleanup
      localStorage.removeItem("builder_template");

    } catch (err) {
      console.error("Failed to parse template", err);
    }
  }
}, []);





  useEffect(() => {
    async function loadDraftTemplate() {
      if (!templateId || loadedTemplateIdRef.current === templateId) {
        return;
      }

      const token =
        typeof window !== "undefined" ? localStorage.getItem("cms_token") : null;

      if (!token) {
        dispatch({
          type: "SAVE_TEMPLATE_ERROR",
          message: "cms_token not found. Please log in again before editing a draft.",
        });
        return;
      }

      try {
        const response = await fetch(
          // `${BUILDER_TEMPLATE_API}/${templateId}/preview`,
          `${BUILDER_TEMPLATE_API}/${templateId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
          },
        );

        let result: {
          message?: string;
          templateId?: string;
          status?: "draft" | "published";
          version?: number;
          template?: {
            _id?: string;
            title?: string;
            slug?: string;
            description?: string;
            status?: "draft" | "published";
            version?: number;
            draftContent?: {
              widgets?: unknown[];
            } | null;
            publishedContent?: {
              widgets?: unknown[];
            } | null;
          } | null;
          content?: {
            widgets?: unknown[];
          } | null;
          metadata?: {
            title?: string;
            slug?: string;
            description?: string;
          } | null;
          urls?: {
            previewPath?: string;
            livePath?: string;
          } | null;
        } | null = null;

        try {
          result = await response.json();
        } catch {
          result = null;
        }

        if (!response.ok) {
          throw new Error(result?.message || "Failed to load draft template.");
        }

        // if (!result?.templateId) {
        //   throw new Error("Draft template response was missing template id.");
        // }




// const templateData = result?.template;

// if (!templateData?._id) {
//   throw new Error("Template data missing");
// }

// const widgetsFromAPI =
//   templateData?.draftContent?.widgets ||
//   templateData?.publishedContent?.widgets ||
//   [];

// dispatch({
//   type: "LOAD_TEMPLATE_EDIT_SUCCESS",
//   payload: {
//     message: "Template loaded",
//     templateId: templateData._id, // ✅ FIXED
//     status: templateData.status,
//     version: templateData.version,

//     content: {
//       widgets: widgetsFromAPI,
//     },

//     metadata: {
//       title: templateData.title,
//       slug: templateData.slug,
//       description: templateData.description,
//     },

//     urls: result?.urls || null,
//   },
// });





const templateData = result?.template;

if (!templateData?._id) {
  throw new Error("Template data missing");
}

const widgetsFromAPI =
  templateData?.draftContent?.widgets ||
  templateData?.publishedContent?.widgets ||
  [];

dispatch({
  type: "LOAD_TEMPLATE_EDIT_SUCCESS",
  payload: {
    message: "Template loaded",
    templateId: templateData._id, // ✅ FIXED
    status: templateData.status,
    version: templateData.version,

    content: {
      widgets: widgetsFromAPI as WidgetData[],
    },

    metadata: {
      title: templateData.title,
      slug: templateData.slug,
      description: templateData.description,
    },

    urls: result?.urls || null,
  },
});





        // dispatch({
        //   type: "LOAD_TEMPLATE_EDIT_SUCCESS",
        //   payload: {
        //     message: result.message || "Draft template loaded",
        //     templateId: result.templateId,
        //     status: result.status,
        //     version: result.version,
        //     content: result.content
        //       ? {
        //           widgets: result.content.widgets as never[] | undefined,
        //         }
        //       : null,
        //     metadata: result.metadata || null,
        //     urls: result.urls || null,
        //   },
        // });


// dispatch({
//   type: "LOAD_TEMPLATE_EDIT_SUCCESS",
//   payload: {
//     message: result.message || "Draft template loaded",
//     templateId: result.templateId,
//     status: result.status,
//     version: result.version,

//     content: {
//       widgets: result.content?.widgets || [],
//     },

//     metadata: result.metadata || null,
//     urls: result.urls || null,
//   },
// });





// const widgetsFromAPI =
//   result?.template?.draftContent?.widgets ||
//   result?.template?.publishedContent?.widgets ||
//   [];

// dispatch({
//   type: "LOAD_TEMPLATE_EDIT_SUCCESS",
//   payload: {
//     message: "Template loaded",
//     templateId: result.template._id,
//     content: {
//       widgets: widgetsFromAPI,
//     },
//     metadata: {
//       title: result.template.title,
//       slug: result.template.slug,
//       description: result.template.description,
//     },
//   },
// });






        loadedTemplateIdRef.current = templateData._id ?? result?.templateId ?? null;
        setActiveId(null);
      } catch (error) {
        dispatch({
          type: "SAVE_TEMPLATE_ERROR",
          message:
            error instanceof Error
              ? error.message
              : "Something went wrong while loading the draft template.",
        });
      }
    }

    loadDraftTemplate();
  }, [dispatch, templateId]);

  function addWidget(type: string) {
    const newWidget = createWidget(type);

    dispatch({
      type: "UPDATE",
      payload: {
        ...state.present,
        widgets: [...widgets, newWidget],
      },
    });

    setActiveId(newWidget.id);
  }

  function updateWidget(section: string, key: string, value: unknown) {
    if (!activeId) return;

    dispatch({
      type: "UPDATE",
      payload: {
        ...state.present,
        widgets: widgets.map((w: WidgetData) =>
          w.id === activeId
            ? {
                ...w,
                [section]: {
                  ...((w[section] as Record<string, unknown> | undefined) || {}),
                  [key]: value,
                },
              }
            : w
        ),
      },
    });
  }

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = widgets.findIndex((i: WidgetData) => i.id === active.id);
    const newIndex = widgets.findIndex((i: WidgetData) => i.id === over.id);

    dispatch({
      type: "UPDATE",
      payload: {
        ...state.present,
        widgets: arrayMove(widgets, oldIndex, newIndex),
      },
    });
  }





// async function createTemplate() {
//   const token =
//     typeof window !== "undefined"
//       ? localStorage.getItem("cms_token")
//       : null;

//   if (!token) {
//     dispatch({
//       type: "SAVE_TEMPLATE_ERROR",
//       message: "Please login again",
//     });
//     return;
//   }

//   try {
//     const res = await fetch(`${BUILDER_TEMPLATE_API}`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify({
//         content: state.present, // ✅ IMPORTANT
//       }),
//     });

//     const data = await res.json();

//     if (!res.ok) {
//       throw new Error(data?.message || "Create failed");
//     }

//     dispatch({
//       type: "SAVE_TEMPLATE_SUCCESS",
//       payload: {
//         message: data.message,
//         template: data.template,
//         urls: data.urls || null,
//       },
//     });

//     console.log("✅ Template Created:", data);

//   } catch (err) {
//     dispatch({
//       type: "SAVE_TEMPLATE_ERROR",
//       message:
//         err instanceof Error ? err.message : "Create failed",
//     });
//   }
// }





async function createTemplate() {
  const token = localStorage.getItem("cms_token");

  if (!token) {
    dispatch({
      type: "SAVE_TEMPLATE_ERROR",
      message: "Please login again",
    });
    return;
  }

  try {
    const res = await fetch(`${BUILDER_TEMPLATE_API}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: state.present.title,
        slug: state.present.slug,
        description: state.present.description,
        content: {
          widgets: state.present.widgets,
        },
      }),
    });

    const data = await res.json();

    console.log("RESPONSE 👉", data);

    if (!res.ok) {
      throw new Error(data?.message || "Create failed");
    }

    dispatch({
      type: "SAVE_TEMPLATE_SUCCESS",
      payload: {
        message: data.message,
        template: data.template,
        urls: data.urls || null,
      },
    });

    console.log("✅ Template Created:", data);

  } catch (err) {
    dispatch({
      type: "SAVE_TEMPLATE_ERROR",
      message:
        err instanceof Error ? err.message : "Create failed",
    });
  }
}






async function publishTemplate() {
  if (!templateId) {
    dispatch({
      type: "SAVE_TEMPLATE_ERROR",
      message: "Template ID missing",
    });
    return;
  }

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("cms_token")
      : null;

  if (!token) {
    dispatch({
      type: "SAVE_TEMPLATE_ERROR",
      message: "Please login again",
    });
    return;
  }

  try {
    const res = await fetch(
      `${BUILDER_TEMPLATE_API}/${templateId}/publish`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.message || "Publish failed");
    }

    dispatch({
      type: "SAVE_TEMPLATE_SUCCESS",
      // message: data.message || "Published successfully",
       payload: {
        message: data.message,
        template: data.template,
        urls: data.urls || null,
      },
    });

    console.log("API 👉", BUILDER_TEMPLATE_API);

        console.log("✅ Template Created:", data);

    router.push("/posts"); // ✅ redirect

  } catch (err) {
    dispatch({
      type: "SAVE_TEMPLATE_ERROR",
      message:
        err instanceof Error
          ? err.message
          : "Publish failed",
    });
  }
}




  return (
    <>
      {/* <EditorToolbar /> */}
<EditorToolbar publishTemplate={publishTemplate}
 createTemplate={createTemplate} 
 saveDraft={saveDraft}/>

      <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <div className="flex h-[calc(100vh-56px)]">
          <WidgetList addWidget={addWidget} />

          <Canvas
            widgets={widgets}
            activeId={activeId}
            setActiveId={setActiveId}
          />

          <SettingsPanel
            widget={widgets.find((w: WidgetData) => w.id === activeId)}
            updateWidget={updateWidget}
          />
        </div>
      </DndContext>
    </>
  );
}

// export default function Builder() {
export default function Builder({ templateId }: { templateId: string | null }) {

 const [widgets, setWidgets] = useState<any[]>([])
  const [loading, setLoading] = useState(false)



// ✅ 2. 👉 PASTE useEffect HERE
  useEffect(() => {
    if (!templateId) return
    fetchTemplate()
  }, [templateId])

  // ✅ 3. FUNCTIONS BELOW
  const fetchTemplate = async () => {
    try {
      setLoading(true)

      const token = localStorage.getItem("cms_token")

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL
        }/api/builder/template/${templateId}`,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      )

      const data = await res.json()

      const draftWidgets =
        data.template?.draftContent?.widgets ||
        data.template?.publishedContent?.widgets ||
        []

      setWidgets(draftWidgets)

    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }




  return (
    <EditorProvider>
      <BuilderContent templateId={templateId} />
    </EditorProvider>
  );
}
