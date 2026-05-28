"use client";

import { useEditor } from "./EditorProvider";

const buttonClass = "btn inline-flex items-center gap-2 px-2 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 transition";

export default function WidgetList({ addWidget }: any) {
  const { state } = useEditor();
  const isPreview = state.mode === "preview";

  return (
    <div
      className={`w-64 border-r p-4 space-y-2 grid grid-cols-2 gap-1 ${
        isPreview ? "opacity-50 pointer-events-none" : ""
      }`}
    >
      <h3 className="mb-2 font-bold">Widgets</h3>

      <button onClick={() => addWidget("button")} className={buttonClass}>
        ➕ Button
      </button>

      <button onClick={() => addWidget("text")} className={buttonClass}>
       📝 Text Editor
      </button>

      <button onClick={() => addWidget("heading")} className={buttonClass}>
       🔤 Heading
      </button>

      <button onClick={() => addWidget("image")} className={buttonClass}>
        🖼 Image
      </button>

      <button onClick={() => addWidget("image-carousel")} className={buttonClass}>
       🖼️  Image Carousel
      </button>

      <button onClick={() => addWidget("icon-box")} className={buttonClass}>
        🧩 Icon Box
      </button>

      <button onClick={() => addWidget("accordion")} className={buttonClass}>
      📂  Accordion
      </button>

      <button onClick={() => addWidget("inner-section")} className={buttonClass}>
         📐 Inner Section
      </button>

      <button onClick={() => addWidget("paragraph")} className={buttonClass}>
        📄 Paragraph
      </button>

      <button onClick={() => addWidget("separator")} className={buttonClass}>
        ➖ Separator
      </button>

      <button onClick={() => addWidget("hero")} className={buttonClass}>
      🧲  Hero Section
      </button>

      <button onClick={() => addWidget("testimonial")} className={buttonClass}>
        💬 Testimonial
      </button>

      <button onClick={() => addWidget("video")} className={buttonClass}>
       ▶️ Video
      </button>
    </div>
  );
}
