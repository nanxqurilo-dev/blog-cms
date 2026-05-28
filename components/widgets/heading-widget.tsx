"use client"

import {  HeadingWidgetType } from "../builder/types"

export default function HeadingWidget({
  element,
}: {
  element: HeadingWidgetType
}) {
  const Tag = element.props.level

  return (
    <Tag
      style={{
        color: element.props.color,
        textAlign: element.props.align,
      }}
      className="font-bold"
    >
      {element.props.text}
    </Tag>
  )
}
