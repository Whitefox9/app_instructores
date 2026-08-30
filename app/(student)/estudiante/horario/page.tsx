import { CalendarDays, Clock3, GraduationCap, MapPin } from "lucide-react";

import { StudentPageHeader } from "@/components/student/student-page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { studentSchedule } from "@/lib/mocks/student";

export default function StudentSchedulePage() {
  return (
    <div className="space-y-6">
      <StudentPageHeader icon={CalendarDays} title="Mi horario" description="Sesiones, profesores y aulas asignadas." />
      <section className="grid gap-4">
        {studentSchedule.map((session) => (
          <Card key={session.id} className="border-l-4 border-l-primary">
            <CardContent className="grid gap-4 p-5 sm:grid-cols-[130px_1fr] sm:items-center">
              <div className="flex items-center justify-between rounded-2xl bg-primary/6 px-4 py-3 text-primary sm:block sm:text-center">
                <p className="text-lg font-black">{session.day}</p><p className="text-sm">{session.date}</p><p className="mt-0 font-black sm:mt-3">{session.time.split("–")[0]}</p>
              </div>
              <div>
                <Badge variant="secondary">Grupo {session.group}</Badge>
                <h2 className="mt-3 text-xl font-bold text-foreground">{session.subject}</h2>
                <div className="mt-3 grid gap-2 text-sm text-muted-foreground sm:grid-cols-3">
                  <span className="flex items-center gap-2"><Clock3 className="h-4 w-4" />{session.time}</span>
                  <span className="flex items-center gap-2"><GraduationCap className="h-4 w-4" />{session.professor}</span>
                  <span className="flex items-center gap-2"><MapPin className="h-4 w-4" />{session.room}</span>
                </div>
                <Badge
                  className={session.status === "Cambio reciente" ? "mt-4 border-amber-400/60 bg-amber-400/20 text-amber-700 dark:text-amber-200" : "mt-4"}
                  variant={session.status === "Cambio reciente" ? "warning" : "secondary"}
                >
                  {session.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}
