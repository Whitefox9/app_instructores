import { CoordinatorSectionHeader } from "@/components/coordinator/coordinator-section-header";
import { CoordinatorTeachingLoadView } from "@/components/coordinator/coordinator-usal-views";

export default function CoordinadorCargaDocentePage() {
  return <div className="space-y-5"><CoordinatorSectionHeader title="Carga docente" description="Distribución de horas y grupos por docente durante el periodo académico." /><CoordinatorTeachingLoadView /></div>;
}
