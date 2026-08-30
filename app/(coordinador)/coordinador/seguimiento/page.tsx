import { CoordinatorSectionHeader } from "@/components/coordinator/coordinator-section-header";
import { CoordinatorTrackingView } from "@/components/coordinator/coordinator-usal-views";

export default function CoordinadorSeguimientoPage() {
  return (
    <div className="space-y-5">
      <CoordinatorSectionHeader title="Seguimiento" description="Alertas académicas, asistencia, programación y carga docente del periodo activo." />
      <CoordinatorTrackingView />
    </div>
  );
}
