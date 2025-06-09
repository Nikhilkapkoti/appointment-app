import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  doc,
  deleteDoc,
  updateDoc,
  getDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";

export interface Booking {
  id?: string;
  patientId: string;
  patientName: string;
  patientEmail?: string;
  patientPhone: string;
  patientGender: string;
  patientAge: number;
  doctorId: string;
  doctorName: string;
  specialization: string;
  date: string;
  time: string;
  healthIssue: string;
  status: "Pending" | "Confirmed" | "Completed" | "Cancelled" | "Rejected";
  createdAt: Timestamp | Date;
  updatedAt?: Timestamp | Date;
  notes?: string;
}

export const bookingsCollection = collection(db, "bookings");

// Create a new booking
export async function createBooking(bookingData: Omit<Booking, "id" | "createdAt">): Promise<string> {
  try {
    // Validate required fields
    const requiredFields: (keyof Omit<Booking, "id" | "createdAt">)[] = [
      "patientId",
      "patientName",
      "patientPhone",
      "patientGender",
      "patientAge",
      "doctorId",
      "doctorName",
      "specialization",
      "date",
      "time",
      "healthIssue",
      "status",
    ];

    for (const field of requiredFields) {
      if (bookingData[field] === undefined || bookingData[field] === null) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    // Ensure all fields are properly formatted
    const booking: Omit<Booking, "id"> = {
      patientId: String(bookingData.patientId),
      patientName: String(bookingData.patientName),
      patientEmail: bookingData.patientEmail || "",
      patientPhone: String(bookingData.patientPhone),
      patientGender: String(bookingData.patientGender),
      patientAge: Number(bookingData.patientAge),
      doctorId: String(bookingData.doctorId),
      doctorName: String(bookingData.doctorName),
      specialization: String(bookingData.specialization),
      date: String(bookingData.date),
      time: String(bookingData.time),
      healthIssue: String(bookingData.healthIssue),
      status: bookingData.status || "Pending",
      notes: bookingData.notes || "",
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    console.log("Creating booking with data:", booking); // Debug log

    const docRef = await addDoc(bookingsCollection, booking);
    return docRef.id;
  } catch (error) {
    console.error("Error creating booking:", error);
    throw new Error(`Failed to create booking: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

// Get all bookings for a patient
export async function getPatientBookings(patientId: string): Promise<Booking[]> {
  if (!patientId) {
    throw new Error("Patient ID is required");
  }
  try {
    const q = query(bookingsCollection, where("patientId", "==", patientId));
    console.log("Executing patient bookings query:", { patientId }); // Debug log
    const querySnapshot = await getDocs(q);
    const bookings = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      if (!data.createdAt) {
        console.warn(`Booking ${doc.id} missing createdAt field`);
      }
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt || Timestamp.now(), // Fallback for missing createdAt
      } as Booking;
    });
    return bookings;
  } catch (error) {
    console.error("Firestore error in getPatientBookings:", error);
    throw new Error(`Failed to get patient bookings: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

export async function getDoctorBookings(doctorId: string): Promise<Booking[]> {
  if (!doctorId) {
    throw new Error("Doctor ID is required");
  }
  try {
    const q = query(bookingsCollection, where("doctorId", "==", doctorId));
    console.log("Executing doctor bookings query:", { doctorId }); // Debug log
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as Booking));
  } catch (error) {
    console.error("Error getting doctor bookings:", error);
    throw new Error(`Failed to get doctor bookings: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

// Get all bookings (for admin)
export async function getAllBookings(): Promise<Booking[]> {
  try {
    const q = query(bookingsCollection);
    console.log("Executing all bookings query"); // Debug log
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as Booking));
  } catch (error) {
    console.error("Error getting all bookings:", error);
    throw new Error(`Failed to get all bookings: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

// Update booking status
export async function updateBookingStatus(bookingId: string, status: Booking["status"], notes?: string): Promise<void> {
  if (!bookingId) {
    throw new Error("Booking ID is required");
  }
  try {
    const bookingRef = doc(db, "bookings", bookingId);
    const updateData: Partial<Booking> = {
      status,
      updatedAt: Timestamp.now(),
    };
    if (notes !== undefined) {
      updateData.notes = notes;
    }
    console.log("Updating booking status:", { bookingId, status, notes }); // Debug log
    await updateDoc(bookingRef, updateData);
  } catch (error) {
    console.error("Error updating booking status:", error);
    throw new Error(`Failed to update booking status: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

// Delete booking
export async function deleteBooking(bookingId: string): Promise<void> {
  if (!bookingId) {
    throw new Error("Booking ID is required");
  }
  try {
    const bookingRef = doc(db, "bookings", bookingId);
    console.log("Deleting booking:", { bookingId }); // Debug log
    await deleteDoc(bookingRef);
  } catch (error) {
    console.error("Error deleting booking:", error);
    throw new Error(`Failed to delete booking: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

// Get booking by ID
export async function getBookingById(bookingId: string): Promise<Booking | null> {
  if (!bookingId) {
    throw new Error("Booking ID is required");
  }
  try {
    const bookingRef = doc(db, "bookings", bookingId);
    console.log("Fetching booking by ID:", { bookingId }); // Debug log
    const bookingSnap = await getDoc(bookingRef);
    if (bookingSnap.exists()) {
      return { id: bookingSnap.id, ...bookingSnap.data() } as Booking;
    }
    return null;
  } catch (error) {
    console.error("Error getting booking:", error);
    throw new Error(`Failed to get booking: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

// Check if a time slot is already booked
export async function isTimeSlotBooked(doctorId: string, date: string, time: string): Promise<boolean> {
  if (!doctorId || !date || !time) {
    throw new Error("Doctor ID, date, and time are required");
  }
  try {
    const q = query(
      bookingsCollection,
      where("doctorId", "==", doctorId),
      where("date", "==", date),
      where("time", "==", time),
      where("status", "in", ["Pending", "Confirmed"]),
    );
    console.log("Checking time slot:", { doctorId, date, time }); // Debug log
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error("Error checking time slot:", error);
    throw new Error(`Failed to check time slot availability: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

// Get bookings for a specific date range
export async function getBookingsByDateRange(startDate: string, endDate: string): Promise<Booking[]> {
  if (!startDate || !endDate) {
    throw new Error("Start date and end date are required");
  }
  try {
    const q = query(
      bookingsCollection,
      where("date", ">=", startDate),
      where("date", "<=", endDate),
      orderBy("date", "asc"),
      orderBy("time", "asc"),
    );
    console.log("Executing date range query:", { startDate, endDate }); // Debug log
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as Booking));
  } catch (error) {
    console.error("Error getting bookings by date range:", error);
    throw new Error(`Failed to get bookings by date range: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}