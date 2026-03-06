"use client"

import { useState } from "react"
import { Edit2, MapPin, Briefcase, GraduationCap, Link as LinkIcon, Plus, X, Loader2 } from "lucide-react"
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
import { updateProfile, addSkill, removeSkill, addInterest, removeInterest } from "@/lib/api"

interface ProfileSectionProps {
  profile: Record<string, unknown> | null
  onProfileUpdate: () => void
}

export function ProfileSection({ profile, onProfileUpdate }: ProfileSectionProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [newSkill, setNewSkill] = useState("")
  const [newInterest, setNewInterest] = useState("")
  const [addingSkill, setAddingSkill] = useState(false)
  const [addingInterest, setAddingInterest] = useState(false)

  const user = profile?.user as { name?: string; email?: string; image?: string } | undefined
  const skills = (profile?.skills as { id: string; name: string }[]) || []
  const interests = (profile?.interests as { id: string; name: string }[]) || []
  const stats = profile?.stats as {
    connections?: number;
    smartMatches?: number;
    eventsAttended?: number;
    postsShared?: number;
  } | undefined

  const name = user?.name || "Not set"
  const title = (profile?.title as string) || "Not set"
  const location = (profile?.location as string) || "Not set"
  const company = (profile?.company as string) || "Not set"
  const education = (profile?.education as string) || "Not set"
  const bio = (profile?.bio as string) || ""
  const website = (profile?.website as string) || ""
  const avatarInitials = (profile?.avatarInitials as string) || name.substring(0, 2).toUpperCase()

  const handleSaveProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaving(true)
    try {
      const formData = new FormData(e.currentTarget)
      const data: Record<string, string> = {}
      formData.forEach((value, key) => {
        data[key] = value as string
      })
      await updateProfile(data)
      onProfileUpdate()
      setIsEditing(false)
    } catch (error) {
      console.error("Failed to update profile:", error)
    } finally {
      setSaving(false)
    }
  }

  const handleAddSkill = async () => {
    if (!newSkill.trim()) return
    setAddingSkill(true)
    try {
      await addSkill(newSkill.trim())
      setNewSkill("")
      onProfileUpdate()
    } catch (error) {
      console.error("Failed to add skill:", error)
    } finally {
      setAddingSkill(false)
    }
  }

  const handleRemoveSkill = async (id: string) => {
    try {
      await removeSkill(id)
      onProfileUpdate()
    } catch (error) {
      console.error("Failed to remove skill:", error)
    }
  }

  const handleAddInterest = async () => {
    if (!newInterest.trim()) return
    setAddingInterest(true)
    try {
      await addInterest(newInterest.trim())
      setNewInterest("")
      onProfileUpdate()
    } catch (error) {
      console.error("Failed to add interest:", error)
    } finally {
      setAddingInterest(false)
    }
  }

  const handleRemoveInterest = async (id: string) => {
    try {
      await removeInterest(id)
      onProfileUpdate()
    } catch (error) {
      console.error("Failed to remove interest:", error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card className="border-0 shadow-none bg-gradient-to-br from-primary/5 via-background to-background">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="relative">
              <Avatar className="h-28 w-28 border-4 border-background shadow-xl">
                <AvatarImage src={user?.image || ""} alt={name} />
                <AvatarFallback className="text-2xl bg-primary/10 text-primary">{avatarInitials}</AvatarFallback>
              </Avatar>
              <div className="absolute bottom-1 right-1 h-5 w-5 rounded-full bg-green-500 border-2 border-background" />
            </div>

            <div className="flex-1 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-heading font-bold">{name}</h1>
                  <p className="text-lg text-muted-foreground">{title}</p>
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
                    <form onSubmit={handleSaveProfile} className="space-y-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input id="name" name="name" defaultValue={name !== "Not set" ? name : ""} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="title">Title</Label>
                          <Input id="title" name="title" defaultValue={title !== "Not set" ? title : ""} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea id="bio" name="bio" defaultValue={bio} rows={4} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="location">Location</Label>
                          <Input id="location" name="location" defaultValue={location !== "Not set" ? location : ""} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="company">Company</Label>
                          <Input id="company" name="company" defaultValue={company !== "Not set" ? company : ""} />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="education">Education</Label>
                          <Input id="education" name="education" defaultValue={education !== "Not set" ? education : ""} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="website">Website</Label>
                          <Input id="website" name="website" defaultValue={website} />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                        <Button type="submit" disabled={saving}>
                          {saving ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Saving...</> : "Save Changes"}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                {location && location !== "Not set" && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {location}
                  </span>
                )}
                {company && company !== "Not set" && (
                  <span className="flex items-center gap-1">
                    <Briefcase className="h-4 w-4" />
                    {company}
                  </span>
                )}
                {education && education !== "Not set" && (
                  <span className="flex items-center gap-1">
                    <GraduationCap className="h-4 w-4" />
                    {education}
                  </span>
                )}
              </div>

              {bio && <p className="text-muted-foreground max-w-2xl">{bio}</p>}

              {website && (
                <div className="flex items-center gap-3 pt-2">
                  <Button variant="outline" size="sm" asChild>
                    <a href={website.startsWith("http") ? website : `https://${website}`} target="_blank" rel="noopener noreferrer">
                      <LinkIcon className="h-4 w-4 mr-2" />
                      Website
                    </a>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <CardContent className="pt-6">
            <p className="text-3xl font-bold text-primary">{stats?.connections ?? 0}</p>
            <p className="text-sm text-muted-foreground">Connections</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-6">
            <p className="text-3xl font-bold text-primary">{stats?.smartMatches ?? 0}</p>
            <p className="text-sm text-muted-foreground">Smart Matches</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-6">
            <p className="text-3xl font-bold text-primary">{stats?.eventsAttended ?? 0}</p>
            <p className="text-sm text-muted-foreground">Events Attended</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-6">
            <p className="text-3xl font-bold text-primary">{stats?.postsShared ?? 0}</p>
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
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              {skills.length === 0 && (
                <p className="text-sm text-muted-foreground">No skills added yet</p>
              )}
              {skills.map((skill) => (
                <Badge key={skill.id} variant="secondary" className="skill-badge group">
                  {skill.name}
                  <button
                    onClick={() => handleRemoveSkill(skill.id)}
                    className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Add a skill..."
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddSkill())}
                className="flex-1"
              />
              <Button size="sm" onClick={handleAddSkill} disabled={addingSkill || !newSkill.trim()}>
                {addingSkill ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Interests</CardTitle>
              <CardDescription>Topics you care about</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              {interests.length === 0 && (
                <p className="text-sm text-muted-foreground">No interests added yet</p>
              )}
              {interests.map((interest) => (
                <Badge key={interest.id} variant="outline" className="group">
                  {interest.name}
                  <button
                    onClick={() => handleRemoveInterest(interest.id)}
                    className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Add an interest..."
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddInterest())}
                className="flex-1"
              />
              <Button size="sm" onClick={handleAddInterest} disabled={addingInterest || !newInterest.trim()}>
                {addingInterest ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
