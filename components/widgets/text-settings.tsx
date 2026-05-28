
"use client"

import { TextWidgetType } from "../builder/types"
import dynamic from "next/dynamic"
import ClassicEditor from "@ckeditor/ckeditor5-build-classic"

const CKEditor = dynamic(
  () => import("@ckeditor/ckeditor5-react").then(m => m.CKEditor),
  { ssr: false }
)

export default function TextSettings({
  element,
  onChange,
}: {
  element: TextWidgetType
  onChange: (el: TextWidgetType) => void
}) {
  return (
    <div className="space-y-3">
      <CKEditor
        editor={ClassicEditor as any}
        data={element.props.content}
        config={{
          toolbar: [
            "heading",
            "|",
            "bold",
            "italic",
            "underline",
            "link",
            "|",
            "bulletedList",
            "numberedList",
            "|",
            "fontSize",
            "fontColor",
            "alignment",
            "|",
            "undo",
            "redo",
          ],
        }}
        onChange={(_, editor) => {
          onChange({
            ...element,
            props: {
              content: editor.getData(),
            },
          })
        }}
      />
    </div>
  )
}
