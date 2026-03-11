"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState, useCallback } from "react"
import { Bell, Search, Menu, LogOut, MessageCircle, UserPlus, Heart, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ModeToggle } from "@/components/mode-toggle"
import { removeToken } from "@/lib/auth"
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead } from "@/lib/api"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Notification {
  id: string
  type: string
  message: string
  read: boolean
  createdAt: string
  referenceId?: string
}

interface DashboardHeaderProps {
  onMenuClick: () => void
  profile: Record<string, unknown> | null
}

const notificationIcon = (type: string) => {
  switch (type) {
    case "MESSAGE": return <MessageCircle className="h-4 w-4 text-blue-500" />
    case "CONNECTION": return <UserPlus className="h-4 w-4 text-green-500" />
    case "LIKE": return <Heart className="h-4 w-4 text-red-500" />
    case "MATCH": return <Sparkles className="h-4 w-4 text-purple-500" />
    default: return <Bell className="h-4 w-4 text-muted-foreground" />
  }
}

const formatTime = (dateStr: string) => {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

export function DashboardHeader({ onMenuClick, profile }: DashboardHeaderProps) {
  const router = useRouter()
  const user = profile?.user as { name?: string; email?: string; image?: string } | undefined
  const avatarInitials = (profile?.avatarInitials as string) || user?.name?.substring(0, 2).toUpperCase() || "?"

  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [notifOpen, setNotifOpen] = useState(false)

  const fetchNotifications = useCallback(async () => {
    try {
      const data = await getNotifications()
      setNotifications(data.notifications)
      setUnreadCount(data.unreadCount)
    } catch {
      // silently fail
    }
  }, [])

  // Poll every 30 seconds
  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [fetchNotifications])

  const handleMarkAsRead = async (id: string) => {
    try {
      await markNotificationAsRead(id)
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch {
      // silently fail
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead()
      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
      setUnreadCount(0)
    } catch {
      // silently fail
    }
  }

  const handleNotificationClick = async (notif: Notification) => {
    if (!notif.read) await handleMarkAsRead(notif.id)
    setNotifOpen(false)
    // Navigate based on type
    switch (notif.type) {
      case "MESSAGE":
        router.push("/dashboard?tab=matches")
        break
      case "CONNECTION":
        router.push("/dashboard?tab=matches")
        break
      case "LIKE":
        router.push("/dashboard?tab=feed")
        break
      case "MATCH":
        router.push("/dashboard?tab=matches")
        break
    }
  }

  const handleLogout = () => {
    removeToken()
    router.push("/auth/login")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenuClick}>
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
              A
            </div>
            <span className="font-heading text-xl hidden sm:inline-block">ATRIUS</span>
          </Link>
        </div>

        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search people, events, posts..."
              className="w-full pl-10 bg-muted/50 border-0 focus-visible:ring-1"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Notifications Bell */}
          <DropdownMenu open={notifOpen} onOpenChange={(open) => {
            setNotifOpen(open)
            if (open) fetchNotifications()
          }}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-primary text-[10px] text-primary-foreground flex items-center justify-center font-bold">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
                <span className="sr-only">Notifications</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="flex items-center justify-between px-3 py-2">
                <span className="font-semibold text-sm">Notifications</span>
                {unreadCount > 0 && (
                  <Button variant="ghost" size="sm" className="text-xs h-auto py-1" onClick={handleMarkAllAsRead}>
                    Mark all read
                  </Button>
                )}
              </div>
              <DropdownMenuSeparator />
              <ScrollArea className="h-72">
                {notifications.length === 0 ? (
                  <div className="px-3 py-6 text-center text-sm text-muted-foreground">
                    No notifications yet
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`flex items-start gap-3 px-3 py-3 cursor-pointer hover:bg-muted/50 transition-colors border-b border-border/50 last:border-0 ${!notif.read ? "bg-primary/5" : ""}`}
                      onClick={() => handleNotificationClick(notif)}
                    >
                      <div className="mt-0.5 shrink-0">{notificationIcon(notif.type)}</div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm leading-snug ${!notif.read ? "font-medium" : "text-muted-foreground"}`}>
                          {notif.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">{formatTime(notif.createdAt)}</p>
                      </div>
                      {!notif.read && (
                        <div className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0" />
                      )}
                    </div>
                  ))
                )}
              </ScrollArea>
            </DropdownMenuContent>
          </DropdownMenu>

          <ModeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user?.image || ""} alt={user?.name || "User"} />
                  <AvatarFallback className="bg-primary/10 text-primary">{avatarInitials}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.name || "Not set"}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user?.email || "Not set"}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile Settings</DropdownMenuItem>
              <DropdownMenuItem>Account</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}