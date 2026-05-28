
"use client"

import { useEffect, useState } from "react"
import {
  ThumbsUp,
  MessageCircle,
  HelpCircle,
  Pencil,
  Router,
} from "lucide-react"
import Link from "next/link"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { log } from "console"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL


export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null)
  const [recentContent, setRecentContent] = useState<any[]>([])
  const [activity, setActivity] = useState<any[]>([])
  const [chartData, setChartData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [year, setYear] = useState(new Date().getFullYear())



  async function markAsSeen(notificationId: string) {
    try {
      const token = localStorage.getItem("cms_token")

      await fetch(
        `${BASE_URL}/api/dashboard/seen-notification/${notificationId}`,
        {
          method: "PUT", // ⚠️ confirm with backend (PUT or PATCH)
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )

      // Optional: remove or update UI after seen
      setActivity((prev) =>
        prev.filter((item) => item.id !== notificationId)
      )

    } catch (err) {
      console.error("❌ Failed to mark notification as seen", err)
    }
  }

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i)


  // useEffect(() => {
  //   fetchDashboard()
  // }, [])



  useEffect(() => {
    const token = localStorage.getItem("cms_token")

    if (!token) {
      window.location.href = "/"
      return
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]))
      const currentTime = Date.now() / 1000

      if (payload.exp < currentTime) {
        // ❌ token expired
        localStorage.removeItem("cms_token")
        window.location.href = "/"
        return
      }

      // ✅ token valid
      fetchDashboard()
    } catch {
      localStorage.removeItem("cms_token")
      window.location.href = "/"
    }
  }, [year])





  async function fetchDashboard() {
    console.log("BASE_URL:", BASE_URL)

    try {
      setLoading(true)

      const token = localStorage.getItem("cms_token")

      if (!token) {
        console.error("❌ cms_token not found")
        setLoading(false)
        return
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }




      const [postRes, viewRes, CommentRes, recentRes, enquiryRes, monthlyRes, activityRes] = await Promise.all([
        fetch(`${BASE_URL}/api/dashboard/total-post-count`, {
          headers,
          cache: "no-store",
        }),




        fetch(`${BASE_URL}/api/dashboard/total-view-count`, {
          headers,
          cache: "no-store",
        }),



        fetch(`${BASE_URL}/api/dashboard/total-comment-count`, {
          headers,
          cache: "no-store",
        }),

        fetch(`${BASE_URL}/api/dashboard/get-lastest-blog`, {
          headers,
          cache: "no-store",
        }),

        // ✅ NEW API
        fetch(`${BASE_URL}/api/dashboard/get-all-count`, {
          headers,
          cache: "no-store",
        }),

        // ✅ NEW API
        // fetch(
        //   `${BASE_URL}/api/dashboard/get-monthly-engagementdata?year=2026`,
        //   { headers }
        // ),


        fetch(
          `${BASE_URL}/api/dashboard/get-monthly-engagementdata?year=${year}`,
          { headers }
        ),


        fetch(`${BASE_URL}/api/dashboard/get-all-notification`, {
          headers,
          cache: "no-store",
        }),


      ])



      const postJson = await postRes.json()
      const viewJson = await viewRes.json()
      const commentJson = await CommentRes.json()
      const recentJson = await recentRes.json()
      const enquiryJson = await enquiryRes.json()
      const monthlyJson = await monthlyRes.json()
      const activityJson = await activityRes.json()






      console.log("POST API:", postJson)
      console.log("VIEW API:", viewJson)
      console.log("COMMENT API:", commentJson)
      console.log("RECENT API:", recentJson) // 👈 add this also
      console.log("ENQUIRY API:", enquiryJson)
      console.log("MONTHLY API:", monthlyJson)
      console.log("ACTIVITY API:", activityJson)



      setRecentContent(
        recentJson?.latestBlog?.map((item: any) => ({
          id: item._id,
          title: item.title,
          status: item.status,
          lastUpdated: item.updatedAt,
        })) || []
      )


      setActivity(
        activityJson?.notification?.map((item: any) => ({
          id: item._id,          // ✅ ADD THIS

          message: item.message
        })) || []
      )



      const formattedChartData =
        monthlyJson?.data?.map((item: any) => ({
          month: item.month,
          like: item.likes,       // ✅ rename
          comment: item.comments, // ✅ rename
          enquiry: item.enquiries // ✅ rename
        })) || []

      setChartData(formattedChartData)



      // setRecentContent(
      //   recentJson?.latestBlog
      //     ?.slice(0, 5)
      //     .map((item: any) => ({
      //       id: item._id,
      //       title: item.title,
      //       status: item.status,
      //       lastUpdated: item.updatedAt,
      //     })) || []
      // )


      // setRecentContent(
      //   recentJson?.latestBlog
      //     ?.sort(
      //       (a: any, b: any) =>
      //         new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      //     )
      //     .slice(0, 5)
      //     .map((item: any) => ({
      //       id: item._id,
      //       title: item.title,
      //       status: item.status,
      //       lastUpdated: item.updatedAt,
      //     })) || []
      // )




      setStats({
        totalPosts:
          postJson?.total_Post ??
          postJson?.totalPosts ??
          postJson?.data?.total_Post ??
          0,

        totalViews:
          viewJson?.totalViews ??
          viewJson?.total_views ??
          viewJson?.data?.totalViews ??
          0,





        totalComments:
          commentJson?.totalComments ??
          commentJson?.data?.totalComments ??
          0,

        // totalEnquiry: 0,

        // ✅ FIX HERE
        totalEnquiry:
          enquiryJson?.totalEnquiry ??
          enquiryJson?.data?.totalEnquiry ??
          0,


      })

    } catch (err) {
      console.error("❌ Dashboard API error:", err)
    } finally {
      setLoading(false)
    }
  }




  // console.log("Stats:", stats)


  return (
    <div className="space-y-6 pl-10">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-medium">Welcome back, Admin</h1>
        {/* <Button className="bg-blue-600 hover:bg-blue-700">
          Open Editor
        </Button> */}


        <Link href="/builder">
          <Button className="bg-blue-600 hover:bg-blue-700">
            Open Editor
          </Button>
        </Link>



      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
        <Stat title="Total Posts" value={stats?.totalPosts} />
        <Stat title="Views" value={stats?.totalViews} />
        <Stat title="Comments" value={stats?.totalComments} />
        <Stat title="Enquiries" value={stats?.totalEnquiry} />
        <Stat title="SEO Card" value="SEO" />
      </div>

      {/* CONTENT + ACTIVITY */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* RECENT CONTENT */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm">Recent Content</CardTitle>
          </CardHeader>

          {/* <CardContent>
            {loading ? (
              <p className="text-sm text-muted-foreground">Loading...</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-blue-50 text-left">
                    <th className="p-2">Title</th>
                    <th className="p-2">Status</th>
                    <th className="p-2">Last Updated</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {recentContent.map((row) => (
                    <tr key={row.id} className="border-b">
                      <td className="p-2">{row.title}</td>
                      <td className="p-2">
                        <Badge
                          className={
                            row.status === "published"
                              ? "bg-green-100 text-green-700"
                              : "bg-orange-100 text-orange-700"
                          }
                        >
                          {row.status}
                        </Badge>
                      </td>
                      <td className="p-2">
                        {new Date(row.lastUpdated).toLocaleDateString()}
                      </td>
                      <td className="p-2">
                        <Pencil className="h-4 w-4 cursor-pointer text-muted-foreground" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent> */}




          <CardContent>
            {loading ? (
              <p className="text-sm text-muted-foreground">Loading...</p>
            ) : (

              <div className="max-h-[250px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">

                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-blue-50 rounded ">
                    <tr className="text-left">
                      <th className="p-2">Title</th>
                      <th className="p-2">Status</th>
                      <th className="p-2">Last Updated</th>
                     
                    </tr>
                  </thead>

                  <tbody>
                    {recentContent.map((row) => (
                      <tr key={row.id} className="border-b">
                        <td className="p-2">{row.title}</td>
                        <td className="p-2">
                          <Badge
                            className={
                              row.status === "published"
                                ? "bg-green-100 text-green-700"
                                : "bg-orange-100 text-orange-700"
                            }
                          >
                            {row.status}
                          </Badge>
                        </td>
                        <td className="p-2">
                          {new Date(row.lastUpdated).toLocaleDateString()}
                        </td>
                        {/* <td className="p-2">
                          <Pencil className="h-4 w-4 cursor-pointer text-muted-foreground" />
                        </td> */}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>




        </Card>

        {/* RECENT ACTIVITY */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Recent Activity</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4 text-sm">
            {activity.length === 0 ? (
              <p className="text-muted-foreground">No activity</p>
            ) : (
              // activity.map((a, i) => (
              //   <Activity
              //     key={i}
              //     text={a.message}
              //     icon={
              //       a.message?.toLowerCase().includes("like")
              //         ? ThumbsUp
              //         : a.message?.toLowerCase().includes("comment")
              //           ? MessageCircle
              //           : HelpCircle
              //     }
              //   />
              // ))



              activity.map((a, i) => (
                <div
                  key={i}
                  onClick={() => markAsSeen(a.id)}  // ✅ CLICK HERE
                  className="cursor-pointer hover:bg-gray-100 p-2 rounded-md"
                >
                  <Activity
                    text={a.message}
                    icon={
                      a.message?.toLowerCase().includes("like")
                        ? ThumbsUp
                        : a.message?.toLowerCase().includes("comment")
                          ? MessageCircle
                          : HelpCircle
                    }
                  />
                </div>
              ))





            )}
          </CardContent>
        </Card>
      </div>

      {/* ENGAGEMENT */}
      <Card>
        {/* <CardHeader>
          <CardTitle className="text-sm">Blogs Engagement</CardTitle>
        </CardHeader> */}




        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-sm">Blogs Engagement</CardTitle>

          {/* YEAR DROPDOWN */}
          {/* <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="border rounded-md px-3 py-1 text-sm"
          >
            {[2023, 2024, 2025, 2026].map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select> */}





          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="border rounded-md px-3 py-1 text-sm"
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>




        </CardHeader>




        <CardContent className="h-72">
          {chartData.length === 0 ? (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              No engagement data
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                {/* <Line dataKey="like" strokeWidth={2} />
                <Line dataKey="comment" strokeWidth={2} />
                <Line dataKey="enquiry" strokeWidth={2} /> */}


                <Line dataKey="like" stroke="#df20d9" strokeWidth={2} />
                <Line dataKey="comment" stroke="#13d159" strokeWidth={2} />
                <Line dataKey="enquiry" stroke="#1d11fa" strokeWidth={2} />



              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

/* ---------------- COMPONENTS ---------------- */

function Stat({ title, value }: any) {
  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-xs text-muted-foreground">{title}</p>
        <h2 className="text-xl font-semibold">{value ?? "-"}</h2>
      </CardContent>
    </Card>
  )
}

function Activity({ icon: Icon, text }: any) {
  return (
    <div className="flex items-center gap-3">
      <Icon className="h-4 w-4 text-blue-600" />
      <span>{text}</span>
    </div>
  )
}



