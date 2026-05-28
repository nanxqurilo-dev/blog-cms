"use client"

import { BuilderElement } from "../builder/types"

export default function ButtonWidget({ element }: { element: BuilderElement }) {
  const { text, bgColor, textColor, padding, borderRadius } = element.props

  return (
    <button
      style={{
        backgroundColor: bgColor,
        color: textColor,
        padding,
        borderRadius,
      }}
      className="inline-block"
    >
      {text}
    </button>
  )
}
