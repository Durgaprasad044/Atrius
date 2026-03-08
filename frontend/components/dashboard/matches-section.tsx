"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Sparkles, MessageCircle, UserPlus, Search, MapPin, Briefcase, Send, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { getMatches, searchUsers } from "@/lib/api"

interface MatchUser {
  id: string
  name: string
  image?: string
  profile?: {
    title?: string
    location?: string
    company?: string
    avatarInitials?: string
  }
}

interface Match {
  id: string
  score: number
  status: string
  sharedSkills?: string[]
  sharedInterests?: string[]
  matchedUser: MatchUser
}

interface SearchResult {
  id: string
  name: string
  image?: string
  profile?: {
    title?: string
    location?: string
    company?: string
    avatarInitials?: string
    skills?: { name: string }[]
  }
}

export function MatchesSection() {
  const router = useRouter()
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [searching, setSearching] = useState(false)
  const [messageDialog, setMessageDialog] = useState<{ open: boolean; match: Match | null }>({
    open: false,
    match: null,
  })
  const [message, setMessage] = useState("")

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const data = await getMatches()
        setMatches(data)
      } catch {
        router.push("/auth/login")
      } finally {
        setLoading(false)
      }
    }
    fetchMatches()
  }, [router])

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }

    const timeout = setTimeout(async () => {
      setSearching(true)
      try {
        const results = await searchUsers(searchQuery)
        setSearchResults(results)
      } catch (error) {
        console.error("Search failed:", error)
      } finally {
        setSearching(false)
      }
    }, 400)

    return () => clearTimeout(timeout)
  }, [searchQuery])

  const openMessageDialog = (match: Match) => {
    setMessageDialog({ open: true, match })
    setMessage("")
  }

  const sendMessage = () => {
    setMessageDialog({ open: false, match: null })
    setMessage("")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const isSearching = searchQuery.trim().length > 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            Smart Matches
          </h1>
          <p className="text-muted-foreground">AI-powered connections based on your profile</p>
        </div>
        <Badge variant="secondary" className="w-fit">
          {matches.length} potential matches
        </Badge>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            {searching ? (
              <Loader2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground animate-spin" />
            ) : (
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            )}
            <Input
              placeholder="Search people by name..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      {isSearching && (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground font-medium">Search Results</p>
          {searchResults.length === 0 && !searching && (
            <Card className="p-6 text-center">
              <p className="text-muted-foreground">No users found for &quot;{searchQuery}&quot;</p>
            </Card>
          )}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {searchResults.map((user) => {
              const initials = user.name?.split(" ").map(n => n[0]).join("") || user.profile?.avatarInitials || "?"
              return (
                <Card key={user.id} className="group">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Avatar className="h-14 w-14">
                        <AvatarImage src={user.image || ""} alt={user.name} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{user.name}</h3>
                        <p className="text-sm text-muted-foreground">{user.profile?.title || "No title"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      {user.profile?.company && (
                        <span className="flex items-center gap-1">
                          <Briefcase className="h-3.5 w-3.5" />
                          {user.profile.company}
                        </span>
                      )}
                      {user.profile?.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {user.profile.location}
                        </span>
                      )}
                    </div>
                    <Button size="sm" className="w-full">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Connect
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* Auto Matches */}
      {!isSearching && (
        <>
          {matches.length === 0 ? (
            <Card className="p-12 text-center">
              <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium">No matches found yet.</p>
              <p className="text-muted-foreground mt-1">Complete your profile to get matched!</p>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {matches.map((match) => {
                const user = match.matchedUser
                const initials = user?.name?.split(" ").map(n => n[0]).join("") || user?.profile?.avatarInitials || "?"
                return (
                  <Card key={match.id} className="match-card group">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-14 w-14">
                            <AvatarImage src={user?.image || ""} alt={user?.name || "User"} />
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {initials}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold">{user?.name || "Unknown"}</h3>
                            <p className="text-sm text-muted-foreground">{user?.profile?.title || "Not set"}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-full">
                          <Sparkles className="h-3 w-3" />
                          <span className="text-xs font-bold">{Math.round(match.score)}%</span>
                        </div>
                      </div>

                      {/* Shared skills/interests */}
                      {match.sharedSkills && match.sharedSkills.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {match.sharedSkills.slice(0, 3).map((skill) => (
                            <Badge key={skill} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {match.sharedSkills.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{match.sharedSkills.length - 3} more
                            </Badge>
                          )}
                        </div>
                      )}

                      <div className="space-y-3">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          {user?.profile?.company && (
                            <span className="flex items-center gap-1">
                              <Briefcase className="h-3.5 w-3.5" />
                              {user.profile.company}
                            </span>
                          )}
                          {user?.profile?.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3.5 w-3.5" />
                              {user.profile.location}
                            </span>
                          )}
                        </div>

                        <div className="flex gap-2 pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => openMessageDialog(match)}
                          >
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Message
                          </Button>
                          <Button size="sm" className="flex-1">
                            <UserPlus className="h-4 w-4 mr-2" />
                            Connect
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </>
      )}

      {/* Message Dialog */}
      <Dialog open={messageDialog.open} onOpenChange={(open) => setMessageDialog({ open, match: messageDialog.match })}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              {messageDialog.match && (
                <>
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={messageDialog.match.matchedUser?.image || ""} alt={messageDialog.match.matchedUser?.name || ""} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {messageDialog.match.matchedUser?.name?.split(" ").map(n => n[0]).join("") || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p>{messageDialog.match.matchedUser?.name}</p>
                    <p className="text-sm font-normal text-muted-foreground">{messageDialog.match.matchedUser?.profile?.title || ""}</p>
                  </div>
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              Start a conversation to explore collaboration opportunities
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <Textarea
              placeholder="Write your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="resize-none"
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setMessageDialog({ open: false, match: null })}>
                Cancel
              </Button>
              <Button onClick={sendMessage} disabled={!message.trim()}>
                <Send className="h-4 w-4 mr-2" />
                Send Message
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}