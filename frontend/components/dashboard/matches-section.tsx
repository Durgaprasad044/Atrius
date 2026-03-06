"use client"

import { useState } from "react"
import { Sparkles, MessageCircle, UserPlus, Filter, Search, MapPin, Briefcase, X, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const matches = [
  {
    id: 1,
    name: "Sarah Chen",
    title: "AI/ML Engineer",
    company: "OpenAI",
    location: "San Francisco, CA",
    avatar: "/placeholder.svg?height=64&width=64",
    matchScore: 95,
    skills: ["Python", "TensorFlow", "Machine Learning", "NLP"],
    mutualConnections: 12,
    lookingFor: "Technical Co-founder",
    online: true,
  },
  {
    id: 2,
    name: "Michael Park",
    title: "Product Designer",
    company: "Figma",
    location: "New York, NY",
    avatar: "/placeholder.svg?height=64&width=64",
    matchScore: 89,
    skills: ["UI/UX", "Figma", "Design Systems", "Prototyping"],
    mutualConnections: 8,
    lookingFor: "Startup opportunities",
    online: true,
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    title: "Backend Developer",
    company: "Stripe",
    location: "Seattle, WA",
    avatar: "/placeholder.svg?height=64&width=64",
    matchScore: 87,
    skills: ["Go", "Kubernetes", "PostgreSQL", "Microservices"],
    mutualConnections: 5,
    lookingFor: "Mentorship",
    online: false,
  },
  {
    id: 4,
    name: "David Kim",
    title: "Startup Founder",
    company: "TechVentures",
    location: "Austin, TX",
    avatar: "/placeholder.svg?height=64&width=64",
    matchScore: 84,
    skills: ["Leadership", "Fundraising", "Product Strategy", "React"],
    mutualConnections: 15,
    lookingFor: "Technical Partners",
    online: true,
  },
  {
    id: 5,
    name: "Anna Williams",
    title: "DevOps Engineer",
    company: "AWS",
    location: "Denver, CO",
    avatar: "/placeholder.svg?height=64&width=64",
    matchScore: 82,
    skills: ["AWS", "Terraform", "CI/CD", "Docker"],
    mutualConnections: 3,
    lookingFor: "Collaborators",
    online: false,
  },
  {
    id: 6,
    name: "James Lee",
    title: "Data Scientist",
    company: "Meta",
    location: "Menlo Park, CA",
    avatar: "/placeholder.svg?height=64&width=64",
    matchScore: 79,
    skills: ["Python", "PyTorch", "Data Analysis", "Statistics"],
    mutualConnections: 7,
    lookingFor: "Research Partners",
    online: true,
  },
]

const roles = ["All Roles", "Developer", "Designer", "Product Manager", "Data Scientist", "Founder", "Engineer"]

export function MatchesSection() {
  const [selectedRole, setSelectedRole] = useState("All Roles")
  const [searchQuery, setSearchQuery] = useState("")
  const [messageDialog, setMessageDialog] = useState<{ open: boolean; match: typeof matches[0] | null }>({
    open: false,
    match: null,
  })
  const [message, setMessage] = useState("")

  const filteredMatches = matches.filter((match) => {
    const matchesSearch = match.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      match.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      match.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesSearch
  })

  const openMessageDialog = (match: typeof matches[0]) => {
    setMessageDialog({ open: true, match })
    setMessage("")
  }

  const sendMessage = () => {
    // Handle message sending
    setMessageDialog({ open: false, match: null })
    setMessage("")
  }

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

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name, title, or skills..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Matches Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredMatches.map((match) => (
          <Card key={match.id} className="match-card group">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="h-14 w-14">
                      <AvatarImage src={match.avatar} alt={match.name} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {match.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    {match.online && (
                      <div className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-green-500 border-2 border-background" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold">{match.name}</h3>
                    <p className="text-sm text-muted-foreground">{match.title}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-full">
                  <Sparkles className="h-3 w-3" />
                  <span className="text-xs font-bold">{match.matchScore}%</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Briefcase className="h-3.5 w-3.5" />
                    {match.company}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {match.location}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {match.skills.slice(0, 3).map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {match.skills.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{match.skills.length - 3}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2 text-sm">
                  <span className="text-muted-foreground">
                    {match.mutualConnections} mutual connections
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {match.lookingFor}
                  </Badge>
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
        ))}
      </div>

      {/* Message Dialog */}
      <Dialog open={messageDialog.open} onOpenChange={(open) => setMessageDialog({ open, match: messageDialog.match })}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              {messageDialog.match && (
                <>
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={messageDialog.match.avatar} alt={messageDialog.match.name} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {messageDialog.match.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p>{messageDialog.match.name}</p>
                    <p className="text-sm font-normal text-muted-foreground">{messageDialog.match.title}</p>
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
