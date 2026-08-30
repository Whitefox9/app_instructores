import {
  CoordinatorAcademicGroup,
  CoordinatorAlert,
  CoordinatorClassroom,
  CoordinatorFaculty,
  CoordinatorImportBatch,
  CoordinatorMetric,
  CoordinatorScheduleAssignment,
  CoordinatorTeacher,
  CoordinatorTeachingLoad,
} from "@/lib/types";

export const coordinatorAcademicContext = {
  institution: "Universidad de Salamanca",
  period: "2026-1",
  campus: "Campus Salamanca",
  campuses: ["Campus Salamanca", "Campus Ávila", "Campus Zamora"],
};

export const coordinatorMetrics: CoordinatorMetric[] = [
  { label: "Docentes activos", value: "48", tone: "neutral", helper: "En el periodo 2026-1" },
  { label: "Grupos académicos", value: "36", tone: "neutral", helper: "32 con programación completa" },
  { label: "Estudiantes", value: "1.248", tone: "neutral", helper: "Matrícula activa" },
  { label: "Alertas", value: "4", tone: "warning", helper: "Requieren revisión" },
];

export const coordinatorFaculties: CoordinatorFaculty[] = [
  { id: "FAC-CIENCIAS", name: "Facultad de Ciencias", campus: "Campus Salamanca", dean: "María Sánchez", programs: 8, teachers: 19, students: 486 },
  { id: "FAC-ECONOMIA", name: "Facultad de Economía y Empresa", campus: "Campus Salamanca", dean: "Javier Martín", programs: 6, teachers: 16, students: 432 },
  { id: "FAC-EDUCACION", name: "Facultad de Educación", campus: "Campus Salamanca", dean: "Ana Beltrán", programs: 5, teachers: 13, students: 330 },
];

export const coordinatorTeachers: CoordinatorTeacher[] = [
  { id: "DOC-001", name: "Laura Romero", initials: "LR", email: "laura.romero@usal.es", phone: "+34 923 294 500", faculty: "Facultad de Ciencias", department: "Informática y Automática", specialty: "Diseño de interfaces y desarrollo web", contractType: "Profesora titular", assignedHours: 16, maximumHours: 20, groups: 2, availability: "Disponible" },
  { id: "DOC-002", name: "Carlos Mendoza", initials: "CM", email: "carlos.mendoza@usal.es", phone: "+34 923 294 511", faculty: "Facultad de Ciencias", department: "Informática y Automática", specialty: "Bases de datos", contractType: "Profesor asociado", assignedHours: 18, maximumHours: 20, groups: 3, availability: "Parcial" },
  { id: "DOC-003", name: "Elena Martín", initials: "EM", email: "elena.martin@usal.es", phone: "+34 923 294 522", faculty: "Facultad de Economía y Empresa", department: "Administración y Economía", specialty: "Emprendimiento", contractType: "Profesora titular", assignedHours: 20, maximumHours: 20, groups: 3, availability: "Completa" },
  { id: "DOC-004", name: "Miguel Santos", initials: "MS", email: "miguel.santos@usal.es", phone: "+34 923 294 533", faculty: "Facultad de Educación", department: "Didáctica y Organización Escolar", specialty: "Innovación educativa", contractType: "Profesor ayudante doctor", assignedHours: 12, maximumHours: 20, groups: 2, availability: "Disponible" },
];

const flagshipRoster = [
  { id: "EST-001", documentNumber: "1023456789", name: "Daniel Felipe Rojas Gómez", email: "daniel.rojas@usal.es", enrollmentStatus: "Matriculado" as const },
  { id: "EST-002", documentNumber: "1029981456", name: "Nicolás Vargas León", email: "nicolas.vargas@usal.es", enrollmentStatus: "Matriculado" as const },
  { id: "EST-003", documentNumber: "1018475623", name: "Mariana Pardo Silva", email: "mariana.pardo@usal.es", enrollmentStatus: "Matriculado" as const },
];

