"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { ProfileSection } from "@/components/dashboard/profile-section"
import { MatchesSection } from "@/components/dashboard/matches-section"
import { FeedSection } from "@/components/dashboard/feed-section"
import { EventsSection } from "@/components/dashboard/events-section"

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("profile")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileSection />
      case "matches":
        return <MatchesSection />
      case "feed":
        return <FeedSection />
      case "events":
        return <EventsSection />
      default:
        return <ProfileSection />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader onMenuClick={() => setSidebarOpen(true)} />
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
