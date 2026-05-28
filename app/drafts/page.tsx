
"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { MoreVertical, Pencil, Save, Search, Trash2 } from "lucide-react"

const BUILDER_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL
const DRAFT_TEMPLATE_LIMIT = 20
const FALLBACK_DRAFT_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 700'%3E%3Crect width='1200' height='700' fill='%23eff6ff'/%3E%3Crect x='72' y='88' width='1056' height='524' rx='36' fill='%23dbeafe'/%3E%3Ctext x='50%25' y='47%25' text-anchor='middle' fill='%231d4ed8' font-family='Arial, sans-serif' font-size='54' font-weight='700'%3EDraft Template%3C/text%3E%3Ctext x='50%25' y='57%25' text-anchor='middle' fill='%23475569' font-family='Arial, sans-serif' font-size='28'%3EBuilder preview image not available%3C/text%3E%3C/svg%3E"

type DraftWidget = {
  type?: string
  general?: {
    src?: string
    bgImage?: string
    images?: string[]
  } | null
}

type DraftBlog = {
  _id: string
  title?: string | null
  slug?: string | null
  description?: string | null
  lastSavedAt?: string | null
  updatedAt?: string | null
  // ✅ ADD THIS
  template_thumbnail?: string
  thumbnail_public_key?: string

  draftContent?: {
    widgets?: DraftWidget[]
  } | null
}

type DraftBlogsResponse = {
  message?: string
  templates?: DraftBlog[]
  count?: number
  pagination?: {
    currentPage?: number
    totalPages?: number
    hasNextPage?: boolean
  } | null
}

type DraftTemplate = {
  id: string
  title: string
  desc: string
  image: string
  updated: string
  slug: string
}

function normalizeDraftImage(image?: string) {
  if (!image || image.includes("via.placeholder.com")) {
    return FALLBACK_DRAFT_IMAGE
  }

  return image
}

function getDraftThumbnail(widgets?: DraftWidget[]) {
  if (!widgets?.length) {
    return FALLBACK_DRAFT_IMAGE
  }

  for (const widget of widgets) {
    if (
      widget.type === "image" &&
      typeof widget.general?.src === "string" &&
      widget.general.src
    ) {
      return widget.general.src
    }

    if (
      widget.type === "hero" &&
      typeof widget.general?.bgImage === "string" &&
      widget.general.bgImage
    ) {
      return widget.general.bgImage
    }

    if (
      widget.type === "image-carousel" &&
      Array.isArray(widget.general?.images) &&
      widget.general.images[0]
    ) {
      return widget.general.images[0]
    }
  }

  return FALLBACK_DRAFT_IMAGE
}

function mapBlogToDraftTemplate(blog: DraftBlog): DraftTemplate {
  return {
    id: blog._id,
    title: blog.title?.trim() || "Untitled draft template",
    desc: blog.description?.trim() || "Draft template saved from the builder.",
    // image: normalizeDraftImage(getDraftThumbnail(blog.draftContent?.widgets)),

image: normalizeDraftImage(
  blog.template_thumbnail ||
    getDraftThumbnail(blog.draftContent?.widgets)
),

    updated: blog.lastSavedAt || blog.updatedAt || new Date().toISOString(),
    slug: blog.slug?.trim() || "",
  }
}

