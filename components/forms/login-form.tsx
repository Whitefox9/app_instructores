import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function LoginForm() {
  return (
    <Card className="glass-panel w-full max-w-xl">
      <CardHeader className="space-y-3">
        <div className="inline-flex w-fit items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground">
          <ShieldCheck className="h-4 w-4" />
          Acceso institucional
        </div>
        <CardTitle className="text-3xl">Ingresa al portal de instructores</CardTitle>
        <CardDescription className="max-w-lg text-base">
          Base visual preparada para autenticacion, control por roles y experiencia consistente en desktop y mobile.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-foreground">
              Correo institucional
            </label>
            <Input id="email" type="email" placeholder="nombre@institucion.edu.co" />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-foreground">
              Contrasena
            </label>
            <Input id="password" type="password" placeholder="********" />
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <Button asChild>
            <Link href="/admin/dashboard">
              Entrar como admin
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/coordinador/dashboard">Coordinador</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/instructor/inicio">Instructor</Link>
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Los accesos son mock y sirven para navegar la base estructural del proyecto.
        </p>
      </CardContent>
    </Card>
  );
}
