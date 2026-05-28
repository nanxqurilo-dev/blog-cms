"use client"
import { HeadingWidgetType } from "../builder/types"
import { useState } from "react"
import Tabs from "./tabs"

export default function HeadingSettings({
  element,
  onChange,
}: {
  element: HeadingWidgetType
  onChange: (el: HeadingWidgetType) => void
}) {
  const [tab, setTab] = useState<"general" | "style">("general")

  const update = (key: string, value: any) => {
    onChange({
      ...element,
      props: { ...element.props, [key]: value },
    })
  }

  return (
    <>
      <Tabs tab={tab} setTab={setTab} />

      {tab === "general" && (
        <>
          <label>Text</label>
          <input
            value={element.props.text}
            onChange={(e) => update("text", e.target.value)}
            className="input"
          />

          <label>Level</label>
          <select
            value={element.props.level}
            onChange={(e) => update("level", e.target.value)}
            className="input"
          >
            {["h1", "h2", "h3", "h4"].map((h) => (
              <option key={h}>{h}</option>
            ))}
          </select>
        </>
      )}

      {tab === "style" && (
        <>
          <label>Color</label>
          <input
            type="color"
            value={element.props.color}
            onChange={(e) => update("color", e.target.value)}
          />

          <label>Align</label>
          <select
            value={element.props.align}
            onChange={(e) => update("align", e.target.value)}
            className="input"
          >
            <option>left</option>
            <option>center</option>
            <option>right</option>
          </select>
        </>
      )}
    </>
  )
}
