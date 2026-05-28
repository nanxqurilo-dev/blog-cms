// import {
//   SortableContext,
//   verticalListSortingStrategy,
// } from "@dnd-kit/sortable";
// import SortableItem from "../dnd/SortableItem";
// import WidgetRenderer from "./WidgetRenderer";

// export default function Canvas({ widgets, activeId, setActiveId }: any) {
//   return (
//     <div className="flex-1 p-6 bg-gray-50 overflow-auto">
//       <SortableContext
//         items={widgets.map((w: any) => w.id)}
//         strategy={verticalListSortingStrategy}
//       >
//         {widgets.map((widget: any) => (
//           <SortableItem key={widget.id} id={widget.id}>
//             <div
//               onClick={() => setActiveId(widget.id)}
//               className={`p-4 mb-3 border ${
//                 activeId === widget.id
//                   ? "border-blue-500"
//                   : "border-transparent"
//               }`}
//             >
//               <WidgetRenderer widget={widget} />
//             </div>
//           </SortableItem>
//         ))}
//       </SortableContext>
//     </div>
//   );
// }




"use client";

import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableItem from "../dnd/SortableItem";
import WidgetRenderer from "./WidgetRenderer";
import { useEditor } from "./EditorProvider";

export default function Canvas({
  widgets,
  activeId,
  setActiveId,
}: any) {
  const { state } = useEditor();

  const isPreview = state.mode === "preview";

  return (
    <div
      className={`flex-1 p-6 bg-gray-50 overflow-auto ${
        isPreview ? "pointer-events-none opacity-90" : ""
      }`}
    >
      {widgets.length === 0 && (
        <div className="text-center text-gray-400 mt-20">
          Start Building
        </div>
      )}

      <SortableContext
        items={widgets.map((w: any) => w.id)}
        strategy={verticalListSortingStrategy}
      >
        {widgets.map((widget: any) => (
          <SortableItem key={widget.id} id={widget.id}>
            <div
              onClick={() => {
                if (!isPreview) setActiveId(widget.id);
              }}
              className={`p-4 mb-3 border rounded transition-all
                ${
                  activeId === widget.id && !isPreview
                    ? "border-blue-500 bg-white"
                    : "border-transparent"
                }
              `}
            >
              <WidgetRenderer widget={widget} />
            </div>
          </SortableItem>
        ))}
      </SortableContext>
    </div>
  );
}
