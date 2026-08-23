import { InstructorAttendanceWorkspace } from "@/components/instructor/instructor-attendance-workspace";
import { instructorAttendanceSheets } from "@/lib/mocks/instructor-attendance";

export default function InstructorAsistenciaPage() {
  return (
    <div className="space-y-8">
      <section className="space-y-2">
        <h1 className="text-[2rem] font-semibold text-foreground sm:text-[2.2rem]">Asistencia</h1>
        <p className="text-sm leading-6 text-muted-foreground sm:text-base">
          Registra y consulta la asistencia de tus aprendices con una vista operativa centrada en el dia y el seguimiento historico.
        </p>
      </section>

      <InstructorAttendanceWorkspace sheets={instructorAttendanceSheets} />
    </div>
  );
}
