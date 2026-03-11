"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { getProfile } from "@/lib/api"
import { isAuthenticated } from "@/lib/auth"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { ProfileSection } from "@/components/dashboard/profile-section"
import { MatchesSection } from "@/components/dashboard/matches-section"
import { FeedSection } from "@/components/dashboard/feed-section"
import { EventsSection } from "@/components/dashboard/events-section"
import { SettingsSection } from "@/components/dashboard/settings-section"
import { HelpSection } from "@/components/dashboard/help-section"
import { Loader2 } from "lucide-react"

export default function DashboardClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState("profile")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profile, setProfile] = useState<Record<string, unknown> | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const tab = searchParams.get("tab")
    if (tab) setActiveTab(tab)
  }, [searchParams])

  const fetchProfile = useCallback(async () => {
    try {
      if (!isAuthenticated()) {
        router.push("/auth/login")
        return
      }
      const data = await getProfile()
      setProfile(data)
    } catch {
      router.push("/auth/login")
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileSection profile={profile} onProfileUpdate={fetchProfile} />
      case "matches":
        return <MatchesSection />
      case "feed":
        return <FeedSection />
      case "events":
        return <EventsSection />
      case "settings":
        return <SettingsSection />
      case "help":
        return <HelpSection />
      default:
        return <ProfileSection profile={profile} onProfileUpdate={fetchProfile} />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader onMenuClick={() => setSidebarOpen(true)} profile={profile} />
      <DashboardSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <main className="md:pl-64">
        <div className="container max-w-6xl py-6 px-4 md:px-6">
          {renderContent()}
        </div>
      </main>
    </div>
  )
}
