import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  GraduationCap,
  MapPin,
  UsersRound,
} from "lucide-react";

import { InstructorPageHeader } from "@/components/instructor/instructor-page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  instructorActivity,
  instructorAgenda,
  instructorAssignments,
  instructorAttendance,
} from "@/lib/mocks/instructor";
import { roleProfiles } from "@/lib/mocks/navigation";

export default function InstructorHomePage() {
  const profile = roleProfiles.instructor;
  const nextSession = instructorAgenda[0];
  const nextAssignment = instructorAssignments.find(
    (assignment) => assignment.ficha === nextSession.ficha,
  );
  const classesToday = instructorAgenda.filter(
    (session) => session.dateLabel === nextSession.dateLabel,
  ).length;
  const pendingAttendance = instructorAttendance.filter(
    (record) => record.state !== "Registrada",
  ).length;
  const latestActivity = instructorActivity[0];

  return (
    <div className="space-y-6">
      <InstructorPageHeader
        icon={GraduationCap}
        title={`Buenos días, ${profile.userName.split(" ")[0]}`}
        description="Este es el resumen de tu jornada académica."
      />

      <section className="grid gap-3 sm:grid-cols-3" aria-label="Resumen docente">
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <span className="rounded-2xl bg-primary/10 p-3 text-primary">
              <CalendarDays className="size-6" aria-hidden="true" />
            </span>
            <div>
              <p className="text-2xl font-bold text-foreground">{classesToday}</p>
              <p className="text-sm text-muted-foreground">Clases de hoy</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <span className="rounded-2xl bg-amber-500/10 p-3 text-amber-600">
              <ClipboardCheck className="size-6" aria-hidden="true" />
            </span>
            <div>
              <p className="text-2xl font-bold text-foreground">{pendingAttendance}</p>
              <p className="text-sm text-muted-foreground">Asistencias pendientes</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <span className="rounded-2xl bg-emerald-500/10 p-3 text-emerald-600">
              <UsersRound className="size-6" aria-hidden="true" />
            </span>
            <div>
              <p className="text-2xl font-bold text-foreground">{instructorAssignments.length}</p>
              <p className="text-sm text-muted-foreground">Grupos activos</p>
            </div>
          </CardContent>
        </Card>
      </section>

      <Card className="overflow-hidden border-l-4 border-l-primary">
        <CardHeader className="flex flex-row items-center justify-between gap-4 pb-3">
          <div>
            <p className="text-sm font-medium text-primary">Próxima clase</p>
            <CardTitle className="mt-1 text-2xl">{nextSession.programa}</CardTitle>
          </div>
          <Badge variant="secondary">{nextSession.ficha}</Badge>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-3">
            <p className="flex items-center gap-2">
              <Clock3 className="size-4 text-primary" aria-hidden="true" />
              {nextSession.startTime}–{nextSession.endTime}
            </p>
            <p className="flex items-center gap-2">
              <MapPin className="size-4 text-primary" aria-hidden="true" />
              {nextSession.ambiente}
            </p>
            <p className="flex items-center gap-2">
              <UsersRound className="size-4 text-primary" aria-hidden="true" />
              {nextAssignment?.aprendices ?? 0} estudiantes
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild>
              <Link href={`/instructor/asistencia?ficha=${nextSession.ficha}&origen=inicio`}>
                Registrar asistencia
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/instructor/agenda">Ver horario completo</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <CheckCircle2 className="size-5 text-primary" aria-hidden="true" />
            Novedad importante
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-medium text-foreground">{latestActivity.item}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {latestActivity.owner} · {latestActivity.updatedAt}
            </p>
          </div>
          <Button asChild variant="ghost" className="justify-start text-primary">
            <Link href={`/instructor/detalle-ficha/${nextSession.ficha}`}>
              Ver grupo
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
