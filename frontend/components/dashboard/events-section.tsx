"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Calendar, MapPin, Users, ExternalLink, Search, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { getEvents, attendEvent } from "@/lib/api"

interface EventData {
  id: string
  title: string
  description: string
  date: string
  location: string
  organizerId: string
  organizer: {
    id: string
    name: string
    image?: string
  }
  _count?: {
    attendees: number
  }
  attending?: boolean
}

export function EventsSection() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [eventsList, setEventsList] = useState<EventData[]>([])
  const [loading, setLoading] = useState(true)
  const [attendingIds, setAttendingIds] = useState<Set<string>>(new Set())

  const fetchEvents = async () => {
    try {
      const data = await getEvents()
      setEventsList(data)
    } catch {
      router.push("/auth/login")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const filteredEvents = eventsList.filter((event) => {
    return event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase())
  })

  const handleAttend = async (eventId: string) => {
    try {
      const result = await attendEvent(eventId)
      const newAttending = new Set(attendingIds)
      if (result.attending) {
        newAttending.add(eventId)
      } else {
        newAttending.delete(eventId)
      }
      setAttendingIds(newAttending)
      // Refresh events to get updated attendee count
      fetchEvents()
    } catch (error) {
      console.error("Failed to update attendance:", error)
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold flex items-center gap-2">
            <Calendar className="h-6 w-6 text-primary" />
            Events
          </h1>
          <p className="text-muted-foreground">Discover networking opportunities and tech events</p>
        </div>
        <Badge variant="secondary" className="w-fit">
          {eventsList.length} events
        </Badge>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search events..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Empty State */}
      {filteredEvents.length === 0 && (
        <Card className="p-12 text-center">
          <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg font-medium">No events yet.</p>
          <p className="text-muted-foreground mt-1">Check back soon for upcoming events!</p>
        </Card>
      )}

      {/* Events Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredEvents.map((event) => {
          const isAttending = attendingIds.has(event.id)
          const attendeeCount = event._count?.attendees ?? 0

          return (
            <Card key={event.id} className="event-card overflow-hidden">
              <div className="relative h-40 bg-gradient-to-br from-primary/20 to-primary/5">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl font-heading font-bold text-primary/20">
                    Event
                  </span>
                </div>
                {isAttending && (
                  <div className="absolute top-3 right-3">
                    <Badge variant="secondary">Attending</Badge>
                  </div>
                )}
              </div>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg line-clamp-2">{event.title}</CardTitle>
                <CardDescription className="line-clamp-2">{event.description || "No description"}</CardDescription>
              </CardHeader>
              <CardContent className="pb-3 space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(event.date)} at {formatTime(event.date)}</span>
                  </div>
                  {event.location && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{event.location}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {attendeeCount} attendee{attendeeCount !== 1 ? "s" : ""}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    by {event.organizer?.name || "Unknown"}
                  </span>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4 gap-2">
                <Button
                  variant={isAttending ? "secondary" : "default"}
                  className="flex-1"
                  onClick={() => handleAttend(event.id)}
                >
                  {isAttending ? "Unattend" : "Attend"}
                </Button>
                <Button variant="outline" size="icon">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
