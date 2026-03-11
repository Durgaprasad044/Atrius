"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Sparkles, MessageCircle, UserPlus, Search, MapPin, Briefcase, Send, Loader2, Check, Clock, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  getMatches,
  searchUsers,
  sendConnectionRequest,
  getConnectionStatus,
  sendMessage,
  getConversation,
} from "@/lib/api"
import { ConnectionRespondDialog } from "@/components/dashboard/connection-respond"

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

interface Message {
  id: string
  content: string
  senderId: string
  createdAt: string
  sender: { id: string; name: string; image?: string }
}

type ConnectionStatus = "NONE" | "PENDING" | "ACCEPTED" | "REJECTED"

interface ConnectionState {
  status: ConnectionStatus
  connectionId: string | null
  isSender: boolean
}

export function MatchesSection() {
  const router = useRouter()
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [searching, setSearching] = useState(false)
  const [connectionStates, setConnectionStates] = useState<Record<string, ConnectionState>>({})
  const [connectingId, setConnectingId] = useState<string | null>(null)

  // Message dialog state
  const [messageDialog, setMessageDialog] = useState<{ open: boolean; user: MatchUser | null }>({
    open: false,
    user: null,
  })
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [sendingMessage, setSendingMessage] = useState(false)
  const [loadingMessages, setLoadingMessages] = useState(false)

  // Respond dialog state
  const [respondDialog, setRespondDialog] = useState<{
    open: boolean
    connection: { connectionId: string; user: MatchUser } | null
  }>({ open: false, connection: null })

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const data = await getMatches()
        setMatches(data)
        // Fetch connection status for all matches
        const statuses: Record<string, ConnectionState> = {}
        await Promise.all(
          data.map(async (match: Match) => {
            try {
              const status = await getConnectionStatus(match.matchedUser.id)
              statuses[match.matchedUser.id] = status
            } catch {
              statuses[match.matchedUser.id] = { status: "NONE", connectionId: null, isSender: false }
            }
          })
        )
        setConnectionStates(statuses)
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
        // Fetch connection status for search results
        const statuses: Record<string, ConnectionState> = { ...connectionStates }
        await Promise.all(
          results.map(async (user: SearchResult) => {
            if (!statuses[user.id]) {
              try {
                const status = await getConnectionStatus(user.id)
                statuses[user.id] = status
              } catch {
                statuses[user.id] = { status: "NONE", connectionId: null, isSender: false }
              }
            }
          })
        )
        setConnectionStates(statuses)
      } catch (error) {
        console.error("Search failed:", error)
      } finally {
        setSearching(false)
      }
    }, 400)
    return () => clearTimeout(timeout)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery])

  const handleConnect = async (userId: string) => {
    setConnectingId(userId)
    try {
      await sendConnectionRequest(userId)
      setConnectionStates(prev => ({
        ...prev,
        [userId]: { status: "PENDING", connectionId: null, isSender: true },
      }))
    } catch (error) {
      console.error("Failed to send connection request:", error)
    } finally {
      setConnectingId(null)
    }
  }

  const openMessageDialog = useCallback(async (user: MatchUser) => {
    setMessageDialog({ open: true, user })
    setLoadingMessages(true)
    setMessages([])
    try {
      const data = await getConversation(user.id)
      setMessages(data)
    } catch (error) {
      console.error("Failed to load messages:", error)
    } finally {
      setLoadingMessages(false)
    }
  }, [])

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !messageDialog.user) return
    setSendingMessage(true)
    try {
      const msg = await sendMessage(messageDialog.user.id, newMessage.trim())
      setMessages(prev => [...prev, msg])
      setNewMessage("")
    } catch (error) {
      console.error("Failed to send message:", error)
    } finally {
      setSendingMessage(false)
    }
  }

  const renderConnectButton = (userId: string) => {
    const state = connectionStates[userId]
    const isConnecting = connectingId === userId

    if (!state || state.status === "NONE") {
      return (
        <Button size="sm" className="flex-1" onClick={() => handleConnect(userId)} disabled={isConnecting}>
          {isConnecting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <UserPlus className="h-4 w-4 mr-2" />}
          Connect
        </Button>
      )
    }
    if (state.status === "PENDING") {
      if (!state.isSender && state.connectionId) {
        return (
          <Button
            size="sm"
            className="flex-1"
            variant="outline"
            onClick={() => setRespondDialog({
              open: true,
              connection: { connectionId: state.connectionId!, user: { id: userId, name: "", image: "" } }
            })}
          >
            <Clock className="h-4 w-4 mr-2" />
            Respond
          </Button>
        )
      }
      return (
        <Button size="sm" className="flex-1" variant="outline" disabled>
          <Clock className="h-4 w-4 mr-2" />
          Pending
        </Button>
      )
    }
    if (state.status === "ACCEPTED") {
      return (
        <Button size="sm" className="flex-1" variant="outline" disabled>
          <Check className="h-4 w-4 mr-2" />
          Connected
        </Button>
      )
    }
    if (state.status === "REJECTED") {
      return (
        <Button size="sm" className="flex-1" variant="outline" disabled>
          <X className="h-4 w-4 mr-2" />
          Rejected
        </Button>
      )
    }
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
                        <AvatarFallback className="bg-primary/10 text-primary">{initials}</AvatarFallback>
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
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => openMessageDialog(user)}
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Message
                      </Button>
                      {renderConnectButton(user.id)}
                    </div>
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
                            <AvatarFallback className="bg-primary/10 text-primary">{initials}</AvatarFallback>
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

                      {match.sharedSkills && match.sharedSkills.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {match.sharedSkills.slice(0, 3).map((skill) => (
                            <Badge key={skill} variant="secondary" className="text-xs">{skill}</Badge>
                          ))}
                          {match.sharedSkills.length > 3 && (
                            <Badge variant="secondary" className="text-xs">+{match.sharedSkills.length - 3} more</Badge>
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
                            onClick={() => openMessageDialog(user)}
                          >
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Message
                          </Button>
                          {renderConnectButton(user.id)}
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
      <Dialog open={messageDialog.open} onOpenChange={(open) => {
        if (!open) setMessageDialog({ open: false, user: null })
      }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              {messageDialog.user && (
                <>
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={messageDialog.user.image || ""} alt={messageDialog.user.name || ""} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {messageDialog.user.name?.split(" ").map(n => n[0]).join("") || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p>{messageDialog.user.name}</p>
                    <p className="text-sm font-normal text-muted-foreground">{messageDialog.user.profile?.title || ""}</p>
                  </div>
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              Send a message to start a conversation
            </DialogDescription>
          </DialogHeader>

          {/* Conversation history */}
          <ScrollArea className="h-64 rounded-md border p-3">
            {loadingMessages ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-sm text-muted-foreground">No messages yet. Say hello!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((msg) => {
                  const isMe = msg.senderId !== messageDialog.user?.id
                  return (
                    <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${isMe ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                        {msg.content}
                        <p className={`text-xs mt-1 ${isMe ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </ScrollArea>

          {/* Input */}
          <div className="flex gap-2 pt-2">
            <Textarea
              placeholder="Write your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              rows={2}
              className="resize-none"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage()
                }
              }}
            />
            <Button onClick={handleSendMessage} disabled={!newMessage.trim() || sendingMessage} className="self-end">
              {sendingMessage ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      {/* Respond Dialog */}
      <ConnectionRespondDialog
        open={respondDialog.open}
        onClose={() => setRespondDialog({ open: false, connection: null })}
        connection={respondDialog.connection}
        onResponded={(connectionId, status) => {
          setConnectionStates(prev => {
            const updated = { ...prev }
            Object.keys(updated).forEach(uid => {
              if (updated[uid].connectionId === connectionId) {
                updated[uid] = { ...updated[uid], status }
              }
            })
            return updated
          })
        }}
      />
    </div>
  )
}