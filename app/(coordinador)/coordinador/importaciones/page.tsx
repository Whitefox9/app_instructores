import { CoordinatorSectionHeader } from "@/components/coordinator/coordinator-section-header";
import { CoordinatorImportView } from "@/components/coordinator/coordinator-usal-views";

export default function CoordinadorImportacionesPage() {
  return <div className="space-y-5"><CoordinatorSectionHeader title="Importaciones académicas" description="Carga y valida datos de docentes, estudiantes, grupos y aulas." /><CoordinatorImportView /></div>;
}
