"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  CalendarDays,
  CheckCheck,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Clock3,
  Download,
  FileClock,
  History,
  MessageSquareText,
  Save,
  Search,
  UserRound,
  UsersRound,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { publishAttendanceSheet } from "@/lib/attendance/shared-attendance";
import { downloadInstructorAttendanceExcel } from "@/lib/exporters/instructor-attendance-excel";
import type {
  InstructorAttendanceLearner,
  InstructorAttendanceMark,
  InstructorAttendanceSheet,
} from "@/lib/types";
import { cn } from "@/lib/utils";

type Props = {
  sheets: InstructorAttendanceSheet[];
  initialFicha?: string | null;
  contextMessage?: string;
};

type View = "register" | "history";
type ListFilter = "all" | "pending" | "exceptions";
type HistoryMode = "sessions" | "student";

const attendanceStates: InstructorAttendanceMark[] = ["A", "T", "SE", "CE"];

const statusMeta: Record<
  InstructorAttendanceMark,
  {
    label: string;
    badge: "success" | "warning" | "danger" | "secondary";
    active: string;
  }
> = {
  A: {
    label: "Asistió",
    badge: "success",
    active: "border-success bg-success/10 text-success",
  },
  T: {
    label: "Tardanza",
    badge: "warning",
    active: "border-warning bg-warning/10 text-warning-foreground",
  },
  SE: {
    label: "Inasistencia",
    badge: "danger",
    active: "border-danger bg-danger/10 text-danger",
  },
  CE: {
    label: "Excusa",
    badge: "secondary",
    active: "border-secondary-foreground/30 bg-secondary text-secondary-foreground",
  },
};

function getCounts(learners: InstructorAttendanceLearner[]) {
  return learners.reduce(
    (counts, learner) => {
      if (learner.status) counts[learner.status] += 1;
      else counts.pending += 1;
      return counts;
    },
    { A: 0, T: 0, SE: 0, CE: 0, pending: 0 },
  );
}

