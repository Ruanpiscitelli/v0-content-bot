"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { getSupabase } from "@/lib/supabase"

export default function DashboardClient() {
  const [userData, setUserData] = useState({
    name: "Virallyzer",
    username: "virallyzer",
    posts: 128,
    followers: "24.5K",
    following: 342,
  })

  useEffect(() => {
    const fetchUserData = async () => {
      const supabase = getSupabase()

      if (!supabase) return

      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session?.user) {
          // Aqui você pode buscar dados adicionais do usuário do seu banco de dados
          // Por enquanto, vamos apenas usar o email como nome de usuário
          const email = session.user.email
          if (email) {
            setUserData((prev) => ({
              ...prev,
              name: email.split("@")[0],
              username: email.split("@")[0].toLowerCase(),
            }))
          }
        }
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error)
      }
    }

    fetchUserData()
  }, [])

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Profile Card */}
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md col-span-1">
          <div className="flex items-center mb-4">
            <div className="relative">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden border-2 border-red-600">
                <Image
                  src="/diverse-profile-avatars.png"
                  alt="Profile"
                  width={64}
                  height={64}
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 md:w-6 md:h-6 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div className="ml-4">
              <h2 className="font-bold text-base md:text-lg">{userData.name}</h2>
              <p className="text-gray-600 text-xs md:text-sm">@{userData.username}</p>
            </div>
          </div>

          <div className="border-t pt-4 mt-2">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600 text-sm">Posts</span>
              <span className="font-medium text-sm">{userData.posts}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600 text-sm">Followers</span>
              <span className="font-medium text-sm">{userData.followers}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 text-sm">Following</span>
              <span className="font-medium text-sm">{userData.following}</span>
            </div>
          </div>
        </div>

        {/* Engagement Card */}
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md col-span-1">
          <h2 className="font-bold text-base md:text-lg mb-4">Engagement</h2>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-xs md:text-sm text-gray-600">Likes</span>
                <span className="text-xs md:text-sm font-medium">3.2K</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-red-600 h-2 rounded-full" style={{ width: "75%" }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-xs md:text-sm text-gray-600">Comments</span>
                <span className="text-xs md:text-sm font-medium">842</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-red-600 h-2 rounded-full" style={{ width: "60%" }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-xs md:text-sm text-gray-600">Shares</span>
                <span className="text-xs md:text-sm font-medium">512</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-red-600 h-2 rounded-full" style={{ width: "45%" }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-xs md:text-sm text-gray-600">Saves</span>
                <span className="text-xs md:text-sm font-medium">1.8K</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-red-600 h-2 rounded-full" style={{ width: "65%" }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Growth Card */}
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md col-span-1">
          <h2 className="font-bold text-base md:text-lg mb-4">Growth</h2>

          <div className="space-y-4">
            <div className="flex items-center">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 md:h-6 md:w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              </div>
              <div className="ml-3 md:ml-4">
                <p className="text-xs md:text-sm text-gray-600">New Followers</p>
                <p className="font-bold text-base md:text-xl">+1,248</p>
                <p className="text-xs text-green-600">+12.5% from last month</p>
              </div>
            </div>

            <div className="flex items-center">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 md:h-6 md:w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </div>
              <div className="ml-3 md:ml-4">
                <p className="text-xs md:text-sm text-gray-600">Profile Views</p>
                <p className="font-bold text-base md:text-xl">8,942</p>
                <p className="text-xs text-blue-600">+18.2% from last month</p>
              </div>
            </div>

            <div className="flex items-center">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 md:h-6 md:w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
                  />
                </svg>
              </div>
              <div className="ml-3 md:ml-4">
                <p className="text-xs md:text-sm text-gray-600">Engagement Rate</p>
                <p className="font-bold text-base md:text-xl">5.7%</p>
                <p className="text-xs text-purple-600">+2.3% from last month</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Posts */}
      <div className="mt-6 md:mt-8">
        <h2 className="text-lg md:text-xl font-bold mb-4">Recent Posts</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-36 md:h-48 bg-gray-200 relative">
                <Image
                  src={`/vibrant-community-connection.png?height=192&width=384&query=social media post ${item}`}
                  alt={`Post ${item}`}
                  width={384}
                  height={192}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3 md:p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs md:text-sm text-gray-500">2 days ago</span>
                  <span className="text-xs md:text-sm font-medium text-red-600">Instagram</span>
                </div>
                <p className="text-xs md:text-sm text-gray-600 mb-3 line-clamp-3">
                  {item === 1 &&
                    "How to increase your social media engagement with AI-generated content. Check out these 5 proven strategies!"}
                  {item === 2 &&
                    "The ultimate guide to creating viral content that converts. Learn how Virallyzer can help you save time."}
                  {item === 3 &&
                    "Behind the scenes of our content creation process. See how we help businesses grow their online presence."}
                </p>
                <div className="flex justify-between text-xs md:text-sm text-gray-500">
                  <span>❤️ {item === 1 ? "245" : item === 2 ? "189" : "312"}</span>
                  <span>💬 {item === 1 ? "32" : item === 2 ? "27" : "45"}</span>
                  <span>🔄 {item === 1 ? "18" : item === 2 ? "14" : "23"}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Content Performance */}
      <div className="mt-6 md:mt-8">
        <h2 className="text-lg md:text-xl font-bold mb-4">Content Performance</h2>

        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
          <div className="flex flex-wrap justify-between mb-4">
            <div className="w-full sm:w-auto mb-4 sm:mb-0">
              <span className="text-sm text-gray-500">Total Content</span>
              <p className="text-2xl font-bold">128</p>
            </div>
            <div className="w-full sm:w-auto mb-4 sm:mb-0">
              <span className="text-sm text-gray-500">Average Engagement</span>
              <p className="text-2xl font-bold">4.8%</p>
            </div>
            <div className="w-full sm:w-auto mb-4 sm:mb-0">
              <span className="text-sm text-gray-500">Top Platform</span>
              <p className="text-2xl font-bold">Instagram</p>
            </div>
            <div className="w-full sm:w-auto">
              <span className="text-sm text-gray-500">Content Created This Month</span>
              <p className="text-2xl font-bold">24</p>
            </div>
          </div>

          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Performance Chart</p>
          </div>
        </div>
      </div>
    </div>
  )
}
