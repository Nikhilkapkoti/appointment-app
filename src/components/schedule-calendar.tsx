"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, CalendarIcon, Plus, Trash2, Edit, Save, X, Check } from "lucide-react";
import { format } from "date-fns";

interface TimeSlot {
  start: string;
  end: string;
  id: string;
}

interface DaySchedule {
  day: string;
  isAvailable: boolean;
  timeSlots: TimeSlot[];
}

interface WeeklySchedule {
  doctorId: string;
  schedule: DaySchedule[];
}

interface ScheduleException {
  id: string;
  date: string;
  type: "unavailable" | "custom";
  reason?: string;
  timeSlots?: TimeSlot[];
}

interface ScheduleCalendarProps {
  doctorId: string;
  doctorName: string;
  onScheduleUpdate: (schedule: WeeklySchedule) => void;
}

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const DEFAULT_TIME_SLOTS = [
  { start: "09:00", end: "12:00" },
  { start: "14:00", end: "17:00" },
];

export function ScheduleCalendar({ doctorId, doctorName, onScheduleUpdate }: ScheduleCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [weeklySchedule, setWeeklySchedule] = useState<WeeklySchedule>({
    doctorId,
    schedule: DAYS_OF_WEEK.map((day) => ({
      day,
      isAvailable: day !== "Sunday",
      timeSlots:
        day !== "Sunday"
          ? DEFAULT_TIME_SLOTS.map((slot, index) => ({
              ...slot,
              id: `${day}-${index}`,
            }))
          : [],
    })),
  });
  const [exceptions, setExceptions] = useState<ScheduleException[]>([]);
  const [isAddingException, setIsAddingException] = useState(false);
  const [selectedExceptionDate, setSelectedExceptionDate] = useState<Date | undefined>(undefined);
  const [newTimeSlot, setNewTimeSlot] = useState({ start: "09:00", end: "10:00" });

  const updateDayAvailability = (day: string, isAvailable: boolean) => {
    setWeeklySchedule((prev) => ({
      ...prev,
      schedule: prev.schedule.map((daySchedule) =>
        daySchedule.day === day
          ? { ...daySchedule, isAvailable, timeSlots: isAvailable ? daySchedule.timeSlots : [] }
          : daySchedule,
      ),
    }));
  };

  const addTimeSlot = (day: string) => {
    const newSlot: TimeSlot = {
      id: `${day}-${Date.now()}`,
      start: newTimeSlot.start,
      end: newTimeSlot.end,
    };

    setWeeklySchedule((prev) => ({
      ...prev,
      schedule: prev.schedule.map((daySchedule) =>
        daySchedule.day === day ? { ...daySchedule, timeSlots: [...daySchedule.timeSlots, newSlot] } : daySchedule,
      ),
    }));
  };

  const removeTimeSlot = (day: string, slotId: string) => {
    setWeeklySchedule((prev) => ({
      ...prev,
      schedule: prev.schedule.map((daySchedule) =>
        daySchedule.day === day
          ? { ...daySchedule, timeSlots: daySchedule.timeSlots.filter((slot) => slot.id !== slotId) }
          : daySchedule,
      ),
    }));
  };

  const updateTimeSlot = (day: string, slotId: string, start: string, end: string) => {
    setWeeklySchedule((prev) => ({
      ...prev,
      schedule: prev.schedule.map((daySchedule) =>
        daySchedule.day === day
          ? {
              ...daySchedule,
              timeSlots: daySchedule.timeSlots.map((slot) => (slot.id === slotId ? { ...slot, start, end } : slot)),
            }
          : daySchedule,
      ),
    }));
  };

  const addException = (date: Date, type: "unavailable" | "custom", reason?: string) => {
    const newException: ScheduleException = {
      id: `exception-${Date.now()}`,
      date: format(date, "yyyy-MM-dd"),
      type,
      reason,
      timeSlots: type === "custom" ? [] : undefined,
    };

    setExceptions((prev) => [...prev, newException]);
    setIsAddingException(false);
    setSelectedExceptionDate(undefined);
  };

  const removeException = (exceptionId: string) => {
    setExceptions((prev) => prev.filter((ex) => ex.id !== exceptionId));
  };

  const saveSchedule = () => {
    onScheduleUpdate(weeklySchedule);
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getExceptionForDate = (date: Date) => {
    return exceptions.find((ex) => ex.date === format(date, "yyyy-MM-dd"));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Schedule for {doctorName}</h3>
        <Button onClick={saveSchedule} className="bg-green-600 hover:bg-green-700">
          <Save className="mr-2 h-4 w-4" />
          Save Schedule
        </Button>
      </div>

      <Tabs defaultValue="weekly" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="weekly">Weekly Schedule</TabsTrigger>
          <TabsTrigger value="exceptions">Exceptions & Holidays</TabsTrigger>
        </TabsList>

        {/* Weekly Schedule Tab */}
        <TabsContent value="weekly">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Regular Weekly Hours</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {DAYS_OF_WEEK.map((day) => {
                const daySchedule = weeklySchedule.schedule.find((d) => d.day === day)!;

                return (
                  <Card key={day} className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <h4 className="font-medium text-lg">{day}</h4>
                        <Switch
                          checked={daySchedule.isAvailable}
                          onCheckedChange={(checked) => updateDayAvailability(day, checked)}
                        />
                        <Label className="text-sm text-muted-foreground">
                          {daySchedule.isAvailable ? "Available" : "Not Available"}
                        </Label>
                      </div>

                      {daySchedule.isAvailable && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Plus className="h-4 w-4 mr-1" />
                              Add Time Slot
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Add Time Slot for {day}</DialogTitle>
                            </DialogHeader>
                            <div className="grid grid-cols-2 gap-4 py-4">
                              <div>
                                <Label>Start Time</Label>
                                <Input
                                  type="time"
                                  value={newTimeSlot.start}
                                  onChange={(e) => setNewTimeSlot((prev) => ({ ...prev, start: e.target.value }))}
                                />
                              </div>
                              <div>
                                <Label>End Time</Label>
                                <Input
                                  type="time"
                                  value={newTimeSlot.end}
                                  onChange={(e) => setNewTimeSlot((prev) => ({ ...prev, end: e.target.value }))}
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button onClick={() => addTimeSlot(day)}>Add Time Slot</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>

                    {daySchedule.isAvailable && (
                      <div className="space-y-2">
                        {daySchedule.timeSlots.length === 0 ? (
                          <p className="text-sm text-muted-foreground italic">No time slots defined</p>
                        ) : (
                          daySchedule.timeSlots.map((slot) => (
                            <TimeSlotEditor
                              key={slot.id}
                              slot={slot}
                              onUpdate={(start, end) => updateTimeSlot(day, slot.id, start, end)}
                              onRemove={() => removeTimeSlot(day, slot.id)}
                            />
                          ))
                        )}
                      </div>
                    )}
                  </Card>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Exceptions Tab */}
        <TabsContent value="exceptions">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <CalendarIcon className="h-5 w-5" />
                <span>Schedule Exceptions</span>
              </CardTitle>
              <Dialog open={isAddingException} onOpenChange={setIsAddingException}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Exception
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Schedule Exception</DialogTitle>
                    <DialogDescription>Set specific dates when the regular schedule doesn't apply</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div>
                      <Label>Select Date</Label>
                      <Calendar
                        mode="single"
                        selected={selectedExceptionDate}
                        onSelect={setSelectedExceptionDate}
                        className="rounded-md border"
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        onClick={() =>
                          selectedExceptionDate && addException(selectedExceptionDate, "unavailable", "Not available")
                        }
                        disabled={!selectedExceptionDate}
                      >
                        Mark as Unavailable
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() =>
                          selectedExceptionDate && addException(selectedExceptionDate, "custom", "Custom schedule")
                        }
                        disabled={!selectedExceptionDate}
                      >
                        Custom Schedule
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {exceptions.length === 0 ? (
                  <p className="text-muted-foreground italic">No schedule exceptions defined</p>
                ) : (
                  exceptions.map((exception) => (
                    <Card key={exception.id} className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Badge variant={exception.type === "unavailable" ? "destructive" : "secondary"}>
                            {format(new Date(exception.date), "MMM dd, yyyy")}
                          </Badge>
                          <span className="text-sm">
                            {exception.type === "unavailable" ? "Not Available" : "Custom Schedule"}
                          </span>
                          {exception.reason && (
                            <span className="text-sm text-muted-foreground">- {exception.reason}</span>
                          )}
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => removeException(exception.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function TimeSlotEditor({
  slot,
  onUpdate,
  onRemove,
}: {
  slot: TimeSlot;
  onUpdate: (start: string, end: string) => void;
  onRemove: () => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [start, setStart] = useState(slot.start);
  const [end, setEnd] = useState(slot.end);

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const handleSave = () => {
    onUpdate(start, end);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setStart(slot.start);
    setEnd(slot.end);
    setIsEditing(false);
  };

  return (
    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
      {isEditing ? (
        <div className="flex items-center space-x-2 flex-1">
          <Input type="time" value={start} onChange={(e) => setStart(e.target.value)} className="w-32" />
          <span>to</span>
          <Input type="time" value={end} onChange={(e) => setEnd(e.target.value)} className="w-32" />
          <Button size="sm" onClick={handleSave}>
            <Check className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={handleCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="flex items-center justify-between flex-1">
          <span className="font-medium">
            {formatTime(slot.start)} - {formatTime(slot.end)}
          </span>
          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onRemove}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ScheduleCalendar;