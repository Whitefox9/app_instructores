"use client";

import { calculateAttendancePercentage } from "@/lib/attendance/shared-attendance";
import { studentAttendance, studentProfile } from "@/lib/mocks/student";
import { useSharedStudentAttendance } from "@/components/student/use-shared-student-attendance";

export function StudentAttendanceMetric() {
  const { records } = useSharedStudentAttendance(studentProfile.document);
  const percentage = records.length
    ? calculateAttendancePercentage(
        records,
        studentAttendance.baselineEffective,
        studentAttendance.baselineSessions,
      )
    : studentAttendance.percentage;

  return <p className="mt-2 text-3xl font-black text-primary">{percentage}%</p>;
}
