import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  BookOpenCheck,
  CalendarDays,
  ClipboardCheck,
  Clock3,
  MapPin,
  UsersRound,
} from "lucide-react";

import { InstructorGroupRoster } from "@/components/instructor/instructor-group-roster";
import { InstructorPageHeader } from "@/components/instructor/instructor-page-header";
import { InstructorStateBadge } from "@/components/instructor/instructor-badges";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { instructorAssignments } from "@/lib/mocks/instructor";
import { instructorAttendanceSheets } from "@/lib/mocks/instructor-attendance";

type InstructorGroupDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function InstructorGroupDetailPage({ params }: InstructorGroupDetailPageProps) {
  const { id } = await params;
  const assignment = instructorAssignments.find((item) => item.group === id);

  if (!assignment) {
    return (
      <div className="space-y-6">
        <Button asChild variant="outline">
          <Link href="/instructor/mis-asignaciones">
            <ArrowLeft className="size-4" aria-hidden="true" />
            Volver a grupos
          </Link>
        </Button>
        <Card className="border-dashed">
          <CardContent className="px-6 py-12 text-center">
            <AlertCircle className="mx-auto size-8 text-primary" aria-hidden="true" />
            <h1 className="mt-4 text-xl font-bold text-foreground">Grupo no encontrado</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              No encontramos un grupo activo con el identificador {id}.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const attendanceSheet = instructorAttendanceSheets.find((sheet) => sheet.ficha === id);
  const latestAttendance = attendanceSheet?.history[0];

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" className="-ml-3 w-fit text-muted-foreground">
        <Link href="/instructor/mis-asignaciones">
          <ArrowLeft className="size-4" aria-hidden="true" />
          Volver a grupos
        </Link>
      </Button>

      <InstructorPageHeader
        icon={UsersRound}
        title={assignment.programa}
        description={`Grupo ${assignment.group} · ${assignment.modalidad} · Jornada ${assignment.jornada}`}
      />

      <Card className="overflow-hidden border-0 bg-slate-950 text-white shadow-lg">
        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <InstructorStateBadge
                  state={assignment.estado}
                  className={
                    assignment.estado === "Requiere ajuste"
                      ? "border-amber-300/40 bg-amber-300/15 text-amber-200"
                      : undefined
                  }
                />
                <Badge className="border-white/15 bg-white/10 text-white hover:bg-white/10">
                  {assignment.dependencia}
                </Badge>
              </div>
              <p className="mt-5 max-w-2xl text-sm leading-6 text-slate-300">
                {assignment.novedades}
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              {attendanceSheet ? (
                <Button asChild size="lg" className="w-full px-6 sm:w-auto sm:min-w-[12rem]">
                  <Link href={`/instructor/asistencia?ficha=${assignment.group}&origen=grupo`}>
                    <ClipboardCheck className="size-4" aria-hidden="true" />
                    Registrar asistencia
                  </Link>
                </Button>
              ) : (
                <Button disabled size="lg" className="w-full px-6 sm:w-auto">
                  <ClipboardCheck className="size-4" aria-hidden="true" />
                  Asistencia no disponible
                </Button>
              )}
              <Button
                asChild
                size="lg"
                variant="outline"
                className="w-full border-white/25 bg-transparent px-6 text-white hover:bg-white/10 hover:text-white sm:w-auto sm:min-w-[10rem]"
              >
                <Link href="/instructor/agenda">
                  <CalendarDays className="size-4" aria-hidden="true" />
                  Ver horario
                </Link>
              </Button>
            </div>
          </div>

          <dl className="mt-7 grid gap-3 border-t border-white/10 pt-6 sm:grid-cols-3">
            <div>
              <dt className="text-xs uppercase tracking-wider text-slate-400">Estudiantes</dt>
              <dd className="mt-1 text-2xl font-bold">{assignment.studentCount}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-slate-400">Última asistencia</dt>
              <dd className="mt-1 text-2xl font-bold">
                {latestAttendance ? `${latestAttendance.attendanceRate}%` : "Sin registro"}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-slate-400">Periodo</dt>
              <dd className="mt-1 text-2xl font-bold">2026-1</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Información de formación</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-5 text-sm sm:grid-cols-2">
            <p className="flex items-start gap-3 text-muted-foreground">
              <Clock3 className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
              <span>
                <strong className="block font-medium text-foreground">Horario</strong>
                {assignment.horario}
              </span>
            </p>
            <p className="flex items-start gap-3 text-muted-foreground">
              <MapPin className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
              <span>
                <strong className="block font-medium text-foreground">Espacio asignado</strong>
                {assignment.room} · {assignment.sede}
              </span>
            </p>
            <p className="flex items-start gap-3 text-muted-foreground sm:col-span-2">
              <BookOpenCheck className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
              <span>
                <strong className="block font-medium text-foreground">Modalidad académica</strong>
                {assignment.modalidad}
              </span>
            </p>
          </CardContent>
        </Card>

        <Card className="border-primary/25 bg-primary/[0.04]">
          <CardContent className="p-5">
            <AlertCircle className="size-6 text-primary" aria-hidden="true" />
            <p className="mt-3 font-bold text-foreground">Novedad vigente</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {assignment.novedades}
            </p>
          </CardContent>
        </Card>
      </div>

      <InstructorGroupRoster
        learners={(attendanceSheet?.learners ?? []).slice(0, assignment.studentCount)}
        totalStudents={assignment.studentCount}
      />
    </div>
  );
}
