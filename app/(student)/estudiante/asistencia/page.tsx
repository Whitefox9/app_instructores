import { ClipboardCheck } from "lucide-react";

import { StudentAttendanceReport } from "@/components/student/student-attendance-report";
import { StudentPageHeader } from "@/components/student/student-page-header";

export default function StudentAttendancePage() {
  return (
    <div className="space-y-6">
      <StudentPageHeader
        icon={ClipboardCheck}
        title="Mi asistencia"
        description="Consulta tu registro reciente y las novedades informadas por tus docentes."
      />
      <StudentAttendanceReport />
    </div>
  );
}
