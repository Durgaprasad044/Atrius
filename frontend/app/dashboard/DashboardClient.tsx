import { Suspense } from "react"
import DashboardClient from "./DashboardClient"
import { Loader2 } from "lucide-react"

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <DashboardClient />
    </Suspense>
  )
}