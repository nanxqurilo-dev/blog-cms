
// "use client"

// import { TextWidgetType } from "../builder/types"

// export default function TextWidget({
//   element,
// }: {
//   element: TextWidgetType
// }) {
//   return (
//     <div
//       className="prose max-w-none"
//       dangerouslySetInnerHTML={{ __html: element.props.content }}
//     />
//   )
// }




"use client"
import { TextWidgetType } from "../builder/types"

export default function TextWidget({
  element,
  isActive,
  onSelect,
}: {
  element: TextWidgetType
  isActive: boolean
  onSelect: () => void
}) {
  return (
    <div
      onClick={onSelect}
      className={`cursor-text ${
        isActive ? "ring-2 ring-primary p-1" : ""
      }`}
      dangerouslySetInnerHTML={{ __html: element.props.content }}
    />
  )
}
