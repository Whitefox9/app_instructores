import { CoordinatorMetricStrip } from "@/components/coordinator/coordinator-metric-strip";
import { CoordinatorSectionHeader } from "@/components/coordinator/coordinator-section-header";
import { CoordinatorDashboardView } from "@/components/coordinator/coordinator-usal-views";
import { coordinatorAcademicContext, coordinatorMetrics } from "@/lib/mocks/coordinator-usal";

export default function CoordinadorDashboardPage() {

  return (
    <div className="space-y-5">
      <CoordinatorSectionHeader
        title="Resumen académico"
        description={`${coordinatorAcademicContext.campus} · Periodo ${coordinatorAcademicContext.period}. Consulta docentes, grupos, estudiantes, aulas y alertas del día.`}
      />
      <CoordinatorMetricStrip metrics={coordinatorMetrics} />
      <CoordinatorDashboardView />
    </div>
  );
}
