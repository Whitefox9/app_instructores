"use client";

import { CalendarCheck2, RefreshCw } from "lucide-react";

import { useSharedStudentAttendance } from "@/components/student/use-shared-student-attendance";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  calculateAttendancePercentage,
  type SharedAttendanceStatus,
} from "@/lib/attendance/shared-attendance";
import { studentAttendance, studentProfile } from "@/lib/mocks/student";

type DisplayStatus = SharedAttendanceStatus | "Asistió" | "Tardanza" | "Inasistencia";

const statusVariant: Record<DisplayStatus, "success" | "warning" | "danger" | "secondary"> = {
  "Asistió": "success",
  Tardanza: "warning",
  Inasistencia: "danger",
  Excusa: "secondary",
};

const statusClassName: Record<DisplayStatus, string> = {
  "Asistió": "border-emerald-400/60 bg-emerald-400/20 text-emerald-700",
  Tardanza: "border-amber-400/60 bg-amber-400/20 text-amber-700",
  Inasistencia: "border-rose-400/60 bg-rose-400/20 text-rose-700",
  Excusa: "border-sky-400/60 bg-sky-400/20 text-sky-700",
};

function formatSharedDate(date: string) {
  return new Intl.DateTimeFormat("es-CO", { day: "numeric", month: "short" }).format(
    new Date(`${date}T00:00:00`),
  );
}

export function StudentAttendanceReport() {
  const { records: sharedRecords, state } = useSharedStudentAttendance(studentProfile.document);
  const percentage = sharedRecords.length
    ? calculateAttendancePercentage(
        sharedRecords,
        studentAttendance.baselineEffective,
        studentAttendance.baselineSessions,
      )
    : studentAttendance.percentage;
  const records = [
    ...sharedRecords.map((record) => ({
      id: record.id,
      date: formatSharedDate(record.date),
      subject: record.subject,
      status: record.status as DisplayStatus,
      observation: record.observation,
      shared: true,
    })),
    ...studentAttendance.records.map((record) => ({
      ...record,
      status: record.status as DisplayStatus,
      observation: "",
      shared: false,
    })),
  ];

  return (
    <div className="space-y-5">
      <Card>
        <CardContent className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-5">
            <div className="rounded-full bg-primary/8 p-4 text-primary">
              <CalendarCheck2 className="size-8" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Asistencia acumulada</p>
              <p className="text-4xl font-black text-primary">{percentage}%</p>
            </div>
          </div>
          <div className="rounded-2xl bg-muted px-4 py-3 text-sm">
            <p className="flex items-center gap-2 font-bold text-foreground">
              <RefreshCw className="size-4 text-primary" aria-hidden="true" />
              {state === "loading"
                ? "Consultando actualizaciones"
                : state === "error"
                  ? "No fue posible sincronizar"
                  : sharedRecords.length
                    ? `${sharedRecords.length} registro${sharedRecords.length === 1 ? "" : "s"} del docente`
                    : "Sin novedades nuevas"}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="divide-y divide-border p-0">
          {records.map((record) => (
            <div key={record.id} className="grid gap-3 p-5 sm:grid-cols-[90px_1fr_auto] sm:items-center">
              <p className="font-black capitalize">{record.date}</p>
              <div>
                <p>{record.subject}</p>
                {record.shared ? (
                  <p className="mt-1 text-xs font-medium text-primary">Registrado por el docente</p>
                ) : null}
                {record.observation ? (
                  <p className="mt-1 text-sm text-muted-foreground">{record.observation}</p>
                ) : null}
              </div>
              <Badge variant={statusVariant[record.status]} className={statusClassName[record.status]}>
                {record.status}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
