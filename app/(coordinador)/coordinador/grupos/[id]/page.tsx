import { CoordinatorSectionHeader } from "@/components/coordinator/coordinator-section-header";
import { CoordinatorGroupDetailView } from "@/components/coordinator/coordinator-usal-views";

export default async function CoordinadorGrupoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <div className="space-y-5"><CoordinatorSectionHeader title="Detalle del grupo" description="Información académica y estudiantes matriculados." /><CoordinatorGroupDetailView groupId={id} /></div>;
}
