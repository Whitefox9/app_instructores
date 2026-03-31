import { CoordinatorSectionHeader } from "@/components/coordinator/coordinator-section-header";
import { EmptyState } from "@/components/ui/empty-state";
import { ClipboardList } from "lucide-react";

export default function CoordinadorAsignacionesPage() {
  return (
    <div className="space-y-5">
      <CoordinatorSectionHeader
        title="Asignaciones"
        description="Modulo limpio para iniciar pruebas. No hay asignaciones creadas todavia."
      />
      <EmptyState
        icon={ClipboardList}
        title="Sin asignaciones registradas"
        description="La operacion inicia en cero para que puedas probar el flujo de asignacion desde el pool de instructores, las fichas pendientes y los ambientes libres."
      />
    </div>
  );
}
