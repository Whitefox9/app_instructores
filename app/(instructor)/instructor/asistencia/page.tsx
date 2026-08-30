import { ClipboardCheck } from "lucide-react";

import { InstructorAttendanceWorkspace } from "@/components/instructor/instructor-attendance-workspace";
import { InstructorPageHeader } from "@/components/instructor/instructor-page-header";
import { instructorAttendanceSheets } from "@/lib/mocks/instructor-attendance";

type InstructorAttendancePageProps = {
  searchParams: Promise<{
    ficha?: string;
    origen?: string;
  }>;
};

export default async function InstructorAttendancePage({ searchParams }: InstructorAttendancePageProps) {
  const { ficha: requestedFicha, origen } = await searchParams;
  const requestedSheet = requestedFicha
    ? instructorAttendanceSheets.find((sheet) => sheet.ficha === requestedFicha)
    : undefined;
  const initialFicha = requestedFicha ? requestedSheet?.ficha ?? null : undefined;
  const contextMessage = requestedFicha
    ? requestedSheet
      ? `Grupo ${requestedSheet.ficha} cargado${origen === "horario" ? " desde Horario" : origen === "grupo" ? " desde Grupos" : origen === "notificacion" ? " desde Notificaciones" : ""}.`
      : `El grupo ${requestedFicha} todavía no tiene una lista de asistencia disponible.`
    : undefined;

  return (
    <div className="space-y-6">
      <InstructorPageHeader
        icon={ClipboardCheck}
        title="Asistencia"
        description="Registra la asistencia de tus estudiantes y consulta su seguimiento histórico."
      />

      <InstructorAttendanceWorkspace
        key={initialFicha ?? "attendance-default"}
        sheets={instructorAttendanceSheets}
        initialFicha={initialFicha}
        contextMessage={contextMessage}
      />
    </div>
  );
}
