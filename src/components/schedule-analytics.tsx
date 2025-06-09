"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts"
import {
  TrendingUp,
  Clock,
  Calendar,
  Users,
  AlertTriangle,
  CheckCircle,
  Target,
  BarChart3,
  PieChartIcon,
} from "lucide-react"

interface UtilizationData {
  doctorId: string
  doctorName: string
  specialization: string
  totalSlots: number
  bookedSlots: number
  utilizationRate: number
  revenue: number
  avgRating: number
  weeklyData: Array<{
    day: string
    available: number
    booked: number
    utilization: number
  }>
  monthlyTrend: Array<{
    month: string
    utilization: number
    bookings: number
  }>
  timeSlotAnalysis: Array<{
    timeSlot: string
    bookingRate: number
    demand: number
  }>
}

interface OptimizationSuggestion {
  type: "increase_slots" | "reduce_slots" | "shift_hours" | "add_day" | "remove_day"
  priority: "high" | "medium" | "low"
  title: string
  description: string
  impact: string
  doctorId: string
}

const mockUtilizationData: UtilizationData[] = [
  {
    doctorId: "1",
    doctorName: "Dr. John Smith",
    specialization: "Cardiologist",
    totalSlots: 120,
    bookedSlots: 95,
    utilizationRate: 79.2,
    revenue: 47500,
    avgRating: 4.5,
    weeklyData: [
      { day: "Mon", available: 20, booked: 18, utilization: 90 },
      { day: "Tue", available: 20, booked: 16, utilization: 80 },
      { day: "Wed", available: 20, booked: 19, utilization: 95 },
      { day: "Thu", available: 20, booked: 17, utilization: 85 },
      { day: "Fri", available: 20, booked: 15, utilization: 75 },
      { day: "Sat", available: 10, booked: 8, utilization: 80 },
      { day: "Sun", available: 0, booked: 0, utilization: 0 },
    ],
    monthlyTrend: [
      { month: "Jan", utilization: 75, bookings: 85 },
      { month: "Feb", utilization: 78, bookings: 92 },
      { month: "Mar", utilization: 82, bookings: 98 },
      { month: "Apr", utilization: 79, bookings: 95 },
      { month: "May", utilization: 85, bookings: 102 },
      { month: "Jun", utilization: 79, bookings: 95 },
    ],
    timeSlotAnalysis: [
      { timeSlot: "09:00", bookingRate: 95, demand: 120 },
      { timeSlot: "10:00", bookingRate: 88, demand: 110 },
      { timeSlot: "11:00", bookingRate: 92, demand: 115 },
      { timeSlot: "14:00", bookingRate: 75, demand: 85 },
      { timeSlot: "15:00", bookingRate: 70, demand: 80 },
      { timeSlot: "16:00", bookingRate: 65, demand: 75 },
    ],
  },
  {
    doctorId: "2",
    doctorName: "Dr. Jane Doe",
    specialization: "Dermatologist",
    totalSlots: 80,
    bookedSlots: 45,
    utilizationRate: 56.3,
    revenue: 22500,
    avgRating: 4.8,
    weeklyData: [
      { day: "Mon", available: 12, booked: 8, utilization: 67 },
      { day: "Tue", available: 12, booked: 7, utilization: 58 },
      { day: "Wed", available: 12, booked: 9, utilization: 75 },
      { day: "Thu", available: 12, booked: 6, utilization: 50 },
      { day: "Fri", available: 12, booked: 8, utilization: 67 },
      { day: "Sat", available: 8, booked: 3, utilization: 38 },
      { day: "Sun", available: 0, booked: 0, utilization: 0 },
    ],
    monthlyTrend: [
      { month: "Jan", utilization: 60, bookings: 48 },
      { month: "Feb", utilization: 58, bookings: 46 },
      { month: "Mar", utilization: 62, bookings: 50 },
      { month: "Apr", utilization: 55, bookings: 44 },
      { month: "May", utilization: 59, bookings: 47 },
      { month: "Jun", utilization: 56, bookings: 45 },
    ],
    timeSlotAnalysis: [
      { timeSlot: "10:00", bookingRate: 70, demand: 85 },
      { timeSlot: "11:00", bookingRate: 65, demand: 80 },
      { timeSlot: "15:00", bookingRate: 55, demand: 65 },
      { timeSlot: "16:00", bookingRate: 50, demand: 60 },
    ],
  },
]

