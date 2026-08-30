import { Building2, IdCard, Mail, Phone, UserRound } from "lucide-react";

import { StudentPageHeader } from "@/components/student/student-page-header";
import { StudentProfilePhotoEditor } from "@/components/student/student-profile-photo";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { studentProfile } from "@/lib/mocks/student";

const profileRows = [
  { label: "Documento", value: studentProfile.document, icon: IdCard },
  { label: "Correo", value: studentProfile.email, icon: Mail },
  { label: "Teléfono", value: studentProfile.phone, icon: Phone },
  { label: "Campus", value: studentProfile.campus, icon: Building2 },
];

export default function StudentProfilePage() {
  return (
    <div className="space-y-6">
      <StudentPageHeader icon={UserRound} title="Mi perfil" description="Datos de contacto, identificación y foto de perfil." />
      <Card>
        <CardContent className="p-6 sm:p-8">
          <div className="text-center">
            <StudentProfilePhotoEditor initials={studentProfile.initials} />
            <h2 className="mt-2 text-2xl font-bold">{studentProfile.name}</h2>
            <p className="mt-1 text-sm text-muted-foreground">Expediente {studentProfile.recordNumber}</p>
            <Badge className="mt-3" variant="secondary">{studentProfile.status}</Badge>
          </div>
          <div className="mt-7 divide-y divide-border">
            {profileRows.map(({ label, value, icon: Icon }) => (
              <div key={label} className="grid gap-3 py-4 sm:grid-cols-[180px_1fr] sm:items-center">
                <span className="flex items-center gap-3 text-sm text-muted-foreground"><Icon className="h-5 w-5 text-primary" />{label}</span>
                <span className="break-all font-bold sm:break-normal">{value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
