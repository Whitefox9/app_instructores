import { CoordinatorSectionHeader } from "@/components/coordinator/coordinator-section-header";
import { CoordinatorGroupsView } from "@/components/coordinator/coordinator-usal-views";

export default function CoordinadorGruposPage() {
  return <div className="space-y-5"><CoordinatorSectionHeader title="Grupos académicos" description="Consulta asignaturas, programas, docentes, horarios, aulas y matrícula del periodo." /><CoordinatorGroupsView /></div>;
}
