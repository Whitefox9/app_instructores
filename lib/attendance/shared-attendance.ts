import type { InstructorAttendanceMark, InstructorAttendanceSheet } from "@/lib/types";

export type SharedAttendanceStatus = "Asistió" | "Tardanza" | "Inasistencia" | "Excusa";

export type SharedAttendanceRecord = {
  id: string;
  document: string;
  studentName: string;
  group: string;
  subject: string;
  date: string;
  status: SharedAttendanceStatus;
  observation: string;
  savedAt: string;
};

export const attendanceUpdatedEvent = "usal:attendance-updated";

const statusMap: Record<InstructorAttendanceMark, SharedAttendanceStatus> = {
  A: "Asistió",
  T: "Tardanza",
  SE: "Inasistencia",
  CE: "Excusa",
};

export function normalizeDocument(document: string) {
  return document.replace(/\D/g, "");
}

export function sheetToSharedRecords(sheet: InstructorAttendanceSheet): SharedAttendanceRecord[] {
  const savedAt = new Date().toISOString();

  return sheet.learners.flatMap((learner) =>
    learner.status
      ? [
          {
            id: `${sheet.ficha}-${sheet.date}-${normalizeDocument(learner.document)}`,
            document: normalizeDocument(learner.document),
            studentName: learner.apprentice,
            group: sheet.ficha,
            subject: sheet.programa,
            date: sheet.date,
            status: statusMap[learner.status],
            observation: learner.observation,
            savedAt,
          },
        ]
      : [],
  );
}

export async function publishAttendanceSheet(sheet: InstructorAttendanceSheet) {
  const response = await fetch("/api/demo/attendance", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      group: sheet.ficha,
      date: sheet.date,
      records: sheetToSharedRecords(sheet),
    }),
  });

  if (!response.ok) throw new Error("No fue posible sincronizar la asistencia.");

  window.dispatchEvent(new CustomEvent(attendanceUpdatedEvent));
}

export async function fetchStudentAttendance(document: string) {
  const normalizedDocument = normalizeDocument(document);
  const response = await fetch(
    `/api/demo/attendance?document=${encodeURIComponent(normalizedDocument)}`,
    { cache: "no-store" },
  );

  if (!response.ok) throw new Error("No fue posible consultar la asistencia.");

  const payload = (await response.json()) as { records: SharedAttendanceRecord[] };
  return payload.records;
}

export function calculateAttendancePercentage(
  records: SharedAttendanceRecord[],
  baselineEffective: number,
  baselineSessions: number,
) {
  const sharedEffective = records.filter(
    (record) => record.status === "Asistió" || record.status === "Tardanza",
  ).length;
  const totalSessions = baselineSessions + records.length;

  return totalSessions
    ? Math.round(((baselineEffective + sharedEffective) / totalSessions) * 100)
    : 0;
}
