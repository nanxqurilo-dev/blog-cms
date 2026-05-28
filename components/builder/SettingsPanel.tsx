"use client";

import { type ChangeEvent, type ReactNode, useState } from "react";

const TEMPLATE_IMAGE_UPLOAD_API =
  `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/template/upload-image`;
const inputClass =
  "w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500";
const selectClass = inputClass;
const textareaClass = `${inputClass} min-h-[96px] resize-y`;
const checkboxClass = "h-4 w-4 rounded border-gray-300";
const sectionTitleClass = "text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500";

type SettingsPanelProps = {
  widget: any;
  updateWidget: (section: string, key: string, value: any) => void;
};

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-medium text-gray-600">{label}</span>
      {children}
    </label>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-3 rounded-lg border border-gray-200 bg-gray-50/70 p-3">
      <div className={sectionTitleClass}>{title}</div>
      {children}
    </section>
  );
}

function Row({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-2 gap-3">{children}</div>;
}

export default function SettingsPanel({ widget, updateWidget }: SettingsPanelProps) {
  const [tab, setTab] = useState<"general" | "style">("general");
  const [uploadState, setUploadState] = useState<{
    image: "idle" | "uploading" | "error";
    hero: "idle" | "uploading" | "error";
  }>({
    image: "idle",
    hero: "idle",
  });
  const [uploadMessage, setUploadMessage] = useState("");

  if (!widget) {
    return <div className="w-96 border-l p-4 text-gray-500">Select a widget</div>;
  }

  const g = widget.general || {};
  const s = widget.style || {};

  const isButton = widget.type === "button";
  const isText = widget.type === "text";
  const isHeading = widget.type === "heading";
  const isImage = widget.type === "image";
  const isImageCarousel = widget.type === "image-carousel";
  const isIconBox = widget.type === "icon-box";
  const isAccordion = widget.type === "accordion";
  const isInnerSection = widget.type === "inner-section";
  const isParagraph = widget.type === "paragraph";
  const isSeparator = widget.type === "separator";
  const isHero = widget.type === "hero";
  const isTestimonial = widget.type === "testimonial";
  const isVideo = widget.type === "video";

  const updateTypography = (key: string, value: any) => {
    updateWidget("style", "typography", {
      ...(s.typography || {}),
      [key]: value,
    });
  };

  const updateBorder = (key: string, value: any) => {
    updateWidget("style", "border", {
      ...(s.border || {}),
      [key]: value,
    });
  };

  const updateHover = (key: string, value: any) => {
    updateWidget("style", "hover", {
      ...(s.hover || {}),
      [key]: value,
    });
  };

  const updateHeroStyle = (key: string, value: any) => {
    updateWidget("style", key, value);
  };

  async function uploadImageFile(
    file: File,
    target: "image" | "hero",
  ) {
    setUploadState((current) => ({
      ...current,
      [target]: "uploading",
    }));
    setUploadMessage("");

    try {
      const formData = new FormData();
      formData.append("post_thumbnail", file);

      const token =
        typeof window !== "undefined" ? localStorage.getItem("cms_token") : null;
      const headers: HeadersInit = {};

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(TEMPLATE_IMAGE_UPLOAD_API, {
        method: "POST",
        headers,
        body: formData,
      });

      let result:
        | {
            success?: boolean;
            data?: {
              url?: string;
              public_key?: string;
            };
            message?: string;
          }
        | null = null;

      try {
        result = await response.json();
      } catch {
        result = null;
      }

      if (!response.ok || !result?.success || !result.data?.url) {
        throw new Error(result?.message || "Image upload failed.");
      }

      if (target === "image") {
        updateWidget("general", "src", result.data.url);
      } else {
        updateWidget("general", "bgType", "image");
        updateWidget("general", "bgImage", result.data.url);
      }

      setUploadState((current) => ({
        ...current,
        [target]: "idle",
      }));
      setUploadMessage("Image uploaded successfully.");
    } catch (error) {
      setUploadState((current) => ({
        ...current,
        [target]: "error",
      }));
      setUploadMessage(
        error instanceof Error ? error.message : "Something went wrong while uploading the image.",
      );
    }
  }

  async function handleFileChange(
    event: ChangeEvent<HTMLInputElement>,
    target: "image" | "hero",
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    await uploadImageFile(file, target);
    event.target.value = "";
  }

  return (
    <div className="w-96 border-l p-4 text-sm overflow-y-auto bg-white">
      <div className="mb-4 flex rounded-lg bg-gray-100 p-1">
        <button
          className={`flex-1 rounded-md px-3 py-2 text-sm ${
            tab === "general" ? "bg-white font-semibold shadow-sm" : "text-gray-600"
          }`}
          onClick={() => setTab("general")}
          type="button"
        >
          General
        </button>
        <button
          className={`flex-1 rounded-md px-3 py-2 text-sm ${
            tab === "style" ? "bg-white font-semibold shadow-sm" : "text-gray-600"
          }`}
          onClick={() => setTab("style")}
          type="button"
        >
          Style
        </button>
      </div>

      {tab === "general" && (
        <div className="space-y-4">
          {isText && (
            <>
              <Section title="Content">
                <Field label="Text">
                  <textarea
                    className={textareaClass}
                    placeholder="Write your text..."
                    value={g.text || ""}
                    onChange={(e) => updateWidget("general", "text", e.target.value)}
                  />
                </Field>
              </Section>

              <Section title="Structure">
                <Row>
                  <Field label="HTML Tag">
                    <select className={selectClass} value={g.htmlTag || "div"} onChange={(e) => updateWidget("general", "htmlTag", e.target.value)}>
                      <option value="div">Div</option>
                      <option value="p">Paragraph</option>
                      <option value="span">Span</option>
                      <option value="blockquote">Blockquote</option>
                    </select>
                  </Field>
                  <Field label="Preset Style">
                    <select className={selectClass} value={g.variant || "default"} onChange={(e) => updateWidget("general", "variant", e.target.value)}>
                      <option value="default">Default</option>
                      <option value="lead">Lead</option>
                      <option value="muted">Muted</option>
                      <option value="accent">Accent</option>
                    </select>
                  </Field>
                </Row>
              </Section>

              <Section title="Link">
                <Field label="Optional Link URL">
                  <input className={inputClass} placeholder="https://example.com" value={g.link || ""} onChange={(e) => updateWidget("general", "link", e.target.value)} />
                </Field>
                <Row>
                  <Field label="Open In">
                    <select className={selectClass} value={g.linkTarget || "_self"} onChange={(e) => updateWidget("general", "linkTarget", e.target.value)}>
                      <option value="_self">Same tab</option>
                      <option value="_blank">New tab</option>
                    </select>
                  </Field>
                  <Field label="Aria Label">
                    <input className={inputClass} placeholder="Accessible label" value={g.ariaLabel || ""} onChange={(e) => updateWidget("general", "ariaLabel", e.target.value)} />
                  </Field>
                </Row>
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input className={checkboxClass} type="checkbox" checked={Boolean(g.noFollow)} onChange={(e) => updateWidget("general", "noFollow", e.target.checked)} />
                  Add nofollow rel
                </label>
              </Section>
            </>
          )}

          {isHeading && (
            <>
              <Section title="Content">
                <Field label="Heading Text">
                  <textarea
                    className={textareaClass}
                    placeholder="Write your heading..."
                    value={g.text || ""}
                    onChange={(e) => updateWidget("general", "text", e.target.value)}
                  />
                </Field>
                <Field label="Subtitle">
                  <textarea
                    className={textareaClass}
                    placeholder="Optional supporting copy"
                    value={g.subtitle || ""}
                    onChange={(e) => updateWidget("general", "subtitle", e.target.value)}
                  />
                </Field>
              </Section>

              <Section title="Structure">
                <Row>
                  <Field label="HTML Tag">
                    <select className={selectClass} value={g.htmlTag || "h2"} onChange={(e) => updateWidget("general", "htmlTag", e.target.value)}>
                      <option value="h1">H1</option>
                      <option value="h2">H2</option>
                      <option value="h3">H3</option>
                      <option value="h4">H4</option>
                      <option value="h5">H5</option>
                      <option value="h6">H6</option>
                    </select>
                  </Field>
                  <Field label="Anchor ID">
                    <input className={inputClass} placeholder="section-heading" value={g.anchorId || ""} onChange={(e) => updateWidget("general", "anchorId", e.target.value)} />
                  </Field>
                </Row>
              </Section>

              <Section title="Accent">
                <Field label="Eyebrow Text">
                  <input className={inputClass} placeholder="Section Intro" value={g.eyebrow || ""} onChange={(e) => updateWidget("general", "eyebrow", e.target.value)} />
                </Field>
                <Field label="Highlighted Text">
                  <input className={inputClass} placeholder="word or phrase to highlight" value={g.highlightText || ""} onChange={(e) => updateWidget("general", "highlightText", e.target.value)} />
                </Field>
              </Section>
            </>
          )}

          {isParagraph && (
            <>
              <Section title="Content">
                <Field label="Paragraph">
                  <textarea
                    className={textareaClass}
                    placeholder="Write paragraph content..."
                    value={g.text || ""}
                    onChange={(e) => updateWidget("general", "text", e.target.value)}
                  />
                </Field>
              </Section>

              <Section title="Structure">
                <Row>
                  <Field label="HTML Tag">
                    <select className={selectClass} value={g.htmlTag || "p"} onChange={(e) => updateWidget("general", "htmlTag", e.target.value)}>
                      <option value="p">Paragraph</option>
                      <option value="div">Div</option>
                      <option value="blockquote">Blockquote</option>
                    </select>
                  </Field>
                  <Field label="Preset Style">
                    <select className={selectClass} value={g.variant || "body"} onChange={(e) => updateWidget("general", "variant", e.target.value)}>
                      <option value="body">Body</option>
                      <option value="intro">Intro</option>
                      <option value="compact">Compact</option>
                      <option value="emphasis">Emphasis</option>
                    </select>
                  </Field>
                </Row>
              </Section>

              <Section title="Link">
                <Field label="Optional Link URL">
                  <input className={inputClass} placeholder="https://example.com" value={g.link || ""} onChange={(e) => updateWidget("general", "link", e.target.value)} />
                </Field>
                <Row>
                  <Field label="Open In">
                    <select className={selectClass} value={g.linkTarget || "_self"} onChange={(e) => updateWidget("general", "linkTarget", e.target.value)}>
                      <option value="_self">Same tab</option>
                      <option value="_blank">New tab</option>
                    </select>
                  </Field>
                  <Field label="Aria Label">
                    <input className={inputClass} placeholder="Accessible label" value={g.ariaLabel || ""} onChange={(e) => updateWidget("general", "ariaLabel", e.target.value)} />
                  </Field>
                </Row>
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input className={checkboxClass} type="checkbox" checked={Boolean(g.noFollow)} onChange={(e) => updateWidget("general", "noFollow", e.target.checked)} />
                  Add nofollow rel
                </label>
              </Section>
            </>
          )}

          {isButton && (
            <>
              <Section title="Content">
                <Field label="Button Text">
                  <input className={inputClass} placeholder="Read More" value={g.text || ""} onChange={(e) => updateWidget("general", "text", e.target.value)} />
                </Field>
                <Field label="Aria Label">
                  <input className={inputClass} placeholder="Accessible label" value={g.ariaLabel || ""} onChange={(e) => updateWidget("general", "ariaLabel", e.target.value)} />
                </Field>
              </Section>

              <Section title="Link">
                <Field label="URL">
                  <input className={inputClass} placeholder="https://example.com" value={g.link || ""} onChange={(e) => updateWidget("general", "link", e.target.value)} />
                </Field>
                <Row>
                  <Field label="Open In">
                    <select className={selectClass} value={g.linkTarget || "_self"} onChange={(e) => updateWidget("general", "linkTarget", e.target.value)}>
                      <option value="_self">Same tab</option>
                      <option value="_blank">New tab</option>
                    </select>
                  </Field>
                  <Field label="Button ID">
                    <input className={inputClass} placeholder="cta-button" value={g.buttonId || ""} onChange={(e) => updateWidget("general", "buttonId", e.target.value)} />
                  </Field>
                </Row>
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input className={checkboxClass} type="checkbox" checked={Boolean(g.noFollow)} onChange={(e) => updateWidget("general", "noFollow", e.target.checked)} />
                  Add nofollow rel
                </label>
              </Section>

              <Section title="Layout">
                <Row>
                  <Field label="Preset Size">
                    <select className={selectClass} value={g.size || "md"} onChange={(e) => updateWidget("general", "size", e.target.value)}>
                      <option value="xs">Extra Small</option>
                      <option value="sm">Small</option>
                      <option value="md">Medium</option>
                      <option value="lg">Large</option>
                      <option value="xl">Extra Large</option>
                    </select>
                  </Field>
                  <Field label="Width Mode">
                    <select className={selectClass} value={g.widthMode || "auto"} onChange={(e) => updateWidget("general", "widthMode", e.target.value)}>
                      <option value="auto">Auto</option>
                      <option value="full">Full Width</option>
                      <option value="custom">Custom Width</option>
                    </select>
                  </Field>
                </Row>
                <Row>
                  <Field label="Alignment">
                    <select className={selectClass} value={s.alignment || "left"} onChange={(e) => updateWidget("style", "alignment", e.target.value)}>
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                    </select>
                  </Field>
                  <Field label="Min Width">
                    <input className={inputClass} placeholder="180px" value={s.minWidth || ""} onChange={(e) => updateWidget("style", "minWidth", e.target.value)} />
                  </Field>
                </Row>
                {g.widthMode === "custom" && (
                  <Field label="Custom Width">
                    <input className={inputClass} placeholder="260px or 100%" value={s.width || ""} onChange={(e) => updateWidget("style", "width", e.target.value)} />
                  </Field>
                )}
              </Section>

              <Section title="Icon">
                <Row>
                  <Field label="Icon">
                    <select className={selectClass} value={g.icon || ""} onChange={(e) => updateWidget("general", "icon", e.target.value)}>
                      <option value="">None</option>
                      <option value="arrow-right">Arrow Right</option>
                      <option value="arrow-left">Arrow Left</option>
                      <option value="check">Check</option>
                      <option value="plus">Plus</option>
                      <option value="download">Download</option>
                      <option value="external">External</option>
                      <option value="mail">Mail</option>
                    </select>
                  </Field>
                  <Field label="Position">
                    <select className={selectClass} value={g.iconPosition || "right"} onChange={(e) => updateWidget("general", "iconPosition", e.target.value)}>
                      <option value="left">Left</option>
                      <option value="right">Right</option>
                    </select>
                  </Field>
                </Row>
                <Row>
                  <Field label="Icon Size">
                    <input className={inputClass} type="number" min="8" value={g.iconSize ?? 18} onChange={(e) => updateWidget("general", "iconSize", Number(e.target.value))} />
                  </Field>
                  <Field label="Icon Spacing">
                    <input className={inputClass} type="number" min="0" value={g.iconSpacing ?? 8} onChange={(e) => updateWidget("general", "iconSpacing", Number(e.target.value))} />
                  </Field>
                </Row>
              </Section>
            </>
          )}
          {isImage && (
            <>
              <Section title="Image Source">
                <Field label="Image URL"><input className={inputClass} placeholder="https://..." value={g.src || ""} onChange={(e) => updateWidget("general", "src", e.target.value)} /></Field>
                <Field label="Upload Image">
                  <input
                    className={inputClass}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, "image")}
                    disabled={uploadState.image === "uploading"}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    {uploadState.image === "uploading"
                      ? "Uploading image..."
                      : "Uploads to the template image API using the `post_thumbnail` form-data key."}
                  </p>
                </Field>
                <Field label="Alt Text"><input className={inputClass} placeholder="Describe the image" value={g.alt || ""} onChange={(e) => updateWidget("general", "alt", e.target.value)} /></Field>
                <Row>
                  <Field label="Loading">
                    <select className={selectClass} value={g.loading || "lazy"} onChange={(e) => updateWidget("general", "loading", e.target.value)}>
                      <option value="lazy">Lazy</option>
                      <option value="eager">Eager</option>
                    </select>
                  </Field>
                  <Field label="Caption Position">
                    <select className={selectClass} value={g.captionPosition || "below"} onChange={(e) => updateWidget("general", "captionPosition", e.target.value)}>
                      <option value="below">Below</option>
                      <option value="above">Above</option>
                      <option value="hidden">Hidden</option>
                    </select>
                  </Field>
                </Row>
              </Section>

              <Section title="Caption & Link">
                <Field label="Caption"><input className={inputClass} placeholder="Optional caption" value={g.caption || ""} onChange={(e) => updateWidget("general", "caption", e.target.value)} /></Field>
                <Field label="Link"><input className={inputClass} placeholder="Optional link" value={g.link || ""} onChange={(e) => updateWidget("general", "link", e.target.value)} /></Field>
                <Row>
                  <Field label="Open In">
                    <select className={selectClass} value={g.linkTarget || "_self"} onChange={(e) => updateWidget("general", "linkTarget", e.target.value)}>
                      <option value="_self">Same tab</option>
                      <option value="_blank">New tab</option>
                    </select>
                  </Field>
                  <Field label="Aria Label"><input className={inputClass} placeholder="Accessible label" value={g.ariaLabel || ""} onChange={(e) => updateWidget("general", "ariaLabel", e.target.value)} /></Field>
                </Row>
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input className={checkboxClass} type="checkbox" checked={Boolean(g.noFollow)} onChange={(e) => updateWidget("general", "noFollow", e.target.checked)} />
                  Add nofollow rel
                </label>
              </Section>
            </>
          )}

          {isImageCarousel && (
            <>
              <Section title="Slides">
                <Field label="Image URLs">
                  <textarea
                    className={textareaClass}
                    placeholder="One image URL per line"
                    value={Array.isArray(g.images) ? g.images.join("\n") : g.images || ""}
                    onChange={(e) => updateWidget("general", "images", e.target.value.split(/\r?\n/).map((item) => item.trim()).filter(Boolean))}
                  />
                </Field>
                <Field label="Captions">
                  <textarea
                    className={textareaClass}
                    placeholder="One caption per line"
                    value={Array.isArray(g.captions) ? g.captions.join("\n") : g.captions || ""}
                    onChange={(e) => updateWidget("general", "captions", e.target.value.split(/\r?\n/).map((item) => item.trim()))}
                  />
                </Field>
                <Field label="Alt Prefix"><input className={inputClass} placeholder="Carousel image" value={g.altPrefix || ""} onChange={(e) => updateWidget("general", "altPrefix", e.target.value)} /></Field>
              </Section>

              <Section title="Navigation">
                <Row>
                  <Field label="Show Arrows">
                    <select className={selectClass} value={g.showArrows === false ? "no" : "yes"} onChange={(e) => updateWidget("general", "showArrows", e.target.value === "yes")}>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </Field>
                  <Field label="Show Dots">
                    <select className={selectClass} value={g.showDots === false ? "no" : "yes"} onChange={(e) => updateWidget("general", "showDots", e.target.value === "yes")}>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </Field>
                </Row>
                <Row>
                  <Field label="Show Counter">
                    <select className={selectClass} value={g.showCounter === false ? "no" : "yes"} onChange={(e) => updateWidget("general", "showCounter", e.target.value === "yes")}>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </Field>
                  <Field label="Show Caption">
                    <select className={selectClass} value={g.showCaption === false ? "no" : "yes"} onChange={(e) => updateWidget("general", "showCaption", e.target.value === "yes")}>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </Field>
                </Row>
              </Section>

              <Section title="Autoplay">
                <Row>
                  <Field label="Autoplay">
                    <select className={selectClass} value={g.autoplay ? "yes" : "no"} onChange={(e) => updateWidget("general", "autoplay", e.target.value === "yes")}>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </Field>
                  <Field label="Loop">
                    <select className={selectClass} value={g.loop === false ? "no" : "yes"} onChange={(e) => updateWidget("general", "loop", e.target.value === "yes")}>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </Field>
                </Row>
                <Row>
                  <Field label="Pause On Hover">
                    <select className={selectClass} value={g.pauseOnHover === false ? "no" : "yes"} onChange={(e) => updateWidget("general", "pauseOnHover", e.target.value === "yes")}>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </Field>
                  <Field label="Autoplay Speed (ms)"><input className={inputClass} type="number" min="500" step="100" value={g.autoplaySpeed ?? 3500} onChange={(e) => updateWidget("general", "autoplaySpeed", Number(e.target.value))} /></Field>
                </Row>
              </Section>
            </>
          )}


          {isIconBox && (
            <>
              <Section title="Content">
                <Field label="Eyebrow"><input className={inputClass} placeholder="Feature Block" value={g.eyebrow || ""} onChange={(e) => updateWidget("general", "eyebrow", e.target.value)} /></Field>
                <Field label="Title"><input className={inputClass} placeholder="Feature title" value={g.title || ""} onChange={(e) => updateWidget("general", "title", e.target.value)} /></Field>
                <Field label="Description">
                  <textarea
                    className={textareaClass}
                    placeholder="Describe this feature..."
                    value={g.description || ""}
                    onChange={(e) => updateWidget("general", "description", e.target.value)}
                  />
                </Field>
              </Section>

              <Section title="Icon">
                <Row>
                  <Field label="Icon">
                    <select className={selectClass} value={g.icon || "badge"} onChange={(e) => updateWidget("general", "icon", e.target.value)}>
                      <option value="badge">Badge Check</option>
                      <option value="sparkles">Sparkles</option>
                      <option value="rocket">Rocket</option>
                      <option value="shield">Shield</option>
                      <option value="globe">Globe</option>
                      <option value="bulb">Lightbulb</option>
                    </select>
                  </Field>
                  <Field label="Show Icon">
                    <select className={selectClass} value={g.showIcon === false ? "no" : "yes"} onChange={(e) => updateWidget("general", "showIcon", e.target.value === "yes")}>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </Field>
                </Row>
                <Field label="Layout">
                  <select className={selectClass} value={g.layout || "vertical"} onChange={(e) => updateWidget("general", "layout", e.target.value)}>
                    <option value="vertical">Vertical</option>
                    <option value="horizontal">Horizontal</option>
                  </select>
                </Field>
              </Section>

              <Section title="Link">
                <Field label="URL"><input className={inputClass} placeholder="https://example.com" value={g.link || ""} onChange={(e) => updateWidget("general", "link", e.target.value)} /></Field>
                <Field label="Link Text"><input className={inputClass} placeholder="Learn more" value={g.linkText || ""} onChange={(e) => updateWidget("general", "linkText", e.target.value)} /></Field>
                <Row>
                  <Field label="Open In">
                    <select className={selectClass} value={g.linkTarget || "_self"} onChange={(e) => updateWidget("general", "linkTarget", e.target.value)}>
                      <option value="_self">Same tab</option>
                      <option value="_blank">New tab</option>
                    </select>
                  </Field>
                  <Field label="Aria Label"><input className={inputClass} placeholder="Accessible label" value={g.ariaLabel || ""} onChange={(e) => updateWidget("general", "ariaLabel", e.target.value)} /></Field>
                </Row>
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input className={checkboxClass} type="checkbox" checked={Boolean(g.noFollow)} onChange={(e) => updateWidget("general", "noFollow", e.target.checked)} />
                  Add nofollow rel
                </label>
              </Section>
            </>
          )}

          {isAccordion && (
            <>
              <Section title="Items">
                <Field label="Accordion Titles">
                  <textarea
                    className={textareaClass}
                    placeholder="One title per line"
                    value={Array.isArray(g.itemsTitle) ? g.itemsTitle.join("\n") : g.itemsTitle || ""}
                    onChange={(e) => updateWidget("general", "itemsTitle", e.target.value.split(/\r?\n/).map((item) => item.trim()))}
                  />
                </Field>
                <Field label="Accordion Content">
                  <textarea
                    className={textareaClass}
                    placeholder="One content item per line"
                    value={Array.isArray(g.itemsContent) ? g.itemsContent.join("\n") : g.itemsContent || ""}
                    onChange={(e) => updateWidget("general", "itemsContent", e.target.value.split(/\r?\n/).map((item) => item.trim()))}
                  />
                </Field>
              </Section>

              <Section title="Behavior">
                <Row>
                  <Field label="First Item Open">
                    <select className={selectClass} value={g.firstOpen === false ? "no" : "yes"} onChange={(e) => updateWidget("general", "firstOpen", e.target.value === "yes")}>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </Field>
                  <Field label="Allow Multiple">
                    <select className={selectClass} value={g.allowMultiple ? "yes" : "no"} onChange={(e) => updateWidget("general", "allowMultiple", e.target.value === "yes")}>
                      <option value="no">No</option>
                      <option value="yes">Yes</option>
                    </select>
                  </Field>
                </Row>
                <Field label="Icon Position">
                  <select className={selectClass} value={g.iconPosition || "right"} onChange={(e) => updateWidget("general", "iconPosition", e.target.value)}>
                    <option value="right">Right</option>
                    <option value="left">Left</option>
                  </select>
                </Field>
              </Section>
            </>
          )}

          {isInnerSection && (
            <>
              <Section title="Section Content">
                <Field label="Eyebrow">
                  <input className={inputClass} placeholder="Inner Section" value={g.eyebrow || ""} onChange={(e) => updateWidget("general", "eyebrow", e.target.value)} />
                </Field>
                <Field label="Title">
                  <input className={inputClass} placeholder="Section title" value={g.title || ""} onChange={(e) => updateWidget("general", "title", e.target.value)} />
                </Field>
                <Field label="Description">
                  <textarea className={textareaClass} placeholder="Describe this inner section..." value={g.description || ""} onChange={(e) => updateWidget("general", "description", e.target.value)} />
                </Field>
              </Section>

              <Section title="Layout">
                <Row>
                  <Field label="Layout Preset">
                    <select className={selectClass} value={g.layoutPreset || "2-col"} onChange={(e) => updateWidget("general", "layoutPreset", e.target.value)}>
                      <option value="2-col">2 Columns</option>
                      <option value="3-col">3 Columns</option>
                      <option value="feature-left">Feature Left</option>
                      <option value="feature-right">Feature Right</option>
                    </select>
                  </Field>
                  <Field label="Vertical Align">
                    <select className={selectClass} value={g.verticalAlign || "top"} onChange={(e) => updateWidget("general", "verticalAlign", e.target.value)}>
                      <option value="top">Top</option>
                      <option value="center">Center</option>
                      <option value="bottom">Bottom</option>
                    </select>
                  </Field>
                </Row>
                <Field label="Show Intro Block">
                  <select className={selectClass} value={g.showIntro === false ? "no" : "yes"} onChange={(e) => updateWidget("general", "showIntro", e.target.value === "yes")}>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </Field>
              </Section>

              <Section title="Columns">
                <Field label="Item Eyebrows">
                  <textarea
                    className={textareaClass}
                    placeholder="One eyebrow per line"
                    value={Array.isArray(g.itemEyebrows) ? g.itemEyebrows.join("\n") : g.itemEyebrows || ""}
                    onChange={(e) => updateWidget("general", "itemEyebrows", e.target.value.split(/\r?\n/).map((item) => item.trim()))}
                  />
                </Field>
                <Field label="Item Titles">
                  <textarea
                    className={textareaClass}
                    placeholder="One title per line"
                    value={Array.isArray(g.itemTitles) ? g.itemTitles.join("\n") : g.itemTitles || ""}
                    onChange={(e) => updateWidget("general", "itemTitles", e.target.value.split(/\r?\n/).map((item) => item.trim()))}
                  />
                </Field>
                <Field label="Item Content">
                  <textarea
                    className={textareaClass}
                    placeholder="One content item per line"
                    value={Array.isArray(g.itemContents) ? g.itemContents.join("\n") : g.itemContents || ""}
                    onChange={(e) => updateWidget("general", "itemContents", e.target.value.split(/\r?\n/).map((item) => item.trim()))}
                  />
                </Field>
              </Section>
            </>
          )}


          {isVideo && (
            <>
              <Section title="Source">
                <Row>
                  <Field label="Source Type">
                    <select className={selectClass} value={g.sourceType || "hosted"} onChange={(e) => updateWidget("general", "sourceType", e.target.value)}>
                      <option value="hosted">Hosted Video</option>
                      <option value="embed">Embed URL</option>
                    </select>
                  </Field>
                  <Field label="Lazy Load">
                    <select className={selectClass} value={g.loading || "lazy"} onChange={(e) => updateWidget("general", "loading", e.target.value)}>
                      <option value="lazy">Lazy</option>
                      <option value="eager">Eager</option>
                    </select>
                  </Field>
                </Row>
                {g.sourceType === "embed" ? (
                  <Field label="Embed URL"><input className={inputClass} placeholder="https://www.youtube.com/watch?v=..." value={g.embedUrl || ""} onChange={(e) => updateWidget("general", "embedUrl", e.target.value)} /></Field>
                ) : (
                  <Field label="Video URL"><input className={inputClass} placeholder="https://example.com/video.mp4" value={g.src || ""} onChange={(e) => updateWidget("general", "src", e.target.value)} /></Field>
                )}
                <Field label="Video Title"><input className={inputClass} placeholder="Product walkthrough" value={g.title || ""} onChange={(e) => updateWidget("general", "title", e.target.value)} /></Field>
                <Field label="Poster Image"><input className={inputClass} placeholder="https://example.com/poster.jpg" value={g.poster || ""} onChange={(e) => updateWidget("general", "poster", e.target.value)} /></Field>
              </Section>

              <Section title="Playback">
                <Row>
                  <Field label="Controls">
                    <select className={selectClass} value={g.controls === false ? "no" : "yes"} onChange={(e) => updateWidget("general", "controls", e.target.value === "yes")}>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </Field>
                  <Field label="Autoplay">
                    <select className={selectClass} value={g.autoplay ? "yes" : "no"} onChange={(e) => updateWidget("general", "autoplay", e.target.value === "yes")}>
                      <option value="no">No</option>
                      <option value="yes">Yes</option>
                    </select>
                  </Field>
                </Row>
                <Row>
                  <Field label="Muted">
                    <select className={selectClass} value={g.muted === false ? "no" : "yes"} onChange={(e) => updateWidget("general", "muted", e.target.value === "yes")}>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </Field>
                  <Field label="Loop">
                    <select className={selectClass} value={g.loop ? "yes" : "no"} onChange={(e) => updateWidget("general", "loop", e.target.value === "yes")}>
                      <option value="no">No</option>
                      <option value="yes">Yes</option>
                    </select>
                  </Field>
                </Row>
                <Row>
                  <Field label="Inline Playback">
                    <select className={selectClass} value={g.playsInline === false ? "no" : "yes"} onChange={(e) => updateWidget("general", "playsInline", e.target.value === "yes")}>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </Field>
                  <Field label="Preload">
                    <select className={selectClass} value={g.preload || "metadata"} onChange={(e) => updateWidget("general", "preload", e.target.value)}>
                      <option value="none">None</option>
                      <option value="metadata">Metadata</option>
                      <option value="auto">Auto</option>
                    </select>
                  </Field>
                </Row>
              </Section>

              <Section title="Caption & Display">
                <Field label="Caption"><input className={inputClass} placeholder="Optional caption" value={g.caption || ""} onChange={(e) => updateWidget("general", "caption", e.target.value)} /></Field>
                <Row>
                  <Field label="Show Caption">
                    <select className={selectClass} value={g.showCaption === false ? "no" : "yes"} onChange={(e) => updateWidget("general", "showCaption", e.target.value === "yes")}>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </Field>
                  <Field label="Show Play Icon">
                    <select className={selectClass} value={g.showPlayIcon === false ? "no" : "yes"} onChange={(e) => updateWidget("general", "showPlayIcon", e.target.value === "yes")}>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </Field>
                </Row>
              </Section>
            </>
          )}

          {isTestimonial && (
            <>
              <Section title="Content">
                <Field label="Quote"><textarea className={textareaClass} placeholder="Share the testimonial quote..." value={g.quote || ""} onChange={(e) => updateWidget("general", "quote", e.target.value)} /></Field>
              </Section>

              <Section title="Author">
                <Field label="Name"><input className={inputClass} placeholder="Client Name" value={g.name || ""} onChange={(e) => updateWidget("general", "name", e.target.value)} /></Field>
                <Row>
                  <Field label="Role"><input className={inputClass} placeholder="Product Lead" value={g.role || ""} onChange={(e) => updateWidget("general", "role", e.target.value)} /></Field>
                  <Field label="Company"><input className={inputClass} placeholder="Northstar Studio" value={g.company || ""} onChange={(e) => updateWidget("general", "company", e.target.value)} /></Field>
                </Row>
                <Field label="Avatar URL"><input className={inputClass} placeholder="https://..." value={g.avatar || ""} onChange={(e) => updateWidget("general", "avatar", e.target.value)} /></Field>
              </Section>

              <Section title="Display">
                <Row>
                  <Field label="Show Avatar">
                    <select className={selectClass} value={g.showAvatar === false ? "no" : "yes"} onChange={(e) => updateWidget("general", "showAvatar", e.target.value === "yes")}>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </Field>
                  <Field label="Show Rating">
                    <select className={selectClass} value={g.showRating === false ? "no" : "yes"} onChange={(e) => updateWidget("general", "showRating", e.target.value === "yes")}>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </Field>
                </Row>
                <Field label="Rating"><input className={inputClass} type="number" min="0" max="5" value={g.rating ?? 5} onChange={(e) => updateWidget("general", "rating", Number(e.target.value))} /></Field>
              </Section>
            </>
          )}

          {isSeparator && (
            <>
              <Section title="Divider">
                <Row>
                  <Field label="Line Style">
                    <select className={selectClass} value={g.type || "solid"} onChange={(e) => updateWidget("general", "type", e.target.value)}>
                      <option value="solid">Solid</option>
                      <option value="dashed">Dashed</option>
                      <option value="dotted">Dotted</option>
                      <option value="double">Double</option>
                    </select>
                  </Field>
                  <Field label="Thickness"><input className={inputClass} placeholder="2px" value={g.thickness || ""} onChange={(e) => updateWidget("general", "thickness", e.target.value)} /></Field>
                </Row>
                <Field label="Width"><input className={inputClass} placeholder="100% or 320px" value={g.width || ""} onChange={(e) => updateWidget("general", "width", e.target.value)} /></Field>
              </Section>

              <Section title="Label">
                <Field label="Separator Label"><input className={inputClass} placeholder="Optional label" value={g.label || ""} onChange={(e) => updateWidget("general", "label", e.target.value)} /></Field>
                <Field label="Label Position">
                  <select className={selectClass} value={g.labelPosition || "center"} onChange={(e) => updateWidget("general", "labelPosition", e.target.value)}>
                    <option value="center">Center</option>
                    <option value="left">Left</option>
                    <option value="right">Right</option>
                  </select>
                </Field>
              </Section>
            </>
          )}

          {isHero && (
            <>
              <Section title="Content">
                <Field label="Title"><input className={inputClass} placeholder="Hero title" value={g.title || ""} onChange={(e) => updateWidget("general", "title", e.target.value)} /></Field>
                <Field label="Subtitle"><input className={inputClass} placeholder="Hero subtitle" value={g.subtitle || ""} onChange={(e) => updateWidget("general", "subtitle", e.target.value)} /></Field>
                <Field label="Description"><textarea className={textareaClass} placeholder="Hero description" value={g.description || ""} onChange={(e) => updateWidget("general", "description", e.target.value)} /></Field>
              </Section>

              <Section title="Layout">
                <Row>
                  <Field label="Horizontal Align">
                    <select className={selectClass} value={g.align || "center"} onChange={(e) => updateWidget("general", "align", e.target.value)}>
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                    </select>
                  </Field>
                  <Field label="Vertical Align">
                    <select className={selectClass} value={g.verticalAlign || "center"} onChange={(e) => updateWidget("general", "verticalAlign", e.target.value)}>
                      <option value="top">Top</option>
                      <option value="center">Center</option>
                      <option value="bottom">Bottom</option>
                    </select>
                  </Field>
                </Row>
              </Section>

              <Section title="Background">
                <Field label="Background Type">
                  <select className={selectClass} value={g.bgType || "color"} onChange={(e) => updateWidget("general", "bgType", e.target.value)}>
                    <option value="color">Color</option>
                    <option value="image">Image</option>
                    <option value="gradient">Gradient</option>
                  </select>
                </Field>
                <Field label="Upload Background Image">
                  <input
                    className={inputClass}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, "hero")}
                    disabled={uploadState.hero === "uploading"}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    {uploadState.hero === "uploading"
                      ? "Uploading background image..."
                      : "Uploads to the template image API using the `post_thumbnail` form-data key."}
                  </p>
                </Field>
                {g.bgType === "color" && <Field label="Background Color"><input className={inputClass} type="color" value={g.bgColor || "#0f172a"} onChange={(e) => updateWidget("general", "bgColor", e.target.value)} /></Field>}
                {g.bgType === "image" && <Field label="Background Image URL"><input className={inputClass} placeholder="https://..." value={g.bgImage || ""} onChange={(e) => updateWidget("general", "bgImage", e.target.value)} /></Field>}
                {g.bgType === "gradient" && <Field label="Gradient CSS"><input className={inputClass} placeholder="linear-gradient(...)" value={g.bgGradient || ""} onChange={(e) => updateWidget("general", "bgGradient", e.target.value)} /></Field>}
              </Section>

              <Section title="CTA Button">
                <Field label="Button Text"><input className={inputClass} placeholder="Explore Story" value={g.btnText || ""} onChange={(e) => updateWidget("general", "btnText", e.target.value)} /></Field>
                <Field label="Button Link"><input className={inputClass} placeholder="https://example.com" value={g.btnLink || ""} onChange={(e) => updateWidget("general", "btnLink", e.target.value)} /></Field>
                <Row>
                  <Field label="Open In">
                    <select className={selectClass} value={g.btnTarget || "_self"} onChange={(e) => updateWidget("general", "btnTarget", e.target.value)}>
                      <option value="_self">Same tab</option>
                      <option value="_blank">New tab</option>
                    </select>
                  </Field>
                  <Field label="Button Nofollow">
                    <select className={selectClass} value={g.btnNoFollow ? "yes" : "no"} onChange={(e) => updateWidget("general", "btnNoFollow", e.target.value === "yes")}>
                      <option value="no">No</option>
                      <option value="yes">Yes</option>
                    </select>
                  </Field>
                </Row>
              </Section>
            </>
          )}
        </div>
      )}

      {uploadMessage && (
        <div
          className={`mt-4 rounded-md px-3 py-2 text-xs ${
            uploadState.image === "error" || uploadState.hero === "error"
              ? "border border-red-200 bg-red-50 text-red-600"
              : "border border-green-200 bg-green-50 text-green-700"
          }`}
        >
          {uploadMessage}
        </div>
      )}

      {tab === "style" && (
        <div className="space-y-4">
          {isText && (
            <>
              <Section title="Typography">
                <Row>
                  <Field label="Font Size"><input className={inputClass} placeholder="17px" value={s.typography?.fontSize || ""} onChange={(e) => updateTypography("fontSize", e.target.value)} /></Field>
                  <Field label="Font Weight"><input className={inputClass} placeholder="400" value={s.typography?.fontWeight || ""} onChange={(e) => updateTypography("fontWeight", e.target.value)} /></Field>
                </Row>
                <Row>
                  <Field label="Font Family"><input className={inputClass} placeholder="inherit" value={s.typography?.fontFamily || ""} onChange={(e) => updateTypography("fontFamily", e.target.value)} /></Field>
                  <Field label="Line Height"><input className={inputClass} placeholder="1.7" value={s.typography?.lineHeight || ""} onChange={(e) => updateTypography("lineHeight", e.target.value)} /></Field>
                </Row>
                <Row>
                  <Field label="Letter Spacing"><input className={inputClass} placeholder="0px" value={s.typography?.letterSpacing || ""} onChange={(e) => updateTypography("letterSpacing", e.target.value)} /></Field>
                  <Field label="Text Transform">
                    <select className={selectClass} value={s.typography?.textTransform || "none"} onChange={(e) => updateTypography("textTransform", e.target.value)}>
                      <option value="none">None</option>
                      <option value="uppercase">Uppercase</option>
                      <option value="lowercase">Lowercase</option>
                      <option value="capitalize">Capitalize</option>
                    </select>
                  </Field>
                </Row>
                <Row>
                  <Field label="Text Decoration">
                    <select className={selectClass} value={s.typography?.textDecoration || "none"} onChange={(e) => updateTypography("textDecoration", e.target.value)}>
                      <option value="none">None</option>
                      <option value="underline">Underline</option>
                      <option value="line-through">Line Through</option>
                    </select>
                  </Field>
                  <Field label="Font Style">
                    <select className={selectClass} value={s.typography?.fontStyle || "normal"} onChange={(e) => updateTypography("fontStyle", e.target.value)}>
                      <option value="normal">Normal</option>
                      <option value="italic">Italic</option>
                    </select>
                  </Field>
                </Row>
              </Section>

              <Section title="Colors & Effects">
                <Row>
                  <Field label="Text Color"><input className={inputClass} type="color" value={s.textColor || "#111827"} onChange={(e) => updateWidget("style", "textColor", e.target.value)} /></Field>
                  <Field label="Opacity"><input className={inputClass} type="number" step="0.1" min="0" max="1" value={s.opacity ?? 1} onChange={(e) => updateWidget("style", "opacity", Number(e.target.value))} /></Field>
                </Row>
                <Field label="Background CSS"><input className={inputClass} placeholder="transparent or linear-gradient(...)" value={s.background || ""} onChange={(e) => updateWidget("style", "background", e.target.value)} /></Field>
                <Field label="Text Shadow"><input className={inputClass} placeholder="none" value={s.textShadow || ""} onChange={(e) => updateWidget("style", "textShadow", e.target.value)} /></Field>
                <Field label="Box Shadow"><input className={inputClass} placeholder="none" value={s.boxShadow || ""} onChange={(e) => updateWidget("style", "boxShadow", e.target.value)} /></Field>
              </Section>

              <Section title="Layout">
                <Row>
                  <Field label="Alignment">
                    <select className={selectClass} value={s.alignment || "left"} onChange={(e) => updateWidget("style", "alignment", e.target.value)}>
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                      <option value="justify">Justify</option>
                    </select>
                  </Field>
                  <Field label="Min Height"><input className={inputClass} placeholder="auto or 48px" value={s.minHeight || ""} onChange={(e) => updateWidget("style", "minHeight", e.target.value)} /></Field>
                </Row>
                <Row>
                  <Field label="Width"><input className={inputClass} placeholder="auto or 100%" value={s.width || ""} onChange={(e) => updateWidget("style", "width", e.target.value)} /></Field>
                  <Field label="Max Width"><input className={inputClass} placeholder="720px" value={s.maxWidth || ""} onChange={(e) => updateWidget("style", "maxWidth", e.target.value)} /></Field>
                </Row>
                <Row>
                  <Field label="Padding"><input className={inputClass} placeholder="0px" value={s.padding || ""} onChange={(e) => updateWidget("style", "padding", e.target.value)} /></Field>
                  <Field label="Margin"><input className={inputClass} placeholder="0px" value={s.margin || ""} onChange={(e) => updateWidget("style", "margin", e.target.value)} /></Field>
                </Row>
                <Field label="Transition Duration"><input className={inputClass} placeholder="0.25s" value={s.transitionDuration || ""} onChange={(e) => updateWidget("style", "transitionDuration", e.target.value)} /></Field>
              </Section>

              <Section title="Border & Container">
                <Row>
                  <Field label="Border Width"><input className={inputClass} placeholder="0px" value={s.border?.width || ""} onChange={(e) => updateBorder("width", e.target.value)} /></Field>
                  <Field label="Border Style">
                    <select className={selectClass} value={s.border?.style || "solid"} onChange={(e) => updateBorder("style", e.target.value)}>
                      <option value="solid">Solid</option>
                      <option value="dashed">Dashed</option>
                      <option value="dotted">Dotted</option>
                      <option value="double">Double</option>
                      <option value="none">None</option>
                    </select>
                  </Field>
                </Row>
                <Row>
                  <Field label="Border Color"><input className={inputClass} type="color" value={s.border?.color || "#e5e7eb"} onChange={(e) => updateBorder("color", e.target.value)} /></Field>
                  <Field label="Border Radius"><input className={inputClass} placeholder="0px" value={s.border?.radius || ""} onChange={(e) => updateBorder("radius", e.target.value)} /></Field>
                </Row>
              </Section>
            </>
          )}

          {isHeading && (
            <>
              <Section title="Typography">
                <Row>
                  <Field label="Font Size"><input className={inputClass} placeholder="clamp(32px, 5vw, 56px)" value={s.typography?.fontSize || ""} onChange={(e) => updateTypography("fontSize", e.target.value)} /></Field>
                  <Field label="Font Weight"><input className={inputClass} placeholder="800" value={s.typography?.fontWeight || ""} onChange={(e) => updateTypography("fontWeight", e.target.value)} /></Field>
                </Row>
                <Row>
                  <Field label="Font Family"><input className={inputClass} placeholder="inherit" value={s.typography?.fontFamily || ""} onChange={(e) => updateTypography("fontFamily", e.target.value)} /></Field>
                  <Field label="Line Height"><input className={inputClass} placeholder="1.05" value={s.typography?.lineHeight || ""} onChange={(e) => updateTypography("lineHeight", e.target.value)} /></Field>
                </Row>
                <Row>
                  <Field label="Letter Spacing"><input className={inputClass} placeholder="-0.03em" value={s.typography?.letterSpacing || ""} onChange={(e) => updateTypography("letterSpacing", e.target.value)} /></Field>
                  <Field label="Text Transform">
                    <select className={selectClass} value={s.typography?.textTransform || "none"} onChange={(e) => updateTypography("textTransform", e.target.value)}>
                      <option value="none">None</option>
                      <option value="uppercase">Uppercase</option>
                      <option value="lowercase">Lowercase</option>
                      <option value="capitalize">Capitalize</option>
                    </select>
                  </Field>
                </Row>
                <Row>
                  <Field label="Text Decoration">
                    <select className={selectClass} value={s.typography?.textDecoration || "none"} onChange={(e) => updateTypography("textDecoration", e.target.value)}>
                      <option value="none">None</option>
                      <option value="underline">Underline</option>
                      <option value="line-through">Line Through</option>
                    </select>
                  </Field>
                  <Field label="Font Style">
                    <select className={selectClass} value={s.typography?.fontStyle || "normal"} onChange={(e) => updateTypography("fontStyle", e.target.value)}>
                      <option value="normal">Normal</option>
                      <option value="italic">Italic</option>
                    </select>
                  </Field>
                </Row>
              </Section>

              <Section title="Colors & Highlight">
                <Row>
                  <Field label="Text Color"><input className={inputClass} type="color" value={s.textColor || "#111827"} onChange={(e) => updateWidget("style", "textColor", e.target.value)} /></Field>
                  <Field label="Opacity"><input className={inputClass} type="number" step="0.1" min="0" max="1" value={s.opacity ?? 1} onChange={(e) => updateWidget("style", "opacity", Number(e.target.value))} /></Field>
                </Row>
                <Field label="Text Shadow"><input className={inputClass} placeholder="none" value={s.textShadow || ""} onChange={(e) => updateWidget("style", "textShadow", e.target.value)} /></Field>
                <Row>
                  <Field label="Highlight Color"><input className={inputClass} type="color" value={s.highlight?.color || "#1d4ed8"} onChange={(e) => updateWidget("style", "highlight", { ...(s.highlight || {}), color: e.target.value })} /></Field>
                  <Field label="Highlight Radius"><input className={inputClass} placeholder="0px" value={s.highlight?.radius || ""} onChange={(e) => updateWidget("style", "highlight", { ...(s.highlight || {}), radius: e.target.value })} /></Field>
                </Row>
                <Row>
                  <Field label="Highlight Background"><input className={inputClass} placeholder="transparent or #eff6ff" value={s.highlight?.background || ""} onChange={(e) => updateWidget("style", "highlight", { ...(s.highlight || {}), background: e.target.value })} /></Field>
                  <Field label="Highlight Padding"><input className={inputClass} placeholder="0px 4px" value={s.highlight?.padding || ""} onChange={(e) => updateWidget("style", "highlight", { ...(s.highlight || {}), padding: e.target.value })} /></Field>
                </Row>
              </Section>

              <Section title="Layout">
                <Row>
                  <Field label="Alignment">
                    <select className={selectClass} value={s.alignment || "left"} onChange={(e) => updateWidget("style", "alignment", e.target.value)}>
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                    </select>
                  </Field>
                  <Field label="Min Height"><input className={inputClass} placeholder="auto or 48px" value={s.minHeight || ""} onChange={(e) => updateWidget("style", "minHeight", e.target.value)} /></Field>
                </Row>
                <Row>
                  <Field label="Width"><input className={inputClass} placeholder="100%" value={s.width || ""} onChange={(e) => updateWidget("style", "width", e.target.value)} /></Field>
                  <Field label="Max Width"><input className={inputClass} placeholder="900px" value={s.maxWidth || ""} onChange={(e) => updateWidget("style", "maxWidth", e.target.value)} /></Field>
                </Row>
                <Row>
                  <Field label="Padding"><input className={inputClass} placeholder="0px" value={s.padding || ""} onChange={(e) => updateWidget("style", "padding", e.target.value)} /></Field>
                  <Field label="Margin"><input className={inputClass} placeholder="0px 0px 28px 0px" value={s.margin || ""} onChange={(e) => updateWidget("style", "margin", e.target.value)} /></Field>
                </Row>
                <Field label="Background"><input className={inputClass} placeholder="transparent or linear-gradient(...)" value={s.background || ""} onChange={(e) => updateWidget("style", "background", e.target.value)} /></Field>
                <Field label="Box Shadow"><input className={inputClass} placeholder="none" value={s.boxShadow || ""} onChange={(e) => updateWidget("style", "boxShadow", e.target.value)} /></Field>
              </Section>

              <Section title="Border">
                <Row>
                  <Field label="Border Width"><input className={inputClass} placeholder="0px" value={s.border?.width || ""} onChange={(e) => updateBorder("width", e.target.value)} /></Field>
                  <Field label="Border Style">
                    <select className={selectClass} value={s.border?.style || "solid"} onChange={(e) => updateBorder("style", e.target.value)}>
                      <option value="solid">Solid</option>
                      <option value="dashed">Dashed</option>
                      <option value="dotted">Dotted</option>
                      <option value="double">Double</option>
                      <option value="none">None</option>
                    </select>
                  </Field>
                </Row>
                <Row>
                  <Field label="Border Color"><input className={inputClass} type="color" value={s.border?.color || "#e5e7eb"} onChange={(e) => updateBorder("color", e.target.value)} /></Field>
                  <Field label="Radius"><input className={inputClass} placeholder="0px" value={s.border?.radius || ""} onChange={(e) => updateBorder("radius", e.target.value)} /></Field>
                </Row>
              </Section>

              <Section title="Eyebrow & Subtitle">
                <Row>
                  <Field label="Eyebrow Color"><input className={inputClass} type="color" value={s.eyebrow?.color || "#2563eb"} onChange={(e) => updateWidget("style", "eyebrow", { ...(s.eyebrow || {}), color: e.target.value })} /></Field>
                  <Field label="Eyebrow Size"><input className={inputClass} placeholder="13px" value={s.eyebrow?.fontSize || ""} onChange={(e) => updateWidget("style", "eyebrow", { ...(s.eyebrow || {}), fontSize: e.target.value })} /></Field>
                </Row>
                <Row>
                  <Field label="Eyebrow Weight"><input className={inputClass} placeholder="700" value={s.eyebrow?.fontWeight || ""} onChange={(e) => updateWidget("style", "eyebrow", { ...(s.eyebrow || {}), fontWeight: e.target.value })} /></Field>
                  <Field label="Eyebrow Spacing"><input className={inputClass} placeholder="0.18em" value={s.eyebrow?.letterSpacing || ""} onChange={(e) => updateWidget("style", "eyebrow", { ...(s.eyebrow || {}), letterSpacing: e.target.value })} /></Field>
                </Row>
                <Row>
                  <Field label="Eyebrow Transform">
                    <select className={selectClass} value={s.eyebrow?.textTransform || "uppercase"} onChange={(e) => updateWidget("style", "eyebrow", { ...(s.eyebrow || {}), textTransform: e.target.value })}>
                      <option value="uppercase">Uppercase</option>
                      <option value="none">None</option>
                      <option value="lowercase">Lowercase</option>
                      <option value="capitalize">Capitalize</option>
                    </select>
                  </Field>
                  <Field label="Eyebrow Bottom"><input className={inputClass} placeholder="14px" value={s.eyebrow?.marginBottom || ""} onChange={(e) => updateWidget("style", "eyebrow", { ...(s.eyebrow || {}), marginBottom: e.target.value })} /></Field>
                </Row>
                <Row>
                  <Field label="Subtitle Color"><input className={inputClass} type="color" value={s.subtitle?.color || "#6b7280"} onChange={(e) => updateWidget("style", "subtitle", { ...(s.subtitle || {}), color: e.target.value })} /></Field>
                  <Field label="Subtitle Size"><input className={inputClass} placeholder="18px" value={s.subtitle?.fontSize || ""} onChange={(e) => updateWidget("style", "subtitle", { ...(s.subtitle || {}), fontSize: e.target.value })} /></Field>
                </Row>
                <Row>
                  <Field label="Subtitle Weight"><input className={inputClass} placeholder="400" value={s.subtitle?.fontWeight || ""} onChange={(e) => updateWidget("style", "subtitle", { ...(s.subtitle || {}), fontWeight: e.target.value })} /></Field>
                  <Field label="Subtitle Line Height"><input className={inputClass} placeholder="1.7" value={s.subtitle?.lineHeight || ""} onChange={(e) => updateWidget("style", "subtitle", { ...(s.subtitle || {}), lineHeight: e.target.value })} /></Field>
                </Row>
                <Row>
                  <Field label="Subtitle Spacing"><input className={inputClass} placeholder="16px" value={s.subtitle?.marginTop || ""} onChange={(e) => updateWidget("style", "subtitle", { ...(s.subtitle || {}), marginTop: e.target.value })} /></Field>
                  <Field label="Subtitle Max Width"><input className={inputClass} placeholder="720px" value={s.subtitle?.maxWidth || ""} onChange={(e) => updateWidget("style", "subtitle", { ...(s.subtitle || {}), maxWidth: e.target.value })} /></Field>
                </Row>
              </Section>
            </>
          )}

          {isParagraph && (
            <>
              <Section title="Typography">
                <Row>
                  <Field label="Font Size"><input className={inputClass} placeholder="17px" value={s.typography?.fontSize || ""} onChange={(e) => updateTypography("fontSize", e.target.value)} /></Field>
                  <Field label="Font Weight"><input className={inputClass} placeholder="400" value={s.typography?.fontWeight || ""} onChange={(e) => updateTypography("fontWeight", e.target.value)} /></Field>
                </Row>
                <Row>
                  <Field label="Font Family"><input className={inputClass} placeholder="inherit" value={s.typography?.fontFamily || ""} onChange={(e) => updateTypography("fontFamily", e.target.value)} /></Field>
                  <Field label="Line Height"><input className={inputClass} placeholder="1.85" value={s.typography?.lineHeight || ""} onChange={(e) => updateTypography("lineHeight", e.target.value)} /></Field>
                </Row>
                <Row>
                  <Field label="Letter Spacing"><input className={inputClass} placeholder="0px" value={s.typography?.letterSpacing || ""} onChange={(e) => updateTypography("letterSpacing", e.target.value)} /></Field>
                  <Field label="Text Transform">
                    <select className={selectClass} value={s.typography?.textTransform || "none"} onChange={(e) => updateTypography("textTransform", e.target.value)}>
                      <option value="none">None</option>
                      <option value="uppercase">Uppercase</option>
                      <option value="lowercase">Lowercase</option>
                      <option value="capitalize">Capitalize</option>
                    </select>
                  </Field>
                </Row>
                <Row>
                  <Field label="Text Decoration">
                    <select className={selectClass} value={s.typography?.textDecoration || "none"} onChange={(e) => updateTypography("textDecoration", e.target.value)}>
                      <option value="none">None</option>
                      <option value="underline">Underline</option>
                      <option value="line-through">Line Through</option>
                    </select>
                  </Field>
                  <Field label="Font Style">
                    <select className={selectClass} value={s.typography?.fontStyle || "normal"} onChange={(e) => updateTypography("fontStyle", e.target.value)}>
                      <option value="normal">Normal</option>
                      <option value="italic">Italic</option>
                    </select>
                  </Field>
                </Row>
              </Section>

              <Section title="Colors & Effects">
                <Row>
                  <Field label="Text Color"><input className={inputClass} type="color" value={s.textColor || "#374151"} onChange={(e) => updateWidget("style", "textColor", e.target.value)} /></Field>
                  <Field label="Opacity"><input className={inputClass} type="number" step="0.1" min="0" max="1" value={s.opacity ?? 1} onChange={(e) => updateWidget("style", "opacity", Number(e.target.value))} /></Field>
                </Row>
                <Field label="Background CSS"><input className={inputClass} placeholder="transparent or linear-gradient(...)" value={s.background || ""} onChange={(e) => updateWidget("style", "background", e.target.value)} /></Field>
                <Field label="Text Shadow"><input className={inputClass} placeholder="none" value={s.textShadow || ""} onChange={(e) => updateWidget("style", "textShadow", e.target.value)} /></Field>
                <Field label="Box Shadow"><input className={inputClass} placeholder="none" value={s.boxShadow || ""} onChange={(e) => updateWidget("style", "boxShadow", e.target.value)} /></Field>
              </Section>

              <Section title="Layout">
                <Row>
                  <Field label="Alignment">
                    <select className={selectClass} value={s.alignment || "left"} onChange={(e) => updateWidget("style", "alignment", e.target.value)}>
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                      <option value="justify">Justify</option>
                    </select>
                  </Field>
                  <Field label="Min Height"><input className={inputClass} placeholder="auto or 48px" value={s.minHeight || ""} onChange={(e) => updateWidget("style", "minHeight", e.target.value)} /></Field>
                </Row>
                <Row>
                  <Field label="Width"><input className={inputClass} placeholder="100%" value={s.width || ""} onChange={(e) => updateWidget("style", "width", e.target.value)} /></Field>
                  <Field label="Max Width"><input className={inputClass} placeholder="760px" value={s.maxWidth || ""} onChange={(e) => updateWidget("style", "maxWidth", e.target.value)} /></Field>
                </Row>
                <Row>
                  <Field label="Padding"><input className={inputClass} placeholder="0px" value={s.padding || ""} onChange={(e) => updateWidget("style", "padding", e.target.value)} /></Field>
                  <Field label="Margin"><input className={inputClass} placeholder="0px 0px 18px 0px" value={s.margin || ""} onChange={(e) => updateWidget("style", "margin", e.target.value)} /></Field>
                </Row>
                <Field label="Transition Duration"><input className={inputClass} placeholder="0.25s" value={s.transitionDuration || ""} onChange={(e) => updateWidget("style", "transitionDuration", e.target.value)} /></Field>
              </Section>

              <Section title="Border & Container">
                <Row>
                  <Field label="Border Width"><input className={inputClass} placeholder="0px" value={s.border?.width || ""} onChange={(e) => updateBorder("width", e.target.value)} /></Field>
                  <Field label="Border Style">
                    <select className={selectClass} value={s.border?.style || "solid"} onChange={(e) => updateBorder("style", e.target.value)}>
                      <option value="solid">Solid</option>
                      <option value="dashed">Dashed</option>
                      <option value="dotted">Dotted</option>
                      <option value="double">Double</option>
                      <option value="none">None</option>
                    </select>
                  </Field>
                </Row>
                <Row>
                  <Field label="Border Color"><input className={inputClass} type="color" value={s.border?.color || "#e5e7eb"} onChange={(e) => updateBorder("color", e.target.value)} /></Field>
                  <Field label="Border Radius"><input className={inputClass} placeholder="0px" value={s.border?.radius || ""} onChange={(e) => updateBorder("radius", e.target.value)} /></Field>
                </Row>
              </Section>
            </>
          )}

          {isButton && (
            <>
              <Section title="Typography">
                <Row>
                  <Field label="Font Size"><input className={inputClass} placeholder="16px" value={s.typography?.fontSize || ""} onChange={(e) => updateTypography("fontSize", e.target.value)} /></Field>
                  <Field label="Font Weight"><input className={inputClass} placeholder="600" value={s.typography?.fontWeight || ""} onChange={(e) => updateTypography("fontWeight", e.target.value)} /></Field>
                </Row>
                <Row>
                  <Field label="Font Family"><input className={inputClass} placeholder="inherit" value={s.typography?.fontFamily || ""} onChange={(e) => updateTypography("fontFamily", e.target.value)} /></Field>
                  <Field label="Line Height"><input className={inputClass} placeholder="1" value={s.typography?.lineHeight || ""} onChange={(e) => updateTypography("lineHeight", e.target.value)} /></Field>
                </Row>
                <Row>
                  <Field label="Letter Spacing"><input className={inputClass} placeholder="0px" value={s.typography?.letterSpacing || ""} onChange={(e) => updateTypography("letterSpacing", e.target.value)} /></Field>
                  <Field label="Text Transform">
                    <select className={selectClass} value={s.typography?.textTransform || "none"} onChange={(e) => updateTypography("textTransform", e.target.value)}>
                      <option value="none">None</option>
                      <option value="uppercase">Uppercase</option>
                      <option value="lowercase">Lowercase</option>
                      <option value="capitalize">Capitalize</option>
                    </select>
                  </Field>
                </Row>
              </Section>

              <Section title="Normal State">
                <Field label="Background CSS"><input className={inputClass} placeholder="linear-gradient(...) or #2563eb" value={s.background || ""} onChange={(e) => updateWidget("style", "background", e.target.value)} /></Field>
                <Row>
                  <Field label="Text Color"><input className={inputClass} type="color" value={s.textColor || "#ffffff"} onChange={(e) => updateWidget("style", "textColor", e.target.value)} /></Field>
                  <Field label="Border Color"><input className={inputClass} type="color" value={s.border?.color || "#2563eb"} onChange={(e) => updateBorder("color", e.target.value)} /></Field>
                </Row>
                <Field label="Box Shadow"><input className={inputClass} placeholder="0 10px 25px rgba(37, 99, 235, 0.22)" value={s.boxShadow || ""} onChange={(e) => updateWidget("style", "boxShadow", e.target.value)} /></Field>
                <Field label="Text Shadow"><input className={inputClass} placeholder="none" value={s.textShadow || ""} onChange={(e) => updateWidget("style", "textShadow", e.target.value)} /></Field>
              </Section>
              <Section title="Hover State">
                <Field label="Hover Background CSS"><input className={inputClass} placeholder="linear-gradient(...) or #1d4ed8" value={s.hover?.background || ""} onChange={(e) => updateHover("background", e.target.value)} /></Field>
                <Row>
                  <Field label="Hover Text Color"><input className={inputClass} type="color" value={s.hover?.textColor || "#ffffff"} onChange={(e) => updateHover("textColor", e.target.value)} /></Field>
                  <Field label="Hover Border Color"><input className={inputClass} type="color" value={s.hover?.borderColor || s.border?.color || "#2563eb"} onChange={(e) => updateHover("borderColor", e.target.value)} /></Field>
                </Row>
                <Field label="Hover Box Shadow"><input className={inputClass} placeholder="0 16px 35px rgba(...)" value={s.hover?.boxShadow || ""} onChange={(e) => updateHover("boxShadow", e.target.value)} /></Field>
                <Row>
                  <Field label="Lift / Translate Y"><input className={inputClass} placeholder="-2px" value={s.hover?.translateY || ""} onChange={(e) => updateHover("translateY", e.target.value)} /></Field>
                  <Field label="Transition Duration"><input className={inputClass} placeholder="0.25s" value={s.transitionDuration || ""} onChange={(e) => updateWidget("style", "transitionDuration", e.target.value)} /></Field>
                </Row>
              </Section>

              <Section title="Border & Radius">
                <Row>
                  <Field label="Border Width"><input className={inputClass} placeholder="1px" value={s.border?.width || ""} onChange={(e) => updateBorder("width", e.target.value)} /></Field>
                  <Field label="Border Style">
                    <select className={selectClass} value={s.border?.style || "solid"} onChange={(e) => updateBorder("style", e.target.value)}>
                      <option value="solid">Solid</option>
                      <option value="dashed">Dashed</option>
                      <option value="dotted">Dotted</option>
                      <option value="double">Double</option>
                      <option value="none">None</option>
                    </select>
                  </Field>
                </Row>
                <Field label="Border Radius"><input className={inputClass} placeholder="999px" value={s.border?.radius || ""} onChange={(e) => updateBorder("radius", e.target.value)} /></Field>
              </Section>

              <Section title="Spacing & Width">
                <Row>
                  <Field label="Padding"><input className={inputClass} placeholder="14px 28px" value={s.padding || ""} onChange={(e) => updateWidget("style", "padding", e.target.value)} /></Field>
                  <Field label="Margin"><input className={inputClass} placeholder="0px" value={s.margin || ""} onChange={(e) => updateWidget("style", "margin", e.target.value)} /></Field>
                </Row>
                <Row>
                  <Field label="Width"><input className={inputClass} placeholder="auto or 260px" value={s.width || ""} onChange={(e) => updateWidget("style", "width", e.target.value)} /></Field>
                  <Field label="Min Width"><input className={inputClass} placeholder="160px" value={s.minWidth || ""} onChange={(e) => updateWidget("style", "minWidth", e.target.value)} /></Field>
                </Row>
              </Section>
            </>
          )}

          {isImage && (
            <>
              <Section title="Layout">
                <Row>
                  <Field label="Alignment">
                    <select className={selectClass} value={s.alignment || "left"} onChange={(e) => updateWidget("style", "alignment", e.target.value)}>
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                    </select>
                  </Field>
                  <Field label="Aspect Ratio"><input className={inputClass} placeholder="16 / 9" value={s.aspectRatio || ""} onChange={(e) => updateWidget("style", "aspectRatio", e.target.value)} /></Field>
                </Row>
                <Row>
                  <Field label="Width"><input className={inputClass} placeholder="100%" value={s.width || ""} onChange={(e) => updateWidget("style", "width", e.target.value)} /></Field>
                  <Field label="Max Width"><input className={inputClass} placeholder="720px" value={s.maxWidth || ""} onChange={(e) => updateWidget("style", "maxWidth", e.target.value)} /></Field>
                </Row>
                <Row>
                  <Field label="Height"><input className={inputClass} placeholder="auto or 420px" value={s.height || ""} onChange={(e) => updateWidget("style", "height", e.target.value)} /></Field>
                  <Field label="Min Height"><input className={inputClass} placeholder="auto or 240px" value={s.minHeight || ""} onChange={(e) => updateWidget("style", "minHeight", e.target.value)} /></Field>
                </Row>
                <Row>
                  <Field label="Object Fit">
                    <select className={selectClass} value={s.objectFit || "cover"} onChange={(e) => updateWidget("style", "objectFit", e.target.value)}>
                      <option value="cover">Cover</option>
                      <option value="contain">Contain</option>
                      <option value="fill">Fill</option>
                      <option value="none">None</option>
                      <option value="scale-down">Scale Down</option>
                    </select>
                  </Field>
                  <Field label="Object Position"><input className={inputClass} placeholder="center center" value={s.objectPosition || ""} onChange={(e) => updateWidget("style", "objectPosition", e.target.value)} /></Field>
                </Row>
              </Section>

              <Section title="Frame & Effects">
                <Row>
                  <Field label="Opacity"><input className={inputClass} type="number" step="0.1" min="0" max="1" value={s.opacity ?? 1} onChange={(e) => updateWidget("style", "opacity", Number(e.target.value))} /></Field>
                  <Field label="Transition Duration"><input className={inputClass} placeholder="0.3s" value={s.transitionDuration || ""} onChange={(e) => updateWidget("style", "transitionDuration", e.target.value)} /></Field>
                </Row>
                <Field label="Background CSS"><input className={inputClass} placeholder="transparent" value={s.background || ""} onChange={(e) => updateWidget("style", "background", e.target.value)} /></Field>
                <Field label="CSS Filter"><input className={inputClass} placeholder="none or grayscale(100%)" value={s.filter || ""} onChange={(e) => updateWidget("style", "filter", e.target.value)} /></Field>
                <Field label="Box Shadow"><input className={inputClass} placeholder="0 18px 40px rgba(15, 23, 42, 0.14)" value={s.boxShadow || ""} onChange={(e) => updateWidget("style", "boxShadow", e.target.value)} /></Field>
              </Section>

              <Section title="Overlay">
                <Row>
                  <Field label="Overlay Color"><input className={inputClass} placeholder="rgba(15, 23, 42, 0.2) or #000000" value={s.overlay?.color || ""} onChange={(e) => updateWidget("style", "overlay", { ...(s.overlay || {}), color: e.target.value })} /></Field>
                  <Field label="Overlay Opacity"><input className={inputClass} type="number" step="0.05" min="0" max="1" value={s.overlay?.opacity ?? 0} onChange={(e) => updateWidget("style", "overlay", { ...(s.overlay || {}), opacity: Number(e.target.value) })} /></Field>
                </Row>
              </Section>

              <Section title="Hover State">
                <Row>
                  <Field label="Hover Opacity"><input className={inputClass} type="number" step="0.1" min="0" max="1" value={s.hover?.opacity ?? 1} onChange={(e) => updateHover("opacity", Number(e.target.value))} /></Field>
                  <Field label="Hover Scale"><input className={inputClass} placeholder="1.02" value={s.hover?.scale || ""} onChange={(e) => updateHover("scale", e.target.value)} /></Field>
                </Row>
                <Row>
                  <Field label="Hover Rotate"><input className={inputClass} placeholder="0deg" value={s.hover?.rotate || ""} onChange={(e) => updateHover("rotate", e.target.value)} /></Field>
                  <Field label="Hover Overlay Opacity"><input className={inputClass} type="number" step="0.05" min="0" max="1" value={s.hover?.overlayOpacity ?? 0} onChange={(e) => updateHover("overlayOpacity", Number(e.target.value))} /></Field>
                </Row>
                <Field label="Hover Filter"><input className={inputClass} placeholder="none or brightness(0.9)" value={s.hover?.filter || ""} onChange={(e) => updateHover("filter", e.target.value)} /></Field>
                <Field label="Hover Shadow"><input className={inputClass} placeholder="0 24px 50px rgba(...)" value={s.hover?.boxShadow || ""} onChange={(e) => updateHover("boxShadow", e.target.value)} /></Field>
              </Section>

              <Section title="Border & Spacing">
                <Row>
                  <Field label="Border Width"><input className={inputClass} placeholder="0px" value={s.border?.width || ""} onChange={(e) => updateBorder("width", e.target.value)} /></Field>
                  <Field label="Border Style">
                    <select className={selectClass} value={s.border?.style || "solid"} onChange={(e) => updateBorder("style", e.target.value)}>
                      <option value="solid">Solid</option>
                      <option value="dashed">Dashed</option>
                      <option value="dotted">Dotted</option>
                      <option value="double">Double</option>
                      <option value="none">None</option>
                    </select>
                  </Field>
                </Row>
                <Row>
                  <Field label="Border Color"><input className={inputClass} type="color" value={s.border?.color || "#e5e7eb"} onChange={(e) => updateBorder("color", e.target.value)} /></Field>
                  <Field label="Border Radius"><input className={inputClass} placeholder="24px" value={s.border?.radius || ""} onChange={(e) => updateBorder("radius", e.target.value)} /></Field>
                </Row>
                <Row>
                  <Field label="Padding"><input className={inputClass} placeholder="0px" value={s.padding || ""} onChange={(e) => updateWidget("style", "padding", e.target.value)} /></Field>
                  <Field label="Margin"><input className={inputClass} placeholder="0px" value={s.margin || ""} onChange={(e) => updateWidget("style", "margin", e.target.value)} /></Field>
                </Row>
              </Section>

              <Section title="Caption Style">
                <Row>
                  <Field label="Caption Color"><input className={inputClass} type="color" value={s.caption?.color || "#6b7280"} onChange={(e) => updateWidget("style", "caption", { ...(s.caption || {}), color: e.target.value })} /></Field>
                  <Field label="Caption Align">
                    <select className={selectClass} value={s.caption?.align || "left"} onChange={(e) => updateWidget("style", "caption", { ...(s.caption || {}), align: e.target.value })}>
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                    </select>
                  </Field>
                </Row>
                <Row>
                  <Field label="Caption Font Size"><input className={inputClass} placeholder="14px" value={s.caption?.fontSize || ""} onChange={(e) => updateWidget("style", "caption", { ...(s.caption || {}), fontSize: e.target.value })} /></Field>
                  <Field label="Caption Weight"><input className={inputClass} placeholder="400" value={s.caption?.fontWeight || ""} onChange={(e) => updateWidget("style", "caption", { ...(s.caption || {}), fontWeight: e.target.value })} /></Field>
                </Row>
                <Row>
                  <Field label="Caption Line Height"><input className={inputClass} placeholder="1.6" value={s.caption?.lineHeight || ""} onChange={(e) => updateWidget("style", "caption", { ...(s.caption || {}), lineHeight: e.target.value })} /></Field>
                  <Field label="Caption Spacing"><input className={inputClass} placeholder="12px" value={s.caption?.spacing || ""} onChange={(e) => updateWidget("style", "caption", { ...(s.caption || {}), spacing: e.target.value })} /></Field>
                </Row>
                <Row>
                  <Field label="Caption Background"><input className={inputClass} placeholder="transparent" value={s.caption?.background || ""} onChange={(e) => updateWidget("style", "caption", { ...(s.caption || {}), background: e.target.value })} /></Field>
                  <Field label="Caption Padding"><input className={inputClass} placeholder="0px" value={s.caption?.padding || ""} onChange={(e) => updateWidget("style", "caption", { ...(s.caption || {}), padding: e.target.value })} /></Field>
                </Row>
              </Section>
            </>
          )}

          {isImageCarousel && (
            <>
              <Section title="Frame">
                <Row>
                  <Field label="Alignment">
                    <select className={selectClass} value={s.alignment || "left"} onChange={(e) => updateWidget("style", "alignment", e.target.value)}>
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                    </select>
                  </Field>
                  <Field label="Aspect Ratio"><input className={inputClass} placeholder="16 / 9" value={s.aspectRatio || ""} onChange={(e) => updateWidget("style", "aspectRatio", e.target.value)} /></Field>
                </Row>
                <Row>
                  <Field label="Width"><input className={inputClass} placeholder="100%" value={s.width || ""} onChange={(e) => updateWidget("style", "width", e.target.value)} /></Field>
                  <Field label="Max Width"><input className={inputClass} placeholder="960px" value={s.maxWidth || ""} onChange={(e) => updateWidget("style", "maxWidth", e.target.value)} /></Field>
                </Row>
                <Row>
                  <Field label="Min Height"><input className={inputClass} placeholder="320px" value={s.minHeight || ""} onChange={(e) => updateWidget("style", "minHeight", e.target.value)} /></Field>
                  <Field label="Frame BG"><input className={inputClass} placeholder="#0f172a" value={s.frameBackground || ""} onChange={(e) => updateWidget("style", "frameBackground", e.target.value)} /></Field>
                </Row>
                <Row>
                  <Field label="Padding"><input className={inputClass} placeholder="0px" value={s.padding || ""} onChange={(e) => updateWidget("style", "padding", e.target.value)} /></Field>
                  <Field label="Margin"><input className={inputClass} placeholder="0px" value={s.margin || ""} onChange={(e) => updateWidget("style", "margin", e.target.value)} /></Field>
                </Row>
                <Field label="Background"><input className={inputClass} placeholder="transparent or linear-gradient(...)" value={s.background || ""} onChange={(e) => updateWidget("style", "background", e.target.value)} /></Field>
                <Field label="Box Shadow"><input className={inputClass} placeholder="0 24px 70px rgba(...)" value={s.boxShadow || ""} onChange={(e) => updateWidget("style", "boxShadow", e.target.value)} /></Field>
                <Field label="Transition Duration"><input className={inputClass} placeholder="0.45s" value={s.transitionDuration || ""} onChange={(e) => updateWidget("style", "transitionDuration", e.target.value)} /></Field>
              </Section>

              <Section title="Media">
                <Row>
                  <Field label="Object Fit">
                    <select className={selectClass} value={s.objectFit || "cover"} onChange={(e) => updateWidget("style", "objectFit", e.target.value)}>
                      <option value="cover">Cover</option>
                      <option value="contain">Contain</option>
                      <option value="fill">Fill</option>
                      <option value="none">None</option>
                    </select>
                  </Field>
                  <Field label="Object Position"><input className={inputClass} placeholder="center center" value={s.objectPosition || ""} onChange={(e) => updateWidget("style", "objectPosition", e.target.value)} /></Field>
                </Row>
              </Section>

              <Section title="Border & Overlay">
                <Row>
                  <Field label="Border Width"><input className={inputClass} placeholder="0px" value={s.border?.width || ""} onChange={(e) => updateBorder("width", e.target.value)} /></Field>
                  <Field label="Border Style">
                    <select className={selectClass} value={s.border?.style || "solid"} onChange={(e) => updateBorder("style", e.target.value)}>
                      <option value="solid">Solid</option>
                      <option value="dashed">Dashed</option>
                      <option value="dotted">Dotted</option>
                      <option value="double">Double</option>
                      <option value="none">None</option>
                    </select>
                  </Field>
                </Row>
                <Row>
                  <Field label="Border Color"><input className={inputClass} type="color" value={s.border?.color || "#e5e7eb"} onChange={(e) => updateBorder("color", e.target.value)} /></Field>
                  <Field label="Radius"><input className={inputClass} placeholder="28px" value={s.border?.radius || ""} onChange={(e) => updateBorder("radius", e.target.value)} /></Field>
                </Row>
                <Row>
                  <Field label="Overlay Color"><input className={inputClass} placeholder="rgba(15, 23, 42, 0.12)" value={s.overlay?.color || ""} onChange={(e) => updateWidget("style", "overlay", { ...(s.overlay || {}), color: e.target.value })} /></Field>
                  <Field label="Overlay Opacity"><input className={inputClass} type="number" step="0.05" min="0" max="1" value={s.overlay?.opacity ?? 0} onChange={(e) => updateWidget("style", "overlay", { ...(s.overlay || {}), opacity: Number(e.target.value) })} /></Field>
                </Row>
              </Section>

              <Section title="Arrows">
                <Row>
                  <Field label="Arrow Size"><input className={inputClass} placeholder="46px" value={s.arrows?.size || ""} onChange={(e) => updateWidget("style", "arrows", { ...(s.arrows || {}), size: e.target.value })} /></Field>
                  <Field label="Icon Size"><input className={inputClass} placeholder="20" value={s.arrows?.iconSize || ""} onChange={(e) => updateWidget("style", "arrows", { ...(s.arrows || {}), iconSize: e.target.value })} /></Field>
                </Row>
                <Row>
                  <Field label="Offset"><input className={inputClass} placeholder="18px" value={s.arrows?.offset || ""} onChange={(e) => updateWidget("style", "arrows", { ...(s.arrows || {}), offset: e.target.value })} /></Field>
                  <Field label="Arrow Color"><input className={inputClass} type="color" value={s.arrows?.color || "#ffffff"} onChange={(e) => updateWidget("style", "arrows", { ...(s.arrows || {}), color: e.target.value })} /></Field>
                </Row>
                <Row>
                  <Field label="Arrow BG"><input className={inputClass} placeholder="rgba(255,255,255,0.16)" value={s.arrows?.background || ""} onChange={(e) => updateWidget("style", "arrows", { ...(s.arrows || {}), background: e.target.value })} /></Field>
                  <Field label="Arrow Shadow"><input className={inputClass} placeholder="0 12px 28px rgba(...)" value={s.arrows?.boxShadow || ""} onChange={(e) => updateWidget("style", "arrows", { ...(s.arrows || {}), boxShadow: e.target.value })} /></Field>
                </Row>
              </Section>

              <Section title="Dots & Counter">
                <Row>
                  <Field label="Dot Size"><input className={inputClass} placeholder="10px" value={s.dots?.size || ""} onChange={(e) => updateWidget("style", "dots", { ...(s.dots || {}), size: e.target.value })} /></Field>
                  <Field label="Dot Gap"><input className={inputClass} placeholder="8px" value={s.dots?.gap || ""} onChange={(e) => updateWidget("style", "dots", { ...(s.dots || {}), gap: e.target.value })} /></Field>
                </Row>
                <Row>
                  <Field label="Dot Color"><input className={inputClass} placeholder="rgba(255,255,255,0.45)" value={s.dots?.color || ""} onChange={(e) => updateWidget("style", "dots", { ...(s.dots || {}), color: e.target.value })} /></Field>
                  <Field label="Active Dot"><input className={inputClass} type="color" value={s.dots?.activeColor || "#ffffff"} onChange={(e) => updateWidget("style", "dots", { ...(s.dots || {}), activeColor: e.target.value })} /></Field>
                </Row>
                <Field label="Dots Bottom"><input className={inputClass} placeholder="18px" value={s.dots?.bottom || ""} onChange={(e) => updateWidget("style", "dots", { ...(s.dots || {}), bottom: e.target.value })} /></Field>
                <Row>
                  <Field label="Counter Top"><input className={inputClass} placeholder="18px" value={s.counter?.top || ""} onChange={(e) => updateWidget("style", "counter", { ...(s.counter || {}), top: e.target.value })} /></Field>
                  <Field label="Counter Right"><input className={inputClass} placeholder="18px" value={s.counter?.right || ""} onChange={(e) => updateWidget("style", "counter", { ...(s.counter || {}), right: e.target.value })} /></Field>
                </Row>
                <Row>
                  <Field label="Counter BG"><input className={inputClass} placeholder="rgba(15,23,42,0.58)" value={s.counter?.background || ""} onChange={(e) => updateWidget("style", "counter", { ...(s.counter || {}), background: e.target.value })} /></Field>
                  <Field label="Counter Color"><input className={inputClass} type="color" value={s.counter?.color || "#ffffff"} onChange={(e) => updateWidget("style", "counter", { ...(s.counter || {}), color: e.target.value })} /></Field>
                </Row>
              </Section>

              <Section title="Caption & Placeholder">
                <Row>
                  <Field label="Caption Color"><input className={inputClass} type="color" value={s.caption?.color || "#475569"} onChange={(e) => updateWidget("style", "caption", { ...(s.caption || {}), color: e.target.value })} /></Field>
                  <Field label="Caption Align">
                    <select className={selectClass} value={s.caption?.align || "left"} onChange={(e) => updateWidget("style", "caption", { ...(s.caption || {}), align: e.target.value })}>
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                    </select>
                  </Field>
                </Row>
                <Row>
                  <Field label="Caption Size"><input className={inputClass} placeholder="14px" value={s.caption?.fontSize || ""} onChange={(e) => updateWidget("style", "caption", { ...(s.caption || {}), fontSize: e.target.value })} /></Field>
                  <Field label="Caption Weight"><input className={inputClass} placeholder="400" value={s.caption?.fontWeight || ""} onChange={(e) => updateWidget("style", "caption", { ...(s.caption || {}), fontWeight: e.target.value })} /></Field>
                </Row>
                <Row>
                  <Field label="Caption Line Height"><input className={inputClass} placeholder="1.7" value={s.caption?.lineHeight || ""} onChange={(e) => updateWidget("style", "caption", { ...(s.caption || {}), lineHeight: e.target.value })} /></Field>
                  <Field label="Caption Spacing"><input className={inputClass} placeholder="0px" value={s.caption?.letterSpacing || ""} onChange={(e) => updateWidget("style", "caption", { ...(s.caption || {}), letterSpacing: e.target.value })} /></Field>
                </Row>
                <Row>
                  <Field label="Caption BG"><input className={inputClass} placeholder="#ffffff or transparent" value={s.caption?.background || ""} onChange={(e) => updateWidget("style", "caption", { ...(s.caption || {}), background: e.target.value })} /></Field>
                  <Field label="Caption Padding"><input className={inputClass} placeholder="16px 18px" value={s.caption?.padding || ""} onChange={(e) => updateWidget("style", "caption", { ...(s.caption || {}), padding: e.target.value })} /></Field>
                </Row>
                <Row>
                  <Field label="Placeholder Color"><input className={inputClass} type="color" value={s.placeholder?.color || "#cbd5e1"} onChange={(e) => updateWidget("style", "placeholder", { ...(s.placeholder || {}), color: e.target.value })} /></Field>
                  <Field label="Placeholder BG"><input className={inputClass} placeholder="linear-gradient(...)" value={s.placeholder?.background || ""} onChange={(e) => updateWidget("style", "placeholder", { ...(s.placeholder || {}), background: e.target.value })} /></Field>
                </Row>
              </Section>
            </>
          )}

          {isIconBox && (
            <>
              <Section title="Card">
                <Row>
                  <Field label="Alignment">
                    <select className={selectClass} value={s.alignment || "left"} onChange={(e) => updateWidget("style", "alignment", e.target.value)}>
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                    </select>
                  </Field>
                  <Field label="Gap"><input className={inputClass} placeholder="18px" value={s.gap || ""} onChange={(e) => updateWidget("style", "gap", e.target.value)} /></Field>
                </Row>
                <Row>
                  <Field label="Width"><input className={inputClass} placeholder="100%" value={s.width || ""} onChange={(e) => updateWidget("style", "width", e.target.value)} /></Field>
                  <Field label="Max Width"><input className={inputClass} placeholder="420px" value={s.maxWidth || ""} onChange={(e) => updateWidget("style", "maxWidth", e.target.value)} /></Field>
                </Row>
                <Row>
                  <Field label="Padding"><input className={inputClass} placeholder="28px" value={s.padding || ""} onChange={(e) => updateWidget("style", "padding", e.target.value)} /></Field>
                  <Field label="Margin"><input className={inputClass} placeholder="0px" value={s.margin || ""} onChange={(e) => updateWidget("style", "margin", e.target.value)} /></Field>
                </Row>
                <Field label="Background"><input className={inputClass} placeholder="#ffffff or linear-gradient(...)" value={s.background || ""} onChange={(e) => updateWidget("style", "background", e.target.value)} /></Field>
                <Field label="Box Shadow"><input className={inputClass} placeholder="0 24px 60px rgba(...)" value={s.boxShadow || ""} onChange={(e) => updateWidget("style", "boxShadow", e.target.value)} /></Field>
              </Section>

              <Section title="Border">
                <Row>
                  <Field label="Border Width"><input className={inputClass} placeholder="1px" value={s.border?.width || ""} onChange={(e) => updateBorder("width", e.target.value)} /></Field>
                  <Field label="Border Style">
                    <select className={selectClass} value={s.border?.style || "solid"} onChange={(e) => updateBorder("style", e.target.value)}>
                      <option value="solid">Solid</option>
                      <option value="dashed">Dashed</option>
                      <option value="dotted">Dotted</option>
                      <option value="double">Double</option>
                      <option value="none">None</option>
                    </select>
                  </Field>
                </Row>
                <Row>
                  <Field label="Border Color"><input className={inputClass} type="color" value={s.border?.color || "#e5e7eb"} onChange={(e) => updateBorder("color", e.target.value)} /></Field>
                  <Field label="Radius"><input className={inputClass} placeholder="28px" value={s.border?.radius || ""} onChange={(e) => updateBorder("radius", e.target.value)} /></Field>
                </Row>
              </Section>

              <Section title="Icon Style">
                <Row>
                  <Field label="Icon Size"><input className={inputClass} type="number" min="8" value={s.icon?.size ?? 26} onChange={(e) => updateWidget("style", "icon", { ...(s.icon || {}), size: Number(e.target.value) })} /></Field>
                  <Field label="Box Size"><input className={inputClass} placeholder="64px" value={s.icon?.boxSize || ""} onChange={(e) => updateWidget("style", "icon", { ...(s.icon || {}), boxSize: e.target.value })} /></Field>
                </Row>
                <Row>
                  <Field label="Icon Color"><input className={inputClass} type="color" value={s.icon?.color || "#1d4ed8"} onChange={(e) => updateWidget("style", "icon", { ...(s.icon || {}), color: e.target.value })} /></Field>
                  <Field label="Icon Radius"><input className={inputClass} placeholder="20px" value={s.icon?.radius || ""} onChange={(e) => updateWidget("style", "icon", { ...(s.icon || {}), radius: e.target.value })} /></Field>
                </Row>
                <Field label="Icon Background"><input className={inputClass} placeholder="linear-gradient(...)" value={s.icon?.background || ""} onChange={(e) => updateWidget("style", "icon", { ...(s.icon || {}), background: e.target.value })} /></Field>
                <Field label="Icon Box Shadow"><input className={inputClass} placeholder="inset 0 1px 0 rgba(...)" value={s.icon?.boxShadow || ""} onChange={(e) => updateWidget("style", "icon", { ...(s.icon || {}), boxShadow: e.target.value })} /></Field>
              </Section>

              <Section title="Eyebrow">
                <Row>
                  <Field label="Color"><input className={inputClass} type="color" value={s.eyebrow?.color || "#2563eb"} onChange={(e) => updateWidget("style", "eyebrow", { ...(s.eyebrow || {}), color: e.target.value })} /></Field>
                  <Field label="Font Size"><input className={inputClass} placeholder="12px" value={s.eyebrow?.fontSize || ""} onChange={(e) => updateWidget("style", "eyebrow", { ...(s.eyebrow || {}), fontSize: e.target.value })} /></Field>
                </Row>
                <Row>
                  <Field label="Font Weight"><input className={inputClass} placeholder="700" value={s.eyebrow?.fontWeight || ""} onChange={(e) => updateWidget("style", "eyebrow", { ...(s.eyebrow || {}), fontWeight: e.target.value })} /></Field>
                  <Field label="Bottom Spacing"><input className={inputClass} placeholder="10px" value={s.eyebrow?.marginBottom || ""} onChange={(e) => updateWidget("style", "eyebrow", { ...(s.eyebrow || {}), marginBottom: e.target.value })} /></Field>
                </Row>
                <Row>
                  <Field label="Letter Spacing"><input className={inputClass} placeholder="0.18em" value={s.eyebrow?.letterSpacing || ""} onChange={(e) => updateWidget("style", "eyebrow", { ...(s.eyebrow || {}), letterSpacing: e.target.value })} /></Field>
                  <Field label="Transform">
                    <select className={selectClass} value={s.eyebrow?.textTransform || "uppercase"} onChange={(e) => updateWidget("style", "eyebrow", { ...(s.eyebrow || {}), textTransform: e.target.value })}>
                      <option value="uppercase">Uppercase</option>
                      <option value="none">None</option>
                      <option value="lowercase">Lowercase</option>
                      <option value="capitalize">Capitalize</option>
                    </select>
                  </Field>
                </Row>
              </Section>

              <Section title="Title & Description">
                <Row>
                  <Field label="Title Color"><input className={inputClass} type="color" value={s.title?.color || "#111827"} onChange={(e) => updateWidget("style", "title", { ...(s.title || {}), color: e.target.value })} /></Field>
                  <Field label="Title Size"><input className={inputClass} placeholder="24px" value={s.title?.fontSize || ""} onChange={(e) => updateWidget("style", "title", { ...(s.title || {}), fontSize: e.target.value })} /></Field>
                </Row>
                <Row>
                  <Field label="Title Weight"><input className={inputClass} placeholder="700" value={s.title?.fontWeight || ""} onChange={(e) => updateWidget("style", "title", { ...(s.title || {}), fontWeight: e.target.value })} /></Field>
                  <Field label="Title Bottom"><input className={inputClass} placeholder="12px" value={s.title?.marginBottom || ""} onChange={(e) => updateWidget("style", "title", { ...(s.title || {}), marginBottom: e.target.value })} /></Field>
                </Row>
                <Row>
                  <Field label="Title Line Height"><input className={inputClass} placeholder="1.2" value={s.title?.lineHeight || ""} onChange={(e) => updateWidget("style", "title", { ...(s.title || {}), lineHeight: e.target.value })} /></Field>
                  <Field label="Title Spacing"><input className={inputClass} placeholder="-0.02em" value={s.title?.letterSpacing || ""} onChange={(e) => updateWidget("style", "title", { ...(s.title || {}), letterSpacing: e.target.value })} /></Field>
                </Row>
                <Row>
                  <Field label="Body Color"><input className={inputClass} type="color" value={s.description?.color || "#6b7280"} onChange={(e) => updateWidget("style", "description", { ...(s.description || {}), color: e.target.value })} /></Field>
                  <Field label="Body Size"><input className={inputClass} placeholder="16px" value={s.description?.fontSize || ""} onChange={(e) => updateWidget("style", "description", { ...(s.description || {}), fontSize: e.target.value })} /></Field>
                </Row>
                <Row>
                  <Field label="Body Weight"><input className={inputClass} placeholder="400" value={s.description?.fontWeight || ""} onChange={(e) => updateWidget("style", "description", { ...(s.description || {}), fontWeight: e.target.value })} /></Field>
                  <Field label="Body Line Height"><input className={inputClass} placeholder="1.7" value={s.description?.lineHeight || ""} onChange={(e) => updateWidget("style", "description", { ...(s.description || {}), lineHeight: e.target.value })} /></Field>
                </Row>
                <Field label="Body Letter Spacing"><input className={inputClass} placeholder="0px" value={s.description?.letterSpacing || ""} onChange={(e) => updateWidget("style", "description", { ...(s.description || {}), letterSpacing: e.target.value })} /></Field>
              </Section>

              <Section title="Link Style">
                <Row>
                  <Field label="Link Color"><input className={inputClass} type="color" value={s.link?.color || "#1d4ed8"} onChange={(e) => updateWidget("style", "link", { ...(s.link || {}), color: e.target.value })} /></Field>
                  <Field label="Link Size"><input className={inputClass} placeholder="15px" value={s.link?.fontSize || ""} onChange={(e) => updateWidget("style", "link", { ...(s.link || {}), fontSize: e.target.value })} /></Field>
                </Row>
                <Row>
                  <Field label="Link Weight"><input className={inputClass} placeholder="600" value={s.link?.fontWeight || ""} onChange={(e) => updateWidget("style", "link", { ...(s.link || {}), fontWeight: e.target.value })} /></Field>
                  <Field label="Top Spacing"><input className={inputClass} placeholder="18px" value={s.link?.marginTop || ""} onChange={(e) => updateWidget("style", "link", { ...(s.link || {}), marginTop: e.target.value })} /></Field>
                </Row>
                <Row>
                  <Field label="Gap"><input className={inputClass} placeholder="8px" value={s.link?.gap || ""} onChange={(e) => updateWidget("style", "link", { ...(s.link || {}), gap: e.target.value })} /></Field>
                  <Field label="Icon Size"><input className={inputClass} type="number" min="8" value={s.link?.iconSize ?? 16} onChange={(e) => updateWidget("style", "link", { ...(s.link || {}), iconSize: Number(e.target.value) })} /></Field>
                </Row>
                <Field label="Line Height"><input className={inputClass} placeholder="1.4" value={s.link?.lineHeight || ""} onChange={(e) => updateWidget("style", "link", { ...(s.link || {}), lineHeight: e.target.value })} /></Field>
              </Section>
            </>
          )}

          {isAccordion && (
            <>
              <Section title="Container">
                <Row>
                  <Field label="Alignment">
                    <select className={selectClass} value={s.alignment || "left"} onChange={(e) => updateWidget("style", "alignment", e.target.value)}>
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                    </select>
                  </Field>
                  <Field label="Max Width"><input className={inputClass} placeholder="860px" value={s.maxWidth || ""} onChange={(e) => updateWidget("style", "maxWidth", e.target.value)} /></Field>
                </Row>
                <Row>
                  <Field label="Width"><input className={inputClass} placeholder="100%" value={s.width || ""} onChange={(e) => updateWidget("style", "width", e.target.value)} /></Field>
                  <Field label="Transition"><input className={inputClass} placeholder="0.25s" value={s.transitionDuration || ""} onChange={(e) => updateWidget("style", "transitionDuration", e.target.value)} /></Field>
                </Row>
                <Row>
                  <Field label="Padding"><input className={inputClass} placeholder="0px" value={s.padding || ""} onChange={(e) => updateWidget("style", "padding", e.target.value)} /></Field>
                  <Field label="Margin"><input className={inputClass} placeholder="0px" value={s.margin || ""} onChange={(e) => updateWidget("style", "margin", e.target.value)} /></Field>
                </Row>
                <Field label="Background"><input className={inputClass} placeholder="transparent or linear-gradient(...)" value={s.background || ""} onChange={(e) => updateWidget("style", "background", e.target.value)} /></Field>
              </Section>

              <Section title="Accordion Item">
                <Row>
                  <Field label="Item Background"><input className={inputClass} placeholder="#ffffff" value={s.item?.background || ""} onChange={(e) => updateWidget("style", "item", { ...(s.item || {}), background: e.target.value })} /></Field>
                  <Field label="Item Spacing"><input className={inputClass} placeholder="14px" value={s.item?.spacing || ""} onChange={(e) => updateWidget("style", "item", { ...(s.item || {}), spacing: e.target.value })} /></Field>
                </Row>
                <Row>
                  <Field label="Border Width"><input className={inputClass} placeholder="1px" value={s.item?.borderWidth || ""} onChange={(e) => updateWidget("style", "item", { ...(s.item || {}), borderWidth: e.target.value })} /></Field>
                  <Field label="Border Style">
                    <select className={selectClass} value={s.item?.borderStyle || "solid"} onChange={(e) => updateWidget("style", "item", { ...(s.item || {}), borderStyle: e.target.value })}>
                      <option value="solid">Solid</option>
                      <option value="dashed">Dashed</option>
                      <option value="dotted">Dotted</option>
                      <option value="double">Double</option>
                      <option value="none">None</option>
                    </select>
                  </Field>
                </Row>
                <Row>
                  <Field label="Border Color"><input className={inputClass} type="color" value={s.item?.borderColor || "#e5e7eb"} onChange={(e) => updateWidget("style", "item", { ...(s.item || {}), borderColor: e.target.value })} /></Field>
                  <Field label="Radius"><input className={inputClass} placeholder="22px" value={s.item?.radius || ""} onChange={(e) => updateWidget("style", "item", { ...(s.item || {}), radius: e.target.value })} /></Field>
                </Row>
                <Field label="Box Shadow"><input className={inputClass} placeholder="0 18px 45px rgba(...)" value={s.item?.boxShadow || ""} onChange={(e) => updateWidget("style", "item", { ...(s.item || {}), boxShadow: e.target.value })} /></Field>
              </Section>

              <Section title="Header">
                <Row>
                  <Field label="Header Color"><input className={inputClass} type="color" value={s.header?.color || "#111827"} onChange={(e) => updateWidget("style", "header", { ...(s.header || {}), color: e.target.value })} /></Field>
                  <Field label="Font Size"><input className={inputClass} placeholder="18px" value={s.header?.fontSize || ""} onChange={(e) => updateWidget("style", "header", { ...(s.header || {}), fontSize: e.target.value })} /></Field>
                </Row>
                <Row>
                  <Field label="Font Weight"><input className={inputClass} placeholder="700" value={s.header?.fontWeight || ""} onChange={(e) => updateWidget("style", "header", { ...(s.header || {}), fontWeight: e.target.value })} /></Field>
                  <Field label="Line Height"><input className={inputClass} placeholder="1.4" value={s.header?.lineHeight || ""} onChange={(e) => updateWidget("style", "header", { ...(s.header || {}), lineHeight: e.target.value })} /></Field>
                </Row>
                <Row>
                  <Field label="Letter Spacing"><input className={inputClass} placeholder="-0.01em" value={s.header?.letterSpacing || ""} onChange={(e) => updateWidget("style", "header", { ...(s.header || {}), letterSpacing: e.target.value })} /></Field>
                  <Field label="Gap"><input className={inputClass} placeholder="16px" value={s.header?.gap || ""} onChange={(e) => updateWidget("style", "header", { ...(s.header || {}), gap: e.target.value })} /></Field>
                </Row>
                <Field label="Header Padding"><input className={inputClass} placeholder="22px 24px" value={s.header?.padding || ""} onChange={(e) => updateWidget("style", "header", { ...(s.header || {}), padding: e.target.value })} /></Field>
              </Section>

              <Section title="Content">
                <Row>
                  <Field label="Content Color"><input className={inputClass} type="color" value={s.content?.color || "#6b7280"} onChange={(e) => updateWidget("style", "content", { ...(s.content || {}), color: e.target.value })} /></Field>
                  <Field label="Font Size"><input className={inputClass} placeholder="16px" value={s.content?.fontSize || ""} onChange={(e) => updateWidget("style", "content", { ...(s.content || {}), fontSize: e.target.value })} /></Field>
                </Row>
                <Row>
                  <Field label="Font Weight"><input className={inputClass} placeholder="400" value={s.content?.fontWeight || ""} onChange={(e) => updateWidget("style", "content", { ...(s.content || {}), fontWeight: e.target.value })} /></Field>
                  <Field label="Line Height"><input className={inputClass} placeholder="1.75" value={s.content?.lineHeight || ""} onChange={(e) => updateWidget("style", "content", { ...(s.content || {}), lineHeight: e.target.value })} /></Field>
                </Row>
                <Row>
                  <Field label="Letter Spacing"><input className={inputClass} placeholder="0px" value={s.content?.letterSpacing || ""} onChange={(e) => updateWidget("style", "content", { ...(s.content || {}), letterSpacing: e.target.value })} /></Field>
                  <Field label="Content Padding"><input className={inputClass} placeholder="0px 24px 22px" value={s.content?.padding || ""} onChange={(e) => updateWidget("style", "content", { ...(s.content || {}), padding: e.target.value })} /></Field>
                </Row>
              </Section>

              <Section title="Icon">
                <Row>
                  <Field label="Icon Size"><input className={inputClass} type="number" min="8" value={s.icon?.size ?? 18} onChange={(e) => updateWidget("style", "icon", { ...(s.icon || {}), size: Number(e.target.value) })} /></Field>
                  <Field label="Box Size"><input className={inputClass} placeholder="36px" value={s.icon?.boxSize || ""} onChange={(e) => updateWidget("style", "icon", { ...(s.icon || {}), boxSize: e.target.value })} /></Field>
                </Row>
                <Row>
                  <Field label="Icon Color"><input className={inputClass} type="color" value={s.icon?.color || "#2563eb"} onChange={(e) => updateWidget("style", "icon", { ...(s.icon || {}), color: e.target.value })} /></Field>
                  <Field label="Radius"><input className={inputClass} placeholder="999px" value={s.icon?.radius || ""} onChange={(e) => updateWidget("style", "icon", { ...(s.icon || {}), radius: e.target.value })} /></Field>
                </Row>
                <Field label="Icon Background"><input className={inputClass} placeholder="rgba(37, 99, 235, 0.08)" value={s.icon?.background || ""} onChange={(e) => updateWidget("style", "icon", { ...(s.icon || {}), background: e.target.value })} /></Field>
              </Section>
            </>
          )}

          {isInnerSection && (
            <>
              <Section title="Container">
                <Row>
                  <Field label="Alignment">
                    <select className={selectClass} value={s.alignment || "left"} onChange={(e) => updateWidget("style", "alignment", e.target.value)}>
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                    </select>
                  </Field>
                  <Field label="Max Width"><input className={inputClass} placeholder="1100px" value={s.maxWidth || ""} onChange={(e) => updateWidget("style", "maxWidth", e.target.value)} /></Field>
                </Row>
                <Row>
                  <Field label="Width"><input className={inputClass} placeholder="100%" value={s.width || ""} onChange={(e) => updateWidget("style", "width", e.target.value)} /></Field>
                  <Field label="Min Height"><input className={inputClass} placeholder="420px" value={s.minHeight || ""} onChange={(e) => updateWidget("style", "minHeight", e.target.value)} /></Field>
                </Row>
                <Row>
                  <Field label="Padding"><input className={inputClass} placeholder="36px" value={s.padding || ""} onChange={(e) => updateWidget("style", "padding", e.target.value)} /></Field>
                  <Field label="Margin"><input className={inputClass} placeholder="0px" value={s.margin || ""} onChange={(e) => updateWidget("style", "margin", e.target.value)} /></Field>
                </Row>
                <Field label="Background"><input className={inputClass} placeholder="linear-gradient(...) or #ffffff" value={s.background || ""} onChange={(e) => updateWidget("style", "background", e.target.value)} /></Field>
                <Field label="Box Shadow"><input className={inputClass} placeholder="0 24px 60px rgba(...)" value={s.boxShadow || ""} onChange={(e) => updateWidget("style", "boxShadow", e.target.value)} /></Field>
              </Section>

              <Section title="Border">
                <Row>
                  <Field label="Border Width"><input className={inputClass} placeholder="1px" value={s.border?.width || ""} onChange={(e) => updateBorder("width", e.target.value)} /></Field>
                  <Field label="Border Style">
                    <select className={selectClass} value={s.border?.style || "solid"} onChange={(e) => updateBorder("style", e.target.value)}>
                      <option value="solid">Solid</option>
                      <option value="dashed">Dashed</option>
                      <option value="dotted">Dotted</option>
                      <option value="double">Double</option>
                      <option value="none">None</option>
                    </select>
                  </Field>
                </Row>
                <Row>
                  <Field label="Border Color"><input className={inputClass} type="color" value={s.border?.color || "#e5e7eb"} onChange={(e) => updateBorder("color", e.target.value)} /></Field>
                  <Field label="Radius"><input className={inputClass} placeholder="28px" value={s.border?.radius || ""} onChange={(e) => updateBorder("radius", e.target.value)} /></Field>
                </Row>
              </Section>

              <Section title="Intro Block">
                <Row>
                  <Field label="Intro Max Width"><input className={inputClass} placeholder="720px" value={s.intro?.maxWidth || ""} onChange={(e) => updateWidget("style", "intro", { ...(s.intro || {}), maxWidth: e.target.value })} /></Field>
                  <Field label="Bottom Spacing"><input className={inputClass} placeholder="28px" value={s.intro?.marginBottom || ""} onChange={(e) => updateWidget("style", "intro", { ...(s.intro || {}), marginBottom: e.target.value })} /></Field>
                </Row>
              </Section>

              <Section title="Section Eyebrow">
                <Row>
                  <Field label="Color"><input className={inputClass} type="color" value={s.eyebrow?.color || "#2563eb"} onChange={(e) => updateWidget("style", "eyebrow", { ...(s.eyebrow || {}), color: e.target.value })} /></Field>
                  <Field label="Font Size"><input className={inputClass} placeholder="12px" value={s.eyebrow?.fontSize || ""} onChange={(e) => updateWidget("style", "eyebrow", { ...(s.eyebrow || {}), fontSize: e.target.value })} /></Field>
                </Row>
                <Row>
                  <Field label="Font Weight"><input className={inputClass} placeholder="700" value={s.eyebrow?.fontWeight || ""} onChange={(e) => updateWidget("style", "eyebrow", { ...(s.eyebrow || {}), fontWeight: e.target.value })} /></Field>
                  <Field label="Line Height"><input className={inputClass} placeholder="1.2" value={s.eyebrow?.lineHeight || ""} onChange={(e) => updateWidget("style", "eyebrow", { ...(s.eyebrow || {}), lineHeight: e.target.value })} /></Field>
                </Row>
                <Row>
                  <Field label="Letter Spacing"><input className={inputClass} placeholder="0.18em" value={s.eyebrow?.letterSpacing || ""} onChange={(e) => updateWidget("style", "eyebrow", { ...(s.eyebrow || {}), letterSpacing: e.target.value })} /></Field>
                  <Field label="Text Transform">
                    <select className={selectClass} value={s.eyebrow?.textTransform || "uppercase"} onChange={(e) => updateWidget("style", "eyebrow", { ...(s.eyebrow || {}), textTransform: e.target.value })}>
                      <option value="uppercase">Uppercase</option>
                      <option value="none">None</option>
                      <option value="lowercase">Lowercase</option>
                      <option value="capitalize">Capitalize</option>
                    </select>
                  </Field>
                </Row>
                <Field label="Bottom Spacing"><input className={inputClass} placeholder="12px" value={s.eyebrow?.marginBottom || ""} onChange={(e) => updateWidget("style", "eyebrow", { ...(s.eyebrow || {}), marginBottom: e.target.value })} /></Field>
              </Section>

              <Section title="Section Title">
                <Row>
                  <Field label="Color"><input className={inputClass} type="color" value={s.title?.color || "#111827"} onChange={(e) => updateWidget("style", "title", { ...(s.title || {}), color: e.target.value })} /></Field>
                  <Field label="Font Size"><input className={inputClass} placeholder="clamp(28px, 4vw, 44px)" value={s.title?.fontSize || ""} onChange={(e) => updateWidget("style", "title", { ...(s.title || {}), fontSize: e.target.value })} /></Field>
                </Row>
                <Row>
                  <Field label="Font Weight"><input className={inputClass} placeholder="800" value={s.title?.fontWeight || ""} onChange={(e) => updateWidget("style", "title", { ...(s.title || {}), fontWeight: e.target.value })} /></Field>
                  <Field label="Line Height"><input className={inputClass} placeholder="1.08" value={s.title?.lineHeight || ""} onChange={(e) => updateWidget("style", "title", { ...(s.title || {}), lineHeight: e.target.value })} /></Field>
                </Row>
                <Row>
                  <Field label="Letter Spacing"><input className={inputClass} placeholder="-0.03em" value={s.title?.letterSpacing || ""} onChange={(e) => updateWidget("style", "title", { ...(s.title || {}), letterSpacing: e.target.value })} /></Field>
                  <Field label="Bottom Spacing"><input className={inputClass} placeholder="14px" value={s.title?.marginBottom || ""} onChange={(e) => updateWidget("style", "title", { ...(s.title || {}), marginBottom: e.target.value })} /></Field>
                </Row>
              </Section>

              <Section title="Section Description">
                <Row>
                  <Field label="Color"><input className={inputClass} type="color" value={s.description?.color || "#6b7280"} onChange={(e) => updateWidget("style", "description", { ...(s.description || {}), color: e.target.value })} /></Field>
                  <Field label="Font Size"><input className={inputClass} placeholder="17px" value={s.description?.fontSize || ""} onChange={(e) => updateWidget("style", "description", { ...(s.description || {}), fontSize: e.target.value })} /></Field>
                </Row>
                <Row>
                  <Field label="Font Weight"><input className={inputClass} placeholder="400" value={s.description?.fontWeight || ""} onChange={(e) => updateWidget("style", "description", { ...(s.description || {}), fontWeight: e.target.value })} /></Field>
                  <Field label="Line Height"><input className={inputClass} placeholder="1.8" value={s.description?.lineHeight || ""} onChange={(e) => updateWidget("style", "description", { ...(s.description || {}), lineHeight: e.target.value })} /></Field>
                </Row>
                <Field label="Letter Spacing"><input className={inputClass} placeholder="0px" value={s.description?.letterSpacing || ""} onChange={(e) => updateWidget("style", "description", { ...(s.description || {}), letterSpacing: e.target.value })} /></Field>
              </Section>
            </>
          )}

          {isInnerSection && (
            <>
              <Section title="Grid">
                <Field label="Column Gap"><input className={inputClass} placeholder="20px" value={s.grid?.gap || ""} onChange={(e) => updateWidget("style", "grid", { ...(s.grid || {}), gap: e.target.value })} /></Field>
              </Section>

              <Section title="Item Card">
                <Row>
                  <Field label="Item Min Height"><input className={inputClass} placeholder="220px" value={s.item?.minHeight || ""} onChange={(e) => updateWidget("style", "item", { ...(s.item || {}), minHeight: e.target.value })} /></Field>
                  <Field label="Padding"><input className={inputClass} placeholder="24px" value={s.item?.padding || ""} onChange={(e) => updateWidget("style", "item", { ...(s.item || {}), padding: e.target.value })} /></Field>
                </Row>
                <Row>
                  <Field label="Background"><input className={inputClass} placeholder="#ffffff" value={s.item?.background || ""} onChange={(e) => updateWidget("style", "item", { ...(s.item || {}), background: e.target.value })} /></Field>
                  <Field label="Radius"><input className={inputClass} placeholder="22px" value={s.item?.radius || ""} onChange={(e) => updateWidget("style", "item", { ...(s.item || {}), radius: e.target.value })} /></Field>
                </Row>
                <Row>
                  <Field label="Border Width"><input className={inputClass} placeholder="1px" value={s.item?.borderWidth || ""} onChange={(e) => updateWidget("style", "item", { ...(s.item || {}), borderWidth: e.target.value })} /></Field>
                  <Field label="Border Style">
                    <select className={selectClass} value={s.item?.borderStyle || "solid"} onChange={(e) => updateWidget("style", "item", { ...(s.item || {}), borderStyle: e.target.value })}>
                      <option value="solid">Solid</option>
                      <option value="dashed">Dashed</option>
                      <option value="dotted">Dotted</option>
                      <option value="double">Double</option>
                      <option value="none">None</option>
                    </select>
                  </Field>
                </Row>
                <Row>
                  <Field label="Border Color"><input className={inputClass} type="color" value={s.item?.borderColor || "#e5e7eb"} onChange={(e) => updateWidget("style", "item", { ...(s.item || {}), borderColor: e.target.value })} /></Field>
                  <Field label="Box Shadow"><input className={inputClass} placeholder="0 14px 30px rgba(...)" value={s.item?.boxShadow || ""} onChange={(e) => updateWidget("style", "item", { ...(s.item || {}), boxShadow: e.target.value })} /></Field>
                </Row>
              </Section>

              <Section title="Item Eyebrow">
                <Row>
                  <Field label="Color"><input className={inputClass} type="color" value={s.itemEyebrow?.color || "#2563eb"} onChange={(e) => updateWidget("style", "itemEyebrow", { ...(s.itemEyebrow || {}), color: e.target.value })} /></Field>
                  <Field label="Font Size"><input className={inputClass} placeholder="11px" value={s.itemEyebrow?.fontSize || ""} onChange={(e) => updateWidget("style", "itemEyebrow", { ...(s.itemEyebrow || {}), fontSize: e.target.value })} /></Field>
                </Row>
                <Row>
                  <Field label="Font Weight"><input className={inputClass} placeholder="700" value={s.itemEyebrow?.fontWeight || ""} onChange={(e) => updateWidget("style", "itemEyebrow", { ...(s.itemEyebrow || {}), fontWeight: e.target.value })} /></Field>
                  <Field label="Line Height"><input className={inputClass} placeholder="1.2" value={s.itemEyebrow?.lineHeight || ""} onChange={(e) => updateWidget("style", "itemEyebrow", { ...(s.itemEyebrow || {}), lineHeight: e.target.value })} /></Field>
                </Row>
                <Row>
                  <Field label="Letter Spacing"><input className={inputClass} placeholder="0.18em" value={s.itemEyebrow?.letterSpacing || ""} onChange={(e) => updateWidget("style", "itemEyebrow", { ...(s.itemEyebrow || {}), letterSpacing: e.target.value })} /></Field>
                  <Field label="Text Transform">
                    <select className={selectClass} value={s.itemEyebrow?.textTransform || "uppercase"} onChange={(e) => updateWidget("style", "itemEyebrow", { ...(s.itemEyebrow || {}), textTransform: e.target.value })}>
                      <option value="uppercase">Uppercase</option>
                      <option value="none">None</option>
                      <option value="lowercase">Lowercase</option>
                      <option value="capitalize">Capitalize</option>
                    </select>
                  </Field>
                </Row>
                <Field label="Bottom Spacing"><input className={inputClass} placeholder="10px" value={s.itemEyebrow?.marginBottom || ""} onChange={(e) => updateWidget("style", "itemEyebrow", { ...(s.itemEyebrow || {}), marginBottom: e.target.value })} /></Field>
              </Section>

              <Section title="Item Title">
                <Row>
                  <Field label="Color"><input className={inputClass} type="color" value={s.itemTitle?.color || "#111827"} onChange={(e) => updateWidget("style", "itemTitle", { ...(s.itemTitle || {}), color: e.target.value })} /></Field>
                  <Field label="Font Size"><input className={inputClass} placeholder="22px" value={s.itemTitle?.fontSize || ""} onChange={(e) => updateWidget("style", "itemTitle", { ...(s.itemTitle || {}), fontSize: e.target.value })} /></Field>
                </Row>
                <Row>
                  <Field label="Font Weight"><input className={inputClass} placeholder="700" value={s.itemTitle?.fontWeight || ""} onChange={(e) => updateWidget("style", "itemTitle", { ...(s.itemTitle || {}), fontWeight: e.target.value })} /></Field>
                  <Field label="Line Height"><input className={inputClass} placeholder="1.25" value={s.itemTitle?.lineHeight || ""} onChange={(e) => updateWidget("style", "itemTitle", { ...(s.itemTitle || {}), lineHeight: e.target.value })} /></Field>
                </Row>
                <Row>
                  <Field label="Letter Spacing"><input className={inputClass} placeholder="-0.02em" value={s.itemTitle?.letterSpacing || ""} onChange={(e) => updateWidget("style", "itemTitle", { ...(s.itemTitle || {}), letterSpacing: e.target.value })} /></Field>
                  <Field label="Bottom Spacing"><input className={inputClass} placeholder="10px" value={s.itemTitle?.marginBottom || ""} onChange={(e) => updateWidget("style", "itemTitle", { ...(s.itemTitle || {}), marginBottom: e.target.value })} /></Field>
                </Row>
              </Section>

              <Section title="Item Content">
                <Row>
                  <Field label="Color"><input className={inputClass} type="color" value={s.itemContent?.color || "#6b7280"} onChange={(e) => updateWidget("style", "itemContent", { ...(s.itemContent || {}), color: e.target.value })} /></Field>
                  <Field label="Font Size"><input className={inputClass} placeholder="15px" value={s.itemContent?.fontSize || ""} onChange={(e) => updateWidget("style", "itemContent", { ...(s.itemContent || {}), fontSize: e.target.value })} /></Field>
                </Row>
                <Row>
                  <Field label="Font Weight"><input className={inputClass} placeholder="400" value={s.itemContent?.fontWeight || ""} onChange={(e) => updateWidget("style", "itemContent", { ...(s.itemContent || {}), fontWeight: e.target.value })} /></Field>
                  <Field label="Line Height"><input className={inputClass} placeholder="1.75" value={s.itemContent?.lineHeight || ""} onChange={(e) => updateWidget("style", "itemContent", { ...(s.itemContent || {}), lineHeight: e.target.value })} /></Field>
                </Row>
                <Field label="Letter Spacing"><input className={inputClass} placeholder="0px" value={s.itemContent?.letterSpacing || ""} onChange={(e) => updateWidget("style", "itemContent", { ...(s.itemContent || {}), letterSpacing: e.target.value })} /></Field>
              </Section>
            </>
          )}

          {isVideo && (
            <>
              <Section title="Frame">
                <Row>
                  <Field label="Alignment">
                    <select className={selectClass} value={s.alignment || "left"} onChange={(e) => updateWidget("style", "alignment", e.target.value)}>
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                    </select>
                  </Field>
                  <Field label="Aspect Ratio"><input className={inputClass} placeholder="16 / 9" value={s.aspectRatio || ""} onChange={(e) => updateWidget("style", "aspectRatio", e.target.value)} /></Field>
                </Row>
                <Row>
                  <Field label="Width"><input className={inputClass} placeholder="100%" value={s.width || ""} onChange={(e) => updateWidget("style", "width", e.target.value)} /></Field>
                  <Field label="Max Width"><input className={inputClass} placeholder="860px" value={s.maxWidth || ""} onChange={(e) => updateWidget("style", "maxWidth", e.target.value)} /></Field>
                </Row>
                <Row>
                  <Field label="Min Height"><input className={inputClass} placeholder="320px" value={s.minHeight || ""} onChange={(e) => updateWidget("style", "minHeight", e.target.value)} /></Field>
                  <Field label="Frame Background"><input className={inputClass} placeholder="#0f172a" value={s.frameBackground || ""} onChange={(e) => updateWidget("style", "frameBackground", e.target.value)} /></Field>
                </Row>
                <Row>
                  <Field label="Padding"><input className={inputClass} placeholder="0px" value={s.padding || ""} onChange={(e) => updateWidget("style", "padding", e.target.value)} /></Field>
                  <Field label="Margin"><input className={inputClass} placeholder="0px" value={s.margin || ""} onChange={(e) => updateWidget("style", "margin", e.target.value)} /></Field>
                </Row>
                <Field label="Background"><input className={inputClass} placeholder="transparent or linear-gradient(...)" value={s.background || ""} onChange={(e) => updateWidget("style", "background", e.target.value)} /></Field>
                <Field label="Box Shadow"><input className={inputClass} placeholder="0 24px 60px rgba(...)" value={s.boxShadow || ""} onChange={(e) => updateWidget("style", "boxShadow", e.target.value)} /></Field>
              </Section>

              <Section title="Media">
                <Row>
                  <Field label="Object Fit">
                    <select className={selectClass} value={s.objectFit || "cover"} onChange={(e) => updateWidget("style", "objectFit", e.target.value)}>
                      <option value="cover">Cover</option>
                      <option value="contain">Contain</option>
                      <option value="fill">Fill</option>
                      <option value="none">None</option>
                    </select>
                  </Field>
                  <Field label="Object Position"><input className={inputClass} placeholder="center center" value={s.objectPosition || ""} onChange={(e) => updateWidget("style", "objectPosition", e.target.value)} /></Field>
                </Row>
                <Row>
                  <Field label="Opacity"><input className={inputClass} type="number" step="0.1" min="0" max="1" value={s.opacity ?? 1} onChange={(e) => updateWidget("style", "opacity", Number(e.target.value))} /></Field>
                  <Field label="Filter"><input className={inputClass} placeholder="none or saturate(1.1)" value={s.filter || ""} onChange={(e) => updateWidget("style", "filter", e.target.value)} /></Field>
                </Row>
                <Field label="Transition Duration"><input className={inputClass} placeholder="0.3s" value={s.transitionDuration || ""} onChange={(e) => updateWidget("style", "transitionDuration", e.target.value)} /></Field>
              </Section>

              <Section title="Border & Overlay">
                <Row>
                  <Field label="Border Width"><input className={inputClass} placeholder="0px" value={s.border?.width || ""} onChange={(e) => updateBorder("width", e.target.value)} /></Field>
                  <Field label="Border Style">
                    <select className={selectClass} value={s.border?.style || "solid"} onChange={(e) => updateBorder("style", e.target.value)}>
                      <option value="solid">Solid</option>
                      <option value="dashed">Dashed</option>
                      <option value="dotted">Dotted</option>
                      <option value="double">Double</option>
                      <option value="none">None</option>
                    </select>
                  </Field>
                </Row>
                <Row>
                  <Field label="Border Color"><input className={inputClass} type="color" value={s.border?.color || "#e5e7eb"} onChange={(e) => updateBorder("color", e.target.value)} /></Field>
                  <Field label="Radius"><input className={inputClass} placeholder="28px" value={s.border?.radius || ""} onChange={(e) => updateBorder("radius", e.target.value)} /></Field>
                </Row>
                <Row>
                  <Field label="Overlay Color"><input className={inputClass} placeholder="rgba(15, 23, 42, 0.15)" value={s.overlay?.color || ""} onChange={(e) => updateWidget("style", "overlay", { ...(s.overlay || {}), color: e.target.value })} /></Field>
                  <Field label="Overlay Opacity"><input className={inputClass} type="number" step="0.05" min="0" max="1" value={s.overlay?.opacity ?? 0} onChange={(e) => updateWidget("style", "overlay", { ...(s.overlay || {}), opacity: Number(e.target.value) })} /></Field>
                </Row>
              </Section>

              <Section title="Play Icon">
                <Row>
                  <Field label="Size"><input className={inputClass} placeholder="56px" value={s.playIcon?.size || ""} onChange={(e) => updateWidget("style", "playIcon", { ...(s.playIcon || {}), size: e.target.value })} /></Field>
                  <Field label="Icon Size"><input className={inputClass} placeholder="22" value={s.playIcon?.iconSize || ""} onChange={(e) => updateWidget("style", "playIcon", { ...(s.playIcon || {}), iconSize: e.target.value })} /></Field>
                </Row>
                <Row>
                  <Field label="Position X"><input className={inputClass} placeholder="20px" value={s.playIcon?.positionX || ""} onChange={(e) => updateWidget("style", "playIcon", { ...(s.playIcon || {}), positionX: e.target.value })} /></Field>
                  <Field label="Position Y"><input className={inputClass} placeholder="20px" value={s.playIcon?.positionY || ""} onChange={(e) => updateWidget("style", "playIcon", { ...(s.playIcon || {}), positionY: e.target.value })} /></Field>
                </Row>
                <Row>
                  <Field label="Background"><input className={inputClass} placeholder="rgba(255,255,255,0.16)" value={s.playIcon?.background || ""} onChange={(e) => updateWidget("style", "playIcon", { ...(s.playIcon || {}), background: e.target.value })} /></Field>
                  <Field label="Color"><input className={inputClass} type="color" value={s.playIcon?.color || "#ffffff"} onChange={(e) => updateWidget("style", "playIcon", { ...(s.playIcon || {}), color: e.target.value })} /></Field>
                </Row>
                <Field label="Box Shadow"><input className={inputClass} placeholder="0 12px 30px rgba(...)" value={s.playIcon?.boxShadow || ""} onChange={(e) => updateWidget("style", "playIcon", { ...(s.playIcon || {}), boxShadow: e.target.value })} /></Field>
              </Section>

              <Section title="Caption">
                <Row>
                  <Field label="Caption Color"><input className={inputClass} type="color" value={s.caption?.color || "#6b7280"} onChange={(e) => updateWidget("style", "caption", { ...(s.caption || {}), color: e.target.value })} /></Field>
                  <Field label="Caption Align">
                    <select className={selectClass} value={s.caption?.align || "left"} onChange={(e) => updateWidget("style", "caption", { ...(s.caption || {}), align: e.target.value })}>
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                    </select>
                  </Field>
                </Row>
                <Row>
                  <Field label="Font Size"><input className={inputClass} placeholder="14px" value={s.caption?.fontSize || ""} onChange={(e) => updateWidget("style", "caption", { ...(s.caption || {}), fontSize: e.target.value })} /></Field>
                  <Field label="Font Weight"><input className={inputClass} placeholder="400" value={s.caption?.fontWeight || ""} onChange={(e) => updateWidget("style", "caption", { ...(s.caption || {}), fontWeight: e.target.value })} /></Field>
                </Row>
                <Row>
                  <Field label="Line Height"><input className={inputClass} placeholder="1.6" value={s.caption?.lineHeight || ""} onChange={(e) => updateWidget("style", "caption", { ...(s.caption || {}), lineHeight: e.target.value })} /></Field>
                  <Field label="Letter Spacing"><input className={inputClass} placeholder="0px" value={s.caption?.letterSpacing || ""} onChange={(e) => updateWidget("style", "caption", { ...(s.caption || {}), letterSpacing: e.target.value })} /></Field>
                </Row>
                <Row>
                  <Field label="Background"><input className={inputClass} placeholder="transparent" value={s.caption?.background || ""} onChange={(e) => updateWidget("style", "caption", { ...(s.caption || {}), background: e.target.value })} /></Field>
                  <Field label="Padding"><input className={inputClass} placeholder="14px 16px 0px" value={s.caption?.padding || ""} onChange={(e) => updateWidget("style", "caption", { ...(s.caption || {}), padding: e.target.value })} /></Field>
                </Row>
              </Section>

              <Section title="Placeholder & Hover">
                <Row>
                  <Field label="Placeholder Color"><input className={inputClass} type="color" value={s.placeholder?.color || "#cbd5e1"} onChange={(e) => updateWidget("style", "placeholder", { ...(s.placeholder || {}), color: e.target.value })} /></Field>
                  <Field label="Placeholder BG"><input className={inputClass} placeholder="linear-gradient(...)" value={s.placeholder?.background || ""} onChange={(e) => updateWidget("style", "placeholder", { ...(s.placeholder || {}), background: e.target.value })} /></Field>
                </Row>
                <Row>
                  <Field label="Hover Scale"><input className={inputClass} placeholder="1" value={s.hover?.scale || ""} onChange={(e) => updateWidget("style", "hover", { ...(s.hover || {}), scale: e.target.value })} /></Field>
                  <Field label="Hover Shadow"><input className={inputClass} placeholder="0 28px 70px rgba(...)" value={s.hover?.boxShadow || ""} onChange={(e) => updateWidget("style", "hover", { ...(s.hover || {}), boxShadow: e.target.value })} /></Field>
                </Row>
              </Section>
            </>
          )}

          {isTestimonial && (
            <>
              <Section title="Card">
                <Row>
                  <Field label="Alignment">
                    <select className={selectClass} value={s.alignment || "left"} onChange={(e) => updateWidget("style", "alignment", e.target.value)}>
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                    </select>
                  </Field>
                  <Field label="Max Width"><input className={inputClass} placeholder="640px" value={s.maxWidth || ""} onChange={(e) => updateWidget("style", "maxWidth", e.target.value)} /></Field>
                </Row>
                <Row>
                  <Field label="Width"><input className={inputClass} placeholder="100%" value={s.width || ""} onChange={(e) => updateWidget("style", "width", e.target.value)} /></Field>
                  <Field label="Padding"><input className={inputClass} placeholder="28px" value={s.padding || ""} onChange={(e) => updateWidget("style", "padding", e.target.value)} /></Field>
                </Row>
                <Row>
                  <Field label="Margin"><input className={inputClass} placeholder="0px" value={s.margin || ""} onChange={(e) => updateWidget("style", "margin", e.target.value)} /></Field>
                  <Field label="Text Color"><input className={inputClass} type="color" value={s.textColor || "#111827"} onChange={(e) => updateWidget("style", "textColor", e.target.value)} /></Field>
                </Row>
                <Field label="Background"><input className={inputClass} placeholder="#ffffff or linear-gradient(...)" value={s.background || ""} onChange={(e) => updateWidget("style", "background", e.target.value)} /></Field>
                <Field label="Box Shadow"><input className={inputClass} placeholder="0 24px 60px rgba(...)" value={s.boxShadow || ""} onChange={(e) => updateWidget("style", "boxShadow", e.target.value)} /></Field>
              </Section>

              <Section title="Border">
                <Row>
                  <Field label="Border Width"><input className={inputClass} placeholder="1px" value={s.border?.width || ""} onChange={(e) => updateBorder("width", e.target.value)} /></Field>
                  <Field label="Border Style">
                    <select className={selectClass} value={s.border?.style || "solid"} onChange={(e) => updateBorder("style", e.target.value)}>
                      <option value="solid">Solid</option>
                      <option value="dashed">Dashed</option>
                      <option value="dotted">Dotted</option>
                      <option value="double">Double</option>
                      <option value="none">None</option>
                    </select>
                  </Field>
                </Row>
                <Row>
                  <Field label="Border Color"><input className={inputClass} type="color" value={s.border?.color || "#e5e7eb"} onChange={(e) => updateBorder("color", e.target.value)} /></Field>
                  <Field label="Radius"><input className={inputClass} placeholder="28px" value={s.border?.radius || ""} onChange={(e) => updateBorder("radius", e.target.value)} /></Field>
                </Row>
              </Section>

              <Section title="Quote">
                <Row>
                  <Field label="Quote Color"><input className={inputClass} type="color" value={s.quote?.color || "#111827"} onChange={(e) => updateWidget("style", "quote", { ...(s.quote || {}), color: e.target.value })} /></Field>
                  <Field label="Font Size"><input className={inputClass} placeholder="20px" value={s.quote?.fontSize || ""} onChange={(e) => updateWidget("style", "quote", { ...(s.quote || {}), fontSize: e.target.value })} /></Field>
                </Row>
                <Row>
                  <Field label="Font Weight"><input className={inputClass} placeholder="500" value={s.quote?.fontWeight || ""} onChange={(e) => updateWidget("style", "quote", { ...(s.quote || {}), fontWeight: e.target.value })} /></Field>
                  <Field label="Line Height"><input className={inputClass} placeholder="1.8" value={s.quote?.lineHeight || ""} onChange={(e) => updateWidget("style", "quote", { ...(s.quote || {}), lineHeight: e.target.value })} /></Field>
                </Row>
                <Row>
                  <Field label="Letter Spacing"><input className={inputClass} placeholder="0px" value={s.quote?.letterSpacing || ""} onChange={(e) => updateWidget("style", "quote", { ...(s.quote || {}), letterSpacing: e.target.value })} /></Field>
                  <Field label="Font Style">
                    <select className={selectClass} value={s.quote?.fontStyle || "normal"} onChange={(e) => updateWidget("style", "quote", { ...(s.quote || {}), fontStyle: e.target.value })}>
                      <option value="normal">Normal</option>
                      <option value="italic">Italic</option>
                    </select>
                  </Field>
                </Row>
                <Field label="Bottom Spacing"><input className={inputClass} placeholder="22px" value={s.quote?.marginBottom || ""} onChange={(e) => updateWidget("style", "quote", { ...(s.quote || {}), marginBottom: e.target.value })} /></Field>
              </Section>

              <Section title="Rating">
                <Row>
                  <Field label="Star Color"><input className={inputClass} type="color" value={s.rating?.color || "#f59e0b"} onChange={(e) => updateWidget("style", "rating", { ...(s.rating || {}), color: e.target.value })} /></Field>
                  <Field label="Star Size"><input className={inputClass} type="number" min="8" value={s.rating?.size ?? 16} onChange={(e) => updateWidget("style", "rating", { ...(s.rating || {}), size: Number(e.target.value) })} /></Field>
                </Row>
                <Field label="Bottom Spacing"><input className={inputClass} placeholder="18px" value={s.rating?.marginBottom || ""} onChange={(e) => updateWidget("style", "rating", { ...(s.rating || {}), marginBottom: e.target.value })} /></Field>
              </Section>

              <Section title="Author">
                <Row>
                  <Field label="Gap"><input className={inputClass} placeholder="14px" value={s.author?.gap || ""} onChange={(e) => updateWidget("style", "author", { ...(s.author || {}), gap: e.target.value })} /></Field>
                  <Field label="Avatar Size"><input className={inputClass} placeholder="56px" value={s.author?.avatarSize || ""} onChange={(e) => updateWidget("style", "author", { ...(s.author || {}), avatarSize: e.target.value })} /></Field>
                </Row>
                <Row>
                  <Field label="Avatar Radius"><input className={inputClass} placeholder="999px" value={s.author?.avatarRadius || ""} onChange={(e) => updateWidget("style", "author", { ...(s.author || {}), avatarRadius: e.target.value })} /></Field>
                  <Field label="Avatar Text Size"><input className={inputClass} placeholder="18px" value={s.author?.avatarTextSize || ""} onChange={(e) => updateWidget("style", "author", { ...(s.author || {}), avatarTextSize: e.target.value })} /></Field>
                </Row>
                <Row>
                  <Field label="Avatar Background"><input className={inputClass} placeholder="linear-gradient(...)" value={s.author?.avatarBg || ""} onChange={(e) => updateWidget("style", "author", { ...(s.author || {}), avatarBg: e.target.value })} /></Field>
                  <Field label="Avatar Color"><input className={inputClass} type="color" value={s.author?.avatarColor || "#1d4ed8"} onChange={(e) => updateWidget("style", "author", { ...(s.author || {}), avatarColor: e.target.value })} /></Field>
                </Row>
                <Row>
                  <Field label="Name Color"><input className={inputClass} type="color" value={s.author?.nameColor || "#111827"} onChange={(e) => updateWidget("style", "author", { ...(s.author || {}), nameColor: e.target.value })} /></Field>
                  <Field label="Name Size"><input className={inputClass} placeholder="16px" value={s.author?.nameSize || ""} onChange={(e) => updateWidget("style", "author", { ...(s.author || {}), nameSize: e.target.value })} /></Field>
                </Row>
                <Row>
                  <Field label="Name Weight"><input className={inputClass} placeholder="700" value={s.author?.nameWeight || ""} onChange={(e) => updateWidget("style", "author", { ...(s.author || {}), nameWeight: e.target.value })} /></Field>
                  <Field label="Name Line Height"><input className={inputClass} placeholder="1.3" value={s.author?.nameLineHeight || ""} onChange={(e) => updateWidget("style", "author", { ...(s.author || {}), nameLineHeight: e.target.value })} /></Field>
                </Row>
                <Row>
                  <Field label="Meta Color"><input className={inputClass} type="color" value={s.author?.metaColor || "#6b7280"} onChange={(e) => updateWidget("style", "author", { ...(s.author || {}), metaColor: e.target.value })} /></Field>
                  <Field label="Meta Size"><input className={inputClass} placeholder="14px" value={s.author?.metaSize || ""} onChange={(e) => updateWidget("style", "author", { ...(s.author || {}), metaSize: e.target.value })} /></Field>
                </Row>
                <Row>
                  <Field label="Meta Weight"><input className={inputClass} placeholder="500" value={s.author?.metaWeight || ""} onChange={(e) => updateWidget("style", "author", { ...(s.author || {}), metaWeight: e.target.value })} /></Field>
                  <Field label="Meta Line Height"><input className={inputClass} placeholder="1.5" value={s.author?.metaLineHeight || ""} onChange={(e) => updateWidget("style", "author", { ...(s.author || {}), metaLineHeight: e.target.value })} /></Field>
                </Row>
                <Field label="Meta Spacing"><input className={inputClass} placeholder="4px" value={s.author?.metaSpacing || ""} onChange={(e) => updateWidget("style", "author", { ...(s.author || {}), metaSpacing: e.target.value })} /></Field>
              </Section>
            </>
          )}

          {isSeparator && (
            <>
              <Section title="Line Style">
                <Row>
                  <Field label="Alignment">
                    <select className={selectClass} value={s.alignment || "center"} onChange={(e) => updateWidget("style", "alignment", e.target.value)}>
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                    </select>
                  </Field>
                  <Field label="Opacity"><input className={inputClass} type="number" step="0.1" min="0" max="1" value={s.opacity ?? 1} onChange={(e) => updateWidget("style", "opacity", Number(e.target.value))} /></Field>
                </Row>
                <Row>
                  <Field label="Line Color"><input className={inputClass} type="color" value={s.color || "#d1d5db"} onChange={(e) => updateWidget("style", "color", e.target.value)} /></Field>
                  <Field label="Radius"><input className={inputClass} placeholder="999px" value={s.radius || ""} onChange={(e) => updateWidget("style", "radius", e.target.value)} /></Field>
                </Row>
                <Field label="Box Shadow"><input className={inputClass} placeholder="none" value={s.boxShadow || ""} onChange={(e) => updateWidget("style", "boxShadow", e.target.value)} /></Field>
              </Section>

              <Section title="Spacing">
                <Row>
                  <Field label="Padding"><input className={inputClass} placeholder="14px 0px" value={s.padding || ""} onChange={(e) => updateWidget("style", "padding", e.target.value)} /></Field>
                  <Field label="Margin"><input className={inputClass} placeholder="0px" value={s.margin || ""} onChange={(e) => updateWidget("style", "margin", e.target.value)} /></Field>
                </Row>
              </Section>

              <Section title="Label Style">
                <Row>
                  <Field label="Label Color"><input className={inputClass} type="color" value={s.label?.color || "#6b7280"} onChange={(e) => updateWidget("style", "label", { ...(s.label || {}), color: e.target.value })} /></Field>
                  <Field label="Label Background"><input className={inputClass} placeholder="#ffffff or transparent" value={s.label?.background || ""} onChange={(e) => updateWidget("style", "label", { ...(s.label || {}), background: e.target.value })} /></Field>
                </Row>
                <Row>
                  <Field label="Font Size"><input className={inputClass} placeholder="12px" value={s.label?.fontSize || ""} onChange={(e) => updateWidget("style", "label", { ...(s.label || {}), fontSize: e.target.value })} /></Field>
                  <Field label="Font Weight"><input className={inputClass} placeholder="600" value={s.label?.fontWeight || ""} onChange={(e) => updateWidget("style", "label", { ...(s.label || {}), fontWeight: e.target.value })} /></Field>
                </Row>
                <Row>
                  <Field label="Letter Spacing"><input className={inputClass} placeholder="0.24em" value={s.label?.letterSpacing || ""} onChange={(e) => updateWidget("style", "label", { ...(s.label || {}), letterSpacing: e.target.value })} /></Field>
                  <Field label="Text Transform">
                    <select className={selectClass} value={s.label?.textTransform || "uppercase"} onChange={(e) => updateWidget("style", "label", { ...(s.label || {}), textTransform: e.target.value })}>
                      <option value="uppercase">Uppercase</option>
                      <option value="none">None</option>
                      <option value="lowercase">Lowercase</option>
                      <option value="capitalize">Capitalize</option>
                    </select>
                  </Field>
                </Row>
                <Field label="Label Padding"><input className={inputClass} placeholder="0px 12px" value={s.label?.padding || ""} onChange={(e) => updateWidget("style", "label", { ...(s.label || {}), padding: e.target.value })} /></Field>
              </Section>
            </>
          )}

          {isHero && (
            <>
              <Section title="Container">
                <Row>
                  <Field label="Height"><input className={inputClass} placeholder="72vh" value={s.height || ""} onChange={(e) => updateHeroStyle("height", e.target.value)} /></Field>
                  <Field label="Min Height"><input className={inputClass} placeholder="560px" value={s.minHeight || ""} onChange={(e) => updateHeroStyle("minHeight", e.target.value)} /></Field>
                </Row>
                <Row>
                  <Field label="Max Width"><input className={inputClass} placeholder="1200px" value={s.maxWidth || ""} onChange={(e) => updateHeroStyle("maxWidth", e.target.value)} /></Field>
                  <Field label="Content Width"><input className={inputClass} placeholder="720px" value={s.contentWidth || ""} onChange={(e) => updateHeroStyle("contentWidth", e.target.value)} /></Field>
                </Row>
                <Field label="Padding"><input className={inputClass} placeholder="96px 32px" value={s.padding || ""} onChange={(e) => updateHeroStyle("padding", e.target.value)} /></Field>
                <Row>
                  <Field label="Text Color"><input className={inputClass} type="color" value={s.textColor || "#ffffff"} onChange={(e) => updateHeroStyle("textColor", e.target.value)} /></Field>
                  <Field label="Border Radius"><input className={inputClass} placeholder="32px" value={s.borderRadius || ""} onChange={(e) => updateHeroStyle("borderRadius", e.target.value)} /></Field>
                </Row>
                <Field label="Box Shadow"><input className={inputClass} placeholder="0 28px 70px rgba(...)" value={s.boxShadow || ""} onChange={(e) => updateHeroStyle("boxShadow", e.target.value)} /></Field>
              </Section>

              <Section title="Background Media">
                <Row>
                  <Field label="Background Size"><input className={inputClass} placeholder="cover" value={s.bgSize || ""} onChange={(e) => updateHeroStyle("bgSize", e.target.value)} /></Field>
                  <Field label="Background Position"><input className={inputClass} placeholder="center center" value={s.bgPosition || ""} onChange={(e) => updateHeroStyle("bgPosition", e.target.value)} /></Field>
                </Row>
                <Field label="Background Repeat"><input className={inputClass} placeholder="no-repeat" value={s.bgRepeat || ""} onChange={(e) => updateHeroStyle("bgRepeat", e.target.value)} /></Field>
              </Section>

              <Section title="Overlay">
                <Row>
                  <Field label="Overlay Color"><input className={inputClass} type="color" value={s.overlayColor || "#020617"} onChange={(e) => updateHeroStyle("overlayColor", e.target.value)} /></Field>
                  <Field label="Overlay Opacity"><input className={inputClass} type="number" step="0.05" min="0" max="1" value={s.overlayOpacity ?? 0.42} onChange={(e) => updateHeroStyle("overlayOpacity", Number(e.target.value))} /></Field>
                </Row>
              </Section>

              <Section title="Title Style">
                <Row>
                  <Field label="Font Size"><input className={inputClass} placeholder="clamp(42px, 7vw, 72px)" value={s.title?.fontSize || ""} onChange={(e) => updateHeroStyle("title", { ...(s.title || {}), fontSize: e.target.value })} /></Field>
                  <Field label="Font Weight"><input className={inputClass} placeholder="800" value={s.title?.fontWeight || ""} onChange={(e) => updateHeroStyle("title", { ...(s.title || {}), fontWeight: e.target.value })} /></Field>
                </Row>
                <Row>
                  <Field label="Line Height"><input className={inputClass} placeholder="1.02" value={s.title?.lineHeight || ""} onChange={(e) => updateHeroStyle("title", { ...(s.title || {}), lineHeight: e.target.value })} /></Field>
                  <Field label="Letter Spacing"><input className={inputClass} placeholder="-0.04em" value={s.title?.letterSpacing || ""} onChange={(e) => updateHeroStyle("title", { ...(s.title || {}), letterSpacing: e.target.value })} /></Field>
                </Row>
                <Field label="Bottom Spacing"><input className={inputClass} placeholder="18px" value={s.title?.marginBottom || ""} onChange={(e) => updateHeroStyle("title", { ...(s.title || {}), marginBottom: e.target.value })} /></Field>
              </Section>

              <Section title="Subtitle Style">
                <Row>
                  <Field label="Font Size"><input className={inputClass} placeholder="14px" value={s.subtitle?.fontSize || ""} onChange={(e) => updateHeroStyle("subtitle", { ...(s.subtitle || {}), fontSize: e.target.value })} /></Field>
                  <Field label="Font Weight"><input className={inputClass} placeholder="700" value={s.subtitle?.fontWeight || ""} onChange={(e) => updateHeroStyle("subtitle", { ...(s.subtitle || {}), fontWeight: e.target.value })} /></Field>
                </Row>
                <Row>
                  <Field label="Line Height"><input className={inputClass} placeholder="1.2" value={s.subtitle?.lineHeight || ""} onChange={(e) => updateHeroStyle("subtitle", { ...(s.subtitle || {}), lineHeight: e.target.value })} /></Field>
                  <Field label="Letter Spacing"><input className={inputClass} placeholder="0.28em" value={s.subtitle?.letterSpacing || ""} onChange={(e) => updateHeroStyle("subtitle", { ...(s.subtitle || {}), letterSpacing: e.target.value })} /></Field>
                </Row>
                <Row>
                  <Field label="Transform"><input className={inputClass} placeholder="uppercase" value={s.subtitle?.textTransform || ""} onChange={(e) => updateHeroStyle("subtitle", { ...(s.subtitle || {}), textTransform: e.target.value })} /></Field>
                  <Field label="Color"><input className={inputClass} placeholder="rgba(255,255,255,0.75)" value={s.subtitle?.color || ""} onChange={(e) => updateHeroStyle("subtitle", { ...(s.subtitle || {}), color: e.target.value })} /></Field>
                </Row>
                <Field label="Bottom Spacing"><input className={inputClass} placeholder="20px" value={s.subtitle?.marginBottom || ""} onChange={(e) => updateHeroStyle("subtitle", { ...(s.subtitle || {}), marginBottom: e.target.value })} /></Field>
              </Section>

              <Section title="Description Style">
                <Row>
                  <Field label="Font Size"><input className={inputClass} placeholder="18px" value={s.text?.fontSize || ""} onChange={(e) => updateHeroStyle("text", { ...(s.text || {}), fontSize: e.target.value })} /></Field>
                  <Field label="Font Weight"><input className={inputClass} placeholder="400" value={s.text?.fontWeight || ""} onChange={(e) => updateHeroStyle("text", { ...(s.text || {}), fontWeight: e.target.value })} /></Field>
                </Row>
                <Row>
                  <Field label="Line Height"><input className={inputClass} placeholder="1.8" value={s.text?.lineHeight || ""} onChange={(e) => updateHeroStyle("text", { ...(s.text || {}), lineHeight: e.target.value })} /></Field>
                  <Field label="Color"><input className={inputClass} placeholder="rgba(255,255,255,0.9)" value={s.text?.color || ""} onChange={(e) => updateHeroStyle("text", { ...(s.text || {}), color: e.target.value })} /></Field>
                </Row>
                <Field label="Bottom Spacing"><input className={inputClass} placeholder="30px" value={s.text?.marginBottom || ""} onChange={(e) => updateHeroStyle("text", { ...(s.text || {}), marginBottom: e.target.value })} /></Field>
              </Section>

              <Section title="Button Style">
                <Row>
                  <Field label="Padding"><input className={inputClass} placeholder="14px 30px" value={s.button?.padding || ""} onChange={(e) => updateHeroStyle("button", { ...(s.button || {}), padding: e.target.value })} /></Field>
                  <Field label="Radius"><input className={inputClass} placeholder="999px" value={s.button?.radius || ""} onChange={(e) => updateHeroStyle("button", { ...(s.button || {}), radius: e.target.value })} /></Field>
                </Row>
                <Row>
                  <Field label="Background"><input className={inputClass} type="color" value={s.button?.bg || "#ffffff"} onChange={(e) => updateHeroStyle("button", { ...(s.button || {}), bg: e.target.value })} /></Field>
                  <Field label="Text Color"><input className={inputClass} type="color" value={s.button?.color || "#0f172a"} onChange={(e) => updateHeroStyle("button", { ...(s.button || {}), color: e.target.value })} /></Field>
                </Row>
                <Row>
                  <Field label="Border Width"><input className={inputClass} placeholder="0px" value={s.button?.borderWidth || ""} onChange={(e) => updateHeroStyle("button", { ...(s.button || {}), borderWidth: e.target.value })} /></Field>
                  <Field label="Border Style"><input className={inputClass} placeholder="solid" value={s.button?.borderStyle || ""} onChange={(e) => updateHeroStyle("button", { ...(s.button || {}), borderStyle: e.target.value })} /></Field>
                </Row>
                <Row>
                  <Field label="Border Color"><input className={inputClass} type="color" value={s.button?.borderColor || "#ffffff"} onChange={(e) => updateHeroStyle("button", { ...(s.button || {}), borderColor: e.target.value })} /></Field>
                  <Field label="Box Shadow"><input className={inputClass} placeholder="0 18px 35px rgba(...)" value={s.button?.boxShadow || ""} onChange={(e) => updateHeroStyle("button", { ...(s.button || {}), boxShadow: e.target.value })} /></Field>
                </Row>
              </Section>
            </>
          )}
        </div>
      )}
    </div>
  );
}


