import { CalendarCheck2, ClipboardCheck } from "lucide-react";

import { StudentPageHeader } from "@/components/student/student-page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { studentAttendance } from "@/lib/mocks/student";

const statusVariant = { "Asistió": "success", Tardanza: "warning", Inasistencia: "danger" } as const;

export default function StudentAttendancePage() {
  return (
    <div className="space-y-6">
      <StudentPageHeader icon={ClipboardCheck} title="Mi asistencia" description="Consulta tu registro reciente y detecta novedades." />
      <Card><CardContent className="flex items-center gap-5 p-6"><div className="rounded-full bg-primary/8 p-4 text-primary"><CalendarCheck2 className="h-8 w-8" /></div><div><p className="text-sm text-muted-foreground">Asistencia acumulada</p><p className="text-4xl font-black text-primary">{studentAttendance.percentage}%</p></div></CardContent></Card>
      <Card><CardContent className="divide-y divide-border p-0">{studentAttendance.records.map((record) => <div key={record.id} className="grid gap-3 p-5 sm:grid-cols-[90px_1fr_auto] sm:items-center"><p className="font-black">{record.date}</p><p>{record.subject}</p><Badge variant={statusVariant[record.status]} className={record.status === "Tardanza" ? "border-amber-400/60 bg-amber-400/20 text-amber-700 dark:text-amber-200" : undefined}>{record.status}</Badge></div>)}</CardContent></Card>
    </div>
  );
}
