import { UsersRound } from "lucide-react";

import { InstructorGroups } from "@/components/instructor/instructor-groups";
import { InstructorPageHeader } from "@/components/instructor/instructor-page-header";
import { instructorAssignments } from "@/lib/mocks/instructor";

export default function InstructorAssignmentsPage() {
  return (
    <div className="space-y-6">
      <InstructorPageHeader
        icon={UsersRound}
        title="Mis grupos"
        description="Consulta tus grupos asignados, estudiantes y condiciones de formación."
      />

      <InstructorGroups assignments={instructorAssignments} />
    </div>
  );
}
