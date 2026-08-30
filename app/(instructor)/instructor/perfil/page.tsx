import Link from "next/link";
import {
  BookOpenCheck,
  Building2,
  CalendarDays,
  LogOut,
  Mail,
  UserRound,
  UsersRound,
} from "lucide-react";

import { InstructorPageHeader } from "@/components/instructor/instructor-page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { demoAcademicSystem } from "@/lib/demo/academic-system";
import { instructorAssignments } from "@/lib/mocks/instructor";
import { roleProfiles } from "@/lib/mocks/navigation";
import { cn } from "@/lib/utils";

export default function InstructorProfilePage() {
  const profile = roleProfiles.instructor;
  const { instructor, period } = demoAcademicSystem;

  const details = [
    {
      icon: Mail,
      label: "Correo institucional",
      value: instructor.email,
    },
    {
      icon: Building2,
      label: "Facultad",
      value: instructor.faculty,
    },
    {
      icon: BookOpenCheck,
      label: "Especialidad",
      value: instructor.specialty,
    },
    {
      icon: UsersRound,
      label: "Carga académica",
      value: `${instructorAssignments.length} grupos activos · Periodo ${period.id}`,
    },
  ];

  return (
    <div className="space-y-6">
      <InstructorPageHeader
        icon={UserRound}
        title="Mi perfil"
        description="Información profesional y académica registrada."
      />

      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="bg-slate-950 px-6 py-8 text-white sm:px-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <div className="flex size-20 items-center justify-center rounded-3xl bg-primary text-2xl font-bold">
                  {profile.initials}
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{profile.userName}</h2>
                  <p className="mt-1 text-slate-300">{profile.userTitle}</p>
                  <Badge className="mt-3 border-emerald-400/25 bg-emerald-400/15 text-emerald-300 hover:bg-emerald-400/15">
                    Docente activo
                  </Badge>
                </div>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="w-full px-6 sm:w-auto sm:min-w-[10rem]">
                  <Link href="/instructor/agenda">
                    <CalendarDays className="size-4" aria-hidden="true" />
                    Ver horario
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="w-full border-white/25 bg-transparent px-6 text-white hover:bg-white/10 hover:text-white sm:w-auto sm:min-w-[10rem]"
                >
                  <Link href="/instructor/mis-asignaciones">
                    <UsersRound className="size-4" aria-hidden="true" />
                    Ver grupos
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          <dl className="grid gap-0 sm:grid-cols-2">
            {details.map(({ icon: Icon, label, value }, index) => (
              <div
                key={label}
                className={cn(
                  "flex gap-4 border-b p-6 last:border-b-0",
                  index % 2 === 0 && "sm:border-r",
                  index >= details.length - 2 && "sm:border-b-0",
                )}
              >
                <span className="h-fit rounded-xl bg-primary/10 p-2.5 text-primary">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <dt className="text-sm text-muted-foreground">{label}</dt>
                  <dd className="mt-1 font-medium text-foreground">{value}</dd>
                </div>
              </div>
            ))}
          </dl>

          <div className="flex flex-col gap-4 border-t bg-muted/30 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <div>
              <p className="font-bold text-foreground">Sesión y acceso</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Cierra la sesión cuando termines de usar un dispositivo compartido.
              </p>
            </div>
            <Button asChild size="lg" variant="outline" className="w-full px-6 sm:w-auto">
              <Link href="/login">
                <LogOut className="size-4" aria-hidden="true" />
                Cerrar sesión
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
