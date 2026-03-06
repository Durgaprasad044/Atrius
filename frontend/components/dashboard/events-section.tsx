"use client"

import { useState } from "react"
import { Calendar, MapPin, Users, Clock, ExternalLink, Filter, Search, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const events = [
  {
    id: 1,
    title: "TechCrunch Disrupt 2026",
    description: "The world's leading authority in debuting revolutionary startups, introducing game-changing technologies, and discussing what's top of mind for the tech industry's key innovators.",
    type: "Conference",
    date: "Mar 15-17, 2026",
    time: "9:00 AM - 6:00 PM PST",
    location: "San Francisco, CA",
    venue: "Moscone Center",
    attendees: 1250,
    maxAttendees: 2000,
    status: "live",
    image: "/placeholder.svg?height=200&width=400",
    tags: ["Startups", "Innovation", "Networking"],
    participants: [
      { avatar: "/placeholder.svg?height=32&width=32" },
      { avatar: "/placeholder.svg?height=32&width=32" },
      { avatar: "/placeholder.svg?height=32&width=32" },
      { avatar: "/placeholder.svg?height=32&width=32" },
    ],
    registered: false,
  },
  {
    id: 2,
    title: "AI Summit 2026",
    description: "Join the brightest minds in artificial intelligence for three days of cutting-edge presentations, hands-on workshops, and networking opportunities.",
    type: "Summit",
    date: "Mar 20-22, 2026",
    time: "10:00 AM - 5:00 PM EST",
    location: "New York, NY",
    venue: "Javits Center",
    attendees: 890,
    maxAttendees: 1500,
    status: "live",
    image: "/placeholder.svg?height=200&width=400",
    tags: ["AI", "Machine Learning", "Deep Learning"],
    participants: [
      { avatar: "/placeholder.svg?height=32&width=32" },
      { avatar: "/placeholder.svg?height=32&width=32" },
      { avatar: "/placeholder.svg?height=32&width=32" },
    ],
    registered: true,
  },
  {
    id: 3,
    title: "HackMIT 2026",
    description: "MIT's annual hackathon brings together 1000+ hackers from around the world to build innovative projects over 24 hours.",
    type: "Hackathon",
    date: "Mar 25-26, 2026",
    time: "12:00 PM - 12:00 PM EST",
    location: "Cambridge, MA",
    venue: "MIT Campus",
    attendees: 756,
    maxAttendees: 1000,
    status: "upcoming",
    image: "/placeholder.svg?height=200&width=400",
    tags: ["Hackathon", "Coding", "Innovation"],
    participants: [
      { avatar: "/placeholder.svg?height=32&width=32" },
      { avatar: "/placeholder.svg?height=32&width=32" },
    ],
    registered: false,
  },
  {
    id: 4,
    title: "Product Design Week",
    description: "A week-long celebration of product design featuring workshops, talks, and portfolio reviews from industry leaders.",
    type: "Workshop",
    date: "Apr 1-5, 2026",
    time: "Various times",
    location: "Virtual",
    venue: "Online",
    attendees: 2100,
    maxAttendees: 5000,
    status: "upcoming",
    image: "/placeholder.svg?height=200&width=400",
    tags: ["Design", "UX", "Product"],
    participants: [
      { avatar: "/placeholder.svg?height=32&width=32" },
      { avatar: "/placeholder.svg?height=32&width=32" },
      { avatar: "/placeholder.svg?height=32&width=32" },
      { avatar: "/placeholder.svg?height=32&width=32" },
      { avatar: "/placeholder.svg?height=32&width=32" },
    ],
    registered: true,
  },
  {
    id: 5,
    title: "DevOps Days Seattle",
    description: "A grassroots event for software engineering, systems administration, and operations professionals.",
    type: "Conference",
    date: "Apr 10-11, 2026",
    time: "9:00 AM - 5:00 PM PST",
    location: "Seattle, WA",
    venue: "Washington Convention Center",
    attendees: 445,
    maxAttendees: 800,
    status: "upcoming",
    image: "/placeholder.svg?height=200&width=400",
    tags: ["DevOps", "Cloud", "Infrastructure"],
    participants: [
      { avatar: "/placeholder.svg?height=32&width=32" },
      { avatar: "/placeholder.svg?height=32&width=32" },
    ],
    registered: false,
  },
  {
    id: 6,
    title: "Startup Networking Mixer",
    description: "Connect with founders, investors, and startup enthusiasts in a casual networking environment.",
    type: "Networking",
    date: "Mar 12, 2026",
    time: "6:00 PM - 9:00 PM PST",
    location: "San Francisco, CA",
    venue: "The Battery",
    attendees: 120,
    maxAttendees: 150,
    status: "live",
    image: "/placeholder.svg?height=200&width=400",
    tags: ["Networking", "Startups", "Investors"],
    participants: [
      { avatar: "/placeholder.svg?height=32&width=32" },
      { avatar: "/placeholder.svg?height=32&width=32" },
      { avatar: "/placeholder.svg?height=32&width=32" },
    ],
    registered: true,
  },
]

const eventTypes = ["All Events", "Conference", "Hackathon", "Workshop", "Summit", "Networking"]

export function EventsSection() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState("All Events")
  const [activeTab, setActiveTab] = useState("all")
  const [eventsList, setEventsList] = useState(events)

  const filteredEvents = eventsList.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesType = selectedType === "All Events" || event.type === selectedType

    const matchesTab = activeTab === "all" ||
      (activeTab === "live" && event.status === "live") ||
      (activeTab === "registered" && event.registered)

    return matchesSearch && matchesType && matchesTab
  })

  const handleRegister = (eventId: number) => {
    setEventsList(eventsList.map(event => {
      if (event.id === eventId) {
        return {
          ...event,
          registered: !event.registered,
          attendees: event.registered ? event.attendees - 1 : event.attendees + 1,
        }
      }
      return event
    }))
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
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-green-500/10 text-green-500 border-green-500/20">
            <Zap className="h-3 w-3 mr-1" />
            {events.filter(e => e.status === "live").length} Live Now
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search events..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Event type" />
              </SelectTrigger>
              <SelectContent>
                {eventTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Events</TabsTrigger>
          <TabsTrigger value="live">Live Now</TabsTrigger>
          <TabsTrigger value="registered">Registered</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Events Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredEvents.map((event) => (
          <Card key={event.id} className="event-card overflow-hidden">
            <div className="relative h-40 bg-gradient-to-br from-primary/20 to-primary/5">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl font-heading font-bold text-primary/20">
                  {event.type}
                </span>
              </div>
              {event.status === "live" && (
                <div className="absolute top-3 left-3">
                  <Badge className="bg-green-500 text-white border-0">
                    <span className="relative flex h-2 w-2 mr-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                    </span>
                    Live
                  </Badge>
                </div>
              )}
              {event.registered && (
                <div className="absolute top-3 right-3">
                  <Badge variant="secondary">Registered</Badge>
                </div>
              )}
            </div>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-lg line-clamp-2">{event.title}</CardTitle>
                <Badge variant="outline" className="shrink-0">{event.type}</Badge>
              </div>
              <CardDescription className="line-clamp-2">{event.description}</CardDescription>
            </CardHeader>
            <CardContent className="pb-3 space-y-3">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{event.location}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {event.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {event.participants.slice(0, 4).map((participant, index) => (
                      <Avatar key={index} className="h-7 w-7 border-2 border-background">
                        <AvatarImage src={participant.avatar} />
                        <AvatarFallback className="text-xs bg-primary/10 text-primary">U</AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    <Users className="h-3 w-3 inline mr-1" />
                    {event.attendees}/{event.maxAttendees}
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4 gap-2">
              <Button
                variant={event.registered ? "secondary" : "default"}
                className="flex-1"
                onClick={() => handleRegister(event.id)}
              >
                {event.registered ? "Unregister" : "Register"}
              </Button>
              <Button variant="outline" size="icon">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">No events found matching your criteria</p>
        </Card>
      )}
    </div>
  )
}
