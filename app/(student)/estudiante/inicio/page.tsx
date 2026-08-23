import { ArrowRight, BookOpenText, CalendarDays, CheckCircle2, Clock3, GraduationCap, ShieldCheck } from "lucide-react";

import { StudentPageHeader } from "@/components/student/student-page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { studentAttendance, studentProfile, studentProgram, studentSchedule } from "@/lib/mocks/student";

export default function StudentHomePage() {
  const nextSession = studentSchedule[0];

  return (
    <div className="space-y-6">
      <StudentPageHeader icon={GraduationCap} title={`Buenos días, ${studentProfile.shortName.split(" ")[0]}`} description="Este es el resumen de tu jornada académica." />

      <section className="grid gap-3 sm:grid-cols-3">
        <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Asistencia acumulada</p><p className="mt-2 text-3xl font-black text-primary">{studentAttendance.percentage}%</p></CardContent></Card>
        <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Sesiones esta semana</p><p className="mt-2 text-3xl font-black text-primary">6</p></CardContent></Card>
        <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Estado de matrícula</p><div className="mt-3 flex items-center gap-2 font-bold text-success"><ShieldCheck className="h-5 w-5" /> Activa</div></CardContent></Card>
      </section>

      <Card className="border-l-4 border-l-primary">
        <CardHeader className="flex-row items-center justify-between gap-4">
          <div>
            <Badge>Próxima sesión</Badge>
            <CardTitle className="mt-3 text-2xl">{nextSession.subject}</CardTitle>
          </div>
          <div className="rounded-2xl bg-primary/10 p-3 text-primary"><CalendarDays className="h-6 w-6" /></div>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-3">
          <span className="flex items-center gap-2"><Clock3 className="h-4 w-4 text-primary" /> {nextSession.time}</span>
          <span className="flex items-center gap-2"><GraduationCap className="h-4 w-4 text-primary" /> {nextSession.professor}</span>
          <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> {nextSession.room}</span>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-[6px] border-primary/20 text-lg font-black text-primary">{studentProgram.progress}%</div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-3"><p className="font-bold">Progreso de tu programa</p><BookOpenText className="h-5 w-5 text-primary" /></div>
            <p className="mt-1 text-sm text-muted-foreground">{studentProgram.name}</p>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${studentProgram.progress}%` }} /></div>
          </div>
          <ArrowRight className="hidden h-5 w-5 text-primary sm:block" />
        </CardContent>
      </Card>
    </div>
  );
}
