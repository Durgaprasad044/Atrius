"use client"

import { useState } from "react"
import { HelpCircle, MessageSquare, BookOpen, Shield, FileText, ChevronDown, Send, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

const faqItems = [
  {
    question: "How does Smart Matching work?",
    answer: "Our AI analyzes your skills, interests, and professional goals to find the most compatible professionals in the network. The matching algorithm considers factors like shared skills, complementary expertise, industry alignment, and location to generate a compatibility score.",
  },
  {
    question: "How do I improve my Profile Strength?",
    answer: "Add skills, interests, a detailed bio, and complete all profile fields including your job title, company, education, and location. The more complete your profile, the better matches you'll receive and the higher your profile strength score will be.",
  },
  {
    question: "Can I delete my account?",
    answer: "Yes, you can delete your account at any time. Go to Settings → Danger Zone and click the 'Delete Account' button. Please note this action is irreversible and all your data will be permanently removed.",
  },
  {
    question: "How do I report a user?",
    answer: "You can report a user by clicking the flag icon on their profile or by contacting our support team through the form below. We take all reports seriously and will review them promptly.",
  },
  {
    question: "Is my data private?",
    answer: "Yes, we take your privacy seriously. We never share your personal data with third parties without your consent. Your profile information is only visible to other authenticated users within the Atrius network.",
  },
]

const resources = [
  {
    title: "Getting Started Guide",
    description: "Learn how to set up your profile and make the most of Atrius",
    icon: BookOpen,
  },
  {
    title: "Privacy Policy",
    description: "Understand how we collect, use, and protect your data",
    icon: Shield,
  },
  {
    title: "Terms of Service",
    description: "Review the terms and conditions of using Atrius",
    icon: FileText,
  },
]

export function HelpSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  const handleSubmit = async () => {
    if (!subject.trim() || !message.trim()) return
    setSending(true)
    // Simulate sending
    setTimeout(() => {
      setSending(false)
      setSent(true)
      setSubject("")
      setMessage("")
      setTimeout(() => setSent(false), 3000)
    }, 1000)
  }

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-heading font-bold flex items-center gap-2">
          <HelpCircle className="h-6 w-6 text-primary" />
          Help & Support
        </h1>
        <p className="text-muted-foreground">Find answers or reach out to our team</p>
      </div>

      {/* FAQ */}
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
          <CardDescription>Quick answers to common questions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {faqItems.map((faq, index) => (
            <div key={index} className="border border-border rounded-lg overflow-hidden">
              <button
                onClick={() => toggleFaq(index)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors"
              >
                <span className="text-sm font-medium pr-4">{faq.question}</span>
                <ChevronDown className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${openFaq === index ? "rotate-180" : ""}`} />
              </button>
              {openFaq === index && (
                <div className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed border-t border-border pt-3">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Contact Support */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Contact Support
          </CardTitle>
          <CardDescription>Can&apos;t find what you&apos;re looking for? Send us a message</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="support-subject">Subject</Label>
            <Input
              id="support-subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="What do you need help with?"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="support-message">Message</Label>
            <Textarea
              id="support-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              placeholder="Describe your issue or question in detail..."
            />
          </div>
          <div className="flex items-center justify-between">
            {sent && (
              <p className="text-sm text-green-500 font-medium">✓ Message sent successfully!</p>
            )}
            <div className="ml-auto">
              <Button onClick={handleSubmit} disabled={sending || !subject.trim() || !message.trim()}>
                {sending ? (
                  <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Sending...</>
                ) : (
                  <><Send className="h-4 w-4 mr-2" /> Submit</>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resources */}
      <div>
        <h2 className="text-lg font-heading font-semibold mb-4">Resources</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {resources.map((resource, index) => (
            <Card key={index} className="hover:border-primary/30 transition-colors cursor-pointer group">
              <CardContent className="pt-6 text-center">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <resource.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-sm font-semibold mb-1">{resource.title}</h3>
                <p className="text-xs text-muted-foreground">{resource.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
