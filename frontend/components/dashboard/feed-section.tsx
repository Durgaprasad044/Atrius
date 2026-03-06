"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, Send, Loader2, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getPosts, createPost, deletePost, likePost } from "@/lib/api"
import { getToken } from "@/lib/auth"

interface Post {
  id: string
  content: string
  likes: number
  createdAt: string
  userId: string
  user: {
    id: string
    name: string
    image?: string
  }
}

export function FeedSection() {
  const router = useRouter()
  const [newPost, setNewPost] = useState("")
  const [feedPosts, setFeedPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [posting, setPosting] = useState(false)

  const fetchPosts = async () => {
    try {
      const data = await getPosts()
      setFeedPosts(data)
    } catch {
      router.push("/auth/login")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Decode current user ID from JWT
  const getCurrentUserId = (): string | null => {
    const token = getToken()
    if (!token) return null
    try {
      const payload = JSON.parse(atob(token.split(".")[1]))
      return payload.id
    } catch {
      return null
    }
  }

  const currentUserId = getCurrentUserId()

  const handleLike = async (postId: string) => {
    try {
      const updated = await likePost(postId)
      setFeedPosts(feedPosts.map(post => post.id === postId ? { ...post, likes: updated.likes } : post))
    } catch (error) {
      console.error("Failed to like post:", error)
    }
  }

  const handleDelete = async (postId: string) => {
    try {
      await deletePost(postId)
      setFeedPosts(feedPosts.filter(post => post.id !== postId))
    } catch (error) {
      console.error("Failed to delete post:", error)
    }
  }

  const handlePost = async () => {
    if (!newPost.trim()) return
    setPosting(true)
    try {
      const post = await createPost(newPost.trim())
      setFeedPosts([post, ...feedPosts])
      setNewPost("")
    } catch (error) {
      console.error("Failed to create post:", error)
    } finally {
      setPosting(false)
    }
  }

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    if (diffMins < 60) return `${diffMins}m ago`
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours}h ago`
    const diffDays = Math.floor(diffHours / 24)
    return `${diffDays}d ago`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-heading font-bold">Feed</h1>
        <p className="text-muted-foreground">Stay updated with the community</p>
      </div>

      {/* Create Post */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-3">
            <Textarea
              placeholder="Share your thoughts, insights, or updates..."
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              className="min-h-[100px] resize-none border-0 bg-muted/50 focus-visible:ring-1"
            />
            <div className="flex items-center justify-end">
              <Button onClick={handlePost} disabled={!newPost.trim() || posting}>
                {posting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
                Post
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Empty State */}
      {feedPosts.length === 0 && (
        <Card className="p-12 text-center">
          <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg font-medium">No posts yet.</p>
          <p className="text-muted-foreground mt-1">Be the first to share!</p>
        </Card>
      )}

      {/* Posts */}
      <div className="space-y-4">
        {feedPosts.map((post) => {
          const initials = post.user?.name?.split(" ").map(n => n[0]).join("") || "?"
          const isOwner = currentUserId === post.userId

          return (
            <Card key={post.id} className="feed-post">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={post.user?.image || ""} alt={post.user?.name || "User"} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-sm">{post.user?.name || "Unknown"}</p>
                      <p className="text-xs text-muted-foreground">{formatTime(post.createdAt)}</p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Copy Link</DropdownMenuItem>
                      {isOwner && (
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(post.id)}>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Post
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="pb-3">
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{post.content}</p>
              </CardContent>
              <CardFooter className="border-t pt-3">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLike(post.id)}
                    >
                      <Heart className="h-4 w-4 mr-1" />
                      {post.likes}
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MessageCircle className="h-4 w-4 mr-1" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Share2 className="h-4 w-4 mr-1" />
                    </Button>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Bookmark className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
