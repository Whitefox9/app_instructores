"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  CalendarCheck2,
  CheckCircle2,
  Clock3,
  MapPin,
  MonitorPlay,
  School,
  UsersRound,
} from "lucide-react";

import { InstructorStateBadge } from "@/components/instructor/instructor-badges";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { demoAcademicWeek } from "@/lib/demo/academic-system";
import type { InstructorAgendaEntry, InstructorAssignmentState } from "@/lib/types";
import { cn } from "@/lib/utils";

type InstructorScheduleProps = {
  entries: InstructorAgendaEntry[];
  attendanceGroups: string[];
  assignmentStates: Record<string, InstructorAssignmentState>;
};

const week = demoAcademicWeek;

function durationInHours(entry: InstructorAgendaEntry) {
  const [startHour, startMinute] = entry.startTime.split(":").map(Number);
  const [endHour, endMinute] = entry.endTime.split(":").map(Number);

  return endHour + endMinute / 60 - (startHour + startMinute / 60);
}

export function InstructorSchedule({
  entries,
  attendanceGroups,
  assignmentStates,
}: InstructorScheduleProps) {
  const firstActiveDay = week.find((day) =>
    entries.some((entry) => entry.dayName === day.name),
  );
  const [selectedDay, setSelectedDay] = useState(firstActiveDay?.name ?? week[0].name);
  const selectedEntries = entries.filter((entry) => entry.dayName === selectedDay);
  const selectedDayLabel = selectedDay === "Miercoles" ? "Miércoles" : selectedDay;
  const totalHours = entries.reduce((total, entry) => total + durationInHours(entry), 0);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_19rem]">
      <div className="min-w-0 space-y-5">
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="grid grid-cols-5 gap-1.5" role="tablist" aria-label="Días de la semana">
              {week.map((day) => {
                const classCount = entries.filter((entry) => entry.dayName === day.name).length;
                const active = selectedDay === day.name;

                return (
                  <button
                    key={day.name}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    aria-controls="instructor-day-schedule"
                    onClick={() => setSelectedDay(day.name)}
                    className={cn(
                      "flex min-w-0 flex-col items-center rounded-2xl px-1 py-3 text-center transition-colors sm:px-3",
                      active
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-muted",
                    )}
                  >
                    <span className="text-xs font-semibold sm:text-sm">{day.shortName}</span>
                    <span className="mt-1 text-lg font-bold sm:text-xl">{day.date}</span>
                    <span
                      className={cn(
                        "mt-1 hidden text-[10px] sm:block",
                        active ? "text-white/75" : "text-muted-foreground",
                      )}
                    >
                      {classCount ? `${classCount} clase${classCount > 1 ? "s" : ""}` : "Sin clase"}
                    </span>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <section id="instructor-day-schedule" role="tabpanel" className="space-y-4">
          <div className="flex items-end justify-between gap-4 px-1">
            <div>
              <p className="text-sm font-medium text-primary">Jornada seleccionada</p>
              <h2 className="mt-1 text-2xl font-bold text-foreground">{selectedDayLabel}</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              {selectedEntries.length} {selectedEntries.length === 1 ? "clase" : "clases"}
            </p>
          </div>

          {selectedEntries.length ? (
            selectedEntries.map((entry, index) => (
              <Card key={entry.id} className="overflow-hidden border-l-4 border-l-primary">
                <CardContent className="p-0">
                  <div className="grid md:grid-cols-[9rem_minmax(0,1fr)]">
                    <div className="flex flex-row items-center justify-between gap-4 bg-slate-950 px-5 py-4 text-white md:flex-col md:items-start md:justify-start md:px-6 md:py-7">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                          {index === 0 ? "Primera clase" : "Siguiente clase"}
                        </p>
                        <p className="mt-2 text-2xl font-bold">{entry.startTime}</p>
                        <p className="mt-1 text-sm text-slate-400">hasta {entry.endTime}</p>
                      </div>
                      <Clock3 className="size-7 text-primary md:mt-auto" aria-hidden="true" />
                    </div>

                    <div className="space-y-5 p-5 sm:p-6">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge variant="secondary">Grupo {entry.group}</Badge>
                            <Badge variant="outline">{entry.modalidad}</Badge>
                          </div>
                          <h3 className="mt-3 font-serif text-2xl font-bold text-foreground">
                            {entry.programa}
                          </h3>
                          <p className="mt-1 text-sm text-muted-foreground">{entry.title}</p>
                        </div>
                        <InstructorStateBadge
                          state={assignmentStates[entry.group] ?? "Programada"}
                        />
                      </div>

                      <div className="grid gap-3 text-sm sm:grid-cols-2">
                        <p className="flex items-start gap-2 text-muted-foreground">
                          <MapPin className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                          <span>
                            <strong className="block font-medium text-foreground">{entry.room}</strong>
                            {entry.sede}
                          </span>
                        </p>
                        <p className="flex items-start gap-2 text-muted-foreground">
                          {entry.dependencia === "Virtual" ? (
                            <MonitorPlay className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                          ) : (
                            <School className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                          )}
                          <span>
                            <strong className="block font-medium text-foreground">{entry.dependencia}</strong>
                            {entry.modalidad}
                          </span>
                        </p>
                      </div>

                      <div className="rounded-2xl bg-muted/60 px-4 py-3 text-sm text-muted-foreground">
                        {entry.note}
                      </div>

                      <div className="flex flex-col gap-3 border-t pt-4 sm:flex-row">
                        {attendanceGroups.includes(entry.group) ? (
                          <Button
                            asChild
                            size="lg"
                            className="w-full px-6 sm:w-auto sm:min-w-[12rem]"
                          >
                            <Link href={`/instructor/asistencia?ficha=${entry.group}&origen=horario`}>
                              Registrar asistencia
                              <ArrowRight className="size-4" aria-hidden="true" />
                            </Link>
                          </Button>
                        ) : (
                          <Button disabled size="lg" className="w-full px-6 sm:w-auto">
                            Asistencia no disponible
                          </Button>
                        )}
                        <Button
                          asChild
                          size="lg"
                          variant="outline"
                          className="w-full px-6 sm:w-auto sm:min-w-[10rem]"
                        >
                          <Link href={`/instructor/detalle-ficha/${entry.group}`}>
                            <UsersRound className="size-4" aria-hidden="true" />
                            Ver grupo
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center px-6 py-12 text-center">
                <span className="rounded-2xl bg-primary/10 p-3 text-primary">
                  <CalendarCheck2 className="size-7" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-lg font-bold text-foreground">Jornada sin clases</h3>
                <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                  No tienes sesiones programadas para este día.
                </p>
              </CardContent>
            </Card>
          )}
        </section>
      </div>

      <aside className="space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Resumen semanal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between border-b pb-4">
              <span className="text-sm text-muted-foreground">Clases</span>
              <strong className="text-xl text-foreground">{entries.length}</strong>
            </div>
            <div className="flex items-center justify-between border-b pb-4">
              <span className="text-sm text-muted-foreground">Horas programadas</span>
              <strong className="text-xl text-foreground">{totalHours} h</strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Grupos diferentes</span>
              <strong className="text-xl text-foreground">
                {new Set(entries.map((entry) => entry.group)).size}
              </strong>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/25 bg-primary/[0.04]">
          <CardContent className="p-5">
            <CheckCircle2 className="size-6 text-primary" aria-hidden="true" />
            <p className="mt-3 font-bold text-foreground">Horario actualizado</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              El grupo 2874901 tiene confirmado el Laboratorio B-204.
            </p>
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}
