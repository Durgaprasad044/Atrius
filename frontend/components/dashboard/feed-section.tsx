"use client"

import { useState } from "react"
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, Image, Link as LinkIcon, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const posts = [
  {
    id: 1,
    author: {
      name: "Sarah Chen",
      title: "AI/ML Engineer at OpenAI",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content: "Just published my research on transformer architectures for code generation. The results are promising - 40% improvement in accuracy compared to baseline models. Would love to discuss with anyone working on similar problems!",
    tags: ["AI", "MachineLearning", "Research"],
    likes: 234,
    comments: 45,
    shares: 12,
    timestamp: "2 hours ago",
    liked: false,
    saved: false,
  },
  {
    id: 2,
    author: {
      name: "Michael Park",
      title: "Product Designer at Figma",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content: "Design systems are not just about components - they are about creating a shared language between design and engineering. Here are 5 principles I have learned building design systems at scale:\n\n1. Start with tokens, not components\n2. Document the why, not just the what\n3. Build for composability\n4. Embrace constraints\n5. Iterate with your users",
    tags: ["Design", "DesignSystems", "ProductDesign"],
    likes: 567,
    comments: 89,
    shares: 34,
    timestamp: "4 hours ago",
    liked: true,
    saved: true,
  },
  {
    id: 3,
    author: {
      name: "David Kim",
      title: "Founder at TechVentures",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content: "Excited to announce that we have raised our Series A! Looking for talented engineers and designers to join our mission of making enterprise software more human. DM me if interested in learning more about the opportunity.",
    tags: ["Startup", "Hiring", "Fundraising"],
    likes: 892,
    comments: 156,
    shares: 78,
    timestamp: "6 hours ago",
    liked: false,
    saved: false,
  },
  {
    id: 4,
    author: {
      name: "Emily Rodriguez",
      title: "Backend Developer at Stripe",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content: "Hot take: Most microservices architectures are premature optimization. Start with a well-structured monolith, measure your bottlenecks, and only then consider splitting services. Your future self will thank you.",
    tags: ["Engineering", "Architecture", "Backend"],
    likes: 445,
    comments: 234,
    shares: 56,
    timestamp: "8 hours ago",
    liked: true,
    saved: false,
  },
  {
    id: 5,
    author: {
      name: "James Lee",
      title: "Data Scientist at Meta",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content: "Published a new tutorial on building RAG applications with LangChain and vector databases. Covers everything from document chunking to semantic search optimization. Link in the first comment!",
    tags: ["DataScience", "LLM", "Tutorial"],
    likes: 321,
    comments: 67,
    shares: 23,
    timestamp: "12 hours ago",
    liked: false,
    saved: true,
  },
]

export function FeedSection() {
  const [newPost, setNewPost] = useState("")
  const [feedPosts, setFeedPosts] = useState(posts)
  const [activeTab, setActiveTab] = useState("for-you")

  const handleLike = (postId: number) => {
    setFeedPosts(feedPosts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          liked: !post.liked,
          likes: post.liked ? post.likes - 1 : post.likes + 1,
        }
      }
      return post
    }))
  }

  const handleSave = (postId: number) => {
    setFeedPosts(feedPosts.map(post => {
      if (post.id === postId) {
        return { ...post, saved: !post.saved }
      }
      return post
    }))
  }

  const handlePost = () => {
    if (!newPost.trim()) return
    // Handle post creation
    setNewPost("")
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
          <div className="flex gap-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src="/placeholder.svg?height=40&width=40" alt="You" />
              <AvatarFallback className="bg-primary/10 text-primary">JD</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-3">
              <Textarea
                placeholder="Share your thoughts, insights, or updates..."
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                className="min-h-[100px] resize-none border-0 bg-muted/50 focus-visible:ring-1"
              />
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Image className="h-4 w-4 mr-2" />
                    Image
                  </Button>
                  <Button variant="ghost" size="sm">
                    <LinkIcon className="h-4 w-4 mr-2" />
                    Link
                  </Button>
                </div>
                <Button onClick={handlePost} disabled={!newPost.trim()}>
                  <Send className="h-4 w-4 mr-2" />
                  Post
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feed Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="for-you">For You</TabsTrigger>
          <TabsTrigger value="following">Following</TabsTrigger>
          <TabsTrigger value="trending">Trending</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Posts */}
      <div className="space-y-4">
        {feedPosts.map((post) => (
          <Card key={post.id} className="feed-post">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={post.author.avatar} alt={post.author.name} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {post.author.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-sm">{post.author.name}</p>
                    <p className="text-xs text-muted-foreground">{post.author.title}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{post.timestamp}</span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Profile</DropdownMenuItem>
                      <DropdownMenuItem>Copy Link</DropdownMenuItem>
                      <DropdownMenuItem>Report</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pb-3">
              <p className="text-sm whitespace-pre-wrap leading-relaxed">{post.content}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter className="border-t pt-3">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={post.liked ? "text-red-500" : ""}
                    onClick={() => handleLike(post.id)}
                  >
                    <Heart className={`h-4 w-4 mr-1 ${post.liked ? "fill-current" : ""}`} />
                    {post.likes}
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MessageCircle className="h-4 w-4 mr-1" />
                    {post.comments}
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Share2 className="h-4 w-4 mr-1" />
                    {post.shares}
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className={post.saved ? "text-primary" : ""}
                  onClick={() => handleSave(post.id)}
                >
                  <Bookmark className={`h-4 w-4 ${post.saved ? "fill-current" : ""}`} />
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
