import { Building2, Layers3, ShieldCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="container flex min-h-screen items-center py-10">
      <div className="grid w-full gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="flex items-center">{children}</section>
        <Card className="glass-panel overflow-hidden">
          <CardContent className="flex h-full flex-col justify-between gap-8 p-8">
            <div className="space-y-4">
              <Badge variant="secondary" className="px-4 py-2 text-sm">
                Arquitectura inicial
              </Badge>
              <h2 className="text-4xl font-semibold text-foreground">
                Un mismo sistema, tres experiencias operativas.
              </h2>
              <p className="text-base leading-7 text-muted-foreground">
                La base separa autenticacion, layouts por rol y modulos compartidos para crecer sin
                duplicar estilos ni reglas de navegacion.
              </p>
            </div>
            <div className="grid gap-4">
              <div className="rounded-[1.75rem] border border-border/70 bg-white/80 p-5">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Control por roles</p>
                    <p className="text-sm text-muted-foreground">Admin, coordinador e instructor.</p>
                  </div>
                </div>
              </div>
              <div className="rounded-[1.75rem] border border-border/70 bg-white/80 p-5">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                    <Layers3 className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Componentes reutilizables</p>
                    <p className="text-sm text-muted-foreground">Cards, tablas, filtros y estados base.</p>
                  </div>
                </div>
              </div>
              <div className="rounded-[1.75rem] border border-border/70 bg-white/80 p-5">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Look institucional</p>
                    <p className="text-sm text-muted-foreground">Paleta clara, moderna y profesional.</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