const mockOptimizationSuggestions: OptimizationSuggestion[] = [
  {
    type: "increase_slots",
    priority: "high",
    title: "Increase Morning Slots for Dr. John Smith",
    description: "High demand (95% booking rate) in 9-11 AM slots suggests adding more morning appointments",
    impact: "Potential 15-20% revenue increase",
    doctorId: "1",
  },
  {
    type: "reduce_slots",
    priority: "medium",
    title: "Reduce Saturday Hours for Dr. Jane Doe",
    description: "Low utilization (38%) on Saturdays indicates oversupply",
    impact: "Reduce overhead costs by 12%",
    doctorId: "2",
  },
  {
    type: "shift_hours",
    priority: "high",
    title: "Shift Afternoon Slots Earlier",
    description: "Peak demand is 9-11 AM, consider moving some afternoon slots to morning",
    impact: "Improve overall utilization by 8-12%",
    doctorId: "1",
  },
  {
    type: "add_day",
    priority: "low",
    title: "Consider Sunday Hours for High-Demand Doctors",
    description: "Dr. John Smith has high utilization, Sunday hours could capture unmet demand",
    impact: "Potential 25% capacity increase",
    doctorId: "1",
  },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

export function ScheduleAnalytics() {
  const [selectedDoctor, setSelectedDoctor] = useState<string>("all")
  const [timeRange, setTimeRange] = useState<string>("month")

  const getUtilizationColor = (rate: number) => {
    if (rate >= 80) return "text-green-600"
    if (rate >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getUtilizationBadge = (rate: number) => {
    if (rate >= 80) return <Badge className="bg-green-100 text-green-800">Excellent</Badge>
    if (rate >= 60) return <Badge className="bg-yellow-100 text-yellow-800">Good</Badge>
    return <Badge className="bg-red-100 text-red-800">Needs Improvement</Badge>
  }

  const filteredData =
    selectedDoctor === "all" ? mockUtilizationData : mockUtilizationData.filter((d) => d.doctorId === selectedDoctor)

  const overallStats = {
    avgUtilization: mockUtilizationData.reduce((acc, d) => acc + d.utilizationRate, 0) / mockUtilizationData.length,
    totalRevenue: mockUtilizationData.reduce((acc, d) => acc + d.revenue, 0),
    totalBookings: mockUtilizationData.reduce((acc, d) => acc + d.bookedSlots, 0),
    totalSlots: mockUtilizationData.reduce((acc, d) => acc + d.totalSlots, 0),
  }

  const utilizationDistribution = [
    { name: "Excellent (80%+)", value: mockUtilizationData.filter((d) => d.utilizationRate >= 80).length },
    {
      name: "Good (60-79%)",
      value: mockUtilizationData.filter((d) => d.utilizationRate >= 60 && d.utilizationRate < 80).length,
    },
    { name: "Poor (<60%)", value: mockUtilizationData.filter((d) => d.utilizationRate < 60).length },
  ]

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4">
        <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
          <SelectTrigger className="w-full md:w-64">
            <SelectValue placeholder="Select doctor" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Doctors</SelectItem>
            {mockUtilizationData.map((doctor) => (
              <SelectItem key={doctor.doctorId} value={doctor.doctorId}>
                {doctor.doctorName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="quarter">This Quarter</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Target className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{overallStats.avgUtilization.toFixed(1)}%</p>
                <p className="text-sm text-muted-foreground">Avg Utilization</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Calendar className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{overallStats.totalBookings}</p>
                <p className="text-sm text-muted-foreground">Total Bookings</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{overallStats.totalSlots}</p>
                <p className="text-sm text-muted-foreground">Available Slots</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold">${overallStats.totalRevenue.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="optimization">Optimization</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Doctor Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Doctor Performance</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredData.map((doctor) => (
                    <div key={doctor.doctorId} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{doctor.doctorName}</p>
                          <p className="text-sm text-muted-foreground">{doctor.specialization}</p>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold ${getUtilizationColor(doctor.utilizationRate)}`}>
                            {doctor.utilizationRate.toFixed(1)}%
                          </p>
                          {getUtilizationBadge(doctor.utilizationRate)}
                        </div>
                      </div>
                      <Progress value={doctor.utilizationRate} className="h-2" />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>{doctor.bookedSlots} booked</span>
                        <span>{doctor.totalSlots} total slots</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Utilization Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <PieChartIcon className="h-5 w-5" />
                  <span>Utilization Distribution</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={utilizationDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {utilizationDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Weekly Utilization */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Weekly Utilization Patterns</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={filteredData[0]?.weeklyData || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="utilization" fill="#8884d8" name="Utilization %" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Trends Tab */}
        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Utilization Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={filteredData[0]?.monthlyTrend || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="utilization" stroke="#8884d8" name="Utilization %" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Booking Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Booking Volume Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={filteredData[0]?.monthlyTrend || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="bookings" stroke="#82ca9d" fill="#82ca9d" name="Bookings" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Time Slot Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Time Slot Demand Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={filteredData[0]?.timeSlotAnalysis || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timeSlot" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="bookingRate" fill="#8884d8" name="Booking Rate %" />
                  <Bar dataKey="demand" fill="#82ca9d" name="Demand Score" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Optimization Tab */}
        <TabsContent value="optimization" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5" />
                <span>Optimization Suggestions</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockOptimizationSuggestions.map((suggestion, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center space-x-2">
                          <Badge
                            variant={
                              suggestion.priority === "high"
                                ? "destructive"
                                : suggestion.priority === "medium"
                                  ? "default"
                                  : "secondary"
                            }
                          >
                            {suggestion.priority.toUpperCase()}
                          </Badge>
                          <h4 className="font-semibold">{suggestion.title}</h4>
                        </div>
                        <p className="text-sm text-muted-foreground">{suggestion.description}</p>
                        <p className="text-sm font-medium text-green-600">{suggestion.impact}</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Apply
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Optimization Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold">+15%</p>
                    <p className="text-sm text-muted-foreground">Potential Revenue Increase</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Clock className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold">+25</p>
                    <p className="text-sm text-muted-foreground">Additional Slots/Week</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-8 w-8 text-purple-600" />
                  <div>
                    <p className="text-2xl font-bold">85%</p>
                    <p className="text-sm text-muted-foreground">Target Utilization</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Insights Tab */}
        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Key Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5" />
                  <span>Key Insights</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-800">Peak Demand Hours</h4>
                    <p className="text-sm text-blue-600">
                      9-11 AM shows highest booking rates (90%+) across all doctors
                    </p>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <h4 className="font-semibold text-yellow-800">Underutilized Periods</h4>
                    <p className="text-sm text-yellow-600">
                      Saturday afternoons and late weekday slots have low demand
                    </p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-800">High Performers</h4>
                    <p className="text-sm text-green-600">Dr. John Smith consistently maintains 80%+ utilization</p>
                  </div>
                  <div className="p-3 bg-red-50 rounded-lg">
                    <h4 className="font-semibold text-red-800">Improvement Opportunities</h4>
                    <p className="text-sm text-red-600">Dr. Jane Doe has capacity for 35 more appointments per month</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5" />
                  <span>Action Recommendations</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="h-2 w-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-medium">Expand Morning Hours</h4>
                      <p className="text-sm text-muted-foreground">Add 8:00-9:00 AM slots for high-demand doctors</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="h-2 w-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-medium">Optimize Lunch Breaks</h4>
                      <p className="text-sm text-muted-foreground">Stagger lunch times to maintain coverage</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="h-2 w-2 bg-yellow-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-medium">Weekend Strategy</h4>
                      <p className="text-sm text-muted-foreground">
                        Consider reducing Saturday hours for low-demand specialties
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="h-2 w-2 bg-purple-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-medium">Cross-Training</h4>
                      <p className="text-sm text-muted-foreground">
                        Train staff to handle multiple specialties during peak hours
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Benchmarks */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Benchmarks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">85%</div>
                  <div className="text-sm text-muted-foreground">Target Utilization</div>
                  <Progress value={85} className="mt-2" />
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">4.5+</div>
                  <div className="text-sm text-muted-foreground">Target Rating</div>
                  <Progress value={90} className="mt-2" />
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">$50K</div>
                  <div className="text-sm text-muted-foreground">Monthly Revenue Target</div>
                  <Progress value={75} className="mt-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
