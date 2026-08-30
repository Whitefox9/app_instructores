import { CoordinatorSectionHeader } from "@/components/coordinator/coordinator-section-header";
import { CoordinatorClassroomsView } from "@/components/coordinator/coordinator-usal-views";

export default function CoordinadorAulasPage() {
  return <div className="space-y-5"><CoordinatorSectionHeader title="Aulas y espacios" description="Capacidad, equipamiento y disponibilidad de los espacios académicos." /><CoordinatorClassroomsView /></div>;
}
