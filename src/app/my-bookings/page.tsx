"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Calendar, Clock, X, ChevronLeft, ChevronRight } from "lucide-react";
import { NavBar } from "@/components/nav-bar";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { getPatientBookings, updateBookingStatus, type Booking } from "@/lib/booking-service";
import { format, parse } from "date-fns";
import { toast } from "sonner";

export default function MyBookingsPage() {
  const { user, loading, error: authError } = useAuth();
  const router = useRouter();

  // Redirect if not patient
  useEffect(() => {
    if (!loading && (!user || user.role !== "patient")) {
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
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (authError) {
    return (
      <div className="min-h-screen bg-background">
        <NavBar />
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-6 w-6" />
                  <span>My Bookings</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <h3 className="text-lg font-semibold mb-2">Authentication Error</h3>
                  <p className="text-muted-foreground mb-4">{authError}</p>
                  <Button onClick={() => router.push("/auth/login")}>Go to Login</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "patient") {
    return null;
  }

  return <MyBookingsContent userId={user.id} />;
}

function MyBookingsContent({ userId }: { userId: string }) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<"date" | "doctor" | "status">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const ITEMS_PER_PAGE = 10;
  const totalPages = Math.ceil(bookings.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  useEffect(() => {
    async function fetchBookings() {
      try {
        const fetchedBookings = await getPatientBookings(userId);
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
  }, [userId]);

  // Sort bookings with validation
  const sortedBookings = [...bookings].sort((a, b) => {
    let aValue: string | number | Date;
    let bValue: string | number | Date;

    switch (sortBy) {
      case "date":
        try {
          aValue = a.date ? new Date(a.date) : new Date(0); // Fallback to epoch if invalid
          bValue = b.date ? new Date(b.date) : new Date(0);
          if (isNaN(aValue.getTime())) aValue = new Date(0);
          if (isNaN(bValue.getTime())) bValue = new Date(0);
        } catch {
          aValue = new Date(0);
          bValue = new Date(0);
        }
        break;
      case "doctor":
        aValue = a.doctorName || "";
        bValue = b.doctorName || "";
        break;
      case "status":
        aValue = a.status || "";
        bValue = b.status || "";
        break;
      default:
        try {
          aValue = a.date ? new Date(a.date) : new Date(0);
          bValue = b.date ? new Date(b.date) : new Date(0);
          if (isNaN(aValue.getTime())) aValue = new Date(0);
          if (isNaN(bValue.getTime())) bValue = new Date(0);
        } catch {
          aValue = new Date(0);
          bValue = new Date(0);
        }
    }

    if (sortOrder === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const paginatedBookings = sortedBookings.slice(startIndex, endIndex);

  const handleSort = (column: "date" | "doctor" | "status") => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("desc");
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    try {
      await updateBookingStatus(bookingId, "Cancelled");
      setBookings((prev) =>
        prev.map((booking) => (booking.id === bookingId ? { ...booking, status: "Cancelled" } : booking)),
      );
      toast.success("Booking Cancelled", {
        description: "Your appointment has been cancelled successfully.",
      });
    } catch (err) {
      console.error("Error cancelling booking:", err);
      toast.error("Failed to Cancel Booking", {
        description: "Please try again.",
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
        return <Badge variant="outline">{status || "Unknown"}</Badge>;
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const parsedDate = new Date(dateStr);
      if (isNaN(parsedDate.getTime())) {
        return "Invalid Date";
      }
      return format(parsedDate, "MMM d, yyyy");
    } catch {
      return "Invalid Date";
    }
  };

  const formatTime = (timeStr: string) => {
    try {
      const parsedTime = parse(timeStr, "HH:mm", new Date());
      if (isNaN(parsedTime.getTime())) {
        return "Invalid Time";
      }
      return format(parsedTime, "h:mm a");
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
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <NavBar />
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-6 w-6" />
                  <span>My Bookings</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <h3 className="text-lg font-semibold mb-2">Error loading bookings</h3>
                  <p className="text-muted-foreground mb-4">{error}</p>
                  <Button onClick={() => window.location.reload()}>Try Again</Button>
                </div>
              </CardContent>
            </Card>
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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-6 w-6" />
                <span>My Bookings</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {bookings.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No bookings found</h3>
                  <p className="text-muted-foreground">You haven't made any appointments yet.</p>
                </div>
              ) : (
                <>
                  {/* Desktop Table */}
                  <div className="hidden md:block">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Booking ID</TableHead>
                          <TableHead className="cursor-pointer hover:text-primary" onClick={() => handleSort("doctor")}>
                            Doctor {sortBy === "doctor" && (sortOrder === "asc" ? "↑" : "↓")}
                          </TableHead>
                          <TableHead>Specialization</TableHead>
                          <TableHead className="cursor-pointer hover:text-primary" onClick={() => handleSort("date")}>
                            Date {sortBy === "date" && (sortOrder === "asc" ? "↑" : "↓")}
                          </TableHead>
                          <TableHead>Time</TableHead>
                          <TableHead className="cursor-pointer hover:text-primary" onClick={() => handleSort("status")}>
                            Status {sortBy === "status" && (sortOrder === "asc" ? "↑" : "↓")}
                          </TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedBookings.map((booking) => (
                          <TableRow key={booking.id}>
                            <TableCell className="font-mono text-sm">{booking.id?.substring(0, 8)}</TableCell>
                            <TableCell className="font-medium">{booking.doctorName || "Unknown Doctor"}</TableCell>
                            <TableCell className="text-muted-foreground">{booking.specialization || "N/A"}</TableCell>
                            <TableCell>{formatDate(booking.date)}</TableCell>
                            <TableCell>{formatTime(booking.time)} IST</TableCell>
                            <TableCell>{getStatusBadge(booking.status)}</TableCell>
                            <TableCell>
                              {booking.status === "Pending" && (
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="outline" size="sm">
                                      <X className="h-4 w-4 mr-1" />
                                      Cancel
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Cancel Appointment</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to cancel this booking? This action cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Keep Booking</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleCancelBooking(booking.id!)}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                      >
                                        Cancel Booking
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Mobile Cards */}
                  <div className="md:hidden space-y-4">
                    {paginatedBookings.map((booking) => (
                      <Card key={booking.id}>
                        <CardContent className="pt-4">
                          <div className="space-y-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-mono text-sm text-muted-foreground">{booking.id?.substring(0, 8)}</p>
                                <h3 className="font-semibold">{booking.doctorName || "Unknown Doctor"}</h3>
                                <p className="text-sm text-muted-foreground">{booking.specialization || "N/A"}</p>
                              </div>
                              {getStatusBadge(booking.status)}
                            </div>

                            <div className="flex items-center space-x-4 text-sm">
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span>{formatDate(booking.date)}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span>{formatTime(booking.time)} IST</span>
                              </div>
                            </div>

                            {booking.status === "Pending" && (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="outline" size="sm" className="w-full">
                                    <X className="h-4 w-4 mr-1" />
                                    Cancel Booking
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Cancel Appointment</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to cancel this booking? This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Keep Booking</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleCancelBooking(booking.id!)}
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                      Cancel Booking
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-6">
                      <p className="text-sm text-muted-foreground">
                        Showing {startIndex + 1} to {Math.min(endIndex, bookings.length)} of {bookings.length} bookings
                      </p>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                        >
                          <ChevronLeft className="h-4 w-4" />
                          Previous
                        </Button>
                        <span className="text-sm">
                          Page {currentPage} of {totalPages}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                        >
                          Next
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}