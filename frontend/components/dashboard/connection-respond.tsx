"use client"

import { useState } from "react"
import { Check, X, Loader2, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { acceptConnectionRequest, rejectConnectionRequest } from "@/lib/api"

interface RespondDialogProps {
  open: boolean
  onClose: () => void
  connection: {
    connectionId: string
    user: {
      id: string
      name: string
      image?: string
      profile?: { title?: string }
    }
  } | null
  onResponded: (connectionId: string, status: "ACCEPTED" | "REJECTED") => void
}

export function ConnectionRespondDialog({ open, onClose, connection, onResponded }: RespondDialogProps) {
  const [loading, setLoading] = useState<"accept" | "reject" | null>(null)

  const handleAccept = async () => {
    if (!connection) return
    setLoading("accept")
    try {
      await acceptConnectionRequest(connection.connectionId)
      onResponded(connection.connectionId, "ACCEPTED")
      onClose()
    } catch (error) {
      console.error("Failed to accept:", error)
    } finally {
      setLoading(null)
    }
  }

  const handleReject = async () => {
    if (!connection) return
    setLoading("reject")
    try {
      await rejectConnectionRequest(connection.connectionId)
      onResponded(connection.connectionId, "REJECTED")
      onClose()
    } catch (error) {
      console.error("Failed to reject:", error)
    } finally {
      setLoading(null)
    }
  }

  const initials = connection?.user.name?.split(" ").map(n => n[0]).join("") || "?"

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-primary" />
            Connection Request
          </DialogTitle>
          <DialogDescription>
            Respond to this connection request
          </DialogDescription>
        </DialogHeader>

        {connection && (
          <div className="flex flex-col items-center gap-4 py-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={connection.user.image || ""} alt={connection.user.name} />
              <AvatarFallback className="bg-primary/10 text-primary text-lg">{initials}</AvatarFallback>
            </Avatar>
            <div className="text-center">
              <p className="font-semibold text-lg">{connection.user.name}</p>
              {connection.user.profile?.title && (
                <p className="text-sm text-muted-foreground">{connection.user.profile.title}</p>
              )}
              <p className="text-sm text-muted-foreground mt-1">wants to connect with you</p>
            </div>

            <div className="flex gap-3 w-full pt-2">
              <Button
                variant="outline"
                className="flex-1 text-destructive hover:text-destructive"
                onClick={handleReject}
                disabled={loading !== null}
              >
                {loading === "reject" ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <X className="h-4 w-4 mr-2" />
                )}
                Decline
              </Button>
              <Button
                className="flex-1"
                onClick={handleAccept}
                disabled={loading !== null}
              >
                {loading === "accept" ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Check className="h-4 w-4 mr-2" />
                )}
                Accept
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}