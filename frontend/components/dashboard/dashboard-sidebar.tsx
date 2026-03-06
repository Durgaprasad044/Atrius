"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { User, Sparkles, Newspaper, Calendar, Settings, HelpCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getProfile } from "@/lib/api"

interface DashboardSidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
  isOpen: boolean
  onClose: () => void
}

const navItems = [
  { id: "profile", label: "Profile", icon: User, description: "Your details & skills" },
  { id: "matches", label: "Smart Matches", icon: Sparkles, description: "AI-powered connections" },
  { id: "feed", label: "Feed", icon: Newspaper, description: "Posts & updates" },
  { id: "events", label: "Events", icon: Calendar, description: "Networking opportunities" },
]

const bottomNavItems = [
  { id: "settings", label: "Settings", icon: Settings },
  { id: "help", label: "Help & Support", icon: HelpCircle },
]

interface ProfileData {
  user?: { name?: string }
  title?: string
  location?: string
  company?: string
  education?: string
  bio?: string
  skills?: unknown[]
  interests?: unknown[]
}

function calculateProfileStrength(profile: ProfileData | null): number {
  if (!profile) return 0
  let strength = 0
  if (profile.user?.name) strength += 15
  if (profile.title) strength += 15
  if (profile.location) strength += 10
  if (profile.company) strength += 10
  if (profile.education) strength += 10
  if (profile.bio) strength += 10
  if (profile.skills && profile.skills.length > 0) strength += 15
  if (profile.interests && profile.interests.length > 0) strength += 15
  return strength
}

function getHintText(profile: ProfileData | null): string {
  if (!profile) return "Complete your profile to get started"
  if (!profile.skills || profile.skills.length === 0) return "Add skills to boost your matches"
  if (!profile.bio) return "Add a bio to boost your profile"
  if (!profile.interests || profile.interests.length === 0) return "Add interests to boost your matches"
  const strength = calculateProfileStrength(profile)
  if (strength >= 100) return "Your profile is complete! 🎉"
  return "Complete more fields to boost your profile"
}

export function DashboardSidebar({ activeTab, onTabChange, isOpen, onClose }: DashboardSidebarProps) {
  const [profile, setProfile] = useState<ProfileData | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getProfile()
        setProfile(data as ProfileData)
      } catch {
        // Silently fail — profile strength just shows 0
      }
    }
    fetchData()
  }, [])

  const strength = calculateProfileStrength(profile)
  const hint = getHintText(profile)

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-64 border-r border-border bg-background transition-transform duration-200 md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Mobile close button */}
          <div className="flex items-center justify-between p-4 md:hidden">
            <span className="font-heading text-lg">Navigation</span>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Main navigation */}
          <nav className="flex-1 space-y-1 p-4">
            <p className="mb-3 px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Main
            </p>
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id)
                  onClose()
                }}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all duration-200",
                  activeTab === item.id
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{item.label}</span>
                  <span className="text-xs text-muted-foreground">{item.description}</span>
                </div>
              </button>
            ))}
          </nav>

          {/* Bottom navigation */}
          <div className="border-t border-border p-4">
            {bottomNavItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id)
                  onClose()
                }}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all duration-200",
                  activeTab === item.id
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            ))}
          </div>

          {/* User stats card */}
          <div className="m-4 rounded-lg bg-primary/5 border border-primary/10 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Profile Strength</span>
              <span className="text-sm font-bold text-primary">{strength}%</span>
            </div>
            <div className="h-2 rounded-full bg-muted">
              <div className="h-2 rounded-full bg-primary transition-all duration-500" style={{ width: `${strength}%` }} />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {hint}
            </p>
          </div>
        </div>
      </aside>
    </>
  )
}
