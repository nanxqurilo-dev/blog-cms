// import { useSortable } from "@dnd-kit/sortable";
// import { CSS } from "@dnd-kit/utilities";

// export default function SortableItem({ id, children }: any) {
//   const { attributes, listeners, setNodeRef, transform, transition } =
//     useSortable({ id });

//   return (
//     <div
//       ref={setNodeRef}
//       {...attributes}
//       {...listeners}
//       style={{
//         transform: CSS.Transform.toString(transform),
//         transition,
//       }}
//     >
//       {children}
//     </div>
//   );
// }

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function SortableItem({ id, children }: any) {
  const { setNodeRef, attributes, listeners, transform, transition } =
    useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="cursor-move text-xs text-gray-400 mb-1"
      >
        ⇅ Drag
      </div>

      {children}
    </div>
  );
}
