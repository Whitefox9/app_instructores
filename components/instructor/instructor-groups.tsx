"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  Building2,
  Clock3,
  MapPin,
  MonitorPlay,
  UsersRound,
} from "lucide-react";

import { InstructorStateBadge } from "@/components/instructor/instructor-badges";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { InstructorAssignmentDetail } from "@/lib/types";
import { cn } from "@/lib/utils";

type InstructorGroupsProps = {
  assignments: InstructorAssignmentDetail[];
};

const filters = ["Todos", "Centro", "Virtual"] as const;

export function InstructorGroups({ assignments }: InstructorGroupsProps) {
  const [selectedFilter, setSelectedFilter] = useState<(typeof filters)[number]>("Todos");
  const visibleAssignments = assignments.filter(
    (assignment) => selectedFilter === "Todos" || assignment.dependencia === selectedFilter,
  );

  return (
    <div className="space-y-5">
      <Card>
        <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-bold text-foreground">{assignments.length} grupos activos</p>
            <p className="mt-1 text-sm text-muted-foreground">Periodo académico 2026-1</p>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1" aria-label="Filtrar grupos">
            {filters.map((filter) => (
              <button
                key={filter}
                type="button"
                aria-pressed={selectedFilter === filter}
                onClick={() => setSelectedFilter(filter)}
                className={cn(
                  "min-h-11 shrink-0 rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors",
                  selectedFilter === filter
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-muted-foreground hover:text-foreground",
                )}
              >
                {filter}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <section className="grid gap-4 xl:grid-cols-2" aria-live="polite">
        {visibleAssignments.map((assignment) => {
          const PlaceIcon = assignment.dependencia === "Virtual" ? MonitorPlay : Building2;

          return (
            <Card key={assignment.id} className="h-full overflow-hidden">
              <CardContent className="flex h-full flex-col p-0">
                <div className="border-b bg-slate-950 px-5 py-5 text-white sm:px-6">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                      Grupo {assignment.ficha}
                    </p>
                    <InstructorStateBadge
                      state={assignment.estado}
                      className={cn(
                        assignment.estado === "Requiere ajuste" &&
                          "border-amber-300/40 bg-amber-300/15 text-amber-200",
                      )}
                    />
                  </div>
                  <h2 className="mt-3 font-serif text-2xl font-bold leading-tight xl:min-h-[3.75rem]">
                    {assignment.programa}
                  </h2>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Badge className="border-white/15 bg-white/10 text-white hover:bg-white/10">
                      {assignment.modalidad}
                    </Badge>
                    <Badge className="border-white/15 bg-white/10 text-white hover:bg-white/10">
                      Jornada {assignment.jornada}
                    </Badge>
                  </div>
                </div>

                <div className="flex flex-1 flex-col gap-5 p-5 sm:p-6">
                  <div className="grid gap-3 text-sm sm:grid-cols-2">
                    <p className="flex items-start gap-2 text-muted-foreground">
                      <UsersRound className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                      <span>
                        <strong className="block font-medium text-foreground">
                          {assignment.aprendices} estudiantes
                        </strong>
                        Grupo activo
                      </span>
                    </p>
                    <p className="flex items-start gap-2 text-muted-foreground">
                      <Clock3 className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                      <span>
                        <strong className="block font-medium text-foreground">Horario</strong>
                        {assignment.horario}
                      </span>
                    </p>
                    <p className="flex items-start gap-2 text-muted-foreground sm:col-span-2">
                      <PlaceIcon className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                      <span>
                        <strong className="block font-medium text-foreground">
                          {assignment.ambiente}
                        </strong>
                        {assignment.sede}
                      </span>
                    </p>
                  </div>

                  <div className="mt-auto flex flex-col gap-4 border-t pt-4 sm:flex-row sm:items-end sm:justify-between">
                    <p className="line-clamp-2 min-w-0 text-sm leading-6 text-muted-foreground">
                      {assignment.novedades}
                    </p>
                    <Button
                      asChild
                      size="lg"
                      className="w-full shrink-0 px-6 sm:w-auto sm:min-w-[10rem]"
                    >
                      <Link href={`/instructor/detalle-ficha/${assignment.ficha}`}>
                        Abrir grupo
                        <ArrowRight className="size-4" aria-hidden="true" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </section>

      {!visibleAssignments.length ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            No tienes grupos asignados en esta categoría.
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
