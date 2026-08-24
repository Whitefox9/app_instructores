import { CalendarDays } from "lucide-react";

import { InstructorPageHeader } from "@/components/instructor/instructor-page-header";
import { InstructorSchedule } from "@/components/instructor/instructor-schedule";
import { instructorAgenda, instructorAssignments } from "@/lib/mocks/instructor";
import { instructorAttendanceSheets } from "@/lib/mocks/instructor-attendance";

export default function InstructorAgendaPage() {
  return (
    <div className="space-y-6">
      <InstructorPageHeader
        icon={CalendarDays}
        title="Mi horario"
        description="Consulta tus clases, espacios asignados y actividades de la semana."
      />

      <InstructorSchedule
        entries={instructorAgenda}
        attendanceFichas={instructorAttendanceSheets.map((sheet) => sheet.ficha)}
        assignmentStates={Object.fromEntries(
          instructorAssignments.map((assignment) => [assignment.ficha, assignment.estado]),
        )}
      />
    </div>
  );
}
