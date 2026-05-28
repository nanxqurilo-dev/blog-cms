// "use client"

// import { ImageWidgetType } from "../builder/types"

// export default function ImageWidget({
//   element,
// }: {
//   element: ImageWidgetType
// }) {
//   return (
//     <img
//       src={element.props.src}
//       style={{
//         width: element.props.width,
//         borderRadius: element.props.borderRadius,
//       }}
//       alt=""
//     />
//   )
// }




"use client"

import { ImageWidgetType } from "../builder/types"

export default function ImageWidget({
  element,
}: {
  element: ImageWidgetType
}) {
  if (!element.props.src) {
    return (
      <div className="h-40 bg-muted flex items-center justify-center text-sm text-muted-foreground">
        No image selected
      </div>
    )
  }

  return (
    <img
      src={element.props.src}
      style={{
        width: element.props.width || "300px",
        borderRadius: element.props.borderRadius || "8px",
      }}
      className="block"
      alt="image"
    />
  )
}
