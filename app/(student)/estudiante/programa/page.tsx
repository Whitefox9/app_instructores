import { BookOpenText, CalendarDays, Clock3, GraduationCap, MapPin, MonitorUp } from "lucide-react";

import { StudentPageHeader } from "@/components/student/student-page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { studentProfile, studentProgram } from "@/lib/mocks/student";

const details = [
  { label: "Programa", value: studentProgram.name, icon: BookOpenText },
  { label: "Grupo", value: studentProgram.group, icon: GraduationCap },
  { label: "Número de expediente", value: studentProfile.recordNumber, icon: GraduationCap },
  { label: "Jornada", value: studentProgram.schedule, icon: Clock3 },
  { label: "Modalidad", value: studentProgram.modality, icon: MonitorUp },
  { label: "Profesor líder", value: studentProgram.leadProfessor, icon: GraduationCap },
  { label: "Periodo académico", value: studentProgram.period, icon: CalendarDays },
  { label: "Campus", value: studentProfile.campus, icon: MapPin },
];

export default function StudentProgramPage() {
  return (
    <div className="space-y-6">
      <StudentPageHeader icon={BookOpenText} title="Mi programa" description="Información principal de tu programa académico." />
      <Card>
        <CardHeader className="flex-row items-center justify-between"><CardTitle>Progreso general</CardTitle><span className="text-3xl font-black text-primary">{studentProgram.progress}%</span></CardHeader>
        <CardContent><div className="h-3 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${studentProgram.progress}%` }} /></div><p className="mt-3 text-sm text-muted-foreground">{studentProgram.progress}% completado</p></CardContent>
      </Card>
      <Card><CardContent className="divide-y divide-border p-0">{details.map(({ label, value, icon: Icon }) => <div key={label} className="flex gap-4 p-5"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/8 text-primary"><Icon className="h-5 w-5" /></div><div><p className="text-sm text-muted-foreground">{label}</p><p className="mt-1 font-bold text-foreground">{value}</p></div></div>)}</CardContent></Card>
    </div>
  );
}