export default function Page() {
  const router = useRouter()
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [drafts, setDrafts] = useState<DraftTemplate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [uploadingId, setUploadingId] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null)





  useEffect(() => {
    let isMounted = true

    async function fetchAllDraftTemplates() {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("cms_token") : null

      if (!token) {
        setError("cms_token not found. Please log in again.")
        setDrafts([])
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)

        const response = await fetch(
          `${BUILDER_API_BASE_URL}/api/builder/templates`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
          }
        )

        const result = await response.json()

        if (!response.ok) {
          throw new Error(result?.message || "Failed to fetch draft templates.")
        }

        console.log("API RESULT:", result)

        // ✅ FIXED LINE
        const templates = result?.templates || []

        if (isMounted) {
          setDrafts(templates.map(mapBlogToDraftTemplate))
        }

      } catch (error) {
        if (isMounted) {
          setError(
            error instanceof Error
              ? error.message
              : "Something went wrong while loading draft templates."
          )
          setDrafts([])
        }
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    fetchAllDraftTemplates()

    return () => {
      isMounted = false
    }
  }, [])




  const handleSaveAsTemplate = async (postId: string) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("cms_token") : null

    if (!token) {
      alert("Token missing. Please login again.")
      return
    }

    try {
      const response = await fetch(
        `${BUILDER_API_BASE_URL}/api/builder/template/${postId}/save-as`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result?.message || "Failed to save as template")
      }

      console.log("Saved as template:", result)

      // ✅ Remove from drafts UI (since it moves to templates section)
      setDrafts((prev) => prev.filter((draft) => draft.id !== postId))

    } catch (error) {
      console.error(error)
      alert("Something went wrong while saving as template.")
    }
  }






  const handleDeleteDraft = async (postId: string) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("cms_token") : null

    if (!token) {
      alert("Token missing. Please login again.")
      return
    }

    const confirmDelete = window.confirm("Are you sure you want to delete this draft?")
    if (!confirmDelete) return

    try {
      const response = await fetch(
        `${BUILDER_API_BASE_URL}/api/builder/delete/blog-template/${postId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result?.message || "Failed to delete draft")
      }

      // ✅ remove from UI instantly
      setDrafts((prev) => prev.filter((draft) => draft.id !== postId))

      console.log("Deleted:", result.deleted_id)
    } catch (error) {
      console.error(error)
      alert("Something went wrong while deleting.")
    }
  }



  const handleUploadThumbnail = (postId: string) => {
    setSelectedPostId(postId)
    fileInputRef.current?.click()
  }



  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !selectedPostId) return

    const token =
      typeof window !== "undefined" ? localStorage.getItem("cms_token") : null

    if (!token) {
      alert("Token missing")
      return
    }

    try {
      setUploadingId(selectedPostId)

      const formData = new FormData()
      formData.append("post_thumbnail", file)

      const response = await fetch(
        `${BUILDER_API_BASE_URL}/api/builder/update/thumbnail/${selectedPostId}`,
        {
          method: "PUT", // ⚠️ usually update APIs are PUT (confirm if POST needed)
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      )

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result?.message || "Upload failed")
      }

      console.log("Thumbnail updated:", result)

      const newThumbnail = result?.data?.template_thumbnail

      // ✅ Update UI instantly
      setDrafts((prev) =>
        prev.map((draft) =>
          draft.id === selectedPostId
            ? { ...draft, image: newThumbnail }
            : draft
        )
      )

    } catch (error) {
      console.error(error)
      alert("Failed to upload thumbnail")
    } finally {
      setUploadingId(null)
      setSelectedPostId(null)
    }
  }



  const filteredDrafts = useMemo(() => {
    const query = search.trim().toLowerCase()

    if (!query) return drafts

    return drafts.filter((draft) =>
      [draft.title, draft.desc, draft.slug].join(" ").toLowerCase().includes(query),
    )
  }, [drafts, search])

  const handleAction = (action: string, postId: string) => {
    setOpenMenu(null)

    if (action === "edit") {
      handleOpenDraft(postId)
    }

    // if (action === "template") {
    //   console.log("Save draft as template:", postId)
    // }


    if (action === "template") {
      handleSaveAsTemplate(postId)
    }


    // if (action === "delete") {
    //   console.log("Delete draft template:", postId)
    // }

    if (action === "delete") {
      handleDeleteDraft(postId)
    }



  }

  const handleOpenDraft = (postId: string) => {
    router.push(`/builder?templateId=${encodeURIComponent(postId)}`)
  }

  return (
    <div className="min-h-screen space-y-6 bg-white p-6">

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="relative w-72">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          placeholder="Search drafts"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="w-full rounded-lg border py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {isLoading ? (
        <div className="rounded-xl border border-dashed border-blue-300 bg-blue-50/40 p-8 text-sm text-gray-500">
          Loading draft templates...
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-sm text-red-600">
          {error}
        </div>
      ) : filteredDrafts.length === 0 ? (
        <div className="rounded-xl border border-dashed border-blue-300 bg-blue-50/40 p-8 text-sm text-gray-500">
          No draft templates found.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {filteredDrafts.map((post) => (
            <div
              key={post.id}
              className="relative overflow-hidden rounded-xl border border-blue-500 bg-white"
              role="button"
              tabIndex={0}
              onClick={() => handleOpenDraft(post.id)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault()
                  handleOpenDraft(post.id)
                }
              }}
            >
              <button
                onClick={(event) => {
                  event.stopPropagation()
                  setOpenMenu(openMenu === post.id ? null : post.id)
                }}
                className="absolute right-2 top-2 z-20 rounded-md bg-blue-600 p-1.5 text-white"
                type="button"
              >
                <MoreVertical size={16} />
              </button>

              {openMenu === post.id && (
                <div className="absolute right-2 top-10 z-30 w-48 rounded-lg border bg-white shadow-lg">
                  <button
                    onClick={(event) => {
                      event.stopPropagation()
                      handleAction("edit", post.id)
                    }}
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
                    type="button"
                  >
                    <Pencil size={16} /> Edit
                  </button>



                  <button 
                    onClick={(event) => {
                      event.stopPropagation()
                      handleUploadThumbnail(post.id)
                    }}
                    
                    className="flex w-full object-cover items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
                    type="button"
                  >
                    📤 Upload Thumbnail
                  </button>



                  <button
                    onClick={(event) => {
                      event.stopPropagation()
                      handleAction("template", post.id)
                    }}
                    
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
                    type="button"
                  >
                    <Save size={16} /> Save as template
                  </button>

                  <button
                    onClick={(event) => {
                      event.stopPropagation()
                      handleAction("delete", post.id)
                    }}
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    type="button"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              )}

              {/* <div className="relative h-44 w-full">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover"
                  unoptimized={post.image.startsWith("data:")}
                />
              </div> */}



<div className="relative h-44 w-full">
  <Image
    src={post.image}
    alt={post.title}
    fill
    className={`object-cover ${
      uploadingId === post.id ? "opacity-50" : ""
    }`}
    unoptimized={post.image.startsWith("data:")}
  />

  {uploadingId === post.id && (
    <div className="absolute inset-0 flex items-center justify-center text-sm text-white bg-black/40">
      Uploading...
    </div>
  )}
</div>




              <div className="space-y-2 p-4">
                <h3 className="font-semibold leading-snug text-gray-900">
                  {post.title}
                </h3>

                <p className="text-sm leading-relaxed text-gray-500">
                  {post.desc}
                </p>

                <p className="text-xs text-gray-400">
                  Last edited on : {new Date(post.updated).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
