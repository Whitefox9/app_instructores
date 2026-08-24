import type { SharedAttendanceRecord } from "@/lib/attendance/shared-attendance";

type DemoAttendanceStore = Map<string, SharedAttendanceRecord>;

declare global {
  var __usalDemoAttendanceStore: DemoAttendanceStore | undefined;
}

export function getDemoAttendanceStore() {
  if (!globalThis.__usalDemoAttendanceStore) {
    globalThis.__usalDemoAttendanceStore = new Map<string, SharedAttendanceRecord>();
  }

  return globalThis.__usalDemoAttendanceStore;
}
