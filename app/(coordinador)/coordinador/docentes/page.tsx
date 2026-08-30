import { CoordinatorSectionHeader } from "@/components/coordinator/coordinator-section-header";
import { CoordinatorTeachersView } from "@/components/coordinator/coordinator-usal-views";

export default function CoordinadorDocentesPage() {
  return <div className="space-y-5"><CoordinatorSectionHeader title="Docentes" description="Directorio académico, especialidades, facultades, grupos y disponibilidad docente." /><CoordinatorTeachersView /></div>;
}
