"use client"
import { Trash, Copy, Move } from "lucide-react"

export default function WidgetControls({
  onDelete,
  onDuplicate,
}: {
  onDelete: () => void
  onDuplicate: () => void
}) {
  return (
    <div className="absolute -top-3 right-2 flex gap-2 bg-black text-white px-2 py-1 rounded text-xs">
      <button onClick={onDuplicate}><Copy size={12} /></button>
      <button onClick={onDelete}><Trash size={12} /></button>
      <Move size={12} />
    </div>
  )
}
