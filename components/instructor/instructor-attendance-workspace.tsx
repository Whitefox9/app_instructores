"use client";

import { useDeferredValue, useEffect, useRef, useState, useTransition } from "react";
import { CalendarDays, CheckCheck, ClipboardCheck, Download, FileClock, Save, Search, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { downloadInstructorAttendanceExcel } from "@/lib/exporters/instructor-attendance-excel";
import {
  InstructorAttendanceLearnerHistoryEntry,
  InstructorAttendanceMark,
  InstructorAttendanceSheet,
} from "@/lib/types";
import { cn } from "@/lib/utils";

type Props = { sheets: InstructorAttendanceSheet[] };
type Tab = "rollcall" | "history" | "summary";
type Filter = "all" | "EXCEPTIONS" | "UNMARKED" | InstructorAttendanceMark;
type SaveState = "saving" | "saved";
type HistoryStatusFilter = "all" | InstructorAttendanceMark;

const tabs = [
  { id: "rollcall", label: "Llamado de asistencia", helper: "Marca todos A y corrige excepciones." },
  { id: "history", label: "Historico", helper: "Consulta por fecha o por aprendiz." },
  { id: "summary", label: "Resumen", helper: "Estadisticas y seguimiento del dia." },
] satisfies Array<{ id: Tab; label: string; helper: string }>;

const stateMeta: Record<InstructorAttendanceMark, { label: string; badge: "success" | "warning" | "danger" | "outline"; soft: string; active: string; row: string }> = {
  A: { label: "Asistio", badge: "success", soft: "bg-success/10 text-success", active: "border-success/20 bg-success/12 text-success", row: "border-l-[3px] border-success/70" },
  CE: { label: "Con excusa", badge: "outline", soft: "bg-secondary text-secondary-foreground", active: "border-secondary bg-secondary text-secondary-foreground", row: "border-l-[3px] border-secondary-foreground/50" },
  SE: { label: "Sin excusa", badge: "danger", soft: "bg-danger/10 text-danger", active: "border-danger/20 bg-danger/10 text-danger", row: "border-l-[3px] border-danger/75" },
  T: { label: "Tarde", badge: "warning", soft: "bg-warning/12 text-warning-foreground", active: "border-warning/30 bg-warning/12 text-warning-foreground", row: "border-l-[3px] border-warning/75" },
};

function getCounts(learners: InstructorAttendanceSheet["learners"]) {
  return learners.reduce((acc, learner) => {
    if (!learner.status) {
      acc.UNMARKED += 1;
      return acc;
    }
    acc[learner.status] += 1;
    return acc;
  }, { A: 0, CE: 0, SE: 0, T: 0, UNMARKED: 0 });
}

function isException(status: InstructorAttendanceMark | null) {
  return status === "CE" || status === "SE" || status === "T";
}

function timeLabel() {
  return new Intl.DateTimeFormat("es-CO", { hour: "2-digit", minute: "2-digit" }).format(new Date());
}

function formatMonthLabel(date: string) {
  return new Intl.DateTimeFormat("es-CO", { month: "long", year: "numeric" }).format(new Date(`${date}T00:00:00`));
}

function formatDayLabel(date: string) {
  return new Intl.DateTimeFormat("es-CO", { day: "numeric", month: "short", year: "numeric" }).format(new Date(`${date}T00:00:00`));
}

function buildLearnerHistoryEntries(
  sheet: InstructorAttendanceSheet,
  learner: InstructorAttendanceSheet["learners"][number],
) {
  const seed = learner.id.split("").reduce((acc, item) => acc + item.charCodeAt(0), 0);
  const entries: InstructorAttendanceLearnerHistoryEntry[] = [];

  if (learner.status) {
    entries.push({
      id: `${learner.id}-${sheet.date}`,
      learnerId: learner.id,
      learnerName: learner.apprentice,
      learnerDocument: learner.document,
      date: sheet.date,
      status: learner.status,
      observation: learner.observation,
      ficha: sheet.ficha,
      jornada: sheet.jornada,
      ambiente: sheet.ambiente,
      colegio: sheet.colegio,
    });
  }

  sheet.history.forEach((record, index) => {
    const score = (seed + index * 11) % 12;
    const status: InstructorAttendanceMark =
      score >= 10 ? "SE" : score >= 8 ? "CE" : score >= 6 ? "T" : "A";

    const observation =
      status === "A"
        ? ""
        : status === "T"
          ? "Ingreso posterior al llamado inicial del bloque."
          : status === "CE"
            ? "Excusa registrada en seguimiento academico."
            : "Ausencia sin soporte reportada por el instructor.";

    entries.push({
      id: `${learner.id}-${record.date}`,
      learnerId: learner.id,
      learnerName: learner.apprentice,
      learnerDocument: learner.document,
      date: record.date,
      status,
      observation,
      ficha: sheet.ficha,
      jornada: sheet.jornada,
      ambiente: sheet.ambiente,
      colegio: sheet.colegio,
    });
  });

  return entries.sort((left, right) => right.date.localeCompare(left.date));
}

export function InstructorAttendanceWorkspace({ sheets }: Props) {
  const [draftDate, setDraftDate] = useState(sheets[0]?.date ?? "");
  const [draftFicha, setDraftFicha] = useState(sheets[0]?.ficha ?? "");
  const [localSheets, setLocalSheets] = useState(sheets);
  const [loadedSheetId, setLoadedSheetId] = useState<string | null>(sheets[0]?.id ?? null);
  const [tab, setTab] = useState<Tab>("rollcall");
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [historySearch, setHistorySearch] = useState("");
  const [historyStatusFilter, setHistoryStatusFilter] = useState<HistoryStatusFilter>("all");
  const [historyStartDate, setHistoryStartDate] = useState("");
  const [historyEndDate, setHistoryEndDate] = useState("");
  const [selectedHistoryLearnerId, setSelectedHistoryLearnerId] = useState<string | null>(
    sheets[0]?.learners[0]?.id ?? null,
  );
  const [saveState, setSaveState] = useState<SaveState>("saved");
  const [lastSavedAt, setLastSavedAt] = useState(timeLabel());
  const [isLoading, startTransition] = useTransition();
  const deferredSearch = useDeferredValue(search);
  const saveRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fichaOptions = localSheets.filter((sheet) => sheet.date === draftDate);
  const loadedSheet = localSheets.find((sheet) => sheet.id === loadedSheetId) ?? null;
  const counts = loadedSheet ? getCounts(loadedSheet.learners) : null;
  const effective = loadedSheet && counts ? counts.A + counts.T : 0;
  const coverage = loadedSheet && counts ? Math.round(((loadedSheet.totalAprendices - counts.UNMARKED) / loadedSheet.totalAprendices) * 100) : 0;
  const attendance = loadedSheet ? Math.round((effective / loadedSheet.totalAprendices) * 100) : 0;
  const exceptions = loadedSheet ? loadedSheet.learners.filter((learner) => isException(learner.status) || learner.observation.trim()) : [];
  const filtered = loadedSheet ? loadedSheet.learners.filter((learner) => {
    const searchOk = !deferredSearch || learner.apprentice.toLowerCase().includes(deferredSearch.toLowerCase()) || learner.document.includes(deferredSearch);
    const filterOk = filter === "all" ? true : filter === "EXCEPTIONS" ? isException(learner.status) : filter === "UNMARKED" ? learner.status === null : learner.status === filter;
    return searchOk && filterOk;
  }) : [];
  const historyCandidates = loadedSheet ? loadedSheet.learners.filter((learner) => {
    const term = historySearch.toLowerCase();
    return !term || learner.apprentice.toLowerCase().includes(term) || learner.document.includes(historySearch);
  }) : [];
  const selectedHistoryLearner =
    loadedSheet?.learners.find((learner) => learner.id === selectedHistoryLearnerId) ?? historyCandidates[0] ?? null;
  const selectedHistoryEntries =
    loadedSheet && selectedHistoryLearner ? buildLearnerHistoryEntries(loadedSheet, selectedHistoryLearner) : [];
  const visibleHistoryEntries = selectedHistoryEntries.filter((entry) => {
    const statusOk = historyStatusFilter === "all" ? true : entry.status === historyStatusFilter;
    const startOk = historyStartDate ? entry.date >= historyStartDate : true;
    const endOk = historyEndDate ? entry.date <= historyEndDate : true;
    return statusOk && startOk && endOk;
  });
  const historyCounts = visibleHistoryEntries.reduce(
    (acc, entry) => {
      acc[entry.status] += 1;
      return acc;
    },
    { A: 0, CE: 0, SE: 0, T: 0 },
  );
  const historyAttendance =
    visibleHistoryEntries.length > 0
      ? Math.round(((historyCounts.A + historyCounts.T) / visibleHistoryEntries.length) * 100)
      : 0;
  const historyMonths = visibleHistoryEntries.reduce(
    (acc, entry) => {
      const key = entry.date.slice(0, 7);
      const month = acc.find((item) => item.key === key);
      if (month) {
        month.entries.push(entry);
        return acc;
      }

      acc.push({
        key,
        label: formatMonthLabel(entry.date),
        entries: [entry],
      });
      return acc;
    },
    [] as Array<{ key: string; label: string; entries: InstructorAttendanceLearnerHistoryEntry[] }>,
  );
  const allVisibleSelected = filtered.length > 0 && filtered.every((learner) => selected.includes(learner.id));

  useEffect(() => () => { if (saveRef.current) clearTimeout(saveRef.current); }, []);

  function scheduleSave() {
    if (saveRef.current) clearTimeout(saveRef.current);
    setSaveState("saving");
    saveRef.current = setTimeout(() => {
      setSaveState("saved");
      setLastSavedAt(timeLabel());
    }, 700);
  }

  function updateSheet(updater: (sheet: InstructorAttendanceSheet) => InstructorAttendanceSheet) {
    if (!loadedSheet) return;
    setLocalSheets((current) => current.map((sheet) => sheet.id === loadedSheet.id ? updater(sheet) : sheet));
    scheduleSave();
  }

  function updateStatus(ids: string[], status: InstructorAttendanceMark) {
    updateSheet((sheet) => ({ ...sheet, learners: sheet.learners.map((learner) => ids.includes(learner.id) ? { ...learner, status } : learner) }));
  }

  function updateObservation(id: string, observation: string) {
    updateSheet((sheet) => ({ ...sheet, learners: sheet.learners.map((learner) => learner.id === id ? { ...learner, observation } : learner) }));
  }

  function markAllA() {
    if (!loadedSheet) return;
    updateStatus(loadedSheet.learners.map((learner) => learner.id), "A");
    setSelected([]);
    setFilter("EXCEPTIONS");
  }

  function loadSheet() {
    startTransition(() => {
      const match = localSheets.find((sheet) => sheet.date === draftDate && sheet.ficha === draftFicha) ?? null;
      setLoadedSheetId(match?.id ?? null);
      setSelected([]);
      setSearch("");
      setFilter("all");
      setTab("rollcall");
      setHistorySearch("");
      setHistoryStatusFilter("all");
      setHistoryStartDate("");
      setHistoryEndDate("");
      setSelectedHistoryLearnerId(match?.learners[0]?.id ?? null);
      setSaveState("saved");
      setLastSavedAt(timeLabel());
    });
  }

  function changeDate(nextDate: string) {
    const nextOptions = localSheets.filter((sheet) => sheet.date === nextDate);
    setDraftDate(nextDate);
    setDraftFicha(nextOptions[0]?.ficha ?? "");
  }

  return (
    <div className="space-y-6">
      <Card className="overflow-visible border-primary/15 bg-gradient-to-br from-white via-white to-secondary/55">
        <CardContent className="grid gap-4 p-5 lg:grid-cols-[1.2fr_1.2fr_auto_auto] lg:items-end">
          <label className="space-y-2">
            <span className="text-sm font-medium text-foreground">Fecha</span>
            <div className="relative">
              <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input type="date" className="pl-10" value={draftDate} onChange={(event) => changeDate(event.target.value)} />
            </div>
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-foreground">Ficha</span>
            <Select value={draftFicha} onChange={(event) => setDraftFicha(event.target.value)}>
              {fichaOptions.length ? fichaOptions.map((sheet) => <option key={sheet.id} value={sheet.ficha}>{sheet.ficha} · {sheet.programa}</option>) : <option value="">Sin fichas para la fecha</option>}
            </Select>
          </label>
          <Button className="w-full lg:w-auto" onClick={loadSheet} disabled={!draftDate || !draftFicha || isLoading}>
            <ClipboardCheck className="h-4 w-4" />
            {isLoading ? "Cargando..." : "Cargar ficha"}
          </Button>
          <Button variant="outline" className="w-full lg:w-auto" onClick={() => loadedSheet && downloadInstructorAttendanceExcel(loadedSheet)} disabled={!loadedSheet}>
            <Download className="h-4 w-4" />
            Exportar a Excel
          </Button>
        </CardContent>
      </Card>

      {!loadedSheet || !counts ? <EmptyState icon={FileClock} title="No hay una ficha cargada" description="Selecciona una fecha y una ficha para registrar asistencia." /> : (
        <>
          <Card className="overflow-hidden border-border/70">
            <CardContent className="grid gap-0 p-0 xl:grid-cols-[1.05fr_0.95fr]">
              <div className="bg-gradient-to-br from-primary/12 via-white to-white p-6">
                <div className="flex flex-wrap gap-2"><Badge variant="secondary">Resumen del dia</Badge><Badge variant="outline">Ficha {loadedSheet.ficha}</Badge></div>
                <h2 className="mt-4 text-2xl font-semibold text-foreground">{loadedSheet.programa}</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">Jornada {loadedSheet.jornada} · Horario {loadedSheet.horario} · Ambiente {loadedSheet.ambiente ?? "No aplica"}</p>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[1.2rem] border border-white/80 bg-white/90 p-4"><p className="text-sm text-muted-foreground">Instructor</p><p className="mt-1 font-semibold text-foreground">{loadedSheet.instructor}</p></div>
                  <div className="rounded-[1.2rem] border border-white/80 bg-white/90 p-4"><p className="text-sm text-muted-foreground">Aprendices</p><p className="mt-1 font-semibold text-foreground">{loadedSheet.totalAprendices}</p></div>
                </div>
              </div>
              <div className="grid gap-3 p-6 sm:grid-cols-2">
                <div className="rounded-[1.2rem] border border-success/15 bg-success/8 p-4"><p className="text-sm text-muted-foreground">Asistencia efectiva</p><p className="mt-2 text-3xl font-semibold text-foreground">{attendance}%</p><p className="mt-2 text-sm text-muted-foreground">{effective} presentes o en tardanza.</p></div>
                <div className="rounded-[1.2rem] border border-border/70 bg-background/80 p-4"><p className="text-sm text-muted-foreground">Registro completo</p><p className="mt-2 text-3xl font-semibold text-foreground">{coverage}%</p><p className="mt-2 text-sm text-muted-foreground">{counts.UNMARKED} pendientes.</p></div>
                <div className="rounded-[1.2rem] border border-danger/15 bg-danger/5 p-4"><p className="text-sm text-muted-foreground">Excepciones</p><p className="mt-2 text-3xl font-semibold text-foreground">{exceptions.length}</p><p className="mt-2 text-sm text-muted-foreground">Novedades del dia.</p></div>
                <div className="rounded-[1.2rem] border border-border/70 bg-background/80 p-4"><p className="text-sm text-muted-foreground">Guardado</p><div className="mt-2 flex items-center gap-2"><Badge variant={saveState === "saving" ? "warning" : "success"}>{saveState === "saving" ? "Guardando..." : "Guardado"}</Badge><span className="text-sm text-muted-foreground">{lastSavedAt}</span></div><p className="mt-2 text-sm text-muted-foreground">Cambios guardados automaticamente.</p></div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/15 bg-gradient-to-r from-primary/6 via-white to-white">
            <CardContent className="grid gap-4 p-5 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Flujo recomendado</p>
                <h3 className="mt-2 text-xl font-semibold text-foreground">1. Marcar todos A. 2. Corregir excepciones. 3. Dejar guardado. 4. Exportar si hace falta.</h3>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <Button size="lg" className="sm:min-w-[200px]" onClick={markAllA}><CheckCheck className="h-4 w-4" />Marcar todos A</Button>
                <Button variant="outline" size="lg" className="sm:min-w-[180px]" onClick={() => setFilter("EXCEPTIONS")}>Ver excepciones</Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-3 lg:grid-cols-3">
            {tabs.map((item) => <button key={item.id} type="button" onClick={() => setTab(item.id)} className={cn("rounded-[1.2rem] border p-4 text-left transition-all", tab === item.id ? "border-primary bg-primary text-primary-foreground" : "border-border/80 bg-card hover:border-primary/35 hover:bg-secondary/50")}><p className="font-semibold">{item.label}</p><p className={cn("mt-1 text-sm leading-6", tab === item.id ? "text-primary-foreground/82" : "text-muted-foreground")}>{item.helper}</p></button>)}
          </div>

          {tab === "rollcall" ? (
            <div className="grid gap-6 xl:grid-cols-[1.18fr_0.82fr]">
              <Card>
                <CardHeader className="space-y-4">
                  <div className="flex flex-wrap items-end justify-between gap-3">
                    <div>
                      <CardTitle>Tabla operativa</CardTitle>
                      <CardDescription>Encabezado fijo, filas compactas y lectura por color para grupos grandes.</CardDescription>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">{filtered.length} visibles</Badge>
                      <Badge variant="outline">{selected.length} seleccionados</Badge>
                    </div>
                  </div>
                  <div className="grid gap-3 lg:grid-cols-[1.3fr_0.8fr]">
                    <label className="space-y-2">
                      <span className="text-sm font-medium text-foreground">Buscar</span>
                      <div className="relative">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input className="pl-10" placeholder="Nombre o documento" value={search} onChange={(event) => setSearch(event.target.value)} />
                      </div>
                    </label>
                    <label className="space-y-2">
                      <span className="text-sm font-medium text-foreground">Filtro principal</span>
                      <Select value={filter} onChange={(event) => setFilter(event.target.value as Filter)}>
                        <option value="all">Todos</option>
                        <option value="EXCEPTIONS">Solo excepciones</option>
                        <option value="UNMARKED">Sin marcar</option>
                        <option value="A">Solo A</option>
                        <option value="CE">Solo CE</option>
                        <option value="SE">Solo SE</option>
                        <option value="T">Solo T</option>
                      </Select>
                    </label>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 flex flex-wrap gap-2">
                    {(["all", "EXCEPTIONS", "UNMARKED", "A", "CE", "SE", "T"] as Filter[]).map((item) => (
                      <button key={item} type="button" onClick={() => setFilter(item)} className={cn("rounded-full border px-3 py-1.5 text-xs font-semibold transition-all", filter === item ? item === "all" ? "bg-primary text-primary-foreground" : item === "EXCEPTIONS" ? "bg-danger text-danger-foreground" : item === "UNMARKED" ? "bg-secondary text-secondary-foreground" : stateMeta[item].active : "border-border/80 bg-card text-muted-foreground hover:text-foreground")}>
                        {item === "all" ? "Todos" : item === "EXCEPTIONS" ? "Excepciones" : item === "UNMARKED" ? "Sin marcar" : item}
                      </button>
                    ))}
                  </div>
                  <div className="overflow-hidden rounded-[1.2rem] border border-border/70">
                    <div className="max-h-[72vh] overflow-auto">
                      <table className="min-w-full border-collapse text-sm">
                        <thead className="sticky top-0 z-10 bg-secondary/90 text-left text-muted-foreground backdrop-blur">
                          <tr>
                            <th className="w-12 px-3 py-3"><input type="checkbox" className="h-4 w-4 rounded border-border text-primary focus:ring-ring" checked={allVisibleSelected} onChange={() => setSelected((current) => allVisibleSelected ? current.filter((id) => !filtered.some((learner) => learner.id === id)) : Array.from(new Set([...current, ...filtered.map((learner) => learner.id)])))} /></th>
                            <th className="w-12 px-2 py-3 font-medium">#</th>
                            <th className="min-w-[250px] px-4 py-3 font-medium">Aprendiz</th>
                            <th className="min-w-[130px] px-4 py-3 font-medium">Documento</th>
                            <th className="min-w-[250px] px-4 py-3 font-medium">Estado</th>
                            <th className="min-w-[220px] px-4 py-3 font-medium">Observacion</th>
                          </tr>
                        </thead>
                        <tbody className="bg-card">
                          {filtered.map((learner, index) => (
                            <tr key={learner.id} className={cn("border-b border-border/70 align-top hover:bg-secondary/18", learner.status ? stateMeta[learner.status].row : "border-l-[3px] border-l-border/70", selected.includes(learner.id) ? "bg-secondary/22" : index % 2 === 0 ? "bg-card" : "bg-background/35")}>
                              <td className="px-3 py-3.5"><input type="checkbox" className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-ring" checked={selected.includes(learner.id)} onChange={() => setSelected((current) => current.includes(learner.id) ? current.filter((item) => item !== learner.id) : [...current, learner.id])} /></td>
                              <td className="px-2 py-3.5 text-xs font-semibold text-muted-foreground">{index + 1}</td>
                              <td className="px-4 py-3.5"><div className="font-semibold text-foreground">{learner.apprentice}</div><div className="mt-1"><span className={cn("inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold", learner.status ? stateMeta[learner.status].soft : "bg-muted text-muted-foreground")}>{learner.status ? stateMeta[learner.status].label : "Pendiente"}</span></div></td>
                              <td className="px-4 py-3.5 font-mono text-xs text-muted-foreground">{learner.document}</td>
                              <td className="px-4 py-3.5"><div className="grid grid-cols-4 gap-2">{(["A", "CE", "SE", "T"] as InstructorAttendanceMark[]).map((mark) => <button key={mark} type="button" onClick={() => updateStatus([learner.id], mark)} className={cn("rounded-[0.95rem] border px-2 py-2 text-center text-xs font-semibold transition-all", learner.status === mark ? stateMeta[mark].active : "border-border/80 bg-background text-muted-foreground hover:border-primary/30 hover:text-foreground")}><span className="block">{mark}</span><span className="mt-1 block text-[10px] font-medium opacity-80">{stateMeta[mark].label}</span></button>)}</div></td>
                              <td className="px-4 py-3.5"><Input className="h-11 bg-white/80" placeholder="Observacion opcional" value={learner.observation} onChange={(event) => updateObservation(learner.id, event.target.value)} /></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  {!filtered.length ? <div className="mt-4"><EmptyState icon={Search} title="No hay coincidencias" description="Ajusta la busqueda o el filtro para volver a mostrar aprendices." /></div> : null}
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Operativo rapido</CardTitle>
                    <CardDescription>Acciones rapidas en la derecha para seguir el flujo de trabajo sugerido.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="rounded-[1.2rem] border border-success/15 bg-success/8 p-4">
                      <p className="font-semibold text-foreground">Paso 1</p>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">Completa primero el grupo y luego vuelve al centro para corregir solo las excepciones.</p>
                      <Button className="mt-4 w-full bg-[#16a34a] hover:bg-[#12813a]" onClick={markAllA}><CheckCheck className="h-4 w-4" />Marcar los {loadedSheet.totalAprendices} como A</Button>
                    </div>
                    <div className="rounded-[1.2rem] border border-border/70 bg-background/80 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold text-foreground">Seleccion actual</p>
                          <p className="mt-1 text-sm text-muted-foreground">{selected.length} seleccionados</p>
                        </div>
                        <Button variant="ghost" onClick={() => setSelected([])} disabled={!selected.length}>Limpiar</Button>
                      </div>
                      <div className="mt-4 grid gap-2">
                        <Button variant="outline" onClick={() => selected.length && updateStatus(selected, "CE")} disabled={!selected.length}>Seleccionados CE</Button>
                        <Button variant="outline" onClick={() => selected.length && updateStatus(selected, "SE")} disabled={!selected.length}>Seleccionados SE</Button>
                        <Button variant="outline" onClick={() => selected.length && updateStatus(selected, "T")} disabled={!selected.length}>Seleccionados T</Button>
                        <Button variant="secondary" onClick={() => selected.length && updateStatus(selected, "A")} disabled={!selected.length}>Seleccionados A</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Informacion de la ficha</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm text-muted-foreground">
                    <div><p className="text-xs uppercase tracking-[0.18em]">Programa</p><p className="mt-1 text-foreground">{loadedSheet.programa}</p></div>
                    <div><p className="text-xs uppercase tracking-[0.18em]">Jornada</p><p className="mt-1 text-foreground">{loadedSheet.jornada}</p></div>
                    <div><p className="text-xs uppercase tracking-[0.18em]">Ambiente</p><p className="mt-1 text-foreground">{loadedSheet.colegio ? `${loadedSheet.colegio} · ` : ""}{loadedSheet.ambiente ?? "No aplica"}</p></div>
                    <div><p className="text-xs uppercase tracking-[0.18em]">Instructor</p><p className="mt-1 text-foreground">{loadedSheet.instructor}</p></div>
                    <div><p className="text-xs uppercase tracking-[0.18em]">Aprendices</p><p className="mt-1 text-foreground">{loadedSheet.totalAprendices}</p></div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Estadisticas del dia</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="rounded-[1.2rem] border border-primary/15 bg-primary/6 p-4 text-center">
                      <p className="text-sm text-muted-foreground">Asistencia promedio</p>
                      <p className="mt-2 text-4xl font-semibold text-foreground">{attendance}%</p>
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2">
                      <Badge variant="success" className="justify-center py-2">A {counts.A}</Badge>
                      <Badge variant="outline" className="justify-center py-2">CE {counts.CE}</Badge>
                      <Badge variant="danger" className="justify-center py-2">SE {counts.SE}</Badge>
                      <Badge variant="warning" className="justify-center py-2">T {counts.T}</Badge>
                    </div>
                    <div className="rounded-[1.2rem] border border-border/70 bg-background/80 p-4"><p className="text-sm text-muted-foreground">Guardado</p><div className="mt-3 flex items-center gap-2"><Save className="h-4 w-4 text-primary" /><span className="text-sm text-foreground">{saveState === "saving" ? "Guardando cambios..." : `Guardado a las ${lastSavedAt}`}</span></div></div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : null}

          {tab === "history" ? (
            <div className="space-y-6">
              <div className="grid gap-6 xl:grid-cols-[0.82fr_1.18fr]">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Historico por aprendiz</CardTitle>
                      <CardDescription>
                        Busca por nombre o documento y mantente dentro del contexto de la ficha cargada.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <label className="space-y-2">
                        <span className="text-sm font-medium text-foreground">Buscar aprendiz</span>
                        <div className="relative">
                          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            className="pl-10"
                            placeholder="Nombre o documento"
                            value={historySearch}
                            onChange={(event) => setHistorySearch(event.target.value)}
                          />
                        </div>
                      </label>

                      <label className="space-y-2">
                        <span className="text-sm font-medium text-foreground">Aprendiz seleccionado</span>
                        <Select
                          value={selectedHistoryLearner?.id ?? ""}
                          onChange={(event) => setSelectedHistoryLearnerId(event.target.value)}
                        >
                          {historyCandidates.length ? (
                            historyCandidates.map((learner) => (
                              <option key={learner.id} value={learner.id}>
                                {learner.apprentice} · {learner.document}
                              </option>
                            ))
                          ) : (
                            <option value="">Sin coincidencias</option>
                          )}
                        </Select>
                      </label>
                    </CardContent>
                  </Card>

                  {selectedHistoryLearner ? (
                    <Card>
                      <CardHeader>
                        <CardTitle>{selectedHistoryLearner.apprentice}</CardTitle>
                        <CardDescription>
                          Documento {selectedHistoryLearner.document} · Ficha {loadedSheet.ficha}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="rounded-[1.2rem] border border-border/70 bg-background/80 p-4">
                          <p className="text-sm text-muted-foreground">Programa y contexto</p>
                          <p className="mt-2 font-semibold text-foreground">{loadedSheet.programa}</p>
                          <p className="mt-1 text-sm text-muted-foreground">
                            Jornada {loadedSheet.jornada}
                            {loadedSheet.colegio ? ` · ${loadedSheet.colegio}` : ""}
                            {loadedSheet.ambiente ? ` · ${loadedSheet.ambiente}` : ""}
                          </p>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                          <div className="rounded-[1.2rem] border border-success/15 bg-success/8 p-4">
                            <p className="text-sm text-muted-foreground">Asistencias</p>
                            <p className="mt-2 text-3xl font-semibold text-foreground">{historyCounts.A}</p>
                          </div>
                          <div className="rounded-[1.2rem] border border-border/70 bg-background/80 p-4">
                            <p className="text-sm text-muted-foreground">Excusas</p>
                            <p className="mt-2 text-3xl font-semibold text-foreground">{historyCounts.CE}</p>
                          </div>
                          <div className="rounded-[1.2rem] border border-danger/15 bg-danger/5 p-4">
                            <p className="text-sm text-muted-foreground">Sin excusa</p>
                            <p className="mt-2 text-3xl font-semibold text-foreground">{historyCounts.SE}</p>
                          </div>
                          <div className="rounded-[1.2rem] border border-warning/15 bg-warning/8 p-4">
                            <p className="text-sm text-muted-foreground">Tardanzas</p>
                            <p className="mt-2 text-3xl font-semibold text-foreground">{historyCounts.T}</p>
                          </div>
                        </div>

                        <div className="rounded-[1.2rem] border border-primary/15 bg-primary/6 p-4">
                          <p className="text-sm text-muted-foreground">Porcentaje de asistencia</p>
                          <p className="mt-2 text-3xl font-semibold text-foreground">{historyAttendance}%</p>
                          <p className="mt-2 text-sm text-muted-foreground">
                            Calculado sobre el historico filtrado del aprendiz seleccionado.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <EmptyState
                      icon={Users}
                      title="Selecciona un aprendiz"
                      description="Busca por nombre o documento para consultar su seguimiento historico."
                    />
                  )}
                </div>

                <Card>
                  <CardHeader className="space-y-4">
                    <div>
                      <CardTitle>Seguimiento mensual</CardTitle>
                      <CardDescription>
                        Consulta agrupada por mes para revisar la asistencia registrada del aprendiz seleccionado.
                      </CardDescription>
                    </div>
                    <div className="grid gap-3 lg:grid-cols-3">
                      <label className="space-y-2">
                        <span className="text-sm font-medium text-foreground">Fecha desde</span>
                        <Input type="date" value={historyStartDate} onChange={(event) => setHistoryStartDate(event.target.value)} />
                      </label>
                      <label className="space-y-2">
                        <span className="text-sm font-medium text-foreground">Fecha hasta</span>
                        <Input type="date" value={historyEndDate} onChange={(event) => setHistoryEndDate(event.target.value)} />
                      </label>
                      <label className="space-y-2">
                        <span className="text-sm font-medium text-foreground">Estado</span>
                        <Select
                          value={historyStatusFilter}
                          onChange={(event) => setHistoryStatusFilter(event.target.value as HistoryStatusFilter)}
                        >
                          <option value="all">Todos</option>
                          <option value="A">A</option>
                          <option value="CE">CE</option>
                          <option value="SE">SE</option>
                          <option value="T">T</option>
                        </Select>
                      </label>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">{visibleHistoryEntries.length} registros</Badge>
                      {selectedHistoryLearner ? (
                        <Badge variant="outline">{selectedHistoryLearner.apprentice}</Badge>
                      ) : null}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {selectedHistoryLearner && historyMonths.length ? (
                      historyMonths.map((month) => (
                        <div key={month.key} className="rounded-[1.25rem] border border-border/70 bg-gradient-to-br from-white to-background/70 p-4">
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                              <p className="text-lg font-semibold capitalize text-foreground">{month.label}</p>
                              <p className="mt-1 text-sm text-muted-foreground">{month.entries.length} registros del aprendiz en este mes</p>
                            </div>
                            <Badge variant="secondary">{month.entries.filter((entry) => entry.status === "A" || entry.status === "T").length} con asistencia</Badge>
                          </div>
                          <div className="mt-4 space-y-3">
                            {month.entries.map((entry) => (
                              <div key={entry.id} className="rounded-[1rem] border border-border/70 bg-white/92 p-4">
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                  <div>
                                    <p className="font-semibold text-foreground">{formatDayLabel(entry.date)}</p>
                                    <p className="mt-1 text-sm text-muted-foreground">Ficha {entry.ficha} · Jornada {entry.jornada}</p>
                                  </div>
                                  <Badge variant={stateMeta[entry.status].badge}>{entry.status}</Badge>
                                </div>
                                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                  <div className="rounded-[0.95rem] border border-border/70 bg-background/80 p-3">
                                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Contexto</p>
                                    <p className="mt-2 text-sm text-foreground">{entry.colegio ? `${entry.colegio} · ` : ""}{entry.ambiente ?? "Sin ambiente registrado"}</p>
                                  </div>
                                  <div className="rounded-[0.95rem] border border-border/70 bg-background/80 p-3">
                                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Estado</p>
                                    <p className="mt-2 text-sm font-semibold text-foreground">{entry.status} · {stateMeta[entry.status].label}</p>
                                  </div>
                                </div>
                                {entry.observation ? <div className="mt-4 rounded-[0.95rem] border border-border/70 bg-background/80 p-3 text-sm leading-6 text-muted-foreground">{entry.observation}</div> : null}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))
                    ) : (
                      <EmptyState
                        icon={FileClock}
                        title="Sin registros historicos"
                        description="Ajusta el aprendiz o los filtros de fecha y estado para consultar su seguimiento."
                      />
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : null}

          {tab === "summary" ? (
            <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
              <Card>
                <CardHeader><CardTitle>Estadisticas del dia</CardTitle><CardDescription>Panorama para cierre rapido del llamado.</CardDescription></CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[1.2rem] border border-success/15 bg-success/8 p-4"><p className="text-sm text-muted-foreground">A</p><p className="mt-2 text-3xl font-semibold text-foreground">{counts.A}</p><p className="mt-2 text-sm text-muted-foreground">Presentes sin novedad.</p></div>
                  <div className="rounded-[1.2rem] border border-warning/15 bg-warning/8 p-4"><p className="text-sm text-muted-foreground">T</p><p className="mt-2 text-3xl font-semibold text-foreground">{counts.T}</p><p className="mt-2 text-sm text-muted-foreground">Llegadas tarde.</p></div>
                  <div className="rounded-[1.2rem] border border-border/70 bg-background/80 p-4"><p className="text-sm text-muted-foreground">CE</p><p className="mt-2 text-3xl font-semibold text-foreground">{counts.CE}</p><p className="mt-2 text-sm text-muted-foreground">Excusas registradas.</p></div>
                  <div className="rounded-[1.2rem] border border-danger/15 bg-danger/5 p-4"><p className="text-sm text-muted-foreground">SE</p><p className="mt-2 text-3xl font-semibold text-foreground">{counts.SE}</p><p className="mt-2 text-sm text-muted-foreground">Faltas sin excusa.</p></div>
                  <div className="rounded-[1.2rem] border border-border/70 bg-background/80 p-4"><p className="text-sm text-muted-foreground">Cobertura</p><p className="mt-2 text-3xl font-semibold text-foreground">{coverage}%</p><p className="mt-2 text-sm text-muted-foreground">Control del diligenciamiento.</p></div>
                  <div className="rounded-[1.2rem] border border-border/70 bg-background/80 p-4"><p className="text-sm text-muted-foreground">Pendientes</p><p className="mt-2 text-3xl font-semibold text-foreground">{counts.UNMARKED}</p><p className="mt-2 text-sm text-muted-foreground">Aun sin estado.</p></div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle>Seguimiento del dia</CardTitle><CardDescription>Aprendices con novedad u observacion.</CardDescription></CardHeader>
                <CardContent className="space-y-3">
                  {exceptions.length ? exceptions.map((learner) => <div key={learner.id} className={cn("rounded-[1.2rem] border p-4", learner.status ? stateMeta[learner.status].active : "border-border/70 bg-background/80")}><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="font-semibold text-foreground">{learner.apprentice}</p><p className="mt-1 text-sm text-muted-foreground">{learner.document}</p></div><Badge variant={learner.status ? stateMeta[learner.status].badge : "secondary"}>{learner.status ?? "Sin marcar"}</Badge></div><p className="mt-3 text-sm leading-6 text-muted-foreground">{learner.observation || "Sin observacion adicional."}</p></div>) : <EmptyState icon={Users} title="Sin novedades registradas" description="Si todo el grupo queda en A y sin observaciones, este resumen se mantiene limpio." />}
                </CardContent>
              </Card>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
