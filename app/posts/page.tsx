
"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import {
  MoreVertical,
  Star,
  Eye,
  Heart,
  MessageSquare,
  Repeat,
  Pencil,
  EyeIcon,
  Trash2,
  Save,
} from "lucide-react"
import { useRouter } from "next/navigation"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const postsData = Array.from({ length: 6 }).map((_, i) => ({
  id: i,
  title: "Lorem ipsum dolor sit amet, consectetur",
  desc:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim a",
  image:
    "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?q=80&w=1200",
  updated: "12/12/2025",
  views: 205,
  likes: 100,
  comments: 80,
  shares: 2,
  favourite: i % 3 === 0,
}))

export default function Page() {
  // const [posts, setPosts] = useState(postsData)
  const router = useRouter()

  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [openMenu, setOpenMenu] = useState<number | null>(null)

  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("all") // "all" | "favourites"



  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem("cms_token") // if auth needed

      const res = await fetch(
        `${BASE_URL}/api/builder/get/blog-template/published?page=1&limit=20`,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      )


      const data = await res.json()

      console.log("API DATA 👉", data)
      console.log("First Thumbnail 👉", data.blogs?.[0]?.template_thumbnail)


      // setPosts(data.blogs || [])


      setPosts(
        (data.blogs || []).map((p: any) => ({
          ...p,
          favourite: p.isfavourite ?? false, // ✅ map backend → frontend
        }))
      )


    } catch (err) {
      console.error("Error fetching posts:", err)
    } finally {
      setLoading(false)
    }
  }





  const toggleFavourite = async (id: string) => {
    try {
      const token = localStorage.getItem("cms_token")

      const res = await fetch(
        `${BASE_URL}/api/builder/add/to-favourite/${id}`,
        {
          method: "POST",
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      )

      const data = await res.json()

      console.log("Favourite Response 👉", data)

      // ✅ update instantly
      setPosts(prev =>
        prev.map(p =>
          p._id === id
            ? { ...p, favourite: data.isFavourite }
            : p
        )
      )

      // ✅ IMPORTANT: refetch from backend (fix refresh issue)
      fetchPosts()

    } catch (err) {
      console.error("Favourite error:", err)
    } finally {
      setOpenMenu(null)
    }
  }


  const handleView = (id: number) => {
    alert(`View post ID: ${id}`)
    setOpenMenu(null)
  }

  // const handleEdit = (id: number) => {
  //   alert(`Edit post ID: ${id}`)
  //   setOpenMenu(null)
  // }



const handleEdit = (id: string) => {
  router.push(`/builder?templateId=${id}`)
  setOpenMenu(null)
}


  const handleSaveAsTemplate = (id: number) => {
    alert(`Post ${id} saved as template`)
    setOpenMenu(null)
  }

  // const handleDelete = (id: number) => {
  //   const confirmDelete = confirm(
  //     "Are you sure you want to delete this post?"
  //   )
  //   if (!confirmDelete) return

  //   setPosts(prev => prev.filter(p => p._id !== id))
  //   setOpenMenu(null)
  // }


  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("Are you sure you want to delete this post?")
    if (!confirmDelete) return

    try {
      const token = localStorage.getItem("cms_token")

      const res = await fetch(
        `${BASE_URL}/api/builder/delete/blog-template/${id}`,
        {
          method: "DELETE", // ✅ important
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      )

      const data = await res.json()
      console.log("Delete Response 👉", data)

      // ✅ remove from UI instantly
      setPosts(prev => prev.filter(p => p._id !== id))

      // ✅ optional: re-fetch to stay in sync
      // await fetchPosts()

    } catch (err) {
      console.error("Delete error:", err)
    } finally {
      setOpenMenu(null)
    }
  }


  // 👇 ✅ PASTE HERE
  const filteredPosts = posts.filter((post: any) => {
    const matchesSearch =
      post.title?.toLowerCase().includes(search.toLowerCase()) ||
      post.description?.toLowerCase().includes(search.toLowerCase())

    const matchesFilter =
      filter === "all" ? true : post.favourite === true

    return matchesSearch && matchesFilter
  })



  return (
    <div className="p-6 space-y-6 bg-white min-h-screen">
      {/* Top Bar */}
      <div className="flex items-center justify-between gap-4">



        <input
          type="text"
          placeholder="Search posts"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-sm rounded-md border px-4 py-2 text-sm focus:outline-none"
        />





        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-md border px-4 py-2 text-sm"
        >
          <option value="all">All</option>
          <option value="favourites">Favourites</option>
        </select>




      </div>


      {/* ✅ ADD HERE */}
      {loading && (
        <p className="text-center">Loading posts...</p>
      )}



      {!loading && filteredPosts.length === 0 && (
        <p className="text-center text-gray-500">No posts found</p>
      )}



      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* {posts.map((post, index) => ( */}

        {filteredPosts.map((post, index) => (
          <div
            key={post._id || index}


            className={`rounded-xl border-2 overflow-hidden bg-white ${post.favourite ? "border-yellow-400" : "border-blue-500"
              }`}


          >
            <div className="relative h-44">






              <Image
                src={
                  post.template_thumbnail && post.template_thumbnail !== ""
                    ? post.template_thumbnail
                    : "/fallback.png"
                }

                alt="post"
                fill
                className="object-cover"
              />



              <button
                onClick={() =>
                  setOpenMenu(openMenu === post._id ? null : post._id)
                }



                className={`absolute top-3 right-3 p-1 rounded-md ${post.favourite ? "bg-yellow-400" : "bg-blue-600"
                  }`}

              >
                <MoreVertical size={16} className="text-white" />
              </button>

              {openMenu === post._id && (
                <div className="absolute top-12 right-3 w-44 rounded-md border bg-white shadow-md z-50">
                  <button
                    onClick={() => handleView(post._id)}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-100"
                  >
                    <EyeIcon size={14} /> View
                  </button>

                  <button
                    onClick={() => handleEdit(post._id)}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-100"
                  >
                    <Pencil size={14} /> Edit
                  </button>



                  <button
                    onClick={() => toggleFavourite(post._id)}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-100"
                  >


                    <Star size={14} />
                    {post.favourite ? "Remove from Favourite" : "Mark as Favourite"}


                  </button>

                  {/* <button
                    onClick={() => handleDelete(post._id)}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <Trash2 size={14} /> Delete
                  </button> */}



                  <button
                    onClick={() => handleDelete(post._id)}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <Trash2 size={14} /> Delete
                  </button>



                </div>
              )}
            </div>

            <div className="p-4 space-y-3">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-sm leading-snug">
                  {post.title}
                </h3>

                <Star
                  size={18}
                  className={post.favourite ? "text-yellow-400" : "text-gray-300"}
                />


              </div>

              <p className="text-xs text-gray-500 line-clamp-3">
                {post.description}
              </p>

              <p className="text-[11px] text-gray-400">
                Updated on ·{post.publishDateFormatted}
              </p>

              <div className="flex items-center justify-between pt-2 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Eye size={14} /> {post.seen_count || 0}
                </span>
                <span className="flex items-center gap-1 text-red-500">
                  <Heart size={14} /> {post.likes || 0}
                </span>
                <span className="flex items-center gap-1 text-purple-500">
                  <MessageSquare size={14} /> {post.comments?.length || 0}
                </span>
                {/* <span className="flex items-center gap-1">
                  <Repeat size={14} /> {post.shares || 0}
                </span> */}
              </div>
            </div>
          </div>
        ))}





      </div>
    </div>
  )
}

