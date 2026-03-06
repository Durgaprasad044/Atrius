"use client"

import { useState } from "react"
import { Edit2, MapPin, Briefcase, GraduationCap, Link as LinkIcon, Github, Linkedin, Twitter, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const userProfile = {
  name: "John Doe",
  title: "Full Stack Developer",
  location: "San Francisco, CA",
  email: "john@example.com",
  bio: "Passionate about building scalable web applications and exploring the intersection of AI and software development. Always looking to connect with like-minded innovators.",
  company: "TechCorp Inc.",
  education: "MIT - Computer Science",
  website: "johndoe.dev",
  skills: ["React", "TypeScript", "Node.js", "Python", "Machine Learning", "AWS", "PostgreSQL", "GraphQL"],
  interests: ["AI/ML", "Web3", "Open Source", "Startups", "Product Design"],
  lookingFor: ["Co-founders", "Collaborators", "Mentors", "Technical Partners"],
  stats: {
    connections: 248,
    matches: 45,
    eventsAttended: 12,
    postsShared: 23,
  },
  socials: {
    github: "johndoe",
    linkedin: "johndoe",
    twitter: "johndoe",
  },
}

export function ProfileSection() {
  const [isEditing, setIsEditing] = useState(false)

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card className="border-0 shadow-none bg-gradient-to-br from-primary/5 via-background to-background">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="relative">
              <Avatar className="h-28 w-28 border-4 border-background shadow-xl">
                <AvatarImage src="/placeholder.svg?height=112&width=112" alt={userProfile.name} />
                <AvatarFallback className="text-2xl bg-primary/10 text-primary">JD</AvatarFallback>
              </Avatar>
              <div className="absolute bottom-1 right-1 h-5 w-5 rounded-full bg-green-500 border-2 border-background" />
            </div>

            <div className="flex-1 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-heading font-bold">{userProfile.name}</h1>
                  <p className="text-lg text-muted-foreground">{userProfile.title}</p>
                </div>
                <Dialog open={isEditing} onOpenChange={setIsEditing}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Edit2 className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Edit Profile</DialogTitle>
                      <DialogDescription>
                        Update your profile information to improve your matches
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input id="name" defaultValue={userProfile.name} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="title">Title</Label>
                          <Input id="title" defaultValue={userProfile.title} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea id="bio" defaultValue={userProfile.bio} rows={4} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="location">Location</Label>
                          <Input id="location" defaultValue={userProfile.location} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="company">Company</Label>
                          <Input id="company" defaultValue={userProfile.company} />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                        <Button onClick={() => setIsEditing(false)}>Save Changes</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {userProfile.location}
                </span>
                <span className="flex items-center gap-1">
                  <Briefcase className="h-4 w-4" />
                  {userProfile.company}
                </span>
                <span className="flex items-center gap-1">
                  <GraduationCap className="h-4 w-4" />
                  {userProfile.education}
                </span>
              </div>

              <p className="text-muted-foreground max-w-2xl">{userProfile.bio}</p>

              <div className="flex items-center gap-3 pt-2">
                <Button variant="outline" size="sm" asChild>
                  <a href={`https://github.com/${userProfile.socials.github}`} target="_blank" rel="noopener noreferrer">
                    <Github className="h-4 w-4" />
                  </a>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href={`https://linkedin.com/in/${userProfile.socials.linkedin}`} target="_blank" rel="noopener noreferrer">
                    <Linkedin className="h-4 w-4" />
                  </a>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href={`https://twitter.com/${userProfile.socials.twitter}`} target="_blank" rel="noopener noreferrer">
                    <Twitter className="h-4 w-4" />
                  </a>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href={`https://${userProfile.website}`} target="_blank" rel="noopener noreferrer">
                    <LinkIcon className="h-4 w-4 mr-2" />
                    Website
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <CardContent className="pt-6">
            <p className="text-3xl font-bold text-primary">{userProfile.stats.connections}</p>
            <p className="text-sm text-muted-foreground">Connections</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-6">
            <p className="text-3xl font-bold text-primary">{userProfile.stats.matches}</p>
            <p className="text-sm text-muted-foreground">Smart Matches</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-6">
            <p className="text-3xl font-bold text-primary">{userProfile.stats.eventsAttended}</p>
            <p className="text-sm text-muted-foreground">Events Attended</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-6">
            <p className="text-3xl font-bold text-primary">{userProfile.stats.postsShared}</p>
            <p className="text-sm text-muted-foreground">Posts Shared</p>
          </CardContent>
        </Card>
      </div>

      {/* Skills & Interests */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Skills</CardTitle>
              <CardDescription>Your technical expertise</CardDescription>
            </div>
            <Button variant="ghost" size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {userProfile.skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="skill-badge">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Interests</CardTitle>
              <CardDescription>Topics you care about</CardDescription>
            </div>
            <Button variant="ghost" size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {userProfile.interests.map((interest) => (
                <Badge key={interest} variant="outline">
                  {interest}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Looking For */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Looking For</CardTitle>
          <CardDescription>What kind of connections are you seeking?</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {userProfile.lookingFor.map((item) => (
              <Badge key={item} className="bg-primary/10 text-primary hover:bg-primary/20">
                {item}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
