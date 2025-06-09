"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, Clock, Users, CheckCircle, XCircle, AlertCircle, ToggleLeft, ToggleRight } from "lucide-react";
import { NavBar } from "@/components/nav-bar";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { getDoctorBookings, updateBookingStatus, type Booking } from "@/lib/booking-service";
import { format } from "date-fns";
import { toast } from "sonner";

export default function DoctorDashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Redirect if not doctor
  useEffect(() => {
    if (!loading && (!user || user.role !== "doctor")) {
      router.push("/auth/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <NavBar />
        <div className="container mx-auto px-4 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="h-32 bg-muted rounded"></div>
              <div className="h-32 bg-muted rounded"></div>
              <div className="h-32 bg-muted rounded"></div>
            </div>
            <div className="h-64 bg-muted rounded mt-6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "doctor") {
    return null;
  }

  return <DoctorDashboardContent doctorId={user.id} doctorName={user.name} />;
}

function DoctorDashboardContent({ doctorId, doctorName }: { doctorId: string; doctorName: string }) {
  const { user, updateDoctorStatus } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("upcoming");

  useEffect(() => {
    async function fetchBookings() {
      try {
        const fetchedBookings = await getDoctorBookings(doctorId);
        setBookings(fetchedBookings);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setError("Failed to load bookings");
        toast.error("Failed to Load Bookings", {
          description: "Please try again later.",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchBookings();
  }, [doctorId]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingBookings = bookings.filter(
    (booking) => (booking.status === "Pending" || booking.status === "Confirmed") && new Date(booking.date) >= today,
  );

  const todayBookings = bookings.filter(
    (booking) =>
      (booking.status === "Pending" || booking.status === "Confirmed") &&
      format(new Date(booking.date), "yyyy-MM-dd") === format(today, "yyyy-MM-dd"),
  );

  const pastBookings = bookings.filter(
    (booking) =>
      booking.status === "Completed" ||
      booking.status === "Cancelled" ||
      booking.status === "Rejected" ||
      new Date(booking.date) < today,
  );

  const handleUpdateStatus = async (bookingId: string, status: "Confirmed" | "Completed" | "Rejected") => {
    try {
      await updateBookingStatus(bookingId, status);
      setBookings((prev) =>
        prev.map((booking) => (booking.id === bookingId ? { ...booking, status } : booking)),
      );
      toast.success("Status Updated", {
        description: `Booking status has been updated to ${status}.`,
      });
    } catch (err) {
      console.error("Error updating booking status:", err);
      toast.error("Failed to Update Status", {
        description: "Please try again.",
      });
    }
  };

  const handleToggleActiveStatus = async () => {
    if (!user) return;

    const newStatus = !user.isActive;
    try {
      await updateDoctorStatus(newStatus);
      toast.success("Status Updated", {
        description: `You are now ${newStatus ? "Active" : "Inactive"}.`,
      });
    } catch (err: any) {
      console.error("Error toggling active status:", err);
      toast.error("Failed to Update Status", {
        description: err.message || "Please try again.",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pending":
        return (
          <Badge variant="outline" className="text-yellow-600 border-yellow-600">
            Pending
          </Badge>
        );
      case "Confirmed":
        return (
          <Badge variant="outline" className="text-green-600 border-green-600">
            Confirmed
          </Badge>
        );
      case "Completed":
        return (
          <Badge variant="outline" className="text-blue-600 border-blue-600">
            Completed
          </Badge>
        );
      case "Cancelled":
        return (
          <Badge variant="outline" className="text-red-600 border-red-600">
            Cancelled
          </Badge>
        );
      case "Rejected":
        return (
          <Badge variant="outline" className="text-red-600 border-red-600">
            Rejected
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) {
        return "Invalid Date";
      }
      return format(date, "MMM d, yyyy");
    } catch {
      return "Invalid Date";
    }
  };

  const formatTime = (timeStr: string) => {
    try {
      const [hours, minutes] = timeStr.split(":");
      const hour = Number.parseInt(hours);
      const ampm = hour >= 12 ? "PM" : "AM";
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${minutes} ${ampm} IST`;
    } catch {
      return "Invalid Time";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <NavBar />
        <div className="container mx-auto px-4 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="h-32 bg-muted rounded"></div>
              <div className="h-32 bg-muted rounded"></div>
              <div className="h-32 bg-muted rounded"></div>
            </div>
            <div className="h-64 bg-muted rounded mt-6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <NavBar />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Welcome, {doctorName}</h1>
            <div className="flex items-center space-x-2">
              <Badge variant={user?.isActive ? "default" : "secondary"}>
                {user?.isActive ? "Active" : "Inactive"}
              </Badge>
              <Button
                size="sm"
                variant="outline"
                onClick={handleToggleActiveStatus}
                className={user?.isActive ? "text-red-600 border-red-600 hover:bg-red-50" : "text-green-600 border-green-600 hover:bg-green-50"}
              >
                {user?.isActive ? (
                  <>
                    <ToggleLeft className="h-4 w-4 mr-1" />
                    Set Inactive
                  </>
                ) : (
                  <>
                    <ToggleRight className="h-4 w-4 mr-1" />
                    Set Active
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Today's Appointments</CardTitle>
                <CardDescription>Scheduled for today</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold">{todayBookings.length}</span>
                  <Calendar className="h-6 w-6 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Upcoming Appointments</CardTitle>
                <CardDescription>Future scheduled appointments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold">{upcomingBookings.length}</span>
                  <Clock className="h-6 w-6 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Total Patients</CardTitle>
                <CardDescription>Unique patients seen</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold">
                    {new Set(bookings.map((booking) => booking.patientId)).size}
                  </span>
                  <Users className="h-6 w-6 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Appointments Tabs */}
          <Card>
            <CardHeader>
              <CardTitle>Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="upcoming" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-6">
                  <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                  <TabsTrigger value="today">Today</TabsTrigger>
                  <TabsTrigger value="past">Past</TabsTrigger>
                </TabsList>

                {error ? (
                  <div className="text-center py-12">
                    <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Error loading appointments</h3>
                    <p className="text-muted-foreground mb-4">{error}</p>
                    <Button onClick={() => window.location.reload()}>Try Again</Button>
                  </div>
                ) : (
                  <>
                    <TabsContent value="upcoming">
                      {upcomingBookings.length === 0 ? (
                        <div className="text-center py-12">
                          <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <h3 className="text-lg font-semibold mb-2">No upcoming appointments</h3>
                          <p className="text-muted-foreground">You don't have any upcoming appointments scheduled.</p>
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Booking ID</TableHead>
                                <TableHead>Patient</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Time</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {upcomingBookings.map((booking) => (
                                <TableRow key={booking.id}>
                                  <TableCell className="font-mono text-sm">{booking.id?.substring(0, 8)}</TableCell>
                                  <TableCell>
                                    <div>
                                      <p className="font-medium">{booking.patientName}</p>
                                      <p className="text-sm text-muted-foreground">
                                        {booking.patientGender}, {booking.patientAge} years
                                      </p>
                                    </div>
                                  </TableCell>
                                  <TableCell>{formatDate(booking.date)}</TableCell>
                                  <TableCell>{formatTime(booking.time)}</TableCell>
                                  <TableCell>{getStatusBadge(booking.status)}</TableCell>
                                  <TableCell>
                                    <div className="flex space-x-2">
                                      {booking.status === "Pending" && (
                                        <>
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            className="text-green-600 border-green-600 hover:bg-green-50"
                                            onClick={() => booking.id && handleUpdateStatus(booking.id, "Confirmed")}
                                          >
                                            <CheckCircle className="h-4 w-4 mr-1" />
                                            Confirm
                                          </Button>
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            className="text-red-600 border-red-600 hover:bg-red-50"
                                            onClick={() => booking.id && handleUpdateStatus(booking.id, "Rejected")}
                                          >
                                            <XCircle className="h-4 w-4 mr-1" />
                                            Reject
                                          </Button>
                                        </>
                                      )}
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      )}
                    </TabsContent>
                    <TabsContent value="today">
                      {todayBookings.length === 0 ? (
                        <div className="text-center py-12">
                          <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <h3 className="text-lg font-semibold mb-2">No appointments today</h3>
                          <p className="text-muted-foreground">You don't have any appointments scheduled for today.</p>
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Booking ID</TableHead>
                                <TableHead>Patient</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Time</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {todayBookings.map((booking) => (
                                <TableRow key={booking.id}>
                                  <TableCell className="font-mono text-sm">{booking.id?.substring(0, 8)}</TableCell>
                                  <TableCell>
                                    <div>
                                      <p className="font-medium">{booking.patientName}</p>
                                      <p className="text-sm text-muted-foreground">
                                        {booking.patientGender}, {booking.patientAge} years
                                      </p>
                                    </div>
                                  </TableCell>
                                  <TableCell>{formatDate(booking.date)}</TableCell>
                                  <TableCell>{formatTime(booking.time)}</TableCell>
                                  <TableCell>{getStatusBadge(booking.status)}</TableCell>
                                  <TableCell>
                                    <div className="flex space-x-2">
                                      {booking.status === "Pending" && (
                                        <>
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            className="text-green-600 border-green-600 hover:bg-green-50"
                                            onClick={() => booking.id && handleUpdateStatus(booking.id, "Confirmed")}
                                          >
                                            <CheckCircle className="h-4 w-4 mr-1" />
                                            Confirm
                                          </Button>
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            className="text-red-600 border-red-600 hover:bg-red-50"
                                            onClick={() => booking.id && handleUpdateStatus(booking.id, "Rejected")}
                                          >
                                            <XCircle className="h-4 w-4 mr-1" />
                                            Reject
                                          </Button>
                                        </>
                                      )}
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      )}
                    </TabsContent>
                    <TabsContent value="past">
                      {pastBookings.length === 0 ? (
                        <div className="text-center py-12">
                          <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <h3 className="text-lg font-semibold mb-2">No past appointments</h3>
                          <p className="text-muted-foreground">You don't have any past appointments.</p>
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Booking ID</TableHead>
                                <TableHead>Patient</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Time</TableHead>
                                <TableHead>Status</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {pastBookings.map((booking) => (
                                <TableRow key={booking.id}>
                                  <TableCell className="font-mono text-sm">{booking.id?.substring(0, 8)}</TableCell>
                                  <TableCell>
                                    <div>
                                      <p className="font-medium">{booking.patientName}</p>
                                      <p className="text-sm text-muted-foreground">
                                        {booking.patientGender}, {booking.patientAge} years
                                      </p>
                                    </div>
                                  </TableCell>
                                  <TableCell>{formatDate(booking.date)}</TableCell>
                                  <TableCell>{formatTime(booking.time)}</TableCell>
                                  <TableCell>{getStatusBadge(booking.status)}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      )}
                    </TabsContent>
                  </>
                )}
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