export const coordinatorGroups: CoordinatorAcademicGroup[] = [
  { id: "GRP-DEMO-2874901", code: "2874901", subject: "Análisis y Desarrollo de Software", program: "Grado en Ingeniería Informática", faculty: "Facultad de Ciencias", period: "2026-1", modality: "Presencial", schedule: "Lun a jue · 07:00–11:00", teacher: "Laura Romero", classroom: "Laboratorio B-204", students: 32, capacity: 32, status: "Activo", roster: flagshipRoster },
  { id: "GRP-3011450", code: "3011450", subject: "Emprendimiento", program: "Grado en Administración y Dirección de Empresas", faculty: "Facultad de Economía y Empresa", period: "2026-1", modality: "Presencial", schedule: "Mar y jue · 13:00–17:00", teacher: "Elena Martín", classroom: "Aula 204", students: 34, capacity: 36, status: "Activo", roster: [] },
  { id: "GRP-2988102", code: "2988102", subject: "English Dot Works", program: "Grado en Estudios Ingleses", faculty: "Facultad de Filología", period: "2026-1", modality: "Virtual", schedule: "Mié · 18:00–20:00", teacher: "Miguel Santos", classroom: "Campus virtual", students: 28, capacity: 35, status: "En preparación", roster: [] },
  { id: "GRP-2901220", code: "2901220", subject: "Contabilidad y costes", program: "Grado en Administración y Dirección de Empresas", faculty: "Facultad de Economía y Empresa", period: "2026-1", modality: "Híbrida", schedule: "Vie · 08:00–12:00", teacher: "Carlos Mendoza", classroom: "Aula 310", students: 30, capacity: 30, status: "Requiere atención", roster: [] },
];

export const coordinatorClassrooms: CoordinatorClassroom[] = [
  { id: "AUL-B204", code: "B-204", name: "Laboratorio B-204", campus: "Campus Salamanca", building: "Edificio Multiusos I+D+i", capacity: 32, equipment: ["32 equipos", "Proyector", "Videoconferencia"], status: "Ocupada", nextAvailable: "Hoy · 11:00" },
  { id: "AUL-204", code: "204", name: "Aula 204", campus: "Campus Salamanca", building: "Facultad de Economía y Empresa", capacity: 36, equipment: ["Proyector", "Audio"], status: "Disponible", nextAvailable: "Disponible ahora" },
  { id: "AUL-310", code: "310", name: "Aula 310", campus: "Campus Salamanca", building: "Facultad de Economía y Empresa", capacity: 30, equipment: ["Pantalla interactiva"], status: "Disponible", nextAvailable: "Disponible ahora" },
  { id: "AUL-105", code: "105", name: "Aula 105", campus: "Campus Salamanca", building: "Facultad de Educación", capacity: 40, equipment: ["Proyector", "Audio"], status: "Mantenimiento", nextAvailable: "2 de sep" },
];

export const coordinatorSchedule: CoordinatorScheduleAssignment[] = [
  { id: "PROG-001", groupCode: "2874901", subject: "Análisis y Desarrollo de Software", teacher: "Laura Romero", classroom: "Laboratorio B-204", day: "Lunes", time: "07:00–11:00", status: "Confirmada" },
  { id: "PROG-002", groupCode: "3011450", subject: "Emprendimiento", teacher: "Elena Martín", classroom: "Aula 204", day: "Martes", time: "13:00–17:00", status: "Confirmada" },
  { id: "PROG-003", groupCode: "2901220", subject: "Contabilidad y costes", teacher: "Carlos Mendoza", classroom: "Aula 310", day: "Viernes", time: "08:00–12:00", status: "Pendiente" },
  { id: "PROG-004", groupCode: "2988102", subject: "English Dot Works", teacher: "Miguel Santos", classroom: "Campus virtual", day: "Miércoles", time: "18:00–20:00", status: "Confirmada" },
];

export const coordinatorTeachingLoads: CoordinatorTeachingLoad[] = coordinatorTeachers.map((teacher) => ({
  id: `CARGA-${teacher.id}`,
  teacher: teacher.name,
  faculty: teacher.faculty,
  assignedHours: teacher.assignedHours,
  maximumHours: teacher.maximumHours,
  groups: teacher.groups,
  status: teacher.assignedHours >= teacher.maximumHours ? "Equilibrada" : "Disponible",
}));

export const coordinatorAlerts: CoordinatorAlert[] = [
  { id: "ALT-001", title: "Aula en mantenimiento", detail: "El Aula 105 requiere reprogramar dos sesiones.", severity: "alta", href: "/coordinador/aulas" },
  { id: "ALT-002", title: "Programación pendiente", detail: "El grupo 2901220 aún no tiene confirmación definitiva.", severity: "media", href: "/coordinador/programacion" },
  { id: "ALT-003", title: "Capacidad completa", detail: "El grupo 2874901 alcanzó los 32 estudiantes previstos.", severity: "baja", href: "/coordinador/grupos" },
];

export const coordinatorImportBatches: CoordinatorImportBatch[] = [
  { id: "IMP-001", fileName: "docentes_periodo_2026_1.xlsx", category: "Docentes", records: 48, validRecords: 46, issues: 2, uploadedAt: "Hoy · 09:14", status: "Revisión" },
  { id: "IMP-002", fileName: "matriculas_ingenieria.xlsx", category: "Estudiantes", records: 486, validRecords: 486, issues: 0, uploadedAt: "Ayer · 16:32", status: "Validado" },
];
