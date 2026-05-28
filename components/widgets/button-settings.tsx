"use client"

import { BuilderElement } from "../builder/types"
import { useState } from "react"

export default function ButtonSettings({
  element,
  onChange,
}: {
  element: BuilderElement
  onChange: (el: BuilderElement) => void
}) {
  const [tab, setTab] = useState<"general" | "style">("general")

  const update = (key: string, value: string) => {
    onChange({
      ...element,
      props: {
        ...element.props,
        [key]: value,
      },
    })
  }

  return (
    <>
      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        <button onClick={() => setTab("general")} className="text-sm">
          General
        </button>
        <button onClick={() => setTab("style")} className="text-sm">
          Style
        </button>
      </div>

      {/* GENERAL */}
      {tab === "general" && (
        <div className="space-y-3">
          <label className="text-sm">Button Text</label>
          <input
            value={element.props.text}
            onChange={(e) => update("text", e.target.value)}
            className="w-full border px-2 py-1"
          />
        </div>
      )}

      {/* STYLE */}
      {tab === "style" && (
        <div className="space-y-3">
          <label>Background Color</label>
          <input
            type="color"
            value={element.props.bgColor}
            onChange={(e) => update("bgColor", e.target.value)}
          />

          <label>Text Color</label>
          <input
            type="color"
            value={element.props.textColor}
            onChange={(e) => update("textColor", e.target.value)}
          />
        </div>
      )}
    </>
  )
}
