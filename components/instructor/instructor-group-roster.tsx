"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Search, UserRound } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { InstructorAttendanceLearner } from "@/lib/types";

type InstructorGroupRosterProps = {
  learners: InstructorAttendanceLearner[];
  totalStudents: number;
};

const statusLabel = {
  A: "Asistió",
  CE: "Con excusa",
  SE: "Inasistencia",
  T: "Tardanza",
} as const;

function statusVariant(status: InstructorAttendanceLearner["status"]) {
  if (status === "A") return "success" as const;
  if (status === "T") return "warning" as const;
  if (status === "CE") return "secondary" as const;
  if (status === "SE") return "danger" as const;
  return "outline" as const;
}

export function InstructorGroupRoster({ learners, totalStudents }: InstructorGroupRosterProps) {
  const [expanded, setExpanded] = useState(false);
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLocaleLowerCase("es");
  const matchingLearners = learners.filter(
    (learner) =>
      !normalizedQuery ||
      learner.apprentice.toLocaleLowerCase("es").includes(normalizedQuery) ||
      learner.document.includes(normalizedQuery),
  );
  const visibleLearners = expanded || normalizedQuery ? matchingLearners : matchingLearners.slice(0, 6);

  return (
    <Card>
      <CardHeader className="gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <CardTitle>Estudiantes del grupo</CardTitle>
          <p className="mt-2 text-sm text-muted-foreground">
            {totalStudents} estudiantes registrados
            {learners.length !== totalStudents ? ` · ${learners.length} disponibles en la demostración` : ""}
          </p>
        </div>
        {learners.length ? (
          <label className="relative block w-full sm:max-w-xs">
            <span className="sr-only">Buscar estudiante</span>
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar estudiante"
              className="pl-9"
            />
          </label>
        ) : null}
      </CardHeader>
      <CardContent>
        {learners.length ? (
          <div className="space-y-4">
            <div className="divide-y rounded-2xl border">
              {visibleLearners.map((learner) => (
                <div
                  key={learner.id}
                  className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <UserRound className="size-5" aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-medium text-foreground">{learner.apprentice}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">Documento {learner.document}</p>
                    </div>
                  </div>
                  <Badge variant={statusVariant(learner.status)}>
                    {learner.status ? statusLabel[learner.status] : "Pendiente"}
                  </Badge>
                </div>
              ))}
            </div>

            {!matchingLearners.length ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No encontramos estudiantes con ese nombre o documento.
              </p>
            ) : null}

            {!normalizedQuery && learners.length > 6 ? (
              <Button
                type="button"
                size="lg"
                variant="outline"
                className="w-full"
                onClick={() => setExpanded((current) => !current)}
              >
                {expanded ? (
                  <>
                    Mostrar menos <ChevronUp className="size-4" aria-hidden="true" />
                  </>
                ) : (
                  <>
                    Ver todos los estudiantes ({learners.length})
                    <ChevronDown className="size-4" aria-hidden="true" />
                  </>
                )}
              </Button>
            ) : null}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed px-6 py-10 text-center">
            <UserRound className="mx-auto size-7 text-primary" aria-hidden="true" />
            <p className="mt-3 font-bold text-foreground">Listado en preparación</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Los estudiantes de este grupo todavía no están disponibles en la demostración.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
