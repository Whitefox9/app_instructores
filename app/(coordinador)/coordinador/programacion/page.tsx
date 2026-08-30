import { CoordinatorSectionHeader } from "@/components/coordinator/coordinator-section-header";
import { CoordinatorScheduleView } from "@/components/coordinator/coordinator-usal-views";

export default function CoordinadorProgramacionPage() {
  return <div className="space-y-5"><CoordinatorSectionHeader title="Programación académica" description="Cruza grupos, docentes, aulas, días y horarios del periodo activo." /><CoordinatorScheduleView /></div>;
}
