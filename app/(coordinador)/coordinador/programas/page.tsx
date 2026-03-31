import { CoordinatorMetricStrip } from "@/components/coordinator/coordinator-metric-strip";
import { CoordinatorSectionHeader } from "@/components/coordinator/coordinator-section-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const metrics = [
  { label: "Programas activos", value: "37", tone: "neutral" as const },
  { label: "Bloques planeados", value: "214", tone: "neutral" as const },
  { label: "Cruces pendientes", value: "7", tone: "warning" as const },
  { label: "Ajustes urgentes", value: "3", tone: "danger" as const },
];

const lanes = [
  {
    title: "Planeacion semanal",
    items: [
      "Distribuir apertura de fichas ADSO entre Chapinero y Corferias.",
      "Preparar primera ronda de articulacion para Programacion Web.",
      "Reservar ambientes base para el arranque de titulada.",
    ],
  },
  {
    title: "Movimientos por demanda",
    items: [
      "Abrir 1 bloque adicional de complementaria en servicio al cliente.",
      "Equilibrar carga inicial entre Chapinero y Corferias.",
      "Consolidar bolsa de reemplazos para articulacion de media tecnica.",
    ],
  },
  {
    title: "Pendientes de catalogo",
    items: [
      "Normalizar programas recibidos por importacion de Excel.",
      "Ajustar equivalencias entre modalidades compartida y unica.",
      "Actualizar disponibilidad de ambientes especiales por sede.",
    ],
  },
];

export default function CoordinadorProgramasPage() {
  return (
    <div className="space-y-5">
      <CoordinatorSectionHeader
        title="Planeacion"
        description="Tablero corto para preparar el arranque operativo sobre dos sedes y sin carga previa."
      />
      <CoordinatorMetricStrip metrics={metrics} />
      <div className="grid gap-4 xl:grid-cols-3">
        {lanes.map((lane) => (
          <Card key={lane.title}>
            <CardHeader>
              <CardTitle>{lane.title}</CardTitle>
              <CardDescription>Foco operativo del siguiente corte.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {lane.items.map((item) => (
                <div
                  key={item}
                  className="rounded-[1.2rem] border border-border/70 bg-background/70 px-4 py-4 text-sm text-muted-foreground"
                >
                  {item}
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
