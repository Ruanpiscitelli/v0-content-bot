"use client"

import { useState, useEffect } from "react"
import { getUserAuthEvents, type AuthEvent, type AuthEventType } from "@/lib/auth-events-service"
import { format } from "date-fns"
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  Search,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Filter,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface SecurityClientPageProps {
  userId: string
}

type AuthEventStatus = "success" | "failed" | "pending"

export default function SecurityClientPage({ userId }: SecurityClientPageProps) {
  const [events, setEvents] = useState<AuthEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedEventTypes, setSelectedEventTypes] = useState<AuthEventType[]>([])
  const [activeTab, setActiveTab] = useState("all")

  const limit = 10

  const fetchEvents = async () => {
    setLoading(true)
    setError(null)

    let eventTypes: AuthEventType[] | undefined = undefined

    if (activeTab === "login") {
      eventTypes = ["login_attempt", "login_success", "login_failed"]
    } else if (activeTab === "password") {
      eventTypes = ["password_reset_request", "password_reset_success", "password_reset_failed"]
    } else if (activeTab === "signup") {
      eventTypes = ["signup_attempt", "signup_success", "signup_failed"]
    } else if (selectedEventTypes.length > 0) {
      eventTypes = selectedEventTypes
    }

    const { events, error } = await getUserAuthEvents(userId, limit, page, eventTypes)

    if (error) {
      setError("Failed to load authentication history")
      setLoading(false)
      return
    }

    setEvents(events)
    setLoading(false)
  }

  useEffect(() => {
    fetchEvents()
  }, [userId, page, activeTab, selectedEventTypes])

  const filteredEvents = events.filter((event) => {
    if (!searchTerm) return true

    const searchLower = searchTerm.toLowerCase()
    return (
      event.event_type.toLowerCase().includes(searchLower) ||
      event.status.toLowerCase().includes(searchLower) ||
      event.ip_address?.toLowerCase().includes(searchLower) ||
      event.user_agent?.toLowerCase().includes(searchLower) ||
      (event.metadata && JSON.stringify(event.metadata).toLowerCase().includes(searchLower))
    )
  })

  const getEventTypeLabel = (type: AuthEventType) => {
    switch (type) {
      case "login_attempt":
        return "Login Attempt"
      case "login_success":
        return "Login Success"
      case "login_failed":
        return "Login Failed"
      case "password_reset_request":
        return "Password Reset Request"
      case "password_reset_success":
        return "Password Reset Success"
      case "password_reset_failed":
        return "Password Reset Failed"
      case "signup_attempt":
        return "Signup Attempt"
      case "signup_success":
        return "Signup Success"
      case "signup_failed":
        return "Signup Failed"
      case "logout":
        return "Logout"
      default:
        return type
    }
  }

  const getEventIcon = (event: AuthEvent) => {
    if (event.status === "failed") {
      return <AlertTriangle className="h-5 w-5 text-red-500" />
    }

    if (event.status === "pending") {
      return <Clock className="h-5 w-5 text-amber-500" />
    }

    return <CheckCircle className="h-5 w-5 text-green-500" />
  }

  const getEventStatusBadge = (status: AuthEventStatus) => {
    switch (status) {
      case "success":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Success</Badge>
      case "failed":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Failed</Badge>
      case "pending":
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">Pending</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const allEventTypes: AuthEventType[] = [
    "login_attempt",
    "login_success",
    "login_failed",
    "password_reset_request",
    "password_reset_success",
    "password_reset_failed",
    "signup_attempt",
    "signup_success",
    "signup_failed",
    "logout",
  ]

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-[#5281EE]" />
            <CardTitle>Security & Login History</CardTitle>
          </div>
          <CardDescription>Track your account activity and monitor for suspicious login attempts</CardDescription>
        </CardHeader>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <div className="px-6">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="all">All Activity</TabsTrigger>
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="password">Password Reset</TabsTrigger>
              <TabsTrigger value="signup">Signup</TabsTrigger>
            </TabsList>
          </div>

          <CardContent>
            <div className="flex items-center justify-between mb-4 gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search events..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Filter className="h-4 w-4" />
                    <span className="hidden sm:inline">Filter</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {allEventTypes.map((type) => (
                    <DropdownMenuCheckboxItem
                      key={type}
                      checked={selectedEventTypes.includes(type)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedEventTypes([...selectedEventTypes, type])
                        } else {
                          setSelectedEventTypes(selectedEventTypes.filter((t) => t !== type))
                        }
                      }}
                    >
                      {getEventTypeLabel(type)}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="ghost" size="sm" onClick={fetchEvents} className="flex items-center gap-1">
                <RefreshCw className="h-4 w-4" />
                <span className="hidden sm:inline">Refresh</span>
              </Button>
            </div>

            <TabsContent value="all" className="m-0">
              {renderEventsList(filteredEvents)}
            </TabsContent>

            <TabsContent value="login" className="m-0">
              {renderEventsList(filteredEvents)}
            </TabsContent>

            <TabsContent value="password" className="m-0">
              {renderEventsList(filteredEvents)}
            </TabsContent>

            <TabsContent value="signup" className="m-0">
              {renderEventsList(filteredEvents)}
            </TabsContent>
          </CardContent>

          <CardFooter className="flex items-center justify-between border-t px-6 py-4">
            <div className="text-sm text-gray-500">
              Showing {filteredEvents.length} of {events.length} events
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(Math.max(0, page - 1))}
                disabled={page === 0 || loading}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous</span>
              </Button>

              <span className="text-sm">Page {page + 1}</span>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page + 1)}
                disabled={events.length < limit || loading}
              >
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Next</span>
              </Button>
            </div>
          </CardFooter>
        </Tabs>
      </Card>
    </div>
  )

  function renderEventsList(events: AuthEvent[]) {
    if (loading) {
      return (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-start gap-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      )
    }

    if (error) {
      return (
        <div className="text-center py-8">
          <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-2" />
          <p className="text-red-500">{error}</p>
          <Button variant="outline" size="sm" onClick={fetchEvents} className="mt-4">
            Try Again
          </Button>
        </div>
      )
    }

    if (events.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          <Shield className="h-8 w-8 mx-auto mb-2 opacity-40" />
          <p>No authentication events found</p>
        </div>
      )
    }

    return (
      <div className="space-y-4">
        {events.map((event) => (
          <div key={event.id} className="flex items-start gap-4 p-4 rounded-lg border bg-white">
            <div className="flex-shrink-0">{getEventIcon(event)}</div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h4 className="font-medium text-gray-900">{getEventTypeLabel(event.event_type)}</h4>
                {getEventStatusBadge(event.status)}
              </div>

              <p className="text-sm text-gray-500 mb-2">{format(new Date(event.created_at), "PPpp")}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-500">
                {event.ip_address && (
                  <div>
                    <span className="font-medium">IP Address:</span> {event.ip_address}
                  </div>
                )}

                {event.user_agent && (
                  <div className="truncate">
                    <span className="font-medium">Device:</span> {event.user_agent}
                  </div>
                )}

                {event.metadata && event.metadata.email && (
                  <div>
                    <span className="font-medium">Email:</span> {event.metadata.email}
                  </div>
                )}

                {event.metadata && event.metadata.error && (
                  <div>
                    <span className="font-medium">Error:</span> {event.metadata.error}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }
}
