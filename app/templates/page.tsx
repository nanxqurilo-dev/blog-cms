"use client"
import Image from "next/image"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

type Template = {
  _id: string
  title: string
  description: string
  template_thumbnail: string
}

export default function Page() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)




 const router = useRouter()   // ✅ HERE

  const handleUseTemplate = async (templateId: string) => {   // ✅ HERE
    try {
      const token = localStorage.getItem("cms_token")

      const res = await fetch(
        `${BASE_URL}/api/builder/template/${templateId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (!res.ok) throw new Error("Failed to fetch template")

      const data = await res.json()

      // Save template data
      // localStorage.setItem(
      //   "builder_template",
      //   JSON.stringify(data.template.draftContent)
      // )




localStorage.setItem(
  "builder_template",
  JSON.stringify({
    widgets: data.template.draftContent?.widgets || [],
    title: data.template.title || "",
    slug: data.template.slug || "",
    description: data.template.description || "",
  })
)



      // Redirect
      router.push("/builder")

    } catch (err) {
      console.error(err)
    }
  }





useEffect(() => {
  const fetchTemplates = async () => {
    try {
      const token = localStorage.getItem("cms_token")

      if (!token) {
        console.error("No token found")
        return
      }

      const res = await fetch(
        `${BASE_URL}/api/builder/templates?status=draft`,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
          },
        }
      )

      console.log("STATUS:", res.status)

      if (res.status === 403) {
        console.error("Invalid or expired token")
        localStorage.removeItem("cms_token")
        window.location.href = "/"
        return
      }

      if (!res.ok) {
        throw new Error("API failed")
      }



      const data = await res.json()
      console.log("DATA:", data)

      setTemplates(data.templates || [])
    } catch (err) {
      console.error("Error fetching templates", err)
    } finally {
      setLoading(false)
    }
  }

  fetchTemplates()
}, [])





  return (
    <div className="min-h-screen bg-[#f2f2f2] p-10">
      <div className="flex flex-wrap gap-8">
        {loading && <p>Loading templates...</p>}

        {!loading && templates.length === 0 && (
          <p>No templates found</p>
        )}

        {templates.map((template) => (
          <div
            key={template._id}
            className="w-[360px] rounded-xl border-2 border-blue-600 bg-white p-4"
          >
            {/* Image */}
            <div className="relative h-[180px] w-full overflow-hidden rounded-lg">
              <Image
                src={
                  template.template_thumbnail ||
                  "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?q=80&w=1200"
                }
                alt={template.title}
                fill
                className="object-cover"
              />
            </div>

            {/* Title */}
            <h3 className="mt-4 text-lg font-semibold">
              {template.title}
            </h3>

            {/* Description */}
            <p className="mt-1 text-sm text-gray-500">
              {template.description || "No description"}
            </p>

            {/* Button */}
            {/* <button className="mt-4 w-full rounded-lg bg-blue-600 py-2 text-white font-medium">
              Use Template
            </button> */}


<button
  onClick={() => handleUseTemplate(template._id)}
  className="mt-4 w-full rounded-lg bg-blue-600 py-2 text-white font-medium"
>
  Use Template
</button>


          </div>
        ))}
      </div>
    </div>
  )
}