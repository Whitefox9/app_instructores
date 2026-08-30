"use client";

import { useEffect, useState } from "react";

import {
  attendanceUpdatedEvent,
  fetchStudentAttendance,
  type SharedAttendanceRecord,
} from "@/lib/attendance/shared-attendance";

export function useSharedStudentAttendance(studentDocument: string) {
  const [records, setRecords] = useState<SharedAttendanceRecord[]>([]);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let active = true;

    async function refresh() {
      try {
        const nextRecords = await fetchStudentAttendance(studentDocument);
        if (!active) return;
        setRecords(nextRecords);
        setState("ready");
      } catch {
        if (active) setState("error");
      }
    }

    void refresh();
    const handleAttendanceUpdate = () => void refresh();
    window.addEventListener(attendanceUpdatedEvent, handleAttendanceUpdate);
    const refreshInterval = window.setInterval(() => {
      if (window.document.visibilityState === "visible") void refresh();
    }, 5000);

    return () => {
      active = false;
      window.removeEventListener(attendanceUpdatedEvent, handleAttendanceUpdate);
      window.clearInterval(refreshInterval);
    };
  }, [studentDocument]);

  return { records, state };
}
