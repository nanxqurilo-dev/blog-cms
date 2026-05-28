"use client"
import { ImageWidgetType } from "../builder/types"

export default function ImageSettings({
  element,
  onChange,
}: {
  element: ImageWidgetType
  onChange: (el: ImageWidgetType) => void
}) {
  const update = (key: string, value: string) => {
    onChange({
      ...element,
      props: { ...element.props, [key]: value },
    })
  }

  return (
    <>
      <label>Image URL</label>
      <input
        value={element.props.src}
        onChange={(e) => update("src", e.target.value)}
        className="input"
      />

      <label>Width</label>
      <input
        value={element.props.width}
        onChange={(e) => update("width", e.target.value)}
        className="input"
        placeholder="300px"
      />

      <label>Border Radius</label>
      <input
        value={element.props.borderRadius}
        onChange={(e) => update("borderRadius", e.target.value)}
        className="input"
        placeholder="8px"
      />
    </>
  )
}
