"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScheduleAnalytics } from "@/components/schedule-analytics"
import { NavBar } from "@/components/nav-bar"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { BarChart3, Download, RefreshCw, Calendar } from "lucide-react"

export default function AnalyticsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Redirect if not admin
  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      router.push("/unauthorized")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <NavBar />
        <div className="container mx-auto px-4 py-12">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!user || user.role !== "admin") {
    return null
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulate data refresh
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsRefreshing(false)
  }

  const handleExport = () => {
    // Simulate export functionality
    console.log("Exporting analytics data...")
  }

  return (
    <div className="min-h-screen bg-background">
      <NavBar />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold flex items-center space-x-2">
                <BarChart3 className="h-8 w-8" />
                <span>Schedule Analytics</span>
              </h1>
              <p className="text-muted-foreground">Track utilization and optimize doctor schedules</p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
                <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                {isRefreshing ? "Refreshing..." : "Refresh"}
              </Button>
              <Button variant="outline" onClick={handleExport}>
                <Download className="mr-2 h-4 w-4" />
                Export Report
              </Button>
            </div>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Quick Actions</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm">
                  Generate Weekly Report
                </Button>
                <Button variant="outline" size="sm">
                  Schedule Optimization Review
                </Button>
                <Button variant="outline" size="sm">
                  Compare Doctor Performance
                </Button>
                <Button variant="outline" size="sm">
                  Forecast Demand
                </Button>
                <Button variant="outline" size="sm">
                  Revenue Analysis
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Analytics Component */}
          <ScheduleAnalytics />

          {/* Additional Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Overall System Utilization</span>
                    <span className="font-semibold text-green-600">Healthy</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Booking Conversion Rate</span>
                    <span className="font-semibold">87.5%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Average Wait Time</span>
                    <span className="font-semibold">3.2 days</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Patient Satisfaction</span>
                    <span className="font-semibold text-green-600">4.6/5.0</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upcoming Optimizations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-800 text-sm">Scheduled for Tomorrow</h4>
                    <p className="text-xs text-blue-600">Apply morning slot optimization for Dr. Smith</p>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <h4 className="font-semibold text-yellow-800 text-sm">Pending Review</h4>
                    <p className="text-xs text-yellow-600">Weekend schedule adjustment for Dermatology</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-800 text-sm">Completed</h4>
                    <p className="text-xs text-green-600">Lunch break optimization implemented</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