function isException(status: InstructorAttendanceMark | null) {
  return status === "T" || status === "SE" || status === "CE";
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("es-CO", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

function currentTime() {
  return new Intl.DateTimeFormat("es-CO", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());
}

function formatDateInput(date: string) {
  if (!date) return "Selecciona una fecha";
  return new Intl.DateTimeFormat("es-CO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

function toIsoDate(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function buildStudentHistory(
  sheet: InstructorAttendanceSheet,
  learner: InstructorAttendanceLearner,
) {
  const seed = learner.id.split("").reduce((total, character) => total + character.charCodeAt(0), 0);
  const current = learner.status
    ? [
        {
          id: `${learner.id}-${sheet.date}`,
          date: sheet.date,
          status: learner.status,
          observation: learner.observation,
        },
      ]
    : [];

  const previous = sheet.history.map((record, index) => {
    const score = (seed + index * 11) % 12;
    const status: InstructorAttendanceMark =
      score >= 10 ? "SE" : score >= 8 ? "CE" : score >= 6 ? "T" : "A";

    return {
      id: `${learner.id}-${record.date}`,
      date: record.date,
      status,
      observation:
        status === "A"
          ? ""
          : status === "T"
            ? "Ingreso posterior al llamado inicial."
            : status === "CE"
              ? "Excusa registrada en seguimiento académico."
              : "Ausencia sin soporte registrado.",
    };
  });

  return [...current, ...previous].sort((left, right) => right.date.localeCompare(left.date));
}

export function InstructorAttendanceWorkspace({ sheets, initialFicha, contextMessage }: Props) {
  const initialSheet =
    initialFicha === null
      ? null
      : initialFicha
        ? sheets.find((sheet) => sheet.ficha === initialFicha) ?? null
        : sheets[0] ?? null;

  const [localSheets, setLocalSheets] = useState(sheets);
  const [loadedSheetId, setLoadedSheetId] = useState<string | null>(initialSheet?.id ?? null);
  const [draftDate, setDraftDate] = useState(initialSheet?.date ?? sheets[0]?.date ?? "");
  const [draftFicha, setDraftFicha] = useState(initialSheet?.ficha ?? sheets[0]?.ficha ?? "");
  const [view, setView] = useState<View>("register");
  const [filter, setFilter] = useState<ListFilter>("all");
  const [search, setSearch] = useState("");
  const [openObservations, setOpenObservations] = useState<string[]>([]);
  const [saveState, setSaveState] = useState<"saved" | "saving" | "error">("saved");
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [historyMode, setHistoryMode] = useState<HistoryMode>("sessions");
  const [historyStudentId, setHistoryStudentId] = useState(initialSheet?.learners[0]?.id ?? "");
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [showContextMessage, setShowContextMessage] = useState(Boolean(contextMessage));
  const [calendarMonth, setCalendarMonth] = useState(
    () => new Date(`${initialSheet?.date ?? sheets[0]?.date ?? "2026-01-01"}T00:00:00`),
  );
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadedSheet = localSheets.find((sheet) => sheet.id === loadedSheetId) ?? null;
  const fichaOptions = localSheets.filter((sheet) => sheet.date === draftDate);
  const counts = useMemo(
    () => (loadedSheet ? getCounts(loadedSheet.learners) : null),
    [loadedSheet],
  );
  const normalizedSearch = search.trim().toLocaleLowerCase("es");
  const visibleLearners = loadedSheet
    ? loadedSheet.learners.filter((learner) => {
        const matchesSearch =
          !normalizedSearch ||
          learner.apprentice.toLocaleLowerCase("es").includes(normalizedSearch) ||
          learner.document.includes(normalizedSearch);
        const matchesFilter =
          filter === "all"
            ? true
            : filter === "pending"
              ? learner.status === null
              : isException(learner.status);
        return matchesSearch && matchesFilter;
      })
    : [];
  const selectedHistoryStudent =
    loadedSheet?.learners.find((learner) => learner.id === historyStudentId) ??
    loadedSheet?.learners[0] ??
    null;
  const selectedStudentHistory =
    loadedSheet && selectedHistoryStudent
      ? buildStudentHistory(loadedSheet, selectedHistoryStudent)
      : [];
  const markedCount = loadedSheet && counts ? loadedSheet.learners.length - counts.pending : 0;
  const completion = loadedSheet?.learners.length
    ? Math.round((markedCount / loadedSheet.learners.length) * 100)
    : 0;
  const attendanceRate = loadedSheet?.learners.length && counts
    ? Math.round(((counts.A + counts.T) / loadedSheet.learners.length) * 100)
    : 0;
  const calendarCells = useMemo(() => {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    return [
      ...Array.from({ length: firstWeekday }, () => null),
      ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
    ];
  }, [calendarMonth]);
  const availableDates = new Set(localSheets.map((sheet) => sheet.date));

  useEffect(
    () => () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    },
    [],
  );

  async function persistSheet(sheet: InstructorAttendanceSheet) {
    try {
      await publishAttendanceSheet(sheet);
      setSaveState("saved");
      setLastSavedAt(currentTime());
    } catch {
      setSaveState("error");
    }
  }

  function scheduleSave(sheet: InstructorAttendanceSheet) {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    setSaveState("saving");
    saveTimer.current = setTimeout(() => {
      void persistSheet(sheet);
    }, 650);
  }

  async function saveNow() {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    if (!loadedSheet) return;
    setSaveState("saving");
    await persistSheet(loadedSheet);
  }

  function updateLoadedSheet(
    updater: (sheet: InstructorAttendanceSheet) => InstructorAttendanceSheet,
  ) {
    if (!loadedSheet) return;
    const updatedSheet = updater(loadedSheet);
    setLocalSheets((current) =>
      current.map((sheet) => (sheet.id === loadedSheet.id ? updatedSheet : sheet)),
    );
    scheduleSave(updatedSheet);
  }

  function updateStatus(learnerId: string, status: InstructorAttendanceMark) {
    updateLoadedSheet((sheet) => ({
      ...sheet,
      learners: sheet.learners.map((learner) =>
        learner.id === learnerId ? { ...learner, status } : learner,
      ),
    }));
  }

  function updateObservation(learnerId: string, observation: string) {
    updateLoadedSheet((sheet) => ({
      ...sheet,
      learners: sheet.learners.map((learner) =>
        learner.id === learnerId ? { ...learner, observation } : learner,
      ),
    }));
  }

  function markAllPresent() {
    updateLoadedSheet((sheet) => ({
      ...sheet,
      learners: sheet.learners.map((learner) => ({ ...learner, status: "A" })),
    }));
    setFilter("all");
  }

  function loadSelectedSheet() {
    const match = localSheets.find(
      (sheet) => sheet.date === draftDate && sheet.ficha === draftFicha,
    );
    setLoadedSheetId(match?.id ?? null);
    setView("register");
    setFilter("all");
    setSearch("");
    setOpenObservations([]);
    setHistoryMode("sessions");
    setHistoryStudentId(match?.learners[0]?.id ?? "");
    setShowContextMessage(Boolean(contextMessage) && match?.ficha === initialSheet?.ficha);
  }

  function changeDate(date: string) {
    const nextOptions = localSheets.filter((sheet) => sheet.date === date);
    setDraftDate(date);
    setDraftFicha(nextOptions[0]?.ficha ?? "");
  }

  function selectCalendarDay(day: number) {
    const date = toIsoDate(calendarMonth.getFullYear(), calendarMonth.getMonth(), day);
    changeDate(date);
    setCalendarOpen(false);
  }

  return (
    <div className="space-y-5">
      {contextMessage && showContextMessage ? (
        <div
          role="status"
          className={cn(
            "rounded-2xl border px-4 py-3 text-sm font-medium",
            initialSheet
              ? "border-success/20 bg-success/10 text-success"
              : "border-warning/30 bg-warning/10 text-warning-foreground",
          )}
        >
          {contextMessage}
        </div>
      ) : null}

      <Card className="z-20 overflow-visible">
        <CardContent className="grid gap-4 p-4 md:grid-cols-[minmax(14rem,0.9fr)_minmax(18rem,1.35fr)_auto] md:items-end">
          <div className="space-y-2">
            <label htmlFor="attendance-date" className="text-sm font-medium text-foreground">
              Fecha
            </label>
            <div className="relative">
              <Input
                id="attendance-date"
                type="text"
                readOnly
                className="h-12 cursor-pointer px-4 pr-12 text-base"
                value={formatDateInput(draftDate)}
                onClick={() => setCalendarOpen((current) => !current)}
                aria-haspopup="dialog"
                aria-expanded={calendarOpen}
              />
              <button
                type="button"
                onClick={() => setCalendarOpen((current) => !current)}
                aria-label="Abrir calendario"
                aria-expanded={calendarOpen}
                className="absolute right-1.5 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-xl text-primary transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <CalendarDays className="size-5" aria-hidden="true" />
              </button>

              {calendarOpen ? (
                <div
                  role="dialog"
                  aria-label="Seleccionar fecha"
                  className="absolute left-0 top-[calc(100%+0.5rem)] z-50 w-full min-w-[18rem] rounded-2xl border border-border bg-card p-4 shadow-2xl sm:w-[20rem]"
                >
                  <div className="flex items-center justify-between gap-3">
                    <button
                      type="button"
                      aria-label="Mes anterior"
                      onClick={() =>
                        setCalendarMonth(
                          (current) => new Date(current.getFullYear(), current.getMonth() - 1, 1),
                        )
                      }
                      className="flex size-9 items-center justify-center rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                      <ChevronLeft className="size-5" aria-hidden="true" />
                    </button>
                    <p className="font-bold capitalize text-foreground">
                      {new Intl.DateTimeFormat("es-CO", {
                        month: "long",
                        year: "numeric",
                      }).format(calendarMonth)}
                    </p>
                    <button
                      type="button"
                      aria-label="Mes siguiente"
                      onClick={() =>
                        setCalendarMonth(
                          (current) => new Date(current.getFullYear(), current.getMonth() + 1, 1),
                        )
                      }
                      className="flex size-9 items-center justify-center rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                      <ChevronRight className="size-5" aria-hidden="true" />
                    </button>
                  </div>

                  <div className="mt-4 grid grid-cols-7 gap-1 text-center text-xs font-bold text-muted-foreground">
                    {["L", "M", "X", "J", "V", "S", "D"].map((dayName) => (
                      <span key={dayName} className="py-1">
                        {dayName}
                      </span>
                    ))}
                  </div>
                  <div className="mt-1 grid grid-cols-7 gap-1">
                    {calendarCells.map((day, index) => {
                      if (!day) return <span key={`empty-${index}`} aria-hidden="true" />;
                      const date = toIsoDate(
                        calendarMonth.getFullYear(),
                        calendarMonth.getMonth(),
                        day,
                      );
                      const selected = date === draftDate;
                      const available = availableDates.has(date);

                      return (
                        <button
                          key={date}
                          type="button"
                          onClick={() => selectCalendarDay(day)}
                          aria-label={`Seleccionar ${formatDate(date)}`}
                          aria-pressed={selected}
                          className={cn(
                            "relative flex aspect-square items-center justify-center rounded-xl text-sm font-semibold transition-colors",
                            selected
                              ? "bg-primary text-primary-foreground"
                              : "text-foreground hover:bg-muted",
                          )}
                        >
                          {day}
                          {available && !selected ? (
                            <span className="absolute bottom-1 size-1 rounded-full bg-primary" />
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                  <p className="mt-3 text-center text-xs text-muted-foreground">
                    El punto rojo indica una fecha con grupos disponibles.
                  </p>
                </div>
              ) : null}
            </div>
          </div>
          <label className="space-y-2">
            <span className="text-sm font-medium text-foreground">Grupo</span>
            <Select
              className="h-12 px-4 text-base"
              value={draftFicha}
              onChange={(event) => setDraftFicha(event.target.value)}
            >
              {fichaOptions.length ? (
                fichaOptions.map((sheet) => (
                  <option key={sheet.id} value={sheet.ficha}>
                    {sheet.ficha} · {sheet.programa}
                  </option>
                ))
              ) : (
                <option value="">Sin grupos para esta fecha</option>
              )}
            </Select>
          </label>
          <Button
            size="lg"
            className="min-w-[10rem] px-6"
            onClick={loadSelectedSheet}
            disabled={!draftDate || !draftFicha}
          >
            <ClipboardCheck className="size-4" aria-hidden="true" />
            Abrir grupo
          </Button>
        </CardContent>
      </Card>

      {!loadedSheet || !counts ? (
        <EmptyState
          icon={FileClock}
          title="No hay un grupo cargado"
          description="Selecciona una fecha y un grupo con lista disponible para registrar asistencia."
        />
      ) : (
        <>
          <Card className="overflow-hidden border-0 bg-slate-950 text-white">
            <CardContent className="p-5 sm:p-6">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="border-white/15 bg-white/10 text-white hover:bg-white/10">
                      Grupo {loadedSheet.ficha}
                    </Badge>
                    <Badge className="border-white/15 bg-white/10 text-white hover:bg-white/10">
                      {formatDate(loadedSheet.date)}
                    </Badge>
                  </div>
                  <h2 className="mt-4 font-serif text-2xl font-bold">{loadedSheet.programa}</h2>
                  <p className="mt-2 text-sm text-slate-300">
                    {loadedSheet.horario} · {loadedSheet.ambiente ?? "Espacio por confirmar"}
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button
                    size="lg"
                    variant="outline"
                    className="min-w-[8.5rem] border-white/20 bg-transparent px-5 text-white hover:bg-white/10 hover:text-white"
                    onClick={() => downloadInstructorAttendanceExcel(loadedSheet)}
                  >
                    <Download className="size-4" aria-hidden="true" />
                    Exportar
                  </Button>
                  <Button size="lg" className="min-w-[11rem] px-6" onClick={() => void saveNow()}>
                    <Save className="size-4" aria-hidden="true" />
                    Guardar cambios
                  </Button>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3 border-t border-white/10 pt-5 sm:grid-cols-4">
                <div>
                  <p className="text-xs text-slate-400">Estudiantes</p>
                  <p className="mt-1 text-xl font-bold">{loadedSheet.learners.length}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Registro completo</p>
                  <p className="mt-1 text-xl font-bold">{completion}%</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Asistencia</p>
                  <p className="mt-1 text-xl font-bold">{attendanceRate}%</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Guardado</p>
                  <p className="mt-1 text-sm font-bold">
                    {saveState === "saving"
                      ? "Guardando…"
                      : saveState === "error"
                        ? "Error al guardar"
                        : lastSavedAt
                          ? `A las ${lastSavedAt}`
                          : "Sin cambios"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-2 rounded-2xl bg-muted p-1.5">
            <button
              type="button"
              onClick={() => setView("register")}
              className={cn(
                "flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-bold transition-colors",
                view === "register" ? "bg-white text-primary shadow-sm" : "text-muted-foreground",
              )}
            >
              <ClipboardCheck className="size-4" aria-hidden="true" />
              Registrar
            </button>
            <button
              type="button"
              onClick={() => setView("history")}
              className={cn(
                "flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-bold transition-colors",
                view === "history" ? "bg-white text-primary shadow-sm" : "text-muted-foreground",
              )}
            >
              <History className="size-4" aria-hidden="true" />
              Historial
            </button>
          </div>

          {view === "register" ? (
            <div className="space-y-4">
              <Card>
                <CardContent className="space-y-4 p-4 sm:p-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-bold text-foreground">Registro del día</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Marca a todos como presentes y modifica únicamente las excepciones.
                      </p>
                    </div>
                    <Button size="lg" className="min-w-[11rem] px-6" onClick={markAllPresent}>
                      <CheckCheck className="size-4" aria-hidden="true" />
                      Todos asistieron
                    </Button>
                  </div>

                  <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto]">
                    <label className="relative block">
                      <span className="sr-only">Buscar estudiante</span>
                      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                      <Input
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Buscar por nombre o documento"
                        className="pl-9"
                      />
                    </label>
                    <div className="flex gap-2 overflow-x-auto">
                      {([
                        ["all", "Todos"],
                        ["pending", `Pendientes (${counts.pending})`],
                        ["exceptions", "Excepciones"],
                      ] as Array<[ListFilter, string]>).map(([value, label]) => (
                        <button
                          key={value}
                          type="button"
                          aria-pressed={filter === value}
                          onClick={() => setFilter(value)}
                          className={cn(
                            "shrink-0 rounded-full border px-3 py-2 text-xs font-bold",
                            filter === value
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border bg-background text-muted-foreground",
                          )}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-3">
                {visibleLearners.map((learner) => {
                  const showObservation =
                    openObservations.includes(learner.id) ||
                    Boolean(learner.observation) ||
                    isException(learner.status);

                  return (
                    <Card key={learner.id}>
                      <CardContent className="space-y-4 p-4 sm:p-5">
                        <div className="flex items-start gap-3">
                          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <UserRound className="size-5" aria-hidden="true" />
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="font-bold text-foreground">{learner.apprentice}</p>
                            <p className="mt-1 text-xs text-muted-foreground">
                              Documento {learner.document}
                            </p>
                          </div>
                          {learner.status ? (
                            <Badge variant={statusMeta[learner.status].badge} className="hidden sm:inline-flex">
                              {statusMeta[learner.status].label}
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="hidden sm:inline-flex">Pendiente</Badge>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                          {attendanceStates.map((status) => (
                            <button
                              key={status}
                              type="button"
                              aria-pressed={learner.status === status}
                              onClick={() => updateStatus(learner.id, status)}
                              className={cn(
                                "min-h-11 rounded-xl border px-3 py-2.5 text-sm font-bold leading-tight transition-colors",
                                learner.status === status
                                  ? statusMeta[status].active
                                  : "border-border bg-background text-muted-foreground hover:text-foreground",
                              )}
                            >
                              {statusMeta[status].label}
                            </button>
                          ))}
                        </div>

                        {showObservation ? (
                          <label className="block space-y-2">
                            <span className="text-xs font-medium text-muted-foreground">Observación</span>
                            <Textarea
                              rows={2}
                              value={learner.observation}
                              onChange={(event) => updateObservation(learner.id, event.target.value)}
                              placeholder="Describe brevemente la novedad"
                            />
                          </label>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setOpenObservations((current) => [...current, learner.id])}
                            className="flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-primary"
                          >
                            <MessageSquareText className="size-4" aria-hidden="true" />
                            Añadir observación
                          </button>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}

                {!visibleLearners.length ? (
                  <EmptyState
                    icon={Search}
                    title="No hay coincidencias"
                    description="Cambia la búsqueda o el filtro para volver a mostrar estudiantes."
                  />
                ) : null}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <Card>
                <CardContent className="grid grid-cols-2 gap-2 p-3">
                  <button
                    type="button"
                    onClick={() => setHistoryMode("sessions")}
                    className={cn(
                      "rounded-xl px-3 py-2.5 text-sm font-bold",
                      historyMode === "sessions" ? "bg-primary text-primary-foreground" : "text-muted-foreground",
                    )}
                  >
                    Por sesión
                  </button>
                  <button
                    type="button"
                    onClick={() => setHistoryMode("student")}
                    className={cn(
                      "rounded-xl px-3 py-2.5 text-sm font-bold",
                      historyMode === "student" ? "bg-primary text-primary-foreground" : "text-muted-foreground",
                    )}
                  >
                    Por estudiante
                  </button>
                </CardContent>
              </Card>

              {historyMode === "sessions" ? (
                <div className="space-y-3">
                  {loadedSheet.history.map((record) => (
                    <Card key={record.id}>
                      <CardContent className="p-5">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <p className="font-bold text-foreground">{formatDate(record.date)}</p>
                            <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                              <Clock3 className="size-4" aria-hidden="true" />
                              {record.blockLabel} · Guardado {record.registeredAt.slice(-5)}
                            </p>
                          </div>
                          <Badge variant="success">{record.attendanceRate}% asistencia</Badge>
                        </div>
                        <div className="mt-4 grid grid-cols-4 gap-2 text-center">
                          {attendanceStates.map((status) => (
                            <div key={status} className="rounded-xl bg-muted px-2 py-3">
                              <p className="text-xs text-muted-foreground">{status}</p>
                              <p className="mt-1 font-bold text-foreground">{record.counts[status]}</p>
                            </div>
                          ))}
                        </div>
                        <p className="mt-4 text-sm leading-6 text-muted-foreground">{record.notes}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Seguimiento por estudiante</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <label className="block space-y-2">
                      <span className="text-sm font-medium text-foreground">Estudiante</span>
                      <Select
                        value={selectedHistoryStudent?.id ?? ""}
                        onChange={(event) => setHistoryStudentId(event.target.value)}
                      >
                        {loadedSheet.learners.map((learner) => (
                          <option key={learner.id} value={learner.id}>
                            {learner.apprentice} · {learner.document}
                          </option>
                        ))}
                      </Select>
                    </label>

                    {selectedHistoryStudent ? (
                      <div>
                        <div className="flex items-center gap-3 rounded-2xl bg-muted p-4">
                          <UsersRound className="size-5 text-primary" aria-hidden="true" />
                          <div>
                            <p className="font-bold text-foreground">{selectedHistoryStudent.apprentice}</p>
                            <p className="text-xs text-muted-foreground">
                              Documento {selectedHistoryStudent.document}
                            </p>
                          </div>
                        </div>
                        <div className="mt-4 divide-y rounded-2xl border">
                          {selectedStudentHistory.map((entry) => (
                            <div key={entry.id} className="flex items-start justify-between gap-4 p-4">
                              <div>
                                <p className="font-medium text-foreground">{formatDate(entry.date)}</p>
                                {entry.observation ? (
                                  <p className="mt-1 text-sm text-muted-foreground">{entry.observation}</p>
                                ) : null}
                              </div>
                              <Badge variant={statusMeta[entry.status].badge}>
                                {statusMeta[entry.status].label}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
